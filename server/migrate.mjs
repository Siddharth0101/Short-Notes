import { loadConfig } from './config.mjs';
import { openStorage } from './storage/open-storage.mjs';
import { JsonSessionStore } from './storage/json-session-store.mjs';
import { migrateSessions } from './storage/migrate-sessions.mjs';
let storage;
try {
  const config = loadConfig();
  if (!config.mongoUri) throw new Error('MongoDB configuration required');
  storage = await openStorage(config);
  const result = await migrateSessions(new JsonSessionStore(config.directory), storage.store);
  console.log(JSON.stringify({ ...result, sourceFilesPreserved: true }));
} catch {
  console.error(
    'Migration failed. Check MongoDB configuration and local session files. Existing data was not overwritten; rerunning is safe.',
  );
  process.exitCode = 1;
} finally {
  await storage?.close();
}
