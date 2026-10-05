import { useCallback, useEffect, useRef, useState } from 'react';
import { VoiceSession } from './voice/VoiceSession.js';
import { canRecord } from './voice/RecordedInput.js';
import { transcribeAudio } from './voice/transcribe.js';
import { synthesizeAudio } from './voice/synthesize.js';
import { streamAudio } from './voice/streamSpeech.js';
import { LiveInput, canStream } from './voice/LiveInput.js';
const PREFS_KEY = 'shortnotes.interviewer.voice.v1';
const defaults = { silenceMs: 3500, rate: 1, voiceName: 'Kore', inputLocale: 'auto' };
function readPreferences() {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY) || '{}');
    return {
      silenceMs: [2000, 3500, 5000, 7000].includes(saved.silenceMs) ? saved.silenceMs : 3500,
      rate: [0.85, 1, 1.15, 1.3].includes(saved.rate) ? saved.rate : 1,
      inputLocale: ['auto', 'en-IN', 'en-US', 'hi-IN'].includes(saved.inputLocale)
        ? saved.inputLocale
        : 'auto',
      voiceName: ['Kore', 'Puck', 'Aoede', 'Charon'].includes(saved.voiceName)
        ? saved.voiceName
        : 'Kore',
    };
  } catch {
    return defaults;
  }
}
export function useVoice({ language, onDraft, onSubmit, onActivity }) {
  const callbacks = useRef({ onDraft, onSubmit, onActivity });
  callbacks.current = { onDraft, onSubmit, onActivity };
  const [preferences, setPreferences] = useState(readPreferences);
  const [engine] = useState(
    () =>
      new VoiceSession({
        browser: window,
        transcribe: transcribeAudio,
        synthesize: synthesizeAudio,
        streamSpeech: streamAudio,
        liveInput: canStream(window) ? LiveInput : null,
        onDraft: (text) => callbacks.current.onDraft(text),
        onSubmit: (text) => callbacks.current.onSubmit(text),
        onActivity: () => callbacks.current.onActivity(),
      }),
  );
  const [state, setState] = useState(engine.state);
  engine.configure({ language, ...preferences });
  useEffect(() => {
    const unsubscribe = engine.subscribe(setState);
    const hidden = () => {
      if (document.visibilityState !== 'hidden') return;
      if (engine.state.phase !== 'idle')
        engine.fail('Voice paused while this tab was hidden. Resume voice when you return.');
      else engine.stop(); // Also cancel a pending playback-to-microphone handoff.
    };
    const escape = (event) => {
      if (event.key === 'Escape') engine.stop();
    };
    document.addEventListener('visibilitychange', hidden);
    window.addEventListener('pagehide', engineStop);
    window.addEventListener('keydown', escape);
    function engineStop() {
      engine.stop();
    }
    return () => {
      unsubscribe();
      engine.dispose();
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('pagehide', engineStop);
      window.removeEventListener('keydown', escape);
    };
  }, [engine]);
  const setPreference = useCallback(
    (name, value) => {
      engine.stop();
      setPreferences((previous) => {
        const next = { ...previous, [name]: value };
        try {
          localStorage.setItem(PREFS_KEY, JSON.stringify(next));
        } catch {
          /* Session-only settings still work. */
        }
        return next;
      });
    },
    [engine],
  );
  const stop = useCallback(() => engine.stop(), [engine]);
  const listen = useCallback((...args) => engine.listen(...args), [engine]);
  const speak = useCallback((...args) => engine.speak(...args), [engine]);
  const finish = useCallback((...args) => engine.finish(...args), [engine]);
  const retryRecording = useCallback(() => engine.retryRecording(), [engine]);
  const prepare = useCallback((microphone) => engine.prepare(microphone), [engine]);
  return {
    ...state,
    supported: canStream(window) || canRecord(window),
    streamingSupported: canStream(window),
    listening: ['starting', 'recording', 'transcribing'].includes(state.phase),
    finalizing: state.phase === 'transcribing',
    speaking: ['generating', 'speaking'].includes(state.phase),
    preferences,
    setPreference,
    listen,
    speak,
    stop,
    finish,
    retryRecording,
    prepare,
  };
}
