import { once } from 'node:events';
import { AgentError } from '../agent/errors.mjs';

export async function sendSpeechStream(res, speech, stream, signal) {
  const deadline = AbortSignal.any([signal, AbortSignal.timeout(50000)]);
  const write = async (event) => {
    deadline.throwIfAborted();
    if (!res.write(`${JSON.stringify(event)}\n`))
      await once(res, 'drain', { signal: deadline });
  };
  try {
    for await (const event of stream(speech, { signal: deadline })) {
      // Delay headers until audio arrives so quota/config errors remain HTTP errors.
      if (!res.headersSent)
        res.writeHead(200, {
          'Content-Type': 'application/x-ndjson',
          'Cache-Control': 'no-store, no-transform',
          'X-Content-Type-Options': 'nosniff',
          'X-Accel-Buffering': 'no',
        });
      await write(event);
    }
    if (!res.headersSent)
      throw new AgentError('Speech returned no audio. Tap Replay to retry.', 502);
    await write({ type: 'done' });
    res.end();
  } catch (error) {
    if (!res.headersSent) throw error;
    if (!res.destroyed && !res.writableEnded) {
      res.end(
        `${JSON.stringify({
          type: 'error',
          error:
            error instanceof AgentError
              ? error.message
              : 'Speech was interrupted. Tap Replay to retry.',
        })}\n`,
      );
    }
  }
}
