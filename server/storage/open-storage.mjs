import { JsonSessionStore } from './json-session-store.mjs';
export async function openStorage(config) {
  if (!config.mongoUri)
    return {
      store: new JsonSessionStore(config.directory),
      kind: 'json',
      close: async () => {},
    };
  const { connectMongo } = await import('./mongo-session-store.mjs');
  return { ...(await connectMongo(config)), kind: 'mongodb' };
}
