import { AgentError } from '../agent/errors.mjs';
import { speechInteraction } from './gemini-speech.mjs';

export const SPEECH_VOICES = ['Kore', 'Puck', 'Aoede', 'Charon'];
export function validateSpeech(input) {
  if (typeof input.text !== 'string' || !input.text.trim() || input.text.length > 5000)
    throw new AgentError('Speech needs between 1 and 5000 characters.', 400);
  const voice = input.voice || 'Kore';
  if (!SPEECH_VOICES.includes(voice)) throw new AgentError('Unsupported interviewer voice.', 400);
  return { text: input.text.trim(), voice };
}

export async function synthesizeSpeech(input, options = {}) {
  const { text, voice } = validateSpeech(input);
  const content = await speechInteraction(
    {
      model: process.env.GEMINI_SPEECH_MODEL || 'gemini-3.8-flash-lite-tts',
      input: [{ type: 'user_input', content: [{ type: 'text', text }] }],
      response_format: { type: 'audio', mime_type: 'audio/wav' },
      generation_config: { speech_config: [{ voice }] },
    },
    { ...options, label: 'Speech generation' },
  );
  const audio = content.find((item) => item.type === 'audio');
  if (
    !audio ||
    typeof audio.data !== 'string' ||
    !/^audio\/wav(?:;|$)/i.test(audio.mime_type || '')
  )
    throw new AgentError('Speech generation returned no playable audio. Please retry.', 502);
  const bytes = Buffer.from(audio.data, 'base64');
  if (
    bytes.length < 44 ||
    bytes.length > 8 * 1024 * 1024 ||
    bytes.toString('ascii', 0, 4) !== 'RIFF' ||
    bytes.toString('ascii', 8, 12) !== 'WAVE'
  )
    throw new AgentError('Speech generation returned invalid audio. Please retry.', 502);
  return bytes;
}
