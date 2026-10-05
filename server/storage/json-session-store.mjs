import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, unlink, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { AgentError } from '../agent/errors.mjs';
export class JsonSessionStore {
  constructor(directory) {
    this.directory = directory;
  }
  async *assessmentSessions(subject) {
    for await (const session of this.all()) {
      if (session.subject === subject) yield session;
    }
  }
  async *all({ strict = false } = {}) {
    let files;
    try {
      files = await readdir(this.directory);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const file of files
      .filter((name) => /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}\.json$/i.test(name))
      .sort()) {
      try {
        const session = JSON.parse(await readFile(join(this.directory, file), 'utf8'));
        if (
          !session ||
          session.id !== file.slice(0, -5) ||
          !Array.isArray(session.assessments)
        ) {
          if (strict)
            throw new Error(
              'Invalid local session. Migration stopped; source files are unchanged.',
            );
          continue;
        }
        yield session;
      } catch (error) {
        if (!strict && (error.code === 'ENOENT' || error instanceof SyntaxError)) continue;
        throw error;
      }
    }
  }
  path(id) {
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id))
      throw new AgentError('Interview not found.', 404);
    return join(this.directory, `${id}.json`);
  }
  async get(id) {
    const file = this.path(id);
    try {
      return JSON.parse(await readFile(file, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT')
        throw new AgentError('Interview not found. Start a new session.', 404);
      throw error;
    }
  }
  async save(session) {
    const file = this.path(session.id),
      temp = `${file}.${randomUUID()}.tmp`;
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    try {
      await writeFile(temp, JSON.stringify(session), { mode: 0o600 });
      await rename(temp, file);
    } finally {
      await unlink(temp).catch(() => {});
    }
  }
}
