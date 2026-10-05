import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { MongoSessionStore } from '../../server/storage/mongo-session-store.mjs';
import { LearnerMemory } from '../../server/memory/learner-memory.mjs';
import { migrateSessions } from '../../server/storage/migrate-sessions.mjs';
import { openStorage } from '../../server/storage/open-storage.mjs';

// In-memory collection implements Mongo's filter/projection contract, not network behavior.
class Collection {
  docs = new Map();
  matches(doc, filter) {
    return Object.entries(filter).every(
      ([key, value]) => JSON.stringify(doc[key]) === JSON.stringify(value),
    );
  }
  async insertOne(doc) {
    if (this.docs.has(doc._id)) throw new Error('duplicate key');
    this.docs.set(doc._id, structuredClone(doc));
  }
  async findOne(filter) {
    const doc = [...this.docs.values()].find((d) => this.matches(d, filter));
    if (!doc) return null;
    const { _id, learnerId, ...session } = structuredClone(doc);
    return session;
  }
  async replaceOne(filter, doc) {
    if (!this.docs.has(filter._id) || !this.matches(this.docs.get(filter._id), filter))
      return { matchedCount: 0 };
    this.docs.set(doc._id, structuredClone(doc));
    return { matchedCount: 1 };
  }
  async updateOne(filter, update) {
    if (this.docs.has(filter._id)) return { upsertedCount: 0 };
    await this.insertOne(update.$setOnInsert);
    return { upsertedCount: 1 };
  }
  find(filter) {
    const docs = [...this.docs.values()].filter((d) => this.matches(d, filter));
    const self = this;
    return {
      async *[Symbol.asyncIterator]() {
        yield* structuredClone(docs);
      },
      async close() {
        self.closed = true;
      },
    };
  }
}
const session = () => ({
  id: randomUUID(),
  subject: 'javascript',
  requests: [],
  messages: [],
  assessments: [],
});
const attempt = (verdict, at) => ({
  topic: 'closures',
  phase: 'theory',
  verdict,
  at,
  evidence: 'Lexical access explanation.',
});

test('Mongo adapter persists clean sessions and separates learner namespaces', async () => {
  const collection = new Collection(),
    one = new MongoSessionStore(collection, 'one'),
    two = new MongoSessionStore(collection, 'two');
  const s = session();
  await one.save({ ...s, learnerMemory: ['private projection'], revisitTarget: {} });
  assert.deepEqual(await one.get(s.id), s);
  await assert.rejects(two.get(s.id), { status: 404 });
  await assert.rejects(one.get('../.env'), { status: 404 });
  await two.save({ ...s, subject: 'java' });
  assert.equal((await one.get(s.id)).subject, 'javascript');
  assert.equal((await two.get(s.id)).subject, 'java');
});

test('stale Mongo writes cannot overwrite a committed answer or memory', async () => {
  const collection = new Collection(),
    store = new MongoSessionStore(collection);
  const s = session();
  await store.save(s);
  const committed = { ...s, requests: ['first'], assessments: [attempt('partial', 1)] };
  await store.save(committed, s);
  await assert.rejects(
    store.save({ ...s, requests: ['loser'], assessments: [attempt('incorrect', 2)] }, s),
    { status: 409 },
  );
  assert.deepEqual(await store.get(s.id), committed);
  const memory = await new LearnerMemory(store).retrieve('javascript');
  assert.equal(memory[0].verdict, 'partial');
  assert.equal(collection.closed, true);
});

test('Mongo memory refreshes across store instances and excludes other learners and subjects', async () => {
  const collection = new Collection(),
    store = new MongoSessionStore(collection, 'one');
  await store.save({
    ...session(),
    assessments: [attempt('partial', 1), attempt('correct', 2)],
  });
  await store.save({ ...session(), subject: 'java', assessments: [attempt('incorrect', 3)] });
  await new MongoSessionStore(collection, 'two').save({
    ...session(),
    assessments: [attempt('incorrect', 4)],
  });
  const memory = await new LearnerMemory(new MongoSessionStore(collection, 'one')).retrieve(
    'javascript',
  );
  assert.equal(memory.length, 1);
  assert.equal(memory[0].verdict, 'correct');
  assert.equal(memory[0].improved, true);
});

test('insert-only migration preserves IDs, is resumable and never overwrites new history', async () => {
  const store = new MongoSessionStore(new Collection());
  const s = session();
  const source = {
    async *all() {
      yield s;
    },
  };
  assert.deepEqual(await migrateSessions(source, store), { imported: 1, existing: 0 });
  await store.save({ ...s, requests: ['newer'] }, s);
  assert.deepEqual(await migrateSessions(source, store), { imported: 0, existing: 1 });
  assert.deepEqual((await store.get(s.id)).requests, ['newer']);
  await assert.rejects(
    migrateSessions(
      {
        async *all() {
          yield { ...s, messages: null };
        },
      },
      store,
    ),
    /Invalid local session/,
  );
});

test('configured MongoDB failures do not silently switch to JSON or reveal credentials', async () => {
  await assert.rejects(
    openStorage({
      mongoUri: 'invalid://secret-password',
      mongoDatabase: 'shortnotes',
      learnerId: 'local',
    }),
    (error) => {
      assert.match(error.message, /MongoDB initialization failed/);
      assert.doesNotMatch(error.message, /secret-password/);
      return true;
    },
  );
  const local = await openStorage({
    mongoUri: '',
    directory: '/private/tmp/unused-shortnotes-test',
  });
  assert.equal(local.kind, 'json');
  await local.close();
});
