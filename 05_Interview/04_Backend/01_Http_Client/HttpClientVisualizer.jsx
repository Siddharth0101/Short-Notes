import React, { useState } from 'react';

const STAGES = [
  {
    name: 'Client Browser',
    icon: '💻',
    description: 'The browser packs the request. It sets headers (Authorization Bearer Token, Content-Type: application/json) and serializes the payload.',
    details: {
      Method: 'POST',
      URL: 'https://api.app.com/v1/auth/login',
      Headers: '{ "Content-Type": "application/json" }',
      Body: '{ "email": "user@gmail.com", "password": "••••••" }'
    }
  },
  {
    name: 'Network Transport',
    icon: '🌐',
    description: 'The DNS resolves the URL to an IP address. A TCP/IP handshake is completed. TLS encryption is established and packet routing transfers data to the server gateway.',
    details: {
      DNS: 'api.app.com -> 104.24.12.18',
      Handshake: 'SYN -> SYN-ACK -> ACK (Secure TLS v1.3)',
      Packets: 'Routing payloads over HTTPS port 443'
    }
  },
  {
    name: 'Server Middleware',
    icon: '🛡️',
    description: 'The server parses raw headers. It executes global middlewares: CORS allowances, request logging, body-parsing (parsing req.body), and Rate Limiting.',
    details: {
      Logger: 'POST /v1/auth/login - 12:54:21',
      BodyParser: 'Constructing req.body object from buffer stream',
      CORS: 'Origin check approved (Access-Control-Allow-Origin: *)'
    }
  },
  {
    name: 'Authentication Guard',
    icon: '🔑',
    description: 'If protected route, Auth middlewares read the Authorization header token, run signature verification, extract user payload, and bind req.user context.',
    details: {
      RouteGuard: 'Public Route (Login endpoint bypasses JWT validation checks)',
      Status: 'Permitted - proceeding to controller router mapping'
    }
  },
  {
    name: 'Controller Route Handler',
    icon: '⚙️',
    description: 'The router matches matching endpoint definitions. It runs controller logic, calls databases or APIs, authenticates credentials, and constructs outputs.',
    details: {
      RouterMatch: '/v1/auth/login -> authController.login()',
      DatabaseQuery: 'db.users.findOne({ email: "user@gmail.com" })',
      Result: 'Authentication validated. Signed JWT token created.'
    }
  },
  {
    name: 'Response Dispatch',
    icon: '📤',
    description: 'The response is serialized. The status code (200 OK) is set. It flies back across network and reaches client, updating local state.',
    details: {
      Status: '200 OK',
      Headers: '{ "Content-Type": "application/json", "Set-Cookie": "jwt=..." }',
      Body: '{ "status": "success", "token": "eyJhbGciOi...", "user": { ... } }'
    }
  }
];

export default function HttpClientVisualizer() {
  const [activeStage, setActiveStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextStage = () => {
    if (activeStage < STAGES.length - 1) {
      setActiveStage(activeStage + 1);
    }
  };

  const prevStage = () => {
    if (activeStage > 0) {
      setActiveStage(activeStage - 1);
    }
  };

  const startAutoRun = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    for (let i = 0; i < STAGES.length; i++) {
      setActiveStage(i);
      await new Promise(r => setTimeout(r, 2000));
    }
    setIsAnimating(false);
  };

  return (
    <div style={styles.container}>
      <h2>HTTP Client Request Simulator</h2>
      <p style={styles.subtitle}>Click the stages or trigger Auto-Run to trace the lifecycle of a request pipeline.</p>

      {/* Visual Pipeline */}
      <div style={styles.pipeline}>
        {STAGES.map((stage, idx) => {
          const isActive = idx === activeStage;
          return (
            <React.Fragment key={idx}>
              <div 
                onClick={() => !isAnimating && setActiveStage(idx)}
                style={{
                  ...styles.stageCard,
                  borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                  backgroundColor: isActive ? 'var(--accent-bg)' : 'var(--bg-card)',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  cursor: isAnimating ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={styles.stageIcon}>{stage.icon}</div>
                <div style={{
                  ...styles.stageName,
                  color: isActive ? 'var(--text-h)' : 'var(--text)'
                }}>{stage.name}</div>
              </div>
              {idx < STAGES.length - 1 && (
                <div style={{
                  ...styles.arrow,
                  color: idx < activeStage ? 'var(--accent)' : 'var(--border)'
                }}>➔</div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detailed Sandbox View */}
      <div style={styles.detailsContainer}>
        <div style={styles.detailsHeader}>
          <h3>Stage {activeStage + 1}: {STAGES[activeStage].name}</h3>
          <span style={styles.stageBadge}>Active Node</span>
        </div>
        <p style={styles.description}>{STAGES[activeStage].description}</p>
        
        <div style={styles.codeBlock}>
          <div style={styles.blockTitle}>Runtime Context Variables</div>
          <div style={styles.detailsGrid}>
            {Object.entries(STAGES[activeStage].details).map(([key, val]) => (
              <div key={key} style={styles.detailRow}>
                <span style={styles.detailKey}>{key}:</span>
                <pre style={styles.detailVal}>{val}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={styles.controls}>
        <button 
          onClick={startAutoRun} 
          disabled={isAnimating}
          style={isAnimating ? styles.buttonDisabled : styles.button}
        >
          {isAnimating ? 'Running Simulation...' : 'Auto-Run Flow'}
        </button>
        <div style={styles.navigation}>
          <button 
            onClick={prevStage} 
            disabled={activeStage === 0 || isAnimating}
            style={styles.buttonSecondary}
          >
            Previous Stage
          </button>
          <button 
            onClick={nextStage} 
            disabled={activeStage === STAGES.length - 1 || isAnimating}
            style={styles.buttonSecondary}
          >
            Next Stage
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
  pipeline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)',
    marginBottom: '24px',
    overflowX: 'auto',
    gap: '12px'
  },
  stageCard: {
    flex: '1',
    minWidth: '120px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 8px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center'
  },
  stageIcon: {
    fontSize: '24px',
    marginBottom: '8px'
  },
  stageName: {
    fontSize: '12px',
    fontWeight: 'bold',
    lineHeight: '1.3'
  },
  arrow: {
    fontSize: '20px',
    userSelect: 'none',
    transition: 'color 0.2s ease'
  },
  detailsContainer: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: 'var(--shadow)',
    flexGrow: 1,
    marginBottom: '24px'
  },
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  stageBadge: {
    backgroundColor: 'var(--accent-bg)',
    color: 'var(--accent)',
    border: '1px solid var(--accent-border)',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: '600'
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--text)',
    marginBottom: '24px'
  },
  codeBlock: {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '20px'
  },
  blockTitle: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: 'var(--text)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border)',
    paddingBottom: '8px'
  },
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  detailRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    textAlign: 'left'
  },
  detailKey: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'var(--accent)'
  },
  detailVal: {
    fontSize: '13px',
    fontFamily: 'var(--mono)',
    color: 'var(--text-h)',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navigation: {
    display: 'flex',
    gap: '12px'
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
  buttonDisabled: {
    padding: '10px 18px',
    backgroundColor: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontWeight: '500',
    fontSize: '13px',
    opacity: 0.5
  }
};
