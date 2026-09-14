export const TRACKS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    symbol: 'JS',
    color: 'var(--track-javascript)',
    tint: 'var(--tint-javascript)',
    description: 'Understand the language behind the web.',
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
    description: 'Think in components. Build with confidence.',
    mentor: 'Jonas Schmedtmann · topic companion',
    topics: 'Components · hooks · production apps',
    icon: 'react',
  },
  {
    id: 'java',
    name: 'Java',
    symbol: 'J',
    color: 'var(--track-java)',
    tint: 'var(--tint-java)',
    description: 'Build a strong foundation in the Java language.',
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
    description: 'Build, test and operate Java web applications.',
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
    description: 'Model data and build reliable backends.',
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
    description: 'Learn the patterns behind the problems.',
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
    description: 'Design the bigger picture, end to end.',
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
    description: 'Turn what you know into clear answers.',
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
    recent: clean(value?.recent).slice(0, 8),
  };
}
