import { WebSocketServer } from "ws";
import { connectLiveTranscription } from "../providers/live-transcription.mjs";

// A bounded, same-origin PCM relay. Credentials and provider setup never reach the browser.
export function attachLiveVoice(
  server,
  config,
  connect = connectLiveTranscription,
) {
  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: 8192,
    perMessageDeflate: false,
  });
  let active = 0,
    starts = 0,
    windowStart = Date.now();
  server.on("upgrade", (request, socket, head) => {
    const path = new URL(request.url, "http://localhost").pathname;
    const host = String(request.headers.host || "").split(":")[0];
    const reject = (status) => {
      socket.end(
        `HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
      );
    };
    if (path !== "/api/interviewer/voice/live") return reject("404 Not Found");
    if (
      !["localhost", "127.0.0.1"].includes(host) ||
      !config.allowedOrigins.has(request.headers.origin)
    )
      return reject("403 Forbidden");
    if (!config.configured) return reject("503 Service Unavailable");
    if (Date.now() - windowStart >= 60000) {
      starts = 0;
      windowStart = Date.now();
    }
    if (active >= 1 || ++starts > 20) return reject("429 Too Many Requests");
    wss.handleUpgrade(request, socket, head, (client) => {
      active++;
      let provider,
        ready = false,
        finished = false,
        closed = false,
        bytes = 0,
        textLength = 0;
      let messageWindow = Date.now(),
        messages = 0;
      const timers = new Set();
      const later = (ms, fn) => {
        const timer = setTimeout(fn, ms);
        timers.add(timer);
        return timer;
      };
      const send = (value) => {
        if (closed || client.readyState !== 1) return;
        if (client.bufferedAmount > 128 * 1024) return cleanup();
        client.send(JSON.stringify(value));
      };
      const cleanup = () => {
        if (closed) return;
        closed = true;
        active--;
        for (const timer of timers) clearTimeout(timer);
        provider?.close();
        client.close();
      };
      const fail = (message) => {
        send({ type: "error", message });
        cleanup();
      };
      const startup = later(15000, () =>
        fail("Live microphone connection timed out. Resume voice to retry."),
      );
      later(135000, () =>
        fail(
          "This voice turn reached its time limit. Your text is preserved; send it or resume voice.",
        ),
      );
      client.on("error", cleanup);
      client.on("close", cleanup);
      client.on("message", (data, isBinary) => {
        if (closed) return;
        if (Date.now() - messageWindow >= 1000) {
          messages = 0;
          messageWindow = Date.now();
        }
        if (++messages > 40)
          return fail("Too many audio packets. Resume voice to retry.");
        if (isBinary) {
          if (!ready || finished || !data.length || data.length % 2)
            return fail("Invalid audio stream. Resume voice.");
          bytes += data.length;
          if (bytes > 16000 * 2 * 125)
            return fail(
              "Audio turn is too long. Send the visible text before continuing.",
            );
          provider.sendPCM(data);
          return;
        }
        try {
          const input = JSON.parse(data.toString());
          if (input.type === "start" && !provider) {
            if (
              !["english", "hinglish"].includes(input.language) ||
              !["auto", "en-IN", "en-US", "hi-IN"].includes(input.locale)
            )
              return fail("Invalid live transcription settings.");
            provider = connect({
              language: input.language,
              locale: input.locale,
              onReady() {
                ready = true;
                clearTimeout(startup);
                send({ type: "ready" });
              },
              onTranscript(text, final) {
                if (final) textLength += text.length;
                if (text.length > 10000 || textLength > 10000)
                  return fail(
                    "Transcript reached the answer limit. Review the visible text.",
                  );
                send({ type: "transcript", text, final });
              },
              onComplete() {
                if (!finished) return;
                send({ type: "done" });
                cleanup();
              },
              onError: fail,
            });
          } else if (input.type === "finish" && ready && !finished) {
            finished = true;
            later(10000, () =>
              fail(
                "Final transcript timed out. Review the visible text before sending.",
              ),
            );
            provider.finish();
          } else fail("Invalid live voice command.");
        } catch {
          fail("Could not start live transcription. Resume voice to retry.");
        }
      });
    });
  });
  server.on("close", () => {
    for (const client of wss.clients) client.terminate();
    wss.close();
  });
  return wss;
}
