import React, { useState } from 'react';

const CODE_LINES = [
  'const globalVar = "Global Scope";',
  'function outer() {',
  '  let count = 0;',
  '  return function inner() {',
  '    count++;',
  '    console.log(count);',
  '  };',
  '}',
  'const myCounter = outer();',
  'myCounter(); // step execution'
];

const STEPS = [
  {
    line: 0,
    stack: ['GlobalContext'],
    scopes: [{ title: 'Global Scope', vars: { globalVar: '"Global Scope"', outer: 'function' } }],
    description: 'JavaScript engine starts. Global Execution Context is created and pushed onto Call Stack. globalVar is declared.'
  },
  {
    line: 8,
    stack: ['GlobalContext', 'outer()'],
    scopes: [
      { title: 'Global Scope', vars: { globalVar: '"Global Scope"', myCounter: 'undefined' } },
      { title: 'outer() Local Scope', vars: { count: '0' } }
    ],
    description: 'outer() is called. A new local execution context is created and pushed onto the Call Stack. Local variable count is initialized to 0.'
  },
  {
    line: 3,
    stack: ['GlobalContext'],
    scopes: [
      { title: 'Global Scope', vars: { globalVar: '"Global Scope"', myCounter: 'function inner' } },
      { title: 'Closure (outer)', vars: { count: '0' } }
    ],
    description: 'outer() returns the inner function. outer() context pops off the stack. Since inner references count, the variable count is preserved in a Closure Memory Bubble.'
  },
  {
    line: 9,
    stack: ['GlobalContext', 'inner()'],
    scopes: [
      { title: 'Global Scope', vars: { globalVar: '"Global Scope"', myCounter: 'function inner' } },
      { title: 'Closure (outer)', vars: { count: '0' } },
      { title: 'inner() Local Scope', vars: { } }
    ],
    description: 'myCounter() (which is the inner function) is executed. Local context is pushed to Call Stack. Since inner does not have count locally, it looks up the Scope Chain to the Closure scope.'
  },
  {
    line: 4,
    stack: ['GlobalContext', 'inner()'],
    scopes: [
      { title: 'Global Scope', vars: { globalVar: '"Global Scope"', myCounter: 'function inner' } },
      { title: 'Closure (outer)', vars: { count: '1' } },
      { title: 'inner() Local Scope', vars: { } }
    ],
    description: 'count is incremented inside the Closure memory bubble. Its value updates from 0 to 1.'
  },
  {
    line: 5,
    stack: ['GlobalContext'],
    scopes: [
      { title: 'Global Scope', vars: { globalVar: '"Global Scope"', myCounter: 'function inner' } },
      { title: 'Closure (outer)', vars: { count: '1' } }
    ],
    description: 'The console prints 1. inner() context pops off the Call Stack. The Closure scope persists for subsequent invocations.'
  }
];

export default function ClosureVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
  };

  const stepData = STEPS[currentStep];

  return (
    <div style={styles.container}>
      <h2>Scopes & Closures Visualizer</h2>
      <p style={styles.subtitle}>Trace lexical scope creation, execution contexts, and closure memory step-by-step.</p>

      <div style={styles.layout}>
        {/* Left Column: Code Preview */}
        <div style={styles.codeColumn}>
          <div style={styles.columnHeader}>Source Code</div>
          <div style={styles.codeContainer}>
            {CODE_LINES.map((line, idx) => {
              const isActive = idx === stepData.line;
              return (
                <div
                  key={idx}
                  style={{
                    ...styles.codeLine,
                    backgroundColor: isActive ? 'var(--accent-bg)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                    fontWeight: isActive ? '600' : 'normal'
                  }}
                >
                  <span style={styles.lineNumber}>{idx + 1}</span>
                  <code>{line}</code>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Execution Environments */}
        <div style={styles.visualColumn}>
          {/* Call Stack */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>Call Stack (Execution Contexts)</div>
            <div style={styles.stackContainer}>
              {stepData.stack.map((ctx, idx) => (
                <div key={idx} style={styles.stackFrame}>
                  {ctx}
                </div>
              ))}
              {stepData.stack.length === 0 && <span style={styles.emptyText}>Empty Stack</span>}
            </div>
          </div>

          {/* Scope Chain */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>Scope Chain (Lexical Scopes)</div>
            <div style={styles.scopeChain}>
              {stepData.scopes.map((scope, idx) => (
                <div key={idx} style={styles.scopeBox}>
                  <div style={styles.scopeTitle}>{scope.title}</div>
                  <div style={styles.scopeVars}>
                    {Object.entries(scope.vars).map(([key, val]) => (
                      <div key={key} style={styles.varLine}>
                        <span style={styles.varName}>{key}:</span>{' '}
                        <span style={styles.varValue}>{val}</span>
                      </div>
                    ))}
                    {Object.keys(scope.vars).length === 0 && (
                      <span style={styles.emptyVars}>no variables</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div style={styles.controlBar}>
        <div style={styles.descriptionBox}>
          <strong>Step {currentStep + 1}:</strong> {stepData.description}
        </div>
        <div style={styles.buttons}>
          <button onClick={prevStep} disabled={currentStep === 0} style={styles.button}>
            Previous
          </button>
          <button onClick={nextStep} disabled={currentStep === STEPS.length - 1} style={styles.button}>
            Next Step
          </button>
          <button onClick={restart} style={styles.buttonSecondary}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'var(--sans)',
    backgroundColor: 'var(--bg)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  subtitle: {
    color: 'var(--text)',
    fontSize: '14px',
    marginTop: '4px',
    marginBottom: '24px'
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    flexGrow: 1,
    marginBottom: '24px'
  },
  columnHeader: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
  },
  codeColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  codeContainer: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px',
    fontFamily: 'var(--mono)',
    fontSize: '13px',
    flexGrow: 1,
    boxShadow: 'var(--shadow)'
  },
  codeLine: {
    display: 'flex',
    padding: '4px 8px',
    margin: '2px 0',
    borderRadius: '4px',
    transition: 'all 0.15s ease'
  },
  lineNumber: {
    width: '24px',
    color: 'var(--text)',
    opacity: 0.5,
    userSelect: 'none'
  },
  visualColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  section: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: 'var(--shadow)'
  },
  sectionHeader: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'var(--accent)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
  },
  stackContainer: {
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '8px',
    border: '1px dashed var(--border)',
    borderRadius: '6px',
    padding: '12px',
    backgroundColor: 'var(--bg)'
  },
  stackFrame: {
    backgroundColor: 'var(--accent)',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  scopeChain: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  scopeBox: {
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '12px',
    backgroundColor: 'var(--bg)'
  },
  scopeTitle: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'var(--text-h)',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '4px',
    marginBottom: '8px'
  },
  scopeVars: {
    fontSize: '13px',
    fontFamily: 'var(--mono)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  varLine: {
    display: 'flex',
    gap: '8px'
  },
  varName: {
    color: 'var(--text)'
  },
  varValue: {
    color: 'var(--text-h)',
    fontWeight: 'bold'
  },
  controlBar: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: 'var(--shadow)'
  },
  descriptionBox: {
    fontSize: '14px',
    color: 'var(--text-h)',
    flexGrow: 1,
    lineHeight: '1.5'
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    flexShrink: 0
  },
  button: {
    padding: '10px 18px',
    backgroundColor: 'var(--text-h)',
    color: 'var(--bg)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'opacity 0.15s ease'
  },
  buttonSecondary: {
    padding: '10px 18px',
    backgroundColor: 'transparent',
    color: 'var(--text-h)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'background-color 0.15s ease'
  },
  emptyText: {
    color: 'var(--text)',
    fontSize: '13px',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  emptyVars: {
    color: 'var(--text)',
    opacity: 0.5,
    fontStyle: 'italic'
  }
};
