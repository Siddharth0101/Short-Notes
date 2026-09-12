const lane = (name, items) => ({ name, items });
const frame = (title, explanation, lanes) => ({ title, explanation, lanes });

export function monotonicStackTrace(values) {
  const stack = [];
  const waits = Array(values.length).fill(0);
  const frames = [];
  function snapshot(title, explanation, active = -1) {
    frames.push({
      title,
      explanation,
      cells: values.map((value, i) => ({
        value,
        label: `day ${i}`,
        status: i === active ? 'active' : waits[i] ? 'found' : 'idle',
      })),
      lanes: [
        lane(
          'Unresolved indices · bottom → top',
          stack.map((i) => `${i} (${values[i]}°)`),
        ),
        lane(
          'Days until warmer',
          waits.map((n, i) => `${i}: ${n}`),
        ),
      ],
      result: [...waits],
    });
  }
  snapshot(
    'Every day starts unresolved',
    'Zero means no warmer day has been found. Store indices so duplicate temperatures keep their identity.',
  );
  values.forEach((value, today) => {
    while (stack.length && value > values[stack.at(-1)]) {
      const previous = stack.pop();
      waits[previous] = today - previous;
      snapshot(
        `Day ${today} resolves day ${previous}`,
        `${value}° is warmer than ${values[previous]}°. The wait is ${today} − ${previous} = ${waits[previous]} days. This index will never be pushed again.`,
        today,
      );
    }
    stack.push(today);
    snapshot(
      `Push day ${today}`,
      'Unresolved temperatures stay non-increasing from bottom to top. Equal temperatures do not count as warmer.',
      today,
    );
  });
  snapshot(
    'All answers resolved or left at zero',
    'Remaining indices have no later warmer day. Each index was pushed once and popped at most once: O(n) time, O(n) space.',
  );
  return frames;
}

export const advancedVisuals = [
  {
    id: 'react-identity',
    name: 'React keys and draft identity',
    track: 'react',
    icon: 'react',
    description: 'Watch a draft move to the wrong row, then fix the identity contract.',
    source: 'https://react.dev/learn/preserving-and-resetting-state',
    code: '// Stable identity survives sibling deletion:\nitems.map(item => <Editor key={item.id} item={item} />)\n// Index keys identify positions, not entities:\nitems.map((item, i) => <Editor key={i} item={item} />)',
    language: 'jsx',
    takeaway:
      'Keys identify siblings within their parent. Stable IDs preserve entity state during reordering; changing a key intentionally starts fresh state.',
    frames: [
      frame(
        'Two rows, indexed by position',
        'A and B each have an Editor with local draft state. The keys are 0 and 1.',
        [
          lane('Rendered rows', ['key 0 → A', 'key 1 → B']),
          lane('Local drafts', ['key 0: draft A', 'key 1: draft B']),
        ],
      ),
      frame(
        'Delete A from the data',
        'B becomes the first array item, so its index key changes from 1 to 0.',
        [lane('Next render', ['key 0 → B']), lane('Existing component at key 0', ['draft A'])],
      ),
      frame(
        'Position identity preserves the wrong draft',
        'React reuses the Editor at key 0 for B. Its local state still belongs to the old A editor.',
        [
          lane('Visible row', ['B showing draft A']),
          lane('Unmounted component', ['old key 1, draft B discarded']),
        ],
      ),
      frame(
        'Restart with stable entity keys',
        'Use keys A and B. This is the same initial example with a different identity contract.',
        [
          lane('Rendered rows', ['key A → A', 'key B → B']),
          lane('Local drafts', ['key A: draft A', 'key B: draft B']),
        ],
      ),
      frame(
        'Delete A again',
        'B keeps key B under the same parent and therefore retains its own local state.',
        [
          lane('Visible row', ['key B → B showing draft B']),
          lane('Unmounted component', ['key A only']),
        ],
      ),
    ],
  },
  {
    id: 'transaction-race',
    name: 'The last-seat transaction race',
    track: 'java',
    icon: 'database',
    description: 'Compare a read-then-write race with an atomic conditional claim.',
    language: 'sql',
    source: 'https://www.postgresql.org/docs/18/transaction-iso.html',
    code: 'UPDATE inventory\nSET stock = stock - 1\nWHERE product_id = $1 AND stock > 0\nRETURNING stock;\n-- No returned row: no reservation was made.\n-- Write the reservation in the same transaction.',
    takeaway:
      'Protect the invariant in the shared database. A transaction wrapper or a local Java lock alone does not make every read-then-write design race-safe.',
    frames: [
      frame(
        'One seat, two buyers',
        'Both requests reach different API instances. The database currently has stock = 1.',
        [lane('Buyer A', ['ready']), lane('Database', ['stock = 1']), lane('Buyer B', ['ready'])],
      ),
      frame(
        'Both read available stock',
        'A preliminary SELECT allows both callers to observe one available seat before either writes.',
        [
          lane('Buyer A', ['read 1; decide to book']),
          lane('Database', ['stock = 1']),
          lane('Buyer B', ['read 1; decide to book']),
        ],
      ),
      frame(
        'Both write a previously computed zero',
        'With no other invariant or conflict check, each writes stock = 0 and creates an order. Two bookings now exist for one seat.',
        [
          lane('Bookings', ['order A', 'order B']),
          lane('Database', ['stock = 0 — hides oversell']),
        ],
      ),
      frame(
        'Reset: claim with one conditional statement',
        'Both callers issue UPDATE ... WHERE stock > 0. Here we model PostgreSQL Read Committed row-update behavior.',
        [
          lane('Buyer A', ['conditional UPDATE']),
          lane('Database', ['stock = 1']),
          lane('Buyer B', ['conditional UPDATE']),
        ],
      ),
      frame(
        'A claims the row; B waits',
        'A changes stock to zero and writes its reservation in the same transaction. B cannot update the row concurrently.',
        [
          lane('Buyer A', ['one row returned; commit reservation']),
          lane('Database', ['stock = 0']),
          lane('Buyer B', ['wait for row writer']),
        ],
      ),
      frame(
        'B rechecks and cannot claim',
        'After A commits, B re-evaluates the condition against the updated row. No row satisfies stock > 0, so B returns sold out.',
        [lane('Bookings', ['order A only']), lane('Buyer B', ['zero rows returned → sold out'])],
      ),
    ],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic stack: warmer days',
    track: 'dsa',
    icon: 'layers',
    description: 'See unresolved candidates leave the stack exactly once.',
    source: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
    code: 'const waits = Array(temperatures.length).fill(0);\nconst stack = [];\nfor (let today = 0; today < temperatures.length; today++) {\n  while (stack.length && temperatures[today] > temperatures[stack.at(-1)]) {\n    const previous = stack.pop();\n    waits[previous] = today - previous;\n  }\n  stack.push(today);\n}',
    takeaway:
      'A nested loop can have linear total work. Every index enters once and leaves at most once; equal temperatures remain unresolved.',
    frames: monotonicStackTrace([73, 74, 75, 71, 69, 72, 76, 73]),
  },
];
