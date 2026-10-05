import { AgentError } from '../agent/errors.mjs';
import { speechInteraction } from './gemini-speech.mjs';

export const MAX_AUDIO_BYTES = 2 * 1024 * 1024;
const TYPES = new Set(['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav', 'audio/aiff']);

export function validateRecording(input) {
  if (!TYPES.has(input.mimeType)) throw new AgentError('Unsupported audio format.', 415);
  if (!['english', 'hinglish'].includes(input.language))
    throw new AgentError('Invalid transcription language.', 400);
  if (
    typeof input.audio !== 'string' ||
    !input.audio.length ||
    input.audio.length % 4 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(input.audio)
  )
    throw new AgentError('Invalid audio recording.', 400);
  if (input.audio.length > Math.ceil(MAX_AUDIO_BYTES / 3) * 4)
    throw new AgentError('Recording is too large. Keep each recording under two minutes.', 413);
  const bytes = Buffer.from(input.audio, 'base64');
  if (!bytes.length || bytes.length > MAX_AUDIO_BYTES || bytes.toString('base64') !== input.audio)
    throw new AgentError('Invalid audio recording.', 400);
  const locale = input.locale || 'auto';
  if (!['auto', 'en-IN', 'en-US', 'hi-IN'].includes(locale))
    throw new AgentError('Invalid listening language.', 400);
  return {
    audio: input.audio,
    mimeType: input.mimeType,
    language: input.language,
    locale,
  };
}

// Verbatim ASR keeps mistakes and self-corrections intact for the interviewer to assess.
export async function transcribeRecording(input, options = {}) {
  const { audio, mimeType, language, locale } = validateRecording(input);
  const content = await speechInteraction(
    {
      model: process.env.GEMINI_TRANSCRIPTION_MODEL || 'gemini-3.5-transcribe',
      input: [
        {
          type: 'audio',
          data: audio,
          mime_type: mimeType === 'audio/mp4' ? 'audio/m4a' : mimeType,
        },
      ],
      generation_config: {
        transcription_config: {
          language_codes: locale === 'auto' ? (language === 'english' ? ['en-IN'] : []) : [locale],
          mode: { type: 'verbatim' },
        },
      },
    },
    { ...options, label: 'Transcription', maxBytes: 100000 },
  );
  const text = content
    .filter((item) => item.type === 'text' && typeof item.text === 'string')
    .map((item) => item.text)
    .join(' ')
    .trim();
  if (text.length > 10000)
    throw new AgentError('Transcript too long. Record a shorter answer.', 502);
  return { text };
}
