import WebSocket from "ws";

const ENDPOINT =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent";
const VOCABULARY = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "MongoDB",
  "Spring Boot",
  "closure",
  "lexical scope",
  "useEffect",
  "useState",
  "Big O",
];

// Speech-only adapter: this connection has no interview tools, prompts, or memory.
// Only the hub can assess an answer or advance an interview.
export function connectLiveTranscription(
  callbacks,
  {
    apiKey = process.env.GEMINI_API_KEY,
    model = process.env.GEMINI_LIVE_TRANSCRIPTION_MODEL ||
      "gemini-3.5-transcribe-live",
    WebSocketImpl = WebSocket,
  } = {},
) {
  const socket = new WebSocketImpl(ENDPOINT, {
    headers: { "x-goog-api-key": apiKey },
    maxPayload: 128 * 1024,
    handshakeTimeout: 12000,
    perMessageDeflate: false,
  });
  let closed = false,
    ready = false,
    finishing = false;
  const send = (value) => {
    if (closed || socket.readyState !== 1) return false;
    if (socket.bufferedAmount > 256 * 1024) {
      callbacks.onError(
        "Live transcription is falling behind. Your visible text is preserved; resume voice to retry.",
      );
      return false;
    }
    socket.send(JSON.stringify(value));
    return true;
  };
  socket.on("open", () =>
    send({
      setup: {
        model: `models/${model}`,
        generationConfig: { responseModalities: ["TEXT"] },
        realtimeInputConfig: { automaticActivityDetection: { disabled: true } },
        inputAudioTranscription: {
          languageCodes:
            callbacks.locale === "auto"
              ? callbacks.language === "english"
                ? ["en-IN"]
                : []
              : [callbacks.locale],
          mode: "VERBATIM",
          customVocabulary: VOCABULARY,
        },
      },
    }),
  );
  socket.on("message", (data) => {
    if (closed) return;
    try {
      const message = JSON.parse(data.toString());
      if (message.error)
        return callbacks.onError(
          "Live transcription was rejected. Check model access or quota, then resume voice.",
        );
      if (message.setupComplete) {
        ready = true;
        send({ realtimeInput: { activityStart: {} } });
        callbacks.onReady();
      }
      const content = message.serverContent;
      if (typeof content?.interimInputTranscription?.text === "string")
        callbacks.onTranscript(content.interimInputTranscription.text, false);
      if (typeof content?.inputTranscription?.text === "string")
        callbacks.onTranscript(content.inputTranscription.text, true);
      if (finishing && (content?.turnComplete || content?.generationComplete))
        callbacks.onComplete();
      if (message.goAway)
        callbacks.onError(
          "The live speech connection expired. Your visible text is preserved; resume voice.",
        );
    } catch {
      callbacks.onError(
        "Invalid response from live transcription. Resume voice to retry.",
      );
    }
  });
  socket.on("error", () => {
    if (!closed)
      callbacks.onError(
        "Live transcription could not connect. Check the server connection and model access, then resume voice.",
      );
  });
  socket.on("close", () => {
    if (!closed)
      callbacks.onError(
        "Live transcription disconnected. Your visible text is preserved; resume voice.",
      );
  });
  return {
    sendPCM(bytes) {
      if (!ready || finishing) return false;
      return send({
        realtimeInput: {
          audio: {
            data: bytes.toString("base64"),
            mimeType: "audio/pcm;rate=16000",
          },
        },
      });
    },
    finish() {
      if (!ready || finishing) return;
      finishing = true;
      send({ realtimeInput: { activityEnd: {} } });
    },
    close() {
      closed = true;
      if (socket.readyState === 0) socket.terminate();
      else socket.close();
    },
  };
}
