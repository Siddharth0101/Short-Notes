# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## A minimal HTTP server

```js
// server.mjs — run with node server.mjs
import http from "node:http";

const server = http.createServer((request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (request.method === "GET" && url.pathname === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }
  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found" }));
});
server.listen(3000, "127.0.0.1");
```

## Streams and backpressure

```js
// Copy a file without loading the entire file into memory.
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("input.txt"),
  createWriteStream("output.txt")
);
```

## Backpressure with writable streams

```js
// Naive: ignores backpressure signal, buffers everything in memory.
import { createReadStream, createWriteStream } from "node:fs";

const source = createReadStream("large-export.csv");
const destination = createWriteStream("copy.csv");
source.on("data", (chunk) => {
  destination.write(chunk); // return value ignored — risky under load
});

// Backpressure-aware: pause the source when the writable buffer is full.
source.on("data", (chunk) => {
  const canContinue = destination.write(chunk);
  if (!canContinue) {
    source.pause();
    destination.once("drain", () => source.resume());
  }
});
```

```js
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { createReadStream, createWriteStream } from "node:fs";

await pipeline(
  createReadStream("large-export.csv"),
  createGzip(),
  createWriteStream("large-export.csv.gz")
);
```

## Research notes: Backpressure is a producer contract

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
await pipeline(createReadStream('input.txt'), createWriteStream('copy.txt'));
```
