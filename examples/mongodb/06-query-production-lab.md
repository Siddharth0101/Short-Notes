# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Design one real access pattern

```javascript
db.orders.createIndex({ tenantId: 1, status: 1, createdAt: -1, _id: -1 });
db.orders.find({ tenantId: 't1', status: 'paid' })
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .explain('executionStats');
```

## Stream without whole-file buffering

```javascript
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

await pipeline(
  createReadStream('export.ndjson'),
  createGzip(),
  createWriteStream('export.ndjson.gz'),
);
```
