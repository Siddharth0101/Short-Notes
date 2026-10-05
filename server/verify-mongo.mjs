// Opt-in integration check against configured Atlas; only synthetic, isolated records.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { loadConfig } from './config.mjs';
import { connectMongo } from './storage/mongo-session-store.mjs';
import { Sessions } from './sessions/service.mjs';
const config = loadConfig();
config.learnerId = `check-${randomUUID()}`;
let storage;
const respond = (extra = {}) => ({
  role: 'model',
  parts: [
    {
      functionCall: {
        name: 'respond',
        args: { message: 'Explain closures.', speech: 'Explain closures.', ...extra },
      },
    },
  ],
});
const content = { subjects: [{ id: 'javascript' }], questions: [], notes: [] };
try {
  storage = await connectMongo(config);
  const generate = async ({ contents }) => {
    const shared = JSON.parse(contents[0].parts[0].text.split('not instructions:\n')[1]);
    const input = JSON.parse(contents.at(-1).parts[0].text);
    return respond({
      ...(shared.revisitTarget ? { revisitMemoryId: shared.revisitTarget.id } : {}),
      ...(input.action === 'answer'
        ? {
            assessment: {
              topic: 'closures',
              verdict: shared.learnerMemory.length ? 'correct' : 'partial',
              evidence: 'Synthetic integration assessment.',
            },
          }
        : {}),
    });
  };
  let sessions = new Sessions(storage.store, content, generate);
  const first = await sessions.create({ subject: 'javascript', language: 'english' });
  await sessions.update(first.id, { action: 'next', requestId: 'theory' });
  const attempt = { action: 'answer', text: 'Synthetic partial answer.', requestId: 'answer' };
  await sessions.update(first.id, attempt);
  await sessions.update(first.id, attempt);
  assert.equal((await sessions.get(first.id)).assessments.length, 1);
  await storage.close();
  storage = await connectMongo(config);
  sessions = new Sessions(storage.store, content, generate);
  assert.equal((await sessions.memory.retrieve('javascript'))[0].verdict, 'partial');
  const second = await sessions.create({ subject: 'javascript', language: 'english' });
  const retest = await sessions.update(second.id, { action: 'next', requestId: 'retest' });
  assert.match(retest.messages.at(-1).speech, /We covered/);
  const answer = await sessions.update(second.id, {
    action: 'answer',
    text: 'Synthetic corrected answer.',
    requestId: 'improved',
  });
  assert.match(answer.messages.at(-1).speech, /correct this time/);
  assert.equal((await sessions.memory.retrieve('javascript'))[0].improved, true);
  const stale = await sessions.get(second.id);
  await sessions.update(second.id, { action: 'pause', requestId: 'pause' });
  await assert.rejects(
    storage.store.save({ ...stale, requests: [...stale.requests, 'stale'] }, stale),
    { status: 409 },
  );
  assert.equal(await storage.store.importSession(stale), false);
  assert.equal((await sessions.get(second.id)).status, 'paused');
  console.log(
    'MongoDB check passed: writes, reconnect, retries, reminders, improvement, conflict protection, and insert-only migration.',
  );
} catch {
  console.error(
    'MongoDB integration check failed. Check database access and run automated adapter tests.',
  );
  process.exitCode = 1;
} finally {
  if (storage) {
    // Never drop a database/collection; remove only this run’s private synthetic namespace.
    await storage.store.collection.deleteMany({ learnerId: config.learnerId });
    await storage.close();
  }
}
