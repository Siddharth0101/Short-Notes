// Insert-only migration: stable IDs, resumable, never overwrite MongoDB history.
export async function migrateSessions(source, target) {
  let imported = 0,
    existing = 0;
  for await (const session of source.all({ strict: true })) {
    if (
      !session.subject ||
      !Array.isArray(session.messages) ||
      !Array.isArray(session.requests)
    )
      throw new Error('Invalid local session. Migration stopped; source files are unchanged.');
    if (await target.importSession(session)) imported++;
    else existing++;
  }
  return { imported, existing };
}
