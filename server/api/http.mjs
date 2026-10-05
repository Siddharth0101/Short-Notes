import { AgentError } from '../agent/errors.mjs';
import { createServer } from 'node:http';
import { view } from '../sessions/clock.mjs';
import {
  transcribeRecording,
  validateRecording,
  MAX_AUDIO_BYTES,
} from '../providers/transcription.mjs';
import { synthesizeSpeech, validateSpeech } from '../providers/synthesis.mjs';
import { attachLiveVoice } from './live-voice.mjs';
import { streamSpeech } from '../providers/speech-stream.mjs';
import { sendSpeechStream } from './speech-stream.mjs';
const send = (res, status, value) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(value));
};
export function makeServer(
  sessions,
  config = {
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    allowedOrigins: new Set(['http://localhost:5173', 'http://127.0.0.1:5173']),
  },
  transcribe = transcribeRecording,
  synthesize = synthesizeSpeech,
  stream = streamSpeech,
) {
  let windowStart = Date.now(),
    requests = 0,
    starts = 0,
    transcriptions = 0,
    speechRequests = 0,
    transcribing = false,
    synthesizing = false;
  const server = createServer(async (req, res) => {
    try {
      const hostname = String(req.headers.host || '').split(':')[0];
      if (!['localhost', '127.0.0.1'].includes(hostname))
        return send(res, 403, {
          error: 'This interview server accepts local requests only.',
        });
      if (req.headers.origin && !config.allowedOrigins.has(req.headers.origin))
        return send(res, 403, { error: 'Origin not allowed.' });
      const path = new URL(req.url, 'http://localhost').pathname;
      if (req.method === 'GET' && path === '/api/interviewer/health')
        return send(res, 200, {
          configured: config.configured,
          model: config.model,
          storage: config.storageKind || 'json',
          voice: {
            transcription: process.env.GEMINI_TRANSCRIPTION_MODEL || 'gemini-3.5-transcribe',
            liveTranscription:
              process.env.GEMINI_LIVE_TRANSCRIPTION_MODEL || 'gemini-3.5-transcribe-live',
            speech: process.env.GEMINI_SPEECH_MODEL || 'gemini-3.8-flash-lite-tts',
          },
          subjects: sessions.content.subjects,
        });
      if (req.method === 'GET' && /^\/api\/interviewer\/sessions\/[a-f0-9-]+$/.test(path))
        return send(res, 200, view(await sessions.get(path.split('/').at(-1))));
      if (req.method !== 'POST') return send(res, 404, { error: 'Route not found.' });
      if (!req.headers['content-type']?.startsWith('application/json'))
        return send(res, 415, { error: 'Use application/json.' });
      if (Date.now() - windowStart > 60000) {
        windowStart = Date.now();
        requests = 0;
        starts = 0;
        transcriptions = 0;
        speechRequests = 0;
      }
      if (++requests > 30)
        return send(res, 429, {
          error: 'Too many requests. Please wait a minute.',
        });
      let bytes = 0;
      const isTranscription = path === '/api/interviewer/transcribe';
      const isSpeechStream = path === '/api/interviewer/speech/stream';
      const isSpeech = path === '/api/interviewer/speech' || isSpeechStream;
      const maxBytes = isTranscription
        ? Math.ceil(MAX_AUDIO_BYTES / 3) * 4 + 1024
        : isSpeech
          ? 32000
          : 100000;
      const chunks = [];
      for await (const chunk of req) {
        bytes += chunk.length;
        if (bytes > maxBytes) return send(res, 413, { error: 'Request too large.' });
        chunks.push(chunk);
      }
      let input;
      try {
        input = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return send(res, 400, { error: 'Invalid JSON.' });
      }
      if (!input || typeof input !== 'object' || Array.isArray(input))
        return send(res, 400, { error: 'Invalid request.' });
      if (isTranscription) {
        if (!config.configured)
          return send(res, 503, {
            error:
              'Configure GEMINI_API_KEY and restart the server to use voice transcription.',
          });
        const recording = validateRecording(input);
        if (++transcriptions > 12)
          return send(res, 429, {
            error: 'Too many recordings. Wait a minute and retry.',
          });
        if (transcribing)
          return send(res, 429, {
            error: 'Another recording is being transcribed. Wait and retry.',
          });
        transcribing = true;
        const controller = new AbortController();
        const disconnected = () => {
          if (!res.writableEnded) controller.abort();
        };
        res.on('close', disconnected);
        try {
          const result = await transcribe(recording, {
            signal: controller.signal,
          });
          if (!res.destroyed) send(res, 200, result);
        } finally {
          transcribing = false;
          res.off('close', disconnected);
        }
        return;
      }
      if (isSpeech) {
        if (!config.configured)
          return send(res, 503, {
            error: 'Configure GEMINI_API_KEY and restart the server to use spoken replies.',
          });
        const speech = validateSpeech(input);
        if (++speechRequests > 20)
          return send(res, 429, {
            error: 'Too many spoken replies. Wait a minute and retry.',
          });
        if (synthesizing)
          return send(res, 429, {
            error: 'Another spoken reply is being prepared. Wait and retry.',
          });
        synthesizing = true;
        const controller = new AbortController();
        const disconnected = () => {
          if (!res.writableEnded) controller.abort();
        };
        res.on('close', disconnected);
        try {
          if (isSpeechStream) {
            await sendSpeechStream(res, speech, stream, controller.signal);
            return;
          }
          const audio = await synthesize(speech, { signal: controller.signal });
          if (!res.destroyed) {
            res.writeHead(200, {
              'Content-Type': 'audio/wav',
              'Content-Length': audio.length,
              'Cache-Control': 'no-store',
              'X-Content-Type-Options': 'nosniff',
            });
            res.end(audio);
          }
        } finally {
          synthesizing = false;
          res.off('close', disconnected);
        }
        return;
      }
      if (path === '/api/interviewer/sessions') {
        if (!config.configured)
          return send(res, 503, {
            error: 'Add GEMINI_API_KEY to the repository .env file, then restart the server.',
          });
        if (++starts > 5)
          return send(res, 429, {
            error: 'Please wait before starting another interview.',
          });
        return send(res, 201, await sessions.create(input));
      }
      if (/^\/api\/interviewer\/sessions\/[a-f0-9-]+\/turn$/.test(path))
        return send(res, 200, await sessions.update(path.split('/').at(-2), input));
      send(res, 404, { error: 'Route not found.' });
    } catch (error) {
      if (res.destroyed || res.writableEnded) return;
      const trusted = error instanceof AgentError;
      const retryAfterSeconds =
        trusted && Number.isFinite(error.retryAfterMs)
          ? Math.max(1, Math.ceil(error.retryAfterMs / 1000))
          : null;
      if (retryAfterSeconds) res.setHeader('Retry-After', String(retryAfterSeconds));
      send(res, trusted ? error.status : 500, {
        error: trusted
          ? error.message
          : 'The interview could not be saved or processed. Please retry.',
        ...(retryAfterSeconds ? { retryAfterSeconds } : {}),
      });
    }
  });
  server.requestTimeout = 110000;
  server.headersTimeout = 10000;
  attachLiveVoice(server, config);
  return server;
}
