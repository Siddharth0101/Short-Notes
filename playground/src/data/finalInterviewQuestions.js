// Original gap-focused questions; no company-frequency claims.
export const finalInterviewQuestions = [
  {
    "id": "iq-final-01",
    "track": "java",
    "noteId": "java-low-level-design",
    "level": "Advanced",
    "question": "LLD mein class diagram se pehle physical copy aur book title kyun separate karoge?",
    "answer": "- Title catalog concept hai\n- physical copy actual borrowable unit.\n- Three copies of same title parallel borrow ho sakti hain, same copy ka one active loan invariant hai.\n- Wrong identity choose karoge toh ya unnecessary rejection hogi ya duplicate lending.\n- Pehle operations/state/ownership likho, phir classes choose karo.",
    "followUp": "Parking-space type aur individual parking spot mein same identity distinction kaise apply hogi?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-02",
    "track": "java",
    "noteId": "java-low-level-design",
    "level": "Advanced",
    "question": "LoanStore interface ka implementation method signatures match karke bhi invalid kaise ho sakta hai?",
    "answer": "- Interface ka contract atomic claim aur expected-loan release hai.\n- Non-atomic find-then-save same signatures ke saath concurrent duplicate loans allow kare toh behavioral substitution fail hai.\n- DB implementation ko constraints/atomic operations chahiye\n- type compatibility alone invariant preserve nahi karti.",
    "followUp": "In-memory fake pass hone ke baad real DB mein kaunsa concurrency test run karoge?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-03",
    "track": "java",
    "noteId": "java-low-level-design",
    "level": "Advanced",
    "question": "Old return request new borrow ko clear na kare: LLD mein kaunsi identity chahiye?",
    "answer": "- Copy ID alone enough nahi.\n- Each loan ki unique identity rakho\n- release current loan ko expected loan ID/version se atomically match kare.\n- Return A success, borrow B, phir duplicate return A aaye toh B bache.\n- API layer member authorization separately enforce kare\n- opaque ID alone permission proof nahi.",
    "followUp": "Distributed store mein conditional delete/update ka success outcome kaise map karoge?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-04",
    "track": "java",
    "noteId": "java-low-level-design",
    "level": "Advanced",
    "question": "Clock inject karna test trick se zyada design improvement kyun hai?",
    "answer": "- Business operation ka time source explicit dependency banta hai.\n- Fixed clock se timestamps/boundaries repeatably verify hote hain\n- real sleeps avoid hote hain.\n- Service system clock construction se coupled nahi rehti.\n- Production mein business instant aur duration measurement clock ki distinct needs bhi samjho.",
    "followUp": "System wall clock backward move ho toh elapsed-time deadline ke liye kya choose karoge?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-05",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "SQL 10 ms hai, HTTP response 2 seconds: database ko blame karne se pehle kya measure karoge?",
    "answer": "- Connection acquire wait, application queue, external calls, serialization aur response transfer separately time karo.\n- SQL timer connection milne ke baad start hota ho toh pool wait hide ho sakti hai.\n- Per-instance p95/p99 aur wait stacks compare karo\n- aggregate average hot instance mask kar sakti hai.",
    "followUp": "Pool size badhane se throughput improve hone ke bajay contention kab badhegi?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-06",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "TCP sender ke two writes receiver ke two reads kyun guarantee nahi karte?",
    "answer": "- TCP ordered reliable byte stream hai, application message framing protocol nahi.\n- Reads partial message ya multiple messages combine kar sakti hain.\n- Length-prefix/delimiter parser incomplete buffer preserve kare aur bounded size validate kare.\n- Transport ACK business transaction commit ka acknowledgment nahi.",
    "followUp": "Length prefix huge ya truncated ho toh parser ka resource/error contract kya hoga?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-07",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "DNS resolve success ke baad bhi HTTPS call fail: layers ka diagnosis order kya hai?",
    "answer": "- Name resolution sirf address discovery ka hissa prove karti hai.\n- Correct address/port, connection reachability, TLS hostname/trust chain, proxy route aur application authorization separately inspect karo.\n- Certificate validation bypass ko fix mat bolo\n- exact failed stage/error aur configuration verify karo.",
    "followUp": "Reused keep-alive connection par har request fresh DNS/TLS timings kyun nahi hongi?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-08",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "Heap stable lekin process RSS grow ho rahi hai: next hypotheses kya hain?",
    "answer": "- Native/direct buffers, thread stacks, memory-mapped pages aur runtime allocations inspect karo.\n- Heap graph total process memory nahi.\n- Resident pages aur virtual address reservations alag metrics hain\n- container limit total relevant memory par apply ho sakti hai.\n- Allocation/thread trends aur payload concurrency correlate karo.",
    "followUp": "Har memory increase ko garbage-collector leak bolna incomplete kyun hai?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-09",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "Low CPU ke saath huge p99 latency aur growing queue kaise possible hai?",
    "answer": "- Requests I/O, locks, connection-pool slots ya downstream service ka wait kar rahi ho sakti hain.\n- Low average CPU free useful capacity ka proof nahi.\n- Queue age, blocked stacks, pool wait aur per-instance load dekho.\n- Work conservation aur limits samajhkar bounded admission/timeout policy choose karo.",
    "followUp": "More app replicas single hot database row ka bottleneck kyun necessarily solve nahi karti?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-10",
    "track": "system-design",
    "noteId": "system-design-os-network-debugging",
    "level": "Advanced",
    "question": "200 requests/sec aur 250 ms average latency ko concurrency mein kaise translate karoge?",
    "answer": "- Stable-system Little's Law assumptions mein average in-flight L=lambda×W=200×0.25=50.\n- RPS arrival rate hai, concurrent requests count nahi.\n- Average law p99 guarantee nahi\n- unstable growing queues mein same steady-state inference blindly mat lagao.\n- Latency double aur arrivals same ho toh average concurrency roughly double ho sakti hai.",
    "followUp": "Same arrival rate par pool wait badhne se memory aur timeout pressure kaise badhega?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-11",
    "track": "dsa",
    "noteId": "dsa-patterns",
    "level": "Intermediate",
    "question": "for...of characters count kare aur window string[index] use kare toh emoji case kyun fail ho sakta hai?",
    "answer": "- for...of Unicode code points iterate karta hai\n- ordinary string indexing UTF-16 code units deta hai.\n- Emoji do units ho sakti hai, isliye pattern counts aur window symbols disagree karte hain.\n- Dono ko Array.from se code-point arrays banao, ya clearly code-unit contract choose karo.\n- Conversion ki O(n+m) memory bhi count karo.",
    "followUp": "Combining marks aur user-perceived grapheme clusters ko code points normalize automatically karte hain?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  },
  {
    "id": "iq-final-12",
    "track": "react",
    "noteId": "react-query-supabase",
    "level": "Intermediate",
    "question": "TanStack Query object key order aur manually JSON-stringified keys mein kya nuance hai?",
    "answer": "- TanStack Query serializable object keys ko deterministic hash karti hai\n- same object properties ka insertion order identity change nahi karta.\n- Array element order matter karta hai.\n- Custom cache mein JSON.stringify ko raw key banana object ordering issue laa sakta hai.\n- Library contract padho, irrelevant canonicalization mat add karo\n- actual query parameters/tenant identity include karo.",
    "followUp": "Raw search lowercase normalize karna case-sensitive backend par correctness kyun badal sakta hai?",
    "tags": [
      "interview-priority",
      "contracts"
    ]
  }
];
