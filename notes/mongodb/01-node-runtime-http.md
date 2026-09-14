---
id: mongo-node-runtime-http
title: Node runtime HTTP modules and streams
track: mongodb
order: 1
level: Foundation
minutes: 27
summary: Event loop multiple waits coordinate kar sakta hai; synchronous CPU calculation phir bhi usse block karti hai.
tags: node, http, npm, streams, event-loop, modules
visual: request-flow
---

## Mental model — simple soch

Node JavaScript ko browser ke outside run karta hai. V8 JavaScript execute karta hai; Node APIs operating system aur libuv ke through I/O coordinate karti hain. Main JavaScript thread par long CPU work sab requests ke callbacks delay kar sakta hai. Async I/O ka matlab har operation ke liye naya JavaScript thread create hona nahi hai. Kuch APIs OS networking use karti hain; kuch work libuv thread pool mein jaata hai.

> **Core takeaway:** Event loop multiple waits coordinate kar sakta hai; synchronous CPU calculation phir bhi usse block karti hai.

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

HTTP method operation intent batata hai, path resource identify karta hai, headers metadata aur body payload carry karte hain. Status code result class communicate karta hai. API resource URL ko verbs se bharne ki jagah consistent noun-based contract useful hai. Request body stream hoti hai; production server mein unbounded buffering avoid karo. Express middleware parsing aur routing simplify karta hai, lekin underlying HTTP behavior disappear nahi hota.

## Files modules and packages

ESM mein import/export use hota hai; `.mjs` explicit module extension hai. Package mein `"type": "module"` `.js` interpretation change karta hai. CommonJS require/module.exports older projects mein common hai. Package.json scripts repeatable commands document karte hain; lockfile reproducible dependency resolution help karta hai. Environment values strings hoti hain: port aur timeout parse/validate karo. Secrets environment/secrets manager mein rakho, repository mein nahi.

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

Readable source data produce karta hai, writable destination consume karta hai, transform stream data modify karti hai. Backpressure producer ko consumer ki speed respect karne deti hai. Pipeline error propagation aur cleanup coordinate karta hai. Streaming memory footprint reduce karti hai, lekin application agar har chunk collect kare to benefit lose ho jaata hai.

Node event loop mein poll, check aur timers jaise phases hain. Node 20/libuv 1.45 ke baad per-iteration timer scheduling poll ke baad hoti hai; simplistic old diagrams exact ordering guarantee nahi dete. Main-module setTimeout versus setImmediate order ko universal fixed answer mat banao. CPU-heavy parsing/compression workload ko measure karke worker threads ya separate jobs consider karo.

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

`writable.write()` `false` return kare to internal buffer `highWaterMark` cross kar chuka hai — writer ko slow down karna chahiye. `drain` event signal karta hai ki buffer phir se accept karne layak hai. `pipeline()`/`.pipe()` yeh coordination internally already karte hain, isliye production code mein manual `data`/`write` handling se `pipeline` prefer karo; upar wala manual version sirf mechanism dikhane ke liye hai. Same idea HTTP response par bhi apply hoti hai: `response.write()` ka return value ignore karke tight loop mein likhte jaana slow client ke against process memory grow karega.

Transform stream data ko flow karte waqt modify karti hai, jaise gzip compression ya CSV-to-JSON conversion:

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

Yahan teen streams chained hain: readable source, transform (gzip) aur writable destination. `pipeline` har stage ke backpressure ko automatically respect karta hai aur kisi bhi stage mein error aane par baaki sab streams ko cleanly destroy kar deta hai — manual `.pipe()` chaining mein yeh cleanup easily miss ho jaata hai.

**Real production API mein yeh kaise dikhta hai:** CSV/report export endpoint jo database se lakhs rows fetch karke client ko stream karta hai, usse `res` (jo khud ek writable stream hai) ko directly pipe karna chahiye instead of building a giant array in memory aur ek saath `res.json()` call karna. Slow client ya slow network automatically upstream database cursor ko bhi throttle kar dega jab tak pipeline correctly wired ho.

## Common mistakes — in galtiyon se bacho

- **Wrong assumption:** `fs.readFileSync`/other sync APIs request handler ke andar "thoda sa" use karna safe hai kyunki file chhoti hai. **Why it breaks:** Sync call event loop ko block karti hai; us duration mein koi bhi doosri request (health check bhi) process nahi hoti. Production traffic ke under yeh latency spikes/timeouts ka common root cause hai. **Fix:** Async variant (`fs.promises.readFile`) use karo, ya startup-time config ke liye hi sync version reserve karo jab abhi tak koi request serve nahi ho rahi.
- **Wrong assumption:** ESM aur CommonJS ko same file mein freely mix kar sakte hain bina soche. **Why it breaks:** `require()` ESM-only package ko load nahi kar sakta, aur top-level `await` sirf ESM mein valid hai; mismatch confusing `ERR_REQUIRE_ESM` jaisi errors deta hai. **Fix:** Package ka `"type"` field aur target Node version check karke consistently ek module system choose karo; dynamic `import()` interop escape hatch hai jab zaroorat pade.
- **Wrong assumption:** Large request body ko `request.on("data")` se manually collect karna JSON parsing ke liye fine hai bina limit ke. **Why it breaks:** Client (malicious ya buggy) unbounded body bhej sakta hai; sab chunks memory mein accumulate karna process ko crash kar sakta hai. **Fix:** Body size limit enforce karo (Express mein `express.json({ limit })` jaisa option), aur bade uploads ke liye streaming parser use karo.

## Practice

Health endpoint ke saath text-file download add karo using a stream. Large file aur disconnected client cases test karo. Synchronous expensive loop add karke concurrent health latency compare karo, phir loop remove karo.

## Interview questions — bolkar practice karo

**Q. Node single-threaded hai?** JavaScript execution usually one main thread par hoti hai, lekin runtime OS services, thread pool aur optional workers use karta hai. Blanket “sab single-threaded” inaccurate hai.

**Q. Stream readFile se kab useful hai?** Large data, progressive processing aur bounded memory mein. Small configuration file ko startup par read karna simpler ho sakta hai.

## Research notes: Backpressure is a producer contract

Writable.write() false de toh producer pause kare jab tak destination ready na ho. Continue karoge toh buffer accidental queue banega. Error-aware pipeline cooperating streams coordinate karti hai.

```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
await pipeline(createReadStream('input.txt'), createWriteStream('copy.txt'));
```

Input file exist honi chahiye; output is exercise ka owned file hai. Earlier stage ne poora dataset load kar liya toh final stage stream karne se woh memory cost undo nahi hoti.

**Interview check:** Backpressure total simultaneous exports ki count cap karta hai?

**Answer:** Nahi; woh cooperating pipeline ke andar flow regulate karta hai. Service ko pipelines ke across admission limit aur cancellation/error cleanup alag chahiye.

**Practice:** Slow destination ke saath demand respect/ignore karke memory compare karo.

[Source yahan padho — Node.js](https://nodejs.org/en/learn/modules/backpressuring-in-streams). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Revision and practice lab — khud karke samjho

**Recall:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply:** Endpoint response se pehle long synchronous calculation karta hai. Unrelated lightweight requests slow kyun hoti hain? Cause isolate karne ka experiment do.

> **Hint:** Async networking synchronous calculation ko parallel nahi banati.

**Answer guide — compare after attempting:** Calculation ke saath aur bina concurrent lightweight requests compare karo; event-loop delay measure karo. Suitable CPU work bounded worker queue ya separate execution service ko do. Handler ko async likhne se uski synchronous body event loop se bahar nahi jaati.

**Exit check:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Sources — aur padhne ke liye

[Node event loop guide](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick) runtime phases explain karta hai. [Node stream documentation](https://nodejs.org/api/stream.html) pipeline aur backpressure ka reference hai.
