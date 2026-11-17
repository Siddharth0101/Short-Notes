export const TRACKS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    symbol: 'JS',
    color: 'var(--track-javascript)',
    tint: 'var(--tint-javascript)',
    description: 'Web ke peeche ki language step-by-step samjho.',
    mentor: 'Jonas Schmedtmann · topic companion',
    topics: 'Fundamentals · async · the runtime',
    icon: 'code',
  },
  {
    id: 'react',
    name: 'React',
    symbol: '⚛',
    color: 'var(--track-react)',
    tint: 'var(--tint-react)',
    description: 'Components mein socho aur khud UI banao.',
    mentor: 'Jonas Schmedtmann · topic companion',
    topics: 'Components · hooks · production apps',
    icon: 'react',
  },
  {
    id: 'react-native',
    name: 'React Native',
    symbol: 'RN',
    color: 'var(--track-react-native)',
    tint: 'var(--tint-react-native)',
    description: 'React se Android aur iOS apps ke concepts samjho.',
    mentor: 'React Native + Expo · official docs companion',
    topics: 'Mobile UI · navigation · device APIs · releases',
    icon: 'phone',
  },
  {
    id: 'java',
    name: 'Java',
    symbol: 'J',
    color: 'var(--track-java)',
    tint: 'var(--tint-java)',
    description: 'Java ki strong foundation examples se banao.',
    mentor: 'Telusko · topic companion',
    topics: 'OOP · collections · JVM · concurrency',
    icon: 'coffee',
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    symbol: 'SB',
    color: 'var(--track-spring-boot)',
    tint: 'var(--tint-spring-boot)',
    description: 'Java web app banao, test karo aur deploy samjho.',
    mentor: 'Spring documentation · practical learning path',
    topics: 'Dependency injection · REST · JPA · security',
    icon: 'layers',
  },
  {
    id: 'mongodb',
    name: 'Node & MongoDB',
    symbol: 'M',
    color: 'var(--track-mongodb)',
    tint: 'var(--tint-mongodb)',
    description: 'Data model samjho aur reliable backend banao.',
    mentor: 'Jonas Schmedtmann · topic companion',
    topics: 'Node.js · Express · MongoDB',
    icon: 'database',
  },
  {
    id: 'dsa',
    name: 'Data structures & algorithms',
    shortName: 'DSA',
    symbol: '⌘',
    color: 'var(--track-dsa)',
    tint: 'var(--tint-dsa)',
    description: 'Problems ke peeche ke patterns samjho.',
    mentor: 'Colt Steele · topic companion',
    topics: 'Patterns · trees · graphs · dynamic programming',
    icon: 'network',
  },
  {
    id: 'system-design',
    name: 'System design',
    symbol: '◇',
    color: 'var(--track-system-design)',
    tint: 'var(--tint-system-design)',
    description: 'Requirements se recovery tak complete design samjho.',
    mentor: 'React frontend + Java backend',
    topics: 'Architecture · scale · real-world tradeoffs',
    icon: 'layers',
  },
  {
    id: 'interview',
    name: 'Interview playbooks',
    symbol: '?',
    color: 'var(--track-interview)',
    tint: 'var(--tint-interview)',
    description: 'Jo seekha usse clear answers mein explain karo.',
    mentor: 'Concepts · scenarios · follow-up questions',
    topics: 'Revision · machine coding · communication',
    icon: 'messages',
  },
];

export function parseFrontmatter(raw) {
  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { body: raw };
  const data = Object.fromEntries(
    match[1]
      .split('\n')
      .filter((line) => line.includes(':'))
      .map((line) => {
        const split = line.indexOf(':');
        return [
          line.slice(0, split).trim(),
          line
            .slice(split + 1)
            .trim()
            .replace(/^['"]|['"]$/g, ''),
        ];
      }),
  );
  return {
    ...data,
    order: Number(data.order || 0),
    minutes: Number(data.minutes || 8),
    tags: (data.tags || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    body: match[2].trim(),
  };
}

export function headingId(text) {
  const originalAnchors = {
    'Mental model — simple soch': 'mental-model',
    'Common mistakes — in galtiyon se bacho': 'common-mistakes',
    'Interview questions — bolkar practice karo': 'interview-questions',
    'Sources — aur padhne ke liye': 'sources',
    'Revision and practice lab — khud karke samjho': 'revision-and-practice-lab',
    'Aage badhne se pehle check karo': 'check-before-moving-on',
  };
  if (originalAnchors[text]) return originalAnchors[text];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function extractHeadings(markdown) {
  let fenced = false;
  const headings = [];
  for (const line of markdown.split('\n')) {
    if (/^```/.test(line)) fenced = !fenced;
    if (!fenced && /^## /.test(line)) {
      const title = line.slice(3).replace(/[`*]/g, '').trim();
      headings.push({ title, id: headingId(title) });
    }
  }
  return headings;
}

// Headings for a chapter's table of contents. A translated chapter carries `headingIds` so its
// anchors stay the canonical (Hinglish) ones in every language.
export function chapterHeadings(note) {
  return extractHeadings(note.body || '').map((heading) => ({
    ...heading,
    id: note.headingIds?.[heading.title] ?? heading.id,
  }));
}

// The interview questions that belong under a chapter. An interview playbook takes its whole
// subject; other chapters take the questions pinned to them, or those sharing a tag.
export function chapterQuestions(note, questions) {
  const subject = note.track === 'interview' ? note.id.replace('interview-', '') : note.track;
  return questions.filter((item) => {
    if (note.track === 'interview')
      return item.track === subject || (subject === 'java' && item.track === 'spring-boot');
    if (item.noteId) return item.noteId === note.id;
    if (item.track !== note.track) return false;
    return item.tags.some((tag) => note.tags.includes(tag));
  });
}

export const PRACTICE_HEADING = 'Practice questions';
export const PRACTICE_LEVELS = ['Easy', 'Medium', 'Hard'];

// Split a chapter around its `## Practice questions` section so the reader can
// render questions as interactive cards while the rest stays plain Markdown.
// `slugs` (canonical question slugs, by position) keep practice progress stable when the
// chapter is shown in another language and its titles differ.
export function splitPractice(markdown, slugs) {
  const lines = markdown.split('\n');
  let fenced = false;
  let start = -1;
  let end = lines.length;
  for (let index = 0; index < lines.length; index++) {
    if (/^```/.test(lines[index])) fenced = !fenced;
    if (fenced || !/^## /.test(lines[index])) continue;
    if (start >= 0) {
      end = index;
      break;
    }
    if (lines[index].slice(3).trim() === PRACTICE_HEADING) start = index;
  }
  if (start < 0) return { before: markdown, questions: [], after: '' };
  const questions = parsePracticeQuestions(lines.slice(start + 1, end).join('\n'));
  return {
    before: lines.slice(0, start).join('\n').trim(),
    questions: slugs
      ? questions.map((question, index) => ({ ...question, slug: slugs[index] ?? question.slug }))
      : questions,
    after: lines.slice(end).join('\n').trim(),
  };
}

// Recall section labels in both notebook languages (Hinglish is canonical).
export const RECALL_HEADING = /^Recall (aur|and) practice$/i;
export const RECALL_ANSWER = /^(Jawaab|Answer)\s*[—–-]/i;

// `term — meaning` bullets from the Quick revision part of a chapter: the raw material for
// flashcards and quizzes. Sub-headings inside Quick revision are included; later sections are not.
export function extractTerms(markdown) {
  const terms = [];
  let fenced = false;
  let section = '';
  for (const line of markdown.split('\n')) {
    if (/^```/.test(line)) fenced = !fenced;
    if (fenced) continue;
    if (/^## /.test(line)) {
      if (terms.length || section) break;
      section = line.slice(3).trim();
      continue;
    }
    if (!line.startsWith('- ')) continue;
    const split = line.indexOf(' — ');
    if (split < 0) continue;
    const term = line.slice(2, split).trim();
    const meaning = line.slice(split + 3).trim();
    if (term && meaning && term.length <= 60) terms.push({ term, meaning });
  }
  return terms;
}

// `### Level · Title`, prompt Markdown, then the answer inside <details>.
export function parsePracticeQuestions(section) {
  const chunks = [];
  let fenced = false;
  for (const line of section.split('\n')) {
    if (/^```/.test(line)) fenced = !fenced;
    if (!fenced && /^### /.test(line)) chunks.push([line]);
    else chunks.at(-1)?.push(line);
  }
  return chunks.map(([heading, ...rest]) => {
    const match = heading
      .slice(4)
      .trim()
      .match(/^(Easy|Medium|Hard)\s*·\s*(.+)$/);
    const level = match?.[1] || 'Medium';
    const title = (match?.[2] || heading.slice(4)).trim();
    const open = rest.findIndex((line) => line.trim() === '<details>');
    const close = rest.findLastIndex((line) => line.trim() === '</details>');
    const answerLines = open >= 0 ? rest.slice(open + 1, close > open ? close : undefined) : [];
    return {
      level,
      title,
      slug: headingId(title.replace(/[`*]/g, '')),
      prompt: (open >= 0 ? rest.slice(0, open) : rest).join('\n').trim(),
      answer: answerLines
        .filter((line) => !/^\s*<\/?summary>|^\s*<summary>.*<\/summary>\s*$/.test(line))
        .join('\n')
        .trim(),
    };
  });
}

export function legacyToMarkdown(raw, language = 'javascript') {
  const cleaned = raw.replace(/^\s*['"]use strict['"];?\s*/i, '');
  const blocks = [];
  const re = /\/\*\*?([\s\S]*?)\*\//g;
  let last = 0;
  let match;
  const code = (value) => {
    if (value.trim()) blocks.push('```' + language + '\n' + value.trim() + '\n```');
  };
  while ((match = re.exec(cleaned))) {
    code(cleaned.slice(last, match.index));
    blocks.push(
      match[1]
        .split('\n')
        .map((line) => line.replace(/^\s*\* ?/, ''))
        .filter((line) => !/^\s*[=─━]{3,}\s*$/.test(line))
        .join('\n')
        .replace(/\[⚡ VISUAL\]/g, '')
        .trim(),
    );
    last = re.lastIndex;
  }
  code(cleaned.slice(last));
  return blocks.join('\n\n');
}

export function filterNotes(notes, { query = '', track = 'all', level = 'all' } = {}) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return notes.filter(
    (note) =>
      (track === 'all' || note.track === track) &&
      (level === 'all' || note.level === level) &&
      terms.every((term) =>
        `${note.title} ${note.summary} ${note.tags?.join(' ')} ${note.body || ''} ${note.source || ''} ${note.searchText || ''}`
          .toLowerCase()
          .includes(term),
      ),
  );
}

export function normalizeProgress(value) {
  const clean = (input) =>
    Array.isArray(input) ? [...new Set(input.filter((item) => typeof item === 'string'))] : [];
  return {
    saved: clean(value?.saved),
    completed: clean(value?.completed),
    known: clean(value?.known),
    practiced: clean(value?.practiced),
    recent: clean(value?.recent).slice(0, 8),
  };
}
