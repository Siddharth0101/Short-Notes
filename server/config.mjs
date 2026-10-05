import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';
import { ROOT } from './knowledge/repository.mjs';
export function loadConfig() {
  try {
    loadEnvFile(resolve(ROOT, '.env'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const port = Number(process.env.INTERVIEW_PORT || 8787);
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error('INTERVIEW_PORT must be between 1024 and 65535.');
  return {
    port,
    host: '127.0.0.1',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    configured: Boolean(process.env.GEMINI_API_KEY),
    directory: resolve(ROOT, '.interviews'),
    mongoUri: process.env.MONGODB_URI?.trim() || '',
    mongoDatabase: process.env.MONGODB_DB || 'shortnotes',
    learnerId: process.env.MONGODB_LEARNER_ID || 'local',
    allowedOrigins: new Set([
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
    ]),
  };
}
