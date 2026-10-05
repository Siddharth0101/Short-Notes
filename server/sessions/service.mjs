import { LearnerMemory } from '../memory/learner-memory.mjs';
import { randomUUID } from 'node:crypto';
import { AgentError } from '../agent/errors.mjs';
import { LIMITS, validateInput } from '../agent/guardrails.mjs';
import { runInterviewTurn } from '../agent/hub.mjs';
import { JsonSessionStore } from '../storage/json-session-store.mjs';
import { PHASES, elapsed, phaseAt, view } from './clock.mjs';
export class Sessions {
  constructor(directory, content, generate) {
    this.store = typeof directory === 'string' ? new JsonSessionStore(directory) : directory;
    this.memory = new LearnerMemory(this.store);
    this.content = content;
    this.generate = generate;
    this.busy = new Set();
  }
  save(s, previous) {
    return this.store.save(s, previous);
  }
  get(id) {
    return this.store.get(id);
  }
  async create(input) {
    if (!this.content.subjects.some((t) => t.id === input.subject))
      throw new AgentError('Choose a valid subject.', 400);
    const language = input.language === 'english' ? 'english' : 'hinglish';
    const opening =
      language === 'english'
        ? 'Welcome! We’ll start with your experience, move into technical questions, then do a coding round. Tell me about yourself and one project you personally worked on.'
        : 'Chalo shuru karte hain! Pehle tumhara experience, phir technical questions aur machine coding. Tell me about yourself — aur ek project batao jisme tumne personally kaam kiya hai.';
    const first = {
      id: randomUUID(),
      role: 'assistant',
      text: opening,
      speech: opening,
      phase: 'intro',
      agent: 'intro',
      at: Date.now(),
    };
    const memory = Object.fromEntries(
      PHASES.map((id) => [id, { messages: [], assessments: [] }]),
    );
    memory.intro.messages.push(first);
    const s = {
      version: 1,
      id: randomUUID(),
      subject: input.subject,
      language,
      experience: ['beginner', 'intermediate', 'experienced'].includes(input.experience)
        ? input.experience
        : 'intermediate',
      durationMinutes: 60,
      createdAt: Date.now(),
      status: 'active',
      phase: 'intro',
      activeAgent: 'intro',
      elapsedMs: 0,
      runningSince: Date.now(),
      messages: [first],
      agentMemory: memory,
      handoffs: [],
      traces: [],
      assessments: [],
      coding: null,
      hintsUsed: 0,
      requests: [],
      progress: {
        completed: Array.isArray(input.progress?.completed)
          ? input.progress.completed
              .filter((id) => this.content.notes.some((n) => n.id === id))
              .slice(0, 150)
          : [],
        known: Array.isArray(input.progress?.known)
          ? input.progress.known
              .filter((id) => this.content.questions.some((q) => q.id === id))
              .slice(0, 300)
          : [],
      },
    };
    await this.save(s);
    return view(s);
  }
  async update(id, input) {
    validateInput(input);
    if (this.busy.has(id))
      throw new AgentError('The interviewer is still responding. Please wait.', 409);
    this.busy.add(id);
    try {
      const original = await this.get(id),
        { action, requestId } = input;
      if (original.requests.includes(requestId)) return view(original);
      if (original.status === 'completed')
        throw new AgentError('This interview has ended.', 409);
      const s = structuredClone(original),
        now = Date.now(),
        spent = elapsed(s, now);
      if (action === 'pause' || action === 'resume') {
        s.elapsedMs = spent;
        s.runningSince = now;
        s.status = action === 'pause' ? 'paused' : 'active';
      } else {
        if (s.status === 'paused' && action !== 'end')
          throw new AgentError('Resume the interview first.', 409);
        const ending = action === 'end' || spent >= s.durationMinutes * 60000;
        if (s.messages.length >= LIMITS.messages && !ending)
          throw new AgentError(
            'Session turn limit reached. End the interview to get your review.',
            409,
          );
        const scheduled = phaseAt(s, now),
          assessmentPhase = s.phase;
        s.phase =
          action === 'next'
            ? PHASES[
                Math.max(PHASES.indexOf(scheduled), Math.min(3, PHASES.indexOf(s.phase) + 1))
              ]
            : scheduled;
        if (ending) s.phase = 'review';
        if (action === 'hint' && ['intro', 'review'].includes(s.phase))
          throw new AgentError('Hints are available during theory and coding rounds.', 400);
        if (action === 'hint') s.hintsUsed++;
        if (input.code !== undefined && input.code.trim()) {
          s.lastCode = input.code;
          s.codeLanguage = input.codeLanguage || 'text';
        }
        // Intro has no technical assessment/retest; load memory at the theory handoff.
        s.learnerMemory = s.phase === 'intro' ? [] : await this.memory.retrieve(s.subject);
        if (s.phase === 'theory' && assessmentPhase === 'intro') {
          s.revisitTarget =
            s.learnerMemory.find(
              (item) => item.phase === 'theory' && item.verdict !== 'correct',
            ) || null;
        }
        const previousQuestion = [...s.messages].reverse().find((m) => m.role === 'assistant');
        const reply = await runInterviewTurn(
          s,
          {
            ...input,
            action: ending ? 'end' : action,
            elapsedMs: spent,
            assessmentPhase,
          },
          this.content,
          this.generate,
        );
        const label =
          action === 'answer'
            ? input.text || 'Please review my code.'
            : action === 'hint'
              ? 'Can I have a hint?'
              : ending
                ? 'End interview and review my performance.'
                : `Continue to ${s.phase}.`;
        const messages = [
          {
            id: randomUUID(),
            role: 'user',
            action,
            text: label,
            ...(input.code
              ? { code: input.code, codeLanguage: input.codeLanguage || 'text' }
              : {}),
            phase: action === 'answer' ? assessmentPhase : s.phase,
            at: now,
          },
          {
            id: randomUUID(),
            role: 'assistant',
            text: reply.message,
            speech: reply.speech,
            tools: reply.tools,
            ...(reply.memoryReference ? { memoryReference: reply.memoryReference } : {}),
            reviewChapterIds: reply.reviewChapterIds,
            phase: s.phase,
            agent: s.activeAgent,
            at: Date.now(),
          },
        ];
        s.messages.push(...messages);
        s.agentMemory[s.activeAgent].messages.push(...messages);
        if (reply.assessment) {
          const a = {
            ...reply.assessment,
            at: now,
            phase: assessmentPhase,
            question: previousQuestion?.text.slice(0, 2000) || '',
            answer: (input.text || '').slice(0, 2000),
            correction: reply.message.slice(0, 3000),
          };
          s.assessments.push(a);
          s.agentMemory[assessmentPhase].assessments.push(a);
        }
        s.traces = [...(s.traces || []), reply.trace].slice(-120);
        if (reply.modelRouting) s.modelRouting = reply.modelRouting;
        if (ending) {
          s.elapsedMs = elapsed(s);
          s.status = 'completed';
          s.completedAt = Date.now();
        }
      }
      delete s.revisitTarget;
      delete s.learnerMemory; // Retrieved context is ephemeral; assessments persist atomically.
      s.requests = [...s.requests, requestId].slice(-150);
      await this.save(s, original);
      return view(s);
    } finally {
      this.busy.delete(id);
    }
  }
}
