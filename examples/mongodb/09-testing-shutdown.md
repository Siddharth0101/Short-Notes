# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Import karna server start karna nahi hona chahiye

```js
// server.mjs
import { createServer } from 'node:http';
export function makeServer() {
  return createServer((req, res) => {
    const found = req.method === 'GET' && req.url === '/health';
    res.writeHead(found ? 200 : 404, { 'content-type': 'application/json' });
    res.end(JSON.stringify(found ? { ok: true } : { error: 'not_found' }));
  });
}
```

```js
// server.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { makeServer } from './server.mjs';

test('HTTP response ka status, format aur body verify hote hain', async (t) => {
  const server = makeServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const ok = await fetch(`${base}/health`);
  assert.equal(ok.status, 200);
  assert.match(ok.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await ok.json(), { ok: true });
  const missing = await fetch(`${base}/missing`);
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: 'not_found' });
});
```
