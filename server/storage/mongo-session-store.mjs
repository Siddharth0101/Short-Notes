import { MongoClient } from 'mongodb';
import { AgentError } from '../agent/errors.mjs';

const validId = (id) =>
  typeof id === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(id);
// One session document contains transcript + assessments + request IDs. A turn is
// one atomic write, so long-term memory can never get ahead of its transcript.
export class MongoSessionStore {
  constructor(collection, learnerId = 'local') {
    this.collection = collection;
    this.learnerId = learnerId;
  }
  filter(id) {
    if (!validId(id)) throw new AgentError('Interview not found.', 404);
    return { _id: `${this.learnerId}:${id}`, learnerId: this.learnerId };
  }
  document(session) {
    // Match JSON storage semantics; never persist transient context or driver metadata.
    const clean = JSON.parse(JSON.stringify(session));
    delete clean.learnerMemory;
    delete clean.revisitTarget;
    return { ...clean, ...this.filter(session.id) };
  }
  async get(id) {
    const doc = await this.collection.findOne(this.filter(id), {
      projection: { _id: 0, learnerId: 0 },
    });
    if (!doc) throw new AgentError('Interview not found. Start a new session.', 404);
    return doc;
  }
  async save(session, previous) {
    const doc = this.document(session);
    if (!previous) {
      await this.collection.insertOne(doc);
      return;
    }
    // Compare committed request history to reject competing workers' stale turns.
    const result = await this.collection.replaceOne(
      { ...this.filter(session.id), requests: previous.requests },
      doc,
    );
    if (result.matchedCount !== 1)
      throw new AgentError('This interview changed in another request. Reload and retry.', 409);
  }
  async importSession(session) {
    const result = await this.collection.updateOne(
      this.filter(session.id),
      { $setOnInsert: this.document(session) },
      { upsert: true },
    );
    return result.upsertedCount === 1;
  }
  async *assessmentSessions(subject) {
    const cursor = this.collection.find(
      { learnerId: this.learnerId, subject },
      {
        projection: { _id: 0, id: 1, subject: 1, assessments: 1 },
        batchSize: 50,
        maxTimeMS: 15000,
      },
    );
    try {
      for await (const doc of cursor) yield doc;
    } finally {
      await cursor.close();
    }
  }
}

export async function connectMongo(config) {
  let client;
  try {
    if (
      !/^[a-zA-Z0-9_-]{1,64}$/.test(config.mongoDatabase) ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(config.learnerId)
    )
      throw new Error('Invalid configuration');
    client = new MongoClient(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      timeoutMS: 20000,
      writeConcern: { w: 'majority' },
    });
    await client.connect();
    const db = client.db(config.mongoDatabase);
    await db.command({ ping: 1 });
    const collection = db.collection('interview_sessions');
    await collection.createIndex({ learnerId: 1, subject: 1 }, { name: 'learner_subject' });
    return {
      store: new MongoSessionStore(collection, config.learnerId),
      close: () => client.close(),
    };
  } catch {
    await client?.close().catch(() => {});
    // Never forward driver errors that might contain credentials or topology details.
    throw new Error(
      'MongoDB initialization failed. Check server-only configuration, database permissions, and Atlas network access.',
    );
  }
}
