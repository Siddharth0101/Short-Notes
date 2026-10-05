import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TRACKS } from '../lib/content.js';
import { useProgress } from '../lib/progressContext.js';
import { useVoice } from './useVoice.js';
import { api } from './api.js';
import { KEY, readSaved, readDraft, saveDraft } from './storage.js';
import { timing, defaultCodeLanguage } from './session.js';
export function useInterviewController() {
  const [params] = useSearchParams();
  const [subject, setSubject] = useState(
    TRACKS.some((t) => t.id === params.get('track') && t.id !== 'interview')
      ? params.get('track')
      : 'javascript',
  );
  const [language, setLanguage] = useState('hinglish'),
    [experience, setExperience] = useState('intermediate');
  const [session, setSession] = useState(null),
    [savedId, setSavedId] = useState(readSaved),
    [health, setHealth] = useState(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [storageError, setStorageError] = useState('');
  const [draft, setDraft] = useState(''),
    [code, setCode] = useState(''),
    [codeLanguage, setCodeLanguage] = useState('javascript');
  const [voiceOn, setVoiceOn] = useState(true),
    [handsFree, setHandsFree] = useState(true),
    [autoHints, setAutoHints] = useState(true),
    [hintOffer, setHintOffer] = useState(false);
  const [now, setNow] = useState(Date.now()),
    [confirmEnd, setConfirmEnd] = useState(false);
  const activity = useRef(Date.now()),
    lastHint = useRef(0),
    sending = useRef(false),
    pending = useRef(null),
    sessionRef = useRef(null),
    draftRef = useRef(''),
    codeRef = useRef(''),
    spoken = useRef(null),
    endAttempted = useRef(false),
    transcriptEnd = useRef(null),
    mounted = useRef(true);
  const sendRef = useRef(null);
  sessionRef.current = session;
  draftRef.current = draft;
  codeRef.current = code;
  const { progress } = useProgress();
  const touch = useCallback(() => {
    activity.current = Date.now();
    setHintOffer(false);
  }, []);
  const voice = useVoice({
    language: session?.language || language,
    onDraft: setDraft,
    onSubmit: (text) => sendRef.current?.('answer', text),
    onActivity: touch,
  });
  const { speak, listen } = voice;
  const voiceMode = useRef(null);
  voiceMode.current = { handsFree, voiceOn, busy, confirmEnd };
  useEffect(() => {
    mounted.current = true;
    api('/health')
      .then((value) => {
        if (mounted.current) setHealth(value);
      })
      .catch((e) => {
        if (mounted.current) setError(e.message);
      });
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const subjectName = TRACKS.find((track) => track.id === session?.subject)?.name;
    document.title = session
      ? `${subjectName || 'Interview'} interview · Shortnotes`
      : 'Start an interview · Shortnotes';
  }, [session]);
  const { remaining, scheduled } = timing(session, now);
  const remember = useCallback((s) => {
    setSession(s);
    setSavedId(s.id);
    try {
      localStorage.setItem(KEY, s.id);
    } catch {
      setStorageError('Browser storage unavailable. Download your transcript before leaving.');
    }
  }, []);
  async function start() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError('');
    voice.stop();
    try {
      if (handsFree || voiceOn) {
        const ready = await voice.prepare(handsFree && voice.supported);
        if (!mounted.current) return;
        if (!ready && handsFree) {
          setHandsFree(false);
          setError('Microphone access is blocked. Allow it and resume voice, or type your answer.');
        }
      }
      const s = await api('/sessions', { subject, language, experience, progress });
      if (!mounted.current) return;
      pending.current = null;
      spoken.current = null;
      endAttempted.current = false;
      setDraft('');
      setCode('');
      setCodeLanguage(defaultCodeLanguage(subject));
      remember(s);
      touch();
    } catch (e) {
      if (mounted.current) setError(e.message);
    } finally {
      sending.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function resumeSaved() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError('');
    voice.stop();
    try {
      await voice.prepare(false);
      const s = await api(`/sessions/${savedId}`);
      if (!mounted.current) return;
      let saved = { draft: '', code: '', codeLanguage: '', pending: null };
      try {
        saved = readDraft(s.id);
      } catch {
        setStorageError(
          'Saved draft could not be restored. Your interview transcript is still available.',
        );
      }
      setDraft(saved.draft);
      setCode(saved.code);
      setCodeLanguage(saved.codeLanguage || defaultCodeLanguage(s.subject));
      pending.current = saved.pending;
      if (saved.pending)
        setError('A request was interrupted. Retry it to reconcile the saved interview.');
      spoken.current = s.messages.at(-1)?.id;
      endAttempted.current = false;
      remember(s);
      touch();
      setLanguage(s.language);
      // Restored drafts and unresolved requests are always reviewed before automatic capture.
      if (handsFree && s.status === 'active' && !saved.draft && !saved.pending)
        listen('', s.phase !== 'coding', true);
    } catch (e) {
      if (mounted.current) setError(e.message);
    } finally {
      sending.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function send(action, text = draftRef.current, retry = false) {
    const current = sessionRef.current;
    if (!current || sending.current) return;
    if (pending.current && !retry) {
      setError('Retry the previous request first so this answer is not submitted twice.');
      return;
    }
    if (action === 'answer' && current.status !== 'active') return;
    if (action === 'answer' && !text.trim() && !codeRef.current.trim()) return;
    sending.current = true;
    setBusy(true);
    setError('');
    setConfirmEnd(false);
    voice.stop();
    if (action === 'resume') void voice.prepare(false);
    const payload =
      retry && pending.current
        ? pending.current
        : {
            action,
            text: action === 'answer' ? text : '',
            code: ['answer', 'hint', 'end'].includes(action) ? codeRef.current : '',
            codeLanguage,
            requestId: crypto.randomUUID(),
          };
    pending.current = payload;
    try {
      saveDraft(current.id, {
        draft: draftRef.current,
        code: codeRef.current,
        codeLanguage,
        pending: payload,
      });
    } catch {
      setStorageError('Draft could not be saved in this browser. Export a backup before leaving.');
    }
    try {
      const updated = await api(`/sessions/${current.id}/turn`, payload);
      if (!mounted.current) return;
      pending.current = null;
      if (payload.action === 'resume') spoken.current = null;
      remember(updated);
      if (payload.action === 'answer') setDraft('');
      touch();
    } catch (e) {
      if (!mounted.current) return;
      // These explicit responses mean the server did not commit the transaction.
      // Transport failures and ambiguous 500s must retain the original retry identity.
      if ([400, 413, 415, 429, 502, 503].includes(e.status)) pending.current = null;
      if (e.status === 404) {
        pending.current = null;
        setSession(null);
        setSavedId('');
      }
      if (e.status === 409) {
        try {
          const latest = await api(`/sessions/${current.id}`);
          if (!mounted.current) return;
          remember(latest);
          if (latest.status === 'completed') {
            pending.current = null;
            return;
          }
          if (latest.status === 'paused' || e.message.includes('turn limit'))
            pending.current = null;
        } catch {
          /* Keep the original retry identity when reconciliation is unavailable. */
        }
      }
      if (mounted.current) setError(e.message);
    } finally {
      // Persist the resolved request identity even if React batches busy true/false.
      try {
        saveDraft(current.id, {
          draft: draftRef.current,
          code: codeRef.current,
          codeLanguage,
          pending: pending.current,
        });
      } catch {
        if (mounted.current)
          setStorageError(
            'Draft could not be saved in this browser. Export a backup before leaving.',
          );
      }
      sending.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  sendRef.current = send;
  const takeTurn = useCallback(() => {
    if (
      voiceMode.current.handsFree &&
      !voiceMode.current.busy &&
      !voiceMode.current.confirmEnd &&
      !pending.current &&
      sessionRef.current?.status === 'active' &&
      document.visibilityState !== 'hidden'
    )
      listen(draftRef.current, sessionRef.current.phase !== 'coding', true);
  }, [listen]);

  // Speak only newly received questions, never replay the entire transcript after a refresh.
  const lastMessage = session?.messages.at(-1);
  useEffect(() => {
    if (
      !lastMessage ||
      lastMessage.role !== 'assistant' ||
      lastMessage.id === spoken.current ||
      busy
    )
      return;
    spoken.current = lastMessage.id;
    if (voiceOn && session.status !== 'paused')
      speak(lastMessage.speech || lastMessage.text, takeTurn);
    else if (session.status === 'active') takeTurn();
  }, [lastMessage, busy, voiceOn, handsFree, session?.status, speak, takeTurn]);
  function resumeVoice() {
    if (busy || pending.current || confirmEnd || sessionRef.current?.status !== 'active') return;
    void voice.prepare(false);
    listen(draftRef.current, handsFree && sessionRef.current.phase !== 'coding', handsFree);
  }
  useEffect(() => {
    transcriptEnd.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [session?.messages.length, busy]);
  useEffect(() => {
    if (!session) return;
    try {
      saveDraft(session.id, { draft, code, codeLanguage, pending: pending.current });
    } catch {
      setStorageError('Draft could not be saved in this browser. Export a backup before leaving.');
    }
  }, [draft, code, codeLanguage, session, busy]);
  useEffect(() => {
    if (!session || session.status !== 'active' || busy || pending.current) return;
    if (remaining <= 0 && !endAttempted.current) {
      endAttempted.current = true;
      sendRef.current('end');
      return;
    }
    if (voice.listening || voice.speaking) return;
    if (
      autoHints &&
      session.phase !== 'intro' &&
      session.phase !== 'review' &&
      now - activity.current > 90000 &&
      now - lastHint.current > 120000
    ) {
      lastHint.current = now;
      setHintOffer(true);
    }
  }, [now, session, remaining, busy, autoHints, voice.listening, voice.speaking]);
  // Give a gentle offer after inactivity; request a hint only after the candidate accepts it.
  useEffect(() => {
    if (hintOffer && voiceOn && sessionRef.current?.status === 'active')
      speak('Thoda stuck ho? Hint chahiye toh Get hint dabao. Take your time.');
  }, [hintOffer, voiceOn, speak]);
  useEffect(() => {
    const warn = (e) => {
      if (sessionRef.current?.status === 'active') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  function download() {
    const data = { ...session, draft, code, codeLanguage };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortnotes-interview-${session.subject}-${session.id.slice(0, 8)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {
    subject,
    setSubject,
    language,
    setLanguage,
    experience,
    setExperience,
    session,
    setSession,
    savedId,
    health,
    busy,
    error,
    setError,
    storageError,
    draft,
    setDraft,
    code,
    setCode,
    codeLanguage,
    setCodeLanguage,
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
    start,
    resumeSaved,
    send,
    touch,
    download,
    resumeVoice,
    replay: (message) => {
      void voice.prepare(false);
      speak(message.speech || message.text, message.id === lastMessage?.id ? takeTurn : undefined);
    },
  };
}
