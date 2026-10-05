import { Mic, ArrowRight, Clock3, Sparkles, RotateCcw } from 'lucide-react';
import VoiceSettings from './VoiceSettings.jsx';
import { TRACKS } from '../lib/content.js';
import { PHASES, LABELS, STAGES } from './session.js';
export default function InterviewSetup({ controller, notices }) {
  const {
    subject,
    setSubject,
    experience,
    setExperience,
    language,
    setLanguage,
    voiceOn,
    setVoiceOn,
    handsFree,
    setHandsFree,
    voice,
    busy,
    health,
    start,
    savedId,
    resumeSaved,
  } = controller;
  return (
    <div className="ia-page">
      <div className="ia-eyebrow">
        <Sparkles size={15} /> YOUR PERSONAL INTERVIEW ROOM
      </div>
      <h1>
        Practice like it’s
        <br />
        <span>the real interview.</span>
      </h1>
      <p className="ia-lead">
        Apni knowledge ko conversation mein test karo. Explain your thinking, write real code, and
        get feedback grounded in your notes.
      </p>
      <div className="ia-setup-grid">
        <section className="ia-card ia-setup">
          <h2>Set up your interview</h2>
          <label>
            Subject
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              {TRACKS.filter((t) => t.id !== 'interview').map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div className="ia-fields">
            <label>
              Experience
              <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="beginner">Starting out</option>
                <option value="intermediate">Some project experience</option>
                <option value="experienced">Experienced developer</option>
              </select>
            </label>
            <label>
              Conversation
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="hinglish">Hinglish</option>
                <option value="english">English</option>
              </select>
            </label>
          </div>
          <label className="ia-check">
            <input
              type="checkbox"
              checked={voiceOn}
              onChange={(e) => setVoiceOn(e.target.checked)}
            />{' '}
            Read interviewer replies aloud
          </label>
          <label className="ia-check">
            <input
              type="checkbox"
              checked={handsFree}
              disabled={!voice.supported}
              onChange={(e) => setHandsFree(e.target.checked)}
            />{' '}
            Automatic voice · listen, transcribe, and reply
          </label>
          <VoiceSettings voice={voice} disabled={busy} />
          <p className="ia-small">
            Start interview, allow your mic once, and talk after the interviewer finishes. Your
            words appear as you speak; a short pause sends your answer automatically. Voice needs
            microphone access. Recordings are sent to Gemini for transcription; interviewer replies
            use Gemini text-to-speech. Raw audio is not saved by this app. Sessions are saved in the
            configured interview storage.
          </p>
          {!voice.supported && (
            <p className="ia-notice">
              Microphone capture isn’t available here. You can still complete the interview by
              typing.
            </p>
          )}
          {notices}
          <button
            className="primary-button ia-start"
            disabled={busy || health?.configured === false}
            onClick={start}
          >
            <Mic size={18} />
            {busy ? 'Opening your room…' : 'Start interview'}
            <ArrowRight size={17} />
          </button>
          {health?.configured === false && (
            <p className="ia-notice">
              Add GEMINI_API_KEY to the root .env and restart the interview server.
            </p>
          )}
          {savedId && (
            <button className="text-button ia-resume" disabled={busy} onClick={resumeSaved}>
              <RotateCcw size={15} /> Resume / view last interview
            </button>
          )}
        </section>
        <aside className="ia-card ia-agenda">
          <div className="ia-agenda-title">
            <Clock3 size={20} />
            <strong>One subject. One focused hour.</strong>
          </div>
          {PHASES.map((phase, i) => (
            <div className="ia-agenda-item" key={phase}>
              <span>0{i + 1}</span>
              <div>
                <h3>{LABELS[phase]}</h3>
                <p>
                  {
                    [
                      'Your story, projects, and the decisions you made.',
                      'Concepts, scenarios, corrections, and deeper follow-ups.',
                      'A practical task, code review, and hints when you need them.',
                      'Evidence-based feedback and what to revise next.',
                    ][i]
                  }
                </p>
              </div>
              <small>{STAGES[i]}</small>
            </div>
          ))}
          <div className="ia-note">
            “You mentioned caching in your project. How did you handle stale data?”
            <span>Follow-ups shaped by your answers.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
