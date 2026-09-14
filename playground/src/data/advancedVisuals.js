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
    'Shuru mein har day ka answer pending hai',
    'Zero ka matlab abhi koi warmer day nahi mila. Indices store karo, taaki same temperature wale alag days ki identity bachi rahe.',
  );
  values.forEach((value, today) => {
    while (stack.length && value > values[stack.at(-1)]) {
      const previous = stack.pop();
      waits[previous] = today - previous;
      snapshot(
        `Day ${today} se day ${previous} ka answer mila`,
        `${value}° pichhle ${values[previous]}° se warmer hai. Wait ${today} − ${previous} = ${waits[previous]} din hai. Yeh index ab dobara push nahi hoga.`,
        today,
      );
    }
    stack.push(today);
    snapshot(
      `Day ${today} ko push karo`,
      'Pending temperatures bottom se top tak non-increasing hain. Equal temperature warmer nahi maana jaata, isliye equality par pop nahi karte.',
      today,
    );
  });
  snapshot(
    'Answers mil gaye; baaki zero hain',
    'Bache indices ke baad koi warmer day nahi hai. Har index ek baar push aur maximum ek baar pop hua: time O(n), space O(n).',
  );
  return frames;
}

export const advancedVisuals = [
  {
    id: 'react-identity',
    name: 'React keys and draft identity',
    track: 'react',
    icon: 'react',
    description: 'Galat row par draft pahunchne ka reason aur stable keys ka fix dekho.',
    source: 'https://react.dev/learn/preserving-and-resetting-state',
    code: '// Stable identity survives sibling deletion:\nitems.map(item => <Editor key={item.id} item={item} />)\n// Index keys identify positions, not entities:\nitems.map((item, i) => <Editor key={i} item={item} />)',
    language: 'jsx',
    takeaway:
      'Key same parent ke siblings ki identity batati hai. Stable entity ID se reorder par sahi entity ki state bachti hai. Key badaloge toh nayi state se shuruaat hoti hai.',
    frames: [
      frame(
        'Do rows — position wali keys',
        'A aur B dono ke Editor mein apna local draft hai. Abhi keys positions 0 aur 1 hain.',
        [
          lane('Rendered rows', ['key 0 → A', 'key 1 → B']),
          lane('Local drafts', ['key 0: draft A', 'key 1: draft B']),
        ],
      ),
      frame(
        'Data se A delete karo',
        'A delete hua toh B pehla item bana. Index key 1 se 0 ho gayi, bhale hi entity wahi B hai.',
        [lane('Next render', ['key 0 → B']), lane('Existing component at key 0', ['draft A'])],
      ),
      frame(
        'Position key se galat draft bacha',
        'React key 0 wala Editor B ke liye reuse karta hai. Uski local draft state purane A editor ki hai, isliye galat draft dikhta hai.',
        [
          lane('Visible row', ['B showing draft A']),
          lane('Unmounted component', ['old key 1, draft B discarded']),
        ],
      ),
      frame(
        'Stable entity keys se dobara dekho',
        'Ab entity IDs A aur B ko keys banao. Example wahi hai; identity ab position par depend nahi karti.',
        [
          lane('Rendered rows', ['key A → A', 'key B → B']),
          lane('Local drafts', ['key A: draft A', 'key B: draft B']),
        ],
      ),
      frame(
        'A ko phir delete karo',
        'Same parent ke andar B ki key B hi rehti hai, isliye uski apni local state bachti hai.',
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
    description: 'Read-then-write race ko atomic conditional claim se compare karo.',
    language: 'sql',
    source: 'https://www.postgresql.org/docs/18/transaction-iso.html',
    code: 'UPDATE inventory\nSET stock = stock - 1\nWHERE product_id = $1 AND stock > 0\nRETURNING stock;\n-- No returned row: no reservation was made.\n-- Write the reservation in the same transaction.',
    takeaway:
      'Shared database mein invariant protect karo. Sirf transaction wrapper ya ek Java instance ka lock har read-then-write race solve nahi karta.',
    frames: [
      frame(
        'Ek seat, do buyers',
        'Dono requests alag API instances par aayi hain. Shared database mein stock = 1 hai.',
        [lane('Buyer A', ['ready']), lane('Database', ['stock = 1']), lane('Buyer B', ['ready'])],
      ),
      frame(
        'Dono ne available stock padha',
        'Pehle SELECT karne par dono callers ko ek seat available dikhti hai. Abhi kisi ne write nahi kiya.',
        [
          lane('Buyer A', ['read 1; decide to book']),
          lane('Database', ['stock = 1']),
          lane('Buyer B', ['read 1; decide to book']),
        ],
      ),
      frame(
        'Dono ne pehle calculated zero likha',
        'Koi extra invariant/conflict check nahi hai. Dono pehle se calculated stock = 0 write karke order banate hain. Ek seat ke liye do bookings ho gayi.',
        [
          lane('Bookings', ['order A', 'order B']),
          lane('Database', ['stock = 0 — hides oversell']),
        ],
      ),
      frame(
        'Reset: ek conditional statement se claim karo',
        'Dono UPDATE ... WHERE stock > 0 chalate hain. Yeh PostgreSQL Read Committed row-update behavior ka simplified model hai.',
        [
          lane('Buyer A', ['conditional UPDATE']),
          lane('Database', ['stock = 1']),
          lane('Buyer B', ['conditional UPDATE']),
        ],
      ),
      frame(
        'A ne row claim ki; B wait karta hai',
        'A stock zero karta hai aur same transaction mein reservation likhta hai. B ko is row ka concurrent update karne ke liye wait karna padta hai.',
        [
          lane('Buyer A', ['one row returned; commit reservation']),
          lane('Database', ['stock = 0']),
          lane('Buyer B', ['wait for row writer']),
        ],
      ),
      frame(
        'B dobara check karta hai; claim fail',
        'A commit kare toh B updated row par condition dobara check karta hai. Stock > 0 match nahi hota; B sold out return karta hai.',
        [lane('Bookings', ['order A only']), lane('Buyer B', ['zero rows returned → sold out'])],
      ),
    ],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic stack: warmer days',
    track: 'dsa',
    icon: 'layers',
    description: 'Pending candidates ko stack se maximum ek baar nikalte dekho.',
    source: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
    code: 'const waits = Array(temperatures.length).fill(0);\nconst stack = [];\nfor (let today = 0; today < temperatures.length; today++) {\n  while (stack.length && temperatures[today] > temperatures[stack.at(-1)]) {\n    const previous = stack.pop();\n    waits[previous] = today - previous;\n  }\n  stack.push(today);\n}',
    takeaway:
      'Nested loop ka total kaam bhi linear ho sakta hai. Har index ek baar push aur maximum ek baar pop hota hai. Equal temperature warmer nahi hai, isliye woh pending rehta hai.',
    frames: monotonicStackTrace([73, 74, 75, 71, 69, 72, 76, 73]),
  },
];
