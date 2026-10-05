export async function api(path, body) {
  let response;
  try {
    response = await fetch(`/api/interviewer${path}`, {
      ...(body
        ? {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }
        : {}),
      signal: AbortSignal.timeout(100000),
    });
  } catch {
    throw new Error(
      'Interview server is unreachable or timed out. Start npm run dev:agent, then retry. Your draft is preserved.',
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Interview API is unavailable. Run npm run dev:agent from playground/.');
  }
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed. Please retry.');
    error.status = response.status;
    throw error;
  }
  return data;
}
