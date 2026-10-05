export default function VoiceSettings({ voice, disabled = false }) {
  const { preferences, setPreference } = voice;
  return (
    <details className="ia-voice-settings">
      <summary>Voice settings</summary>
      <div className="ia-voice-fields">
        <label>
          Listening language
          <select
            disabled={disabled}
            value={preferences.inputLocale}
            onChange={(e) => setPreference('inputLocale', e.target.value)}
          >
            <option value="auto">Match interview language</option>
            <option value="en-IN">English · India</option>
            <option value="en-US">English · US</option>
            <option value="hi-IN">Hindi / Hinglish</option>
          </select>
        </label>
        <label>
          Pause before sending
          <select
            disabled={disabled}
            value={preferences.silenceMs}
            onChange={(e) => setPreference('silenceMs', Number(e.target.value))}
          >
            <option value={2000}>Quick · 2 seconds</option>
            <option value={3500}>Balanced · 3.5 seconds</option>
            <option value={5000}>Relaxed · 5 seconds</option>
            <option value={7000}>Thinking time · 7 seconds</option>
          </select>
        </label>
        <label>
          Speaking speed
          <select
            disabled={disabled}
            value={preferences.rate}
            onChange={(e) => setPreference('rate', Number(e.target.value))}
          >
            <option value={0.85}>Slower · 0.85×</option>
            <option value={1}>Normal · 1×</option>
            <option value={1.15}>Faster · 1.15×</option>
            <option value={1.3}>Quick · 1.3×</option>
          </select>
        </label>
        <label>
          Interviewer voice
          <select
            disabled={disabled}
            value={preferences.voiceName}
            onChange={(e) => setPreference('voiceName', e.target.value)}
          >
            <option value="Kore">Kore · firm</option>
            <option value="Puck">Puck · upbeat</option>
            <option value="Aoede">Aoede · breezy</option>
            <option value="Charon">Charon · informative</option>
          </select>
        </label>
      </div>
      <p className="ia-small">
        Saved in this browser. Pause timing applies to hands-free answers. Changing a setting stops
        current audio; tap Speak or Replay to continue. Speech recognition and voice generation run
        through Gemini on the server. The browser only records and plays audio.
      </p>
    </details>
  );
}
