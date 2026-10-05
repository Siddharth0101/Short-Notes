import { Code2 } from 'lucide-react';
import Markdown from '../library/Markdown.jsx';
export default function CodingWorkspace({ controller }) {
  const { session, code, setCode, codeLanguage, setCodeLanguage, busy, touch } = controller;
  const active = session.status === 'active';
  return (
    <aside className="ia-card ia-code">
      <div className="ia-code-title">
        <Code2 size={19} />
        <h2>Coding workspace</h2>
      </div>
      <h3>{session.coding.title}</h3>
      <details open>
        <summary>Task & acceptance checks</summary>
        <Markdown>{session.coding.prompt}</Markdown>
      </details>
      <p className="ia-small">
        Follow the interviewer’s scoped requirements for the time remaining. Code is reviewed by AI;
        it is not executed here.
      </p>
      <label>
        Code language
        <select
          value={codeLanguage}
          disabled={!active || busy}
          onChange={(e) => setCodeLanguage(e.target.value)}
        >
          {['javascript', 'jsx', 'typescript', 'java', 'python', 'sql', 'html', 'text'].map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>
      <label htmlFor="interview-code">Your implementation</label>
      <textarea
        id="interview-code"
        className="ia-code-editor"
        spellCheck={false}
        value={code}
        maxLength={30000}
        disabled={!active || busy}
        onChange={(e) => {
          setCode(e.target.value);
          touch();
        }}
        placeholder="Write or paste your solution here. Talk through your approach as you work."
      />
      <p className="ia-small">
        Code stays in your local draft. Send & review code shares the current version with the
        interviewer.
      </p>
    </aside>
  );
}
