import { loadConfig } from './config.mjs';
import { loadContent, subjects } from './knowledge/repository.mjs';
import { Sessions } from './sessions/service.mjs';
import { makeServer } from './api/http.mjs';
import { openStorage } from './storage/open-storage.mjs';
let storage;
try {
  const config = loadConfig(),
    content = await loadContent();
  content.subjects = subjects;
  storage = await openStorage(config);
  config.storageKind = storage.kind;
  const server = makeServer(new Sessions(storage.store, content), config);
  server.listen(config.port, config.host, () =>
    console.log(
      `Interviewer API: http://${config.host}:${config.port} (storage: ${storage.kind})`,
    ),
  );
  server.on('error', async (error) => {
    console.error(
      error.code === 'EADDRINUSE'
        ? `Port ${config.port} is already in use.`
        : 'Interview server could not start.',
    );
    await storage.close();
    process.exitCode = 1;
  });
  let stopping = false;
  const stop = () => {
    if (stopping) return;
    stopping = true;
    // Let active turns commit before closing the shared pool.
    const deadline = setTimeout(() => process.exit(1), 115000);
    deadline.unref();
    server.close(async () => {
      await storage.close();
      clearTimeout(deadline);
    });
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
} catch {
  console.error('Interviewer startup failed. Check server configuration and storage access.');
  await storage?.close();
  process.exitCode = 1;
}
