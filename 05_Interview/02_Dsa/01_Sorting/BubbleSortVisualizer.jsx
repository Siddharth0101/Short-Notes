import React, { useState, useEffect, useRef } from 'react';

export default function BubbleSortVisualizer() {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(250); // delay in ms
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, passes: 0 });

  const isSortingRef = useRef(isSorting);
  isSortingRef.current = isSorting;

  const generateRandomArray = () => {
    if (isSorting) return;
    const newArray = [];
    for (let i = 0; i < 15; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10); // numbers from 10 to 100
    }
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setStats({ comparisons: 0, swaps: 0, passes: 0 });
  };

  useEffect(() => {
    generateRandomArray();
  }, []);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const startBubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setStats({ comparisons: 0, swaps: 0, passes: 0 });
    
    let arr = [...array];
    let n = arr.length;
    let localComparisons = 0;
    let localSwaps = 0;
    let localPasses = 0;
    let localSorted = [];

    for (let i = 0; i < n - 1; i++) {
      let isSwapped = false;
      localPasses++;
      setStats(prev => ({ ...prev, passes: localPasses }));

      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) {
          // Stopped by user
          setComparing([]);
          setSwapping([]);
          return;
        }

        // Compare j and j + 1
        setComparing([j, j + 1]);
        localComparisons++;
        setStats(prev => ({ ...prev, comparisons: localComparisons }));
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          // Visual Swap indication
          setSwapping([j, j + 1]);
          localSwaps++;
          setStats(prev => ({ ...prev, swaps: localSwaps }));
          await sleep(speed);

          // Swap elements
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await sleep(speed);
          
          isSwapped = true;
        }
        setSwapping([]);
      }
      // Element at n - i - 1 is now in its final sorted position
      localSorted.push(n - i - 1);
      setSorted([...localSorted]);

      if (!isSwapped) break; // Array is fully sorted
    }
    
    // Mark all remaining elements as sorted
    const allSorted = Array.from({ length: n }, (_, idx) => idx);
    setSorted(allSorted);
    setComparing([]);
    setSwapping([]);
    setIsSorting(false);
  };

  const stopSorting = () => {
    setIsSorting(false);
  };

  return (
    <div style={styles.container}>
      <h2>Bubble Sort Visualizer</h2>
      <p style={styles.subtitle}>Watch and control sorting steps. Array values are mapped to bar heights.</p>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Comparisons:</span>
          <span style={styles.statValue}>{stats.comparisons}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Swaps:</span>
          <span style={styles.statValue}>{stats.swaps}</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statLabel}>Passes:</span>
          <span style={styles.statValue}>{stats.passes}</span>
        </div>
      </div>

      {/* Visual Array Grid */}
      <div style={styles.chartContainer}>
        {array.map((val, idx) => {
          let barColor = 'var(--accent-border)'; // default gray-stone
          if (comparing.includes(idx)) {
            barColor = '#eab308'; // comparing - yellow
          }
          if (swapping.includes(idx)) {
            barColor = '#ef4444'; // swapping - red
          }
          if (sorted.includes(idx)) {
            barColor = '#10b981'; // sorted - green
          }

          return (
            <div key={idx} style={styles.barColumn}>
              <div 
                style={{ 
                  ...styles.bar, 
                  height: `${val * 3.5}px`,
                  backgroundColor: barColor
                }}
              />
              <span style={styles.barLabel}>{val}</span>
            </div>
          );
        })}
      </div>

      {/* Speed Slider & Control Actions */}
      <div style={styles.controlBar}>
        <div style={styles.sliderContainer}>
          <label style={styles.sliderLabel}>Animation Delay ({speed}ms)</label>
          <input 
            type="range" 
            min="50" 
            max="1000" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))} 
            disabled={isSorting}
            style={styles.slider}
          />
        </div>
        <div style={styles.buttons}>
          <button 
            onClick={generateRandomArray} 
            disabled={isSorting} 
            style={isSorting ? styles.buttonDisabled : styles.buttonSecondary}
          >
            Reset Array
          </button>
          {isSorting ? (
            <button onClick={stopSorting} style={styles.buttonStop}>
              Stop
            </button>
          ) : (
            <button onClick={startBubbleSort} style={styles.button}>
              Start Sort
            </button>
          )}
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
  statsBar: {
    display: 'flex',
    gap: '24px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '16px 24px',
    marginBottom: '24px',
    boxShadow: 'var(--shadow)'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text)',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '15px',
    color: 'var(--text-h)',
    fontWeight: 'bold',
    fontFamily: 'var(--mono)'
  },
  chartContainer: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '40px 24px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '12px',
    flexGrow: 1,
    boxShadow: 'var(--shadow)',
    marginBottom: '24px',
    minHeight: '380px'
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '32px'
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.2s ease, background-color 0.15s ease'
  },
  barLabel: {
    marginTop: '8px',
    fontSize: '11px',
    fontFamily: 'var(--mono)',
    color: 'var(--text)',
    fontWeight: '500'
  },
  controlBar: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: 'var(--shadow)'
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  sliderLabel: {
    fontSize: '12px',
    color: 'var(--text)',
    fontWeight: '500'
  },
  slider: {
    width: '200px',
    accentColor: 'var(--accent)'
  },
  buttons: {
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
  buttonStop: {
    padding: '10px 18px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '13px',
    transition: 'opacity 0.15s ease'
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
