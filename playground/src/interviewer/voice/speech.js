// Text is prepared for the server TTS tool, never for a browser speech engine.
export function speechText(text) {
  return String(text)
    .slice(0, 14000)
    .replace(/```[\s\S]*?```/g, ' Code example is in the transcript. ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*#`_]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 5000);
}
