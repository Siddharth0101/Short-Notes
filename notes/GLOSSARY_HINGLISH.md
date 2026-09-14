# Technical terms — simple Hinglish meaning

Term ko sirf translate mat karo: example mein uska role dekho. Code keywords English mein hi likhne hain.

| Term | Simple meaning | Chhota example / important limit |
| --- | --- | --- |
| Binding | Naam aur value ka connection | `let count=0`; assignment count ki value badalta hai |
| Mutation | Existing object ke andar change | `user.name='Asha'`; same object dekhne wale aliases change dekhenge |
| Reference / identity | Kis actual object ko refer kar rahe ho | `b=a` clone nahi banata |
| Scope | Code mein variable lookup kahan tak hota hai | Inner function outer bindings access kar sakti hai |
| Closure | Function ka lexical bindings tak retained access | Counter factory ki har call apna count bana sakti hai |
| Snapshot | Kisi point par mila value/state | Purani calculated string number badalne se recalculate nahi hoti |
| Invariant | Operation ke dauran sach rehna zaroori rule | Stock negative nahi; BST left subtree root se chhoti |
| Contract | Inputs, outputs aur failures ka agreed behavior | Empty list ka sum 0; invalid quantity reject |
| Boundary / edge case | Rule ke exact end/start par input | 60 pass threshold ho toh 59,60,61 test |
| Dry-run / trace | Code run kiye bina step-by-step state likhna | Loop ka counter aur total har iteration par note |
| Complexity | Input badhne par work/memory ka growth | O(n) scan; O(log n) binary search |
| Amortized | Operations ki sequence par cost bound | Ek resize expensive ho sakta hai, saare inserts ka total bounded |
| Recursion | Function chhoti problem ke liye khud ko call kare | Base case aur progress dono chahiye |
| Memoization | Same subproblem ka result store/reuse | DP state key mein future ko affect karne wali information ho |
| Immutable | Jis value/object ko allowed model mein change na karein | Shallow readonly/deep immutability same nahi |
| Render / commit | UI calculate karna / changes apply karna | React render ka matlab har DOM node replace hona nahi |
| Side effect | Calculation ke bahar observable change | Network, listener, storage write |
| Dependency injection | Collaborator bahar se supply karna | Service constructor ko repository dena |
| Thread safety | Concurrent access mein correctness bachna | `count++` ko volatile alone atomic nahi banata |
| Atomicity | Operation ka indivisible/all-or-nothing behavior, stated scope mein | DB transaction external payment rollback nahi karti |
| Isolation | Concurrent transactions ek-doosre ko kaise observe karti hain | Level aur query statements dono matter karte hain |
| Idempotency | Same intended operation repeat par duplicate business effect na ho | Retry same purchase ID; changed payload conflict |
| Authentication | Caller kaun hai verify karna | Session/token verify |
| Authorization | Is resource par action allowed hai? | User A, B ka private note edit nahi kare |
| Validation | Data expected shape/range/rule follow karta hai? | Blank title reject; uniqueness ka DB check alag |
| Index | Maintained lookup/order structure | Reads help, writes/storage ka cost bhi |
| Cache | Reusable result ki stored copy | Identity, expiry, freshness aur invalidation define karo |
| Stale | Freshness policy ke hisaab se purana | Stale cache entry zaroori nahi deleted ho |
| Race condition | Interleaving se wrong outcome | Dono buyers stock=1 read karke reserve kar dein |
| Concurrency | Ek period mein multiple operations in progress | Waiting work overlap; CPU parallelism guarantee nahi |
| Backpressure | Slow consumer ke hisaab se producer pace kare | write false de toh wait; unlimited exports ki limit alag |
| Deadline / timeout | Overall time budget / kisi wait ki limit | Client timeout se server write failure prove nahi hoti |
| Throughput / latency | Per-time completed work / ek request ka time | 100 requests/s aur 200ms different measurements |
| p95 / percentile | 95% observations is value se kam/barabar | p95 ko average ki formula mein mat daalo |
| Reconciliation | Uncertain/different records compare karke outcome resolve | Payment provider success, order pending: status match karo |
| Observability | Evidence se andar ka behavior samajhna | Logs, metrics, traces se pool wait versus query time |
| SLO | Measurable user-outcome target | Eligible requests, success definition aur window define karo |
| Tradeoff | Ek benefit ke badle ka cost | Cache faster reads, freshness/invalidation work |

Agar term ab bhi vague lage toh teen lines likho: **meaning → example → kab assumption tootegi**. Isi se deep understanding banti hai.
