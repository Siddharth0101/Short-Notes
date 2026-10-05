import { Link } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Send,
  Lightbulb,
  ArrowRight,
  Download,
  Clock3,
} from 'lucide-react';
import { TRACKS } from '../lib/content.js';
import Markdown from '../library/Markdown.jsx';
import { useInterviewController } from './useInterviewController.js';
import { PHASES, LABELS, STAGES, clock } from './session.js';
import CodingWorkspace from './CodingWorkspace.jsx';
import InterviewReview from './InterviewReview.jsx';
import InterviewSetup from './InterviewSetup.jsx';
import VoiceSettings from './VoiceSettings.jsx';
import './interviewer.css';
export default function InterviewAgent() {
  const controller = useInterviewController();
  const {
    subject,
    session,
    setSession,
    busy,
    error,
    setError,
    storageError,
    draft,
    setDraft,
    code,
    voiceOn,
    setVoiceOn,
    handsFree,
    setHandsFree,
    autoHints,
    setAutoHints,
    hintOffer,
    setHintOffer,
    confirmEnd,
    setConfirmEnd,
    pending,
    transcriptEnd,
    voice,
    remaining,
    scheduled,
    send,
    touch,
    download,
    resumeVoice,
    replay,
  } = controller;
  const subjectName = TRACKS.find((t) => t.id === (session?.subject || subject))?.name;
  const active = session?.status === 'active';
  const notices = (
    <>
      {error && (
        <div className="ia-error" role="alert">
          {error}
          {pending.current && (
            <button onClick={() => send('', '', true)} disabled={busy}>
              Retry last request
            </button>
          )}
        </div>
      )}
      {storageError && (
        <p role="status" className="ia-notice">
          {storageError}
        </p>
      )}
      {voice.error && (!session || session.status === 'completed') && (
        <p role="status" className="ia-notice">
          {voice.error}
        </p>
      )}
    </>
  );
  if (!session) return <InterviewSetup controller={controller} notices={notices} />;
  return (
    <div className="ia-page ia-room">
      <header className="ia-room-header">
        <div>
          <div className="ia-eyebrow">
            INTERVIEW ROOM · {session.language === 'hinglish' ? 'HINGLISH' : 'ENGLISH'}
          </div>
          <h1>{subjectName}</h1>
          <p className="ia-small">
            {session.activeAgent
              ? `${LABELS[session.activeAgent] || 'Interview'} specialist`
              : 'Your notes. Your projects. One focused hour.'}
          </p>
        </div>
        <div className="ia-timer">
          <Clock3 size={19} />
          <strong>{clock(remaining)}</strong>
          <span>
            {session.status === 'paused'
              ? 'Paused'
              : session.status === 'completed'
                ? 'Finished'
                : 'remaining'}
          </span>
        </div>
      </header>
      <nav className="ia-phases" aria-label="Interview stages">
        {PHASES.map((p, i) => (
          <div
            key={p}
            className={
              session.phase === p ? 'current' : PHASES.indexOf(session.phase) > i ? 'done' : ''
            }
          >
            <span>{i + 1}</span>
            {LABELS[p]}
            <small>{STAGES[i]}</small>
          </div>
        ))}
      </nav>
      {notices}
      {session.modelRouting?.fallback && (
        <p className="ia-notice" role="status">
          Using {session.modelRouting.model} because {session.modelRouting.preferredModel}{' '}
          is temporarily unavailable. Your interview and memory continue in the same session.
        </p>
      )}
      <div className="ia-toolbar">
        <div className="ia-controls">
          <button
            onClick={() => {
              voice.stop();
              setVoiceOn(!voiceOn);
            }}
            aria-pressed={voiceOn}
          >
            {voiceOn ? <Volume2 size={16} /> : <VolumeX size={16} />}Voice{' '}
            {voiceOn ? 'on' : 'off'}
          </button>
          <label className="ia-check">
            <input
              type="checkbox"
              checked={handsFree}
              disabled={!voice.supported || !active || busy}
              onChange={(e) => {
                voice.stop();
                setHandsFree(e.target.checked);
                if (e.target.checked && !confirmEnd && !pending.current) {
                  void voice.prepare(false);
                  voice.listen(draft, session.phase !== 'coding', true);
                }
              }}
            />
            Automatic voice
          </label>
          {handsFree && active && (
            <button
              disabled={busy || confirmEnd || Boolean(pending.current)}
              onClick={voice.listening || voice.speaking ? voice.stop : resumeVoice}
            >
              {voice.listening || voice.speaking ? <MicOff size={16} /> : <Mic size={16} />}
              {voice.listening || voice.speaking ? 'Pause voice' : 'Resume voice'}
            </button>
          )}
          <label className="ia-check">
            <input
              type="checkbox"
              checked={autoHints}
              onChange={(e) => setAutoHints(e.target.checked)}
            />
            Hint offers
          </label>
        </div>
        <div className="ia-controls">
          {session.status !== 'completed' && (
            <>
              <button disabled={busy} onClick={() => send(active ? 'pause' : 'resume')}>
                {active ? <Pause size={15} /> : <Play size={15} />}{' '}
                {active ? 'Pause' : 'Resume'}
              </button>
              <button
                disabled={busy}
                onClick={() => {
                  voice.stop();
                  setConfirmEnd(true);
                }}
              >
                End interview
              </button>
            </>
          )}
          <button onClick={download}>
            <Download size={15} />
            Export
          </button>
          {session.status === 'completed' && (
            <button
              onClick={() => {
                voice.stop();
                setSession(null);
                setError('');
              }}
            >
              New interview
            </button>
          )}
        </div>
      </div>
      <VoiceSettings voice={voice} disabled={busy} />
      {confirmEnd && (
        <div className="ia-notice" role="alert">
          Finish now and generate your review?
          <button onClick={() => send('end')}>Finish & review</button>
          <button onClick={() => setConfirmEnd(false)}>Keep going</button>
        </div>
      )}
      {session.status === 'paused' && (
        <div className="ia-notice">
          Interview paused. Your timer and microphone are stopped.
        </div>
      )}
      {scheduled !== session.phase && active && (
        <div className="ia-notice">
          Time for {LABELS[scheduled]}. Finish your thought, then continue.
          <button disabled={busy} onClick={() => send('transition')}>
            Continue to {LABELS[scheduled]}
          </button>
        </div>
      )}
      {hintOffer && active && (
        <div className="ia-hint" role="status">
          <Lightbulb size={19} />
          <span>Thoda stuck ho? I can give you a small hint.</span>
          <button
            disabled={busy}
            onClick={() => {
              setHintOffer(false);
              send('hint');
            }}
          >
            Get hint
          </button>
          <button onClick={touch}>Let me think</button>
        </div>
      )}
      <div className={`ia-workspace ${session.coding ? 'with-code' : ''}`}>
        <section className="ia-conversation ia-card" aria-label="Interview conversation">
          <div className="ia-conversation-title" role="status" aria-live="polite">
            <span className={`ia-status-dot ${voice.listening ? 'listening' : ''}`} />
            {busy
              ? 'Interviewer is thinking…'
              : voice.phase === 'starting'
                ? 'Starting microphone…'
                : voice.phase === 'generating'
                  ? 'Preparing interviewer audio…'
                  : voice.finalizing
                    ? 'Finishing your transcript…'
                    : voice.phase === 'recording'
                      ? voice.waiting
                        ? 'Pause detected · keep talking to continue'
                        : voice.live
                          ? 'Listening · live transcript'
                          : 'Recording your answer…'
                      : voice.speaking
                        ? 'Interviewer is speaking'
                        : voice.listening
                          ? voice.waiting
                            ? 'Pause detected · keep talking or send now'
                            : 'Listening to you…'
                          : session.status === 'completed'
                            ? 'Interview complete'
                            : 'Your conversation'}
            {(voice.speaking || voice.listening) && (
              <button onClick={voice.stop}>
                {voice.speaking
                  ? 'Stop speaking'
                  : voice.finalizing
                    ? 'Cancel transcription'
                    : 'Cancel recording'}
              </button>
            )}
          </div>
          {voice.speaking && (
            <div className="ia-speaking-strip">
              <p>{voice.caption}</p>
              {active && !busy && voice.supported && (
                <button type="button" onClick={resumeVoice}>
                  Interrupt & answer
                </button>
              )}
            </div>
          )}
          <div
            className="ia-transcript"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {session.messages.map((m) => (
              <article key={m.id} className={`ia-message ${m.role}`}>
                <div className="ia-message-label">
                  {m.role === 'assistant' ? 'INTERVIEWER' : 'YOU'}
                  <span>{LABELS[m.phase]}</span>
                </div>
                <Markdown>{m.text}</Markdown>
                {m.code && (
                  <details>
                    <summary>Submitted code</summary>
                    <pre>{m.code}</pre>
                  </details>
                )}
                {m.role === 'assistant' && (
                  <button
                    className="ia-replay"
                    aria-label="Read this response aloud"
                    disabled={busy}
                    onClick={() => replay(m)}
                  >
                    <Volume2 size={13} />
                    Replay
                  </button>
                )}
                {m.reviewChapterIds?.length > 0 && (
                  <div className="ia-reading">
                    {m.reviewChapterIds.map((id) => (
                      <Link key={id} to={`/notes/${id}`}>
                        Revise: {id.replaceAll('-', ' ')}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            ))}
            {busy && (
              <p role="status" className="ia-thinking">
                Checking your answer and preparing the next step…
              </p>
            )}
            <div ref={transcriptEnd} />
          </div>
          {session.status !== 'completed' && (
            <form
              className="ia-composer"
              onSubmit={(e) => {
                e.preventDefault();
                if (voice.listening) voice.finish(true);
                else send('answer');
              }}
            >
              <label htmlFor="interview-answer">
                Your answer{' '}
                <span>
                  {voice.finalizing
                    ? '· transcribing'
                    : voice.listening
                      ? '· microphone is on'
                      : '· speak or type'}
                </span>
              </label>
              <textarea
                id="interview-answer"
                value={draft}
                maxLength={10000}
                disabled={busy || !active}
                onChange={(e) => {
                  if (voice.listening) voice.stop();
                  setDraft(e.target.value);
                  touch();
                }}
                placeholder={
                  handsFree
                    ? 'Your words appear here as you speak…'
                    : 'Explain your thinking… Review your transcript before sending.'
                }
                rows={3}
              />
              <div className="ia-composer-actions">
                <button
                  type="button"
                  className={voice.listening ? 'ia-mic active' : 'ia-mic'}
                  aria-pressed={voice.listening}
                  aria-describedby="interview-mic-status"
                  disabled={busy || !active || !voice.supported || voice.finalizing}
                  onClick={() => (voice.listening ? voice.finish(false) : resumeVoice())}
                >
                  {voice.listening ? <MicOff size={17} /> : <Mic size={17} />}{' '}
                  {voice.listening
                    ? voice.finalizing
                      ? 'Transcribing…'
                      : 'Stop mic'
                    : handsFree
                      ? 'Resume voice'
                      : 'Speak'}
                </button>
                <button
                  type="button"
                  disabled={
                    busy || !active || session.phase === 'intro' || session.phase === 'review'
                  }
                  onClick={() => send('hint')}
                >
                  <Lightbulb size={16} />
                  Hint
                </button>
                <button
                  className="primary-button"
                  disabled={
                    busy ||
                    !active ||
                    voice.finalizing ||
                    (!draft.trim() && !code.trim() && voice.phase !== 'recording')
                  }
                >
                  <Send size={16} />
                  {session.coding ? 'Send & review code' : 'Send answer'}
                </button>
              </div>
              <div id="interview-mic-status" role="status" aria-live="polite">
                <p className={voice.error ? 'ia-notice' : 'ia-small'}>
                  {voice.error ||
                    voice.notice ||
                    (!voice.supported
                      ? 'Microphone input is unavailable here. Use localhost or HTTPS in a microphone-enabled browser.'
                      : handsFree
                        ? 'Automatic voice is ready. The microphone opens after each question. Resume voice if you paused it.'
                        : 'Tap Speak to answer. Gemini transcribes your recording when you stop; you can edit the text before sending.')}
                </p>
                {voice.canRetryRecording && (
                  <button
                    type="button"
                    onClick={voice.retryRecording}
                    disabled={busy || !active}
                  >
                    Retry transcription
                  </button>
                )}
              </div>
              {handsFree && (
                <p className="ia-small">
                  {session.phase === 'coding'
                    ? 'Dictate while coding; use Send & review code when your implementation is ready.'
                    : `Your answer sends after about ${voice.preferences.silenceMs / 1000} seconds of silence. Keep talking to continue, or Stop mic to review first.`}{' '}
                  Escape or Pause voice stops the microphone. Turn off Automatic voice for
                  manual recording.
                  {!voice.streamingSupported &&
                    ' Live captions are unavailable on this device; text appears after the recording finishes.'}
                </p>
              )}
            </form>
          )}
        </section>
        {session.coding && <CodingWorkspace controller={controller} />}
      </div>
      {active && session.phase !== 'review' && (
        <button className="text-button ia-next" disabled={busy} onClick={() => send('next')}>
          Move to {LABELS[PHASES[PHASES.indexOf(session.phase) + 1]]}
          <ArrowRight size={16} />
        </button>
      )}
      {session.status === 'completed' && <InterviewReview session={session} />}
    </div>
  );
}
