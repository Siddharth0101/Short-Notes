// Original practice for the second coverage pass.
export const extensionQuestions = [
  {
    id: 'iq-extension-01',
    noteId: 'javascript-browser-persistence',
    track: 'javascript',
    level: 'Intermediate',
    question: 'Two tabs mein localStorage change event lost update prevent kyun nahi karta?',
    answer:
      'Event notification deta hai, atomic read-modify-write ya conflict resolution nahi. Dono tabs same old snapshot read karke different writes kar sakti hain. Append-only set union aur remove operation ki policy alag hai; transaction/version-aware model choose karo.',
    followUp: 'Unknown future storage version ko fallback se overwrite karna risky kyun hai?',
    tags: ['extension-practice', 'persistence'],
  },
  {
    id: 'iq-extension-02',
    noteId: 'javascript-browser-persistence',
    track: 'javascript',
    level: 'Intermediate',
    question: 'Local transaction success ke baad bhi sync pending status kab sahi hai?',
    answer:
      'Device par committed write server tak nahi pahunchi ho sakti. Local save aur remote acknowledgement alag states hain. Operation ID, base server version aur pending/conflict state rakho. Browser storage eviction/deletion ho sakti hai, isliye important data ka backup/recovery contract bhi chahiye.',
    followUp: 'Service worker add karne se record conflict merge automatically kyun nahi hota?',
    tags: ['extension-practice', 'persistence'],
  },
  {
    id: 'iq-extension-03',
    noteId: 'javascript-git-workflow',
    track: 'javascript',
    level: 'Intermediate',
    question: 'Same file ke staged aur unstaged edits mein commit kya capture karega?',
    answer:
      'Normal commit index snapshot capture karta hai. Title stage karke paragraph baad mein edit kiya toh title change commit mein hai, later paragraph nahi. git diff aur git diff --staged dono read karo; working-tree tests alone partially staged commit coherent prove nahi karte.',
    followUp: 'git restore -- file ka default source HEAD hai ya index? Example do.',
    tags: ['extension-practice', 'workflow'],
  },
  {
    id: 'iq-extension-04',
    noteId: 'javascript-git-workflow',
    track: 'javascript',
    level: 'Intermediate',
    question: 'Published ordinary commit revert karna history rewrite se kaise alag hai?',
    answer:
      'Revert inverse change ka new commit banata hai; original shared history retained rehti hai. Later dependent changes se conflict ho sakta hai, isliye behavior verify karo. Rebase/reset se branch history move/rewrite karna collaborators ko affect kar sakta hai; team policy aur exact target samjho.',
    followUp: 'Reflog uncommitted file edits ka guaranteed backup kyun nahi hai?',
    tags: ['extension-practice', 'workflow'],
  },
  {
    id: 'iq-extension-05',
    noteId: 'spring-servlet-mvc',
    track: 'spring-boot',
    level: 'Advanced',
    question: 'Servlet ya singleton controller ka currentUser field unsafe kab hai?',
    answer:
      'Same instance concurrent requests handle kare toh A ka identity field B overwrite kar sakta hai. Request-local authenticated context use karo. Session object bhi concurrent tabs se mutate ho sakta hai; per-session data thread-safe automatically nahi. Shared business invariant ko appropriate boundary par protect karo.',
    followUp: 'Whole controller synchronized karna usual request-identity fix kyun nahi?',
    tags: ['extension-practice', 'mvc'],
  },
  {
    id: 'iq-extension-06',
    noteId: 'spring-servlet-mvc',
    track: 'spring-boot',
    level: 'Advanced',
    question: 'Redirect ke baad request attribute absent kyun hota hai?',
    answer:
      'Redirect browser se new request karwata hai, old request attributes usmein automatically transfer nahi hote. Authorized durable ID lookup ya limited flash-message mechanism choose karo. Forward server-side same request dispatch hai. Post/Redirect/Get client retries ki idempotency replace nahi karta.',
    followUp: 'Streaming start ke baad ordinary JSON error response bhejna kab invalid hoga?',
    tags: ['extension-practice', 'mvc'],
  },
  {
    id: 'iq-extension-07',
    noteId: 'spring-ai-retrieval',
    track: 'spring-boot',
    level: 'Advanced',
    question: 'Policy RAG se meri kal ki leave approval infer karna galat kyun hai?',
    answer:
      'Policy allowed rules batati hai, specific workflow event ka current status nahi. Approval ke liye authorized live data query/tool ya explicit limitation chahiye. Relevant-looking policy text actual event evidence nahi; fluent answer ko source-supported fact samajhkar accept mat karo.',
    followUp:
      'Other tenant ka matching chunk prompt mein dene ke baad do-not-leak instruction enough hai?',
    tags: ['extension-practice', 'retrieval'],
  },
  {
    id: 'iq-extension-08',
    noteId: 'spring-ai-retrieval',
    track: 'spring-boot',
    level: 'Advanced',
    question: 'Spring AI provider switch par common interface ke baad bhi kya verify karoge?',
    answer:
      'Compatible starter/config, model IDs, supported tools/structured output, context limits aur quality/latency/cost evaluate karo. Embedding model/dimension badle toh vector index compatibility/re-embedding chahiye. Common API migration effort reduce karti hai, identical behavior guarantee nahi deti.',
    followUp:
      'Valid JSON aur retrieved citation ID se factual grounding fully prove kyun nahi hoti?',
    tags: ['extension-practice', 'retrieval'],
  },
  {
    id: 'iq-extension-09',
    noteId: 'system-design-api-contracts',
    track: 'system-design',
    level: 'Advanced',
    question: 'Batch loader ka async backend reject ho toh pending callers ka contract kya hai?',
    answer:
      'Whole batch failure par har queued promise reject honi chahiye; hang ya unhandled rejection nahi. Input keys ko capture karke queue reset karo, async backend await karo, output length/order validate karo. Later batch independent operate kar sake. Teaching loader ko production memoizing DataLoader mat bolo.',
    followUp: 'Keys [7,2,7] aur unordered DB rows [2,7] ko kaise align karoge?',
    tags: ['extension-practice', 'contracts'],
  },
  {
    id: 'iq-extension-10',
    noteId: 'system-design-api-contracts',
    track: 'system-design',
    level: 'Advanced',
    question: 'GraphQL precise fields aur gRPC binary data latency guarantee kyun nahi dete?',
    answer:
      'Response shape/encoding overall work ka sirf part hain. Resolver N+1, unbounded lists, DB latency, serialization, connection reuse aur queueing still matter karte hain. Workload measure karo, authorization/cost bounds rakho aur client transport needs verify karo.',
    followUp: 'Caller deadline expire ho lekin write commit ho jaaye toh retry safe kaise hogi?',
    tags: ['extension-practice', 'contracts'],
  },
];
