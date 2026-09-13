# Study the notes, then prove you can use them

Start with the [course syllabus](README.md) and follow the prerequisites. Every chapter has a **core takeaway** near its mental model and a **Revision and practice lab** with a recall prompt, a specific application challenge, a hint, an answer guide, and an exit check. The lab supplements the chapter's worked examples and existing interview questions.

Pehle khud attempt karo. A familiar-looking answer is not the same as an answer you can produce.

## Choose a session

These are suggested time boxes, not promises about how quickly a topic should be learned. Split a long chapter across sessions when needed.

| Available time | What to do | What to leave with |
| --- | --- | --- |
| 10 minutes | Recall one previously studied takeaway, retry its lab, compare with the guide | One corrected explanation or passing example |
| 30 minutes | Read one concept section, trace its example, attempt the chapter lab | A small implementation or written decision with an edge case |
| 60 minutes | Study the chapter, complete the lab, answer related interview questions | A working artifact and a list of assumptions you can defend |

## Use the same loop in every module

1. **Orient.** Read the title, summary, mental model, and core takeaway. Say what problem the concept helps solve.
2. **Predict.** Before running a worked example, write its output or expected state transition. For architecture, predict what persists when one step fails.
3. **Explain.** Trace the example line by line or decision by decision. If it surprises you, locate the first incorrect assumption.
4. **Apply.** Attempt the revision lab without its answer guide. Use the hint only after writing an initial approach.
5. **Check.** Compare the outcome and reasoning with the guide. Different implementations can be correct; check their contracts and assumptions.
6. **Transfer.** Change an input or constraint and explain what changes. Examples include empty input, reordered responses, a duplicate event, or a tighter memory limit.
7. **Record.** Save one mistake and a next review date. Mark the chapter complete when you can reproduce its reasoning and satisfy its practice criteria.

The Markdown answer guides are visible below their prompts. Stop scrolling while you attempt them. The app's existing interview cards provide answer reveal when you want a hidden-answer round.

## Score evidence, not confidence

Use this informal rubric after an attempt. It is a self-review tool, not a certification or a prediction of interview performance.

| Dimension | 0 — revisit | 1 — developing | 2 — independent |
| --- | --- | --- | --- |
| Explanation | Cannot explain the mechanism | Explains with a hint | Explains with an original example |
| Application | No working approach | Works with help or correction | Produces a correct result without the guide |
| Edge cases | Checks only the supplied example | Finds a relevant boundary | Demonstrates the boundary and explains its outcome |
| Reasoning | Repeats a rule without its assumptions | Names an assumption | Explains when the approach fails or needs changing |

A score of 6–8 is a useful signal to attempt the stage checkpoint, provided there is no unresolved correctness error. A score of 3–5 suggests another lab attempt. At 0–2, return to the worked example or prerequisite. These thresholds are a suggested routine; use the actual acceptance criteria as the final check.

## Keep a small mistake log

Copy this into your own notebook. Record the cause, not only “got it wrong.” Browser bookmarks can hold weak chapters; this table is a manual worksheet, not an automatically saved app feature.

| Chapter | My prediction | What happened | Wrong assumption | Smallest useful check | Review date |
| --- | --- | --- | --- | --- | --- |
| React state | Two direct setters add two | The count increased by one | Both setters used different snapshots | Compare direct and functional updates from zero | Tomorrow |
| Binary search | Any matching index is enough | The first duplicate was required | I did not define the boundary contract | Search for 2 in `[1,2,2,4]` | In three days |
| Checkout | A timeout means payment failed | Payment status was uncertain | Network response and business outcome are identical | Retry with the same operation identity | Next session |

Try a first review in the next session, another a few days later, and another the following week. Move difficult topics earlier and easy topics later. Always attempt before rereading; adjust this schedule to your workload.

## Finish a stage with a deliverable

Use the specific checkpoint in the course syllabus. A finished stage should leave something another person can inspect:

| Track | Useful evidence |
| --- | --- |
| JavaScript | A function or browser interaction with predicted outputs and boundary inputs |
| React | A UI demonstrating state ownership, identity, and loading/error behavior |
| Java & Spring | Compilable code or a clearly labeled application excerpt, plus a contract or transaction check |
| Node & MongoDB | A request/query trace, representative input, and a verified failure outcome |
| DSA | An invariant or recurrence, a hand trace, complexity, and boundary checks |
| System design | A workload estimate, contracts, a state model, and a failure/recovery trace |
| Interview | A timed explanation, an example, a follow-up, and a specific correction |

For a design lab, write assumptions and acceptance criteria instead of pretending there is one universally correct architecture. For a coding lab, run the implementation in the environment stated by the chapter; a framework excerpt may need the surrounding application.

## Turn weak areas into your next session

Choose one failed lab, one nearby worked example, and one related interview question. Repair the underlying misconception, then try a changed input. At the end of a course, complete its capstone or assessed mock and return to the chapters exposed by that attempt.

Use the [source map](RESEARCH_SOURCES.md) and each chapter's primary documentation links for deeper technical verification. The [coverage guide](COURSE_COVERAGE.md) explains the limits of the course mapping.
