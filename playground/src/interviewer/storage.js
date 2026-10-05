export const KEY = 'shortnotes.interviewer.session.v1';
export function readSaved() {
  try {
    return localStorage.getItem(KEY) || '';
  } catch {
    return '';
  }
}
export function readDraft(id) {
  const raw = JSON.parse(localStorage.getItem(`${KEY}.${id}`) || '{}');
  return {
    draft: typeof raw.draft === 'string' ? raw.draft : '',
    code: typeof raw.code === 'string' ? raw.code : '',
    codeLanguage: typeof raw.codeLanguage === 'string' ? raw.codeLanguage : '',
    pending:
      raw.pending &&
      typeof raw.pending.requestId === 'string' &&
      typeof raw.pending.action === 'string'
        ? raw.pending
        : null,
  };
}
export function saveDraft(id, value) {
  localStorage.setItem(`${KEY}.${id}`, JSON.stringify(value));
}
