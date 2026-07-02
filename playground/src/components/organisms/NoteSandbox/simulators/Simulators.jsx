import React, { useState, useEffect } from 'react';
import './Simulators.css';

/* ==========================================================================
 * 1. REGEX SIMULATOR (topic: regex)
 * ========================================================================== */
export function RegexSimulator() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Hello 123 user, your OTP is 4567. Please enter it within 5 mins.');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    try {
      if (!pattern) {
        setMatches([]);
        return;
      }
      const regex = new RegExp(pattern, flags);
      const matchesFound = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          matchesFound.push({
            value: match[0],
            index: match.index,
            length: match[0].length
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(text);
        if (match) {
          matchesFound.push({
            value: match[0],
            index: match.index,
            length: match[0].length
          });
        }
      }
      setMatches(matchesFound);
    } catch (e) {
      setMatches([]);
    }
  }, [pattern, flags, text]);

  const getHighlightedText = () => {
    if (matches.length === 0 || !pattern) return text;
    try {
      const regex = new RegExp(`(${pattern})`, flags);
      const parts = text.split(regex);
      return parts.map((part, i) => {
        try {
          const testRegex = new RegExp(`^${pattern}$`, flags);
          if (testRegex.test(part)) {
            return <span key={i} className="regex-sim__highlight">{part}</span>;
          }
        } catch (e) {}
        return part;
      });
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Regex Matcher Visualizer</h3>
        <span className="sim-badge">Regex Tester</span>
      </div>
      <div className="regex-sim">
        <div className="regex-sim__inputs">
          <div className="regex-sim__field">
            <label className="css-sim__slider-label">Regex Pattern</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="regex-sim__input"
              placeholder="e.g. \d+"
            />
          </div>
          <div className="regex-sim__field regex-sim__field--flag">
            <label className="css-sim__slider-label">Flags</label>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="regex-sim__input"
              placeholder="g, i"
            />
          </div>
        </div>
        <div className="regex-sim__field">
          <label className="css-sim__slider-label">Test Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="regex-sim__textarea"
          />
        </div>
        <div className="regex-sim__field">
          <label className="css-sim__slider-label">Live Match Highlighting</label>
          <div className="regex-sim__output">{getHighlightedText()}</div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 2. CSS UNITS RESPONSIVE PREVIEW SIMULATOR (topic: css)
 * ========================================================================== */
export function CssUnitsSimulator() {
  const [paddingVal, setPaddingVal] = useState(16);
  const [fontSizeVal, setFontSizeVal] = useState(1.2);
  const [heroWidth, setHeroWidth] = useState(90);
  const [heroHeight, setHeroHeight] = useState(140);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Responsive Sizing Sandbox</h3>
        <span className="sim-badge">CSS Sizing</span>
      </div>
      <div className="css-sim">
        <div className="css-sim__controls">
          <div className="css-sim__slider-row">
            <label className="css-sim__slider-label"><span>Header Padding (Absolute: px)</span><span>{paddingVal}px</span></label>
            <input type="range" min="8" max="48" value={paddingVal} onChange={(e) => setPaddingVal(Number(e.target.value))} className="css-sim__slider" />
          </div>
          <div className="css-sim__slider-row">
            <label className="css-sim__slider-label"><span>Font Size (Relative: rem)</span><span>{fontSizeVal}rem</span></label>
            <input type="range" min="0.8" max="3" step="0.1" value={fontSizeVal} onChange={(e) => setFontSizeVal(Number(e.target.value))} className="css-sim__slider" />
          </div>
          <div className="css-sim__slider-row">
            <label className="css-sim__slider-label"><span>Hero Width (Relative: vw)</span><span>{heroWidth}vw</span></label>
            <input type="range" min="40" max="100" value={heroWidth} onChange={(e) => setHeroWidth(Number(e.target.value))} className="css-sim__slider" />
          </div>
          <div className="css-sim__slider-row">
            <label className="css-sim__slider-label"><span>Hero Height (Relative: vh)</span><span>{heroHeight}vh</span></label>
            <input type="range" min="80" max="220" value={heroHeight} onChange={(e) => setHeroHeight(Number(e.target.value))} className="css-sim__slider" />
          </div>
        </div>
        <div className="css-sim__preview">
          <div className="mock-page">
            <header className="mock-page__header" style={{ padding: `${paddingVal}px` }}>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>antigravity</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>Menu</span>
            </header>
            <div className="mock-page__hero" style={{ height: `${heroHeight}px`, width: `${heroWidth}%`, margin: '12px auto' }}>
              <h4 style={{ fontSize: `${fontSizeVal}rem`, fontWeight: 'bold', color: 'var(--text-h)', margin: '0 0 8px 0', lineHeight: '1.2' }}>Learn Relative Metrics</h4>
              <button className="mock-page__cta" style={{ padding: `${paddingVal * 0.6}px ${paddingVal}px`, fontSize: `${fontSizeVal * 0.8}rem` }}>Explore Sandbox</button>
            </div>
            <div style={{ padding: '16px' }} className="mock-page__grid">
              <div className="mock-page__card" style={{ padding: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Flexbox Card</div>
              </div>
              <div className="mock-page__card" style={{ padding: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Grid item</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 3. BINARY SEARCH WITH AUTO PLAY (topic: searching)
 * ========================================================================== */
export function ArraySearchSimulator() {
  const [array] = useState([12, 23, 35, 47, 56, 68, 79, 88, 95]);
  const [target, setTarget] = useState(56);
  const [low, setLow] = useState(-1);
  const [high, setHigh] = useState(-1);
  const [mid, setMid] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [statusMsg, setStatusMsg] = useState('Click Step Search to run Binary Search.');
  const [stepCount, setStepCount] = useState(0);

  // Auto-play state
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [speed, setSpeed] = useState(800);

  const initSearch = () => {
    setLow(0);
    setHigh(array.length - 1);
    setMid(-1);
    setFoundIndex(-1);
    setStepCount(0);
    setIsAutoplay(false);
    setStatusMsg(`Searching for ${target}. Pointers: low=0, high=${array.length - 1}`);
  };

  const stepBinarySearch = () => {
    let currentLow = low === -1 ? 0 : low;
    let currentHigh = high === -1 ? array.length - 1 : high;

    if (currentLow > currentHigh) {
      setStatusMsg(`Target ${target} not found! Pointers crossed.`);
      setIsAutoplay(false);
      return;
    }

    const currentMid = Math.floor((currentLow + currentHigh) / 2);
    setMid(currentMid);
    setLow(currentLow);
    setHigh(currentHigh);
    setStepCount(prev => prev + 1);

    if (array[currentMid] === Number(target)) {
      setFoundIndex(currentMid);
      setStatusMsg(`Found target ${target} at index ${currentMid} in ${stepCount + 1} steps!`);
      setIsAutoplay(false);
      return;
    }

    if (array[currentMid] < Number(target)) {
      setLow(currentMid + 1);
      setStatusMsg(`Index ${currentMid} value (${array[currentMid]}) < ${target}. Set low = mid + 1 (${currentMid + 1}).`);
    } else {
      setHigh(currentMid - 1);
      setStatusMsg(`Index ${currentMid} value (${array[currentMid]}) > ${target}. Set high = mid - 1 (${currentMid - 1}).`);
    }
  };

  useEffect(() => {
    if (!isAutoplay) return;
    
    // Stop autoplay if search resolved
    if (foundIndex !== -1 || (low !== -1 && low > high)) {
      setIsAutoplay(false);
      return;
    }

    const timer = setTimeout(() => {
      stepBinarySearch();
    }, speed);

    return () => clearTimeout(timer);
  }, [isAutoplay, speed, low, high, mid, foundIndex]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Binary Search Visualizer</h3>
        <span className="sim-badge">Searching</span>
      </div>
      <div className="array-sim">
        <div className="array-sim__bars">
          {array.map((val, idx) => {
            let color = 'var(--accent-border)';
            if (idx === mid) color = '#eab308';
            else if (idx === foundIndex) color = '#10b981';
            else if (idx >= low && idx <= high && low !== -1) color = 'rgba(87, 83, 78, 0.3)';

            return (
              <div key={idx} className="array-sim__bar-col">
                <div className="array-sim__bar" style={{ height: `${val * 2}px`, backgroundColor: color }} />
                <span className="array-sim__bar-val">{val}</span>
              </div>
            );
          })}
        </div>
        <div className="array-sim__controls">
          <div className="array-sim__input-group">
            <label className="css-sim__slider-label">Target</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="array-sim__input" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text)' }}>Interval: {speed}ms</span>
            <input type="range" min="300" max="2000" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="css-sim__slider" style={{ width: '120px' }} />
          </div>
          <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={initSearch} className="sim-btn sim-btn--secondary">Init</button>
            <button onClick={() => setIsAutoplay(!isAutoplay)} className={`sim-btn ${isAutoplay ? 'sim-btn--secondary' : ''}`}>
              {isAutoplay ? 'Pause' : 'Auto Play'}
            </button>
            <button onClick={stepBinarySearch} className="sim-btn" disabled={isAutoplay}>Step</button>
          </div>
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
          <div className="note-block__console-title">Mid calculation formula: mid = Math.floor((low + high) / 2)</div>
          <div style={{ marginTop: '4px' }}>{statusMsg}</div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 4. SORTING ALGORITHMS WITH AUTO PLAY (topic: sorting)
 * ========================================================================== */
export function SortingAlgorithmsSimulator() {
  const [array, setArray] = useState([45, 12, 85, 32, 98, 55, 71, 18, 62]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [activeSort, setActiveSort] = useState('bubble');

  // Loop control states
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [minIdx, setMinIdx] = useState(0);
  const [statusText, setStatusText] = useState('Select algorithm and click Step Swap.');

  // Auto-play state
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [speed, setSpeed] = useState(600);

  const resetArray = () => {
    setArray(Array.from({ length: 9 }, () => Math.floor(Math.random() * 80) + 15));
    setComparing([]);
    setSorted([]);
    setI(0);
    setJ(0);
    setMinIdx(0);
    setIsAutoplay(false);
    setStatusText(`Array reset. Algorithm: ${activeSort.toUpperCase()}`);
  };

  useEffect(() => {
    resetArray();
  }, [activeSort]);

  const runMockSortStep = () => {
    let arr = [...array];
    let n = arr.length;

    if (activeSort === 'bubble') {
      if (i >= n - 1) {
        setSorted(Array.from({ length: n }, (_, idx) => idx));
        setComparing([]);
        setIsAutoplay(false);
        setStatusText('Bubble Sort Finished!');
        return;
      }

      setComparing([j, j + 1]);
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        setArray(arr);
        setStatusText(`Swapping indices ${j} (${temp}) and ${j + 1} (${arr[j + 1]})`);
      } else {
        setStatusText(`No swap needed for indices ${j} and ${j + 1}`);
      }

      if (j < n - i - 2) {
        setJ(j + 1);
      } else {
        setSorted(prev => [...prev, n - i - 1]);
        setJ(0);
        setI(i + 1);
      }
    } 
    else if (activeSort === 'selection') {
      if (i >= n - 1) {
        setSorted(Array.from({ length: n }, (_, idx) => idx));
        setComparing([]);
        setIsAutoplay(false);
        setStatusText('Selection Sort Finished!');
        return;
      }

      setComparing([j, minIdx]);
      let currentMin = minIdx;
      if (arr[j] < arr[currentMin]) {
        currentMin = j;
        setMinIdx(j);
        setStatusText(`New minimum found at index ${j} (${arr[j]})`);
      } else {
        setStatusText(`Comparing index ${j} (${arr[j]}) with minimum (${arr[currentMin]})`);
      }

      if (j < n - 1) {
        setJ(j + 1);
      } else {
        let temp = arr[i];
        arr[i] = arr[currentMin];
        arr[currentMin] = temp;
        setArray(arr);
        setSorted(prev => [...prev, i]);
        setStatusText(`Swap index ${i} with minimum at ${currentMin}`);
        
        setI(i + 1);
        setJ(i + 2);
        setMinIdx(i + 1);
      }
    } 
    else if (activeSort === 'insertion') {
      if (i >= n) {
        setSorted(Array.from({ length: n }, (_, idx) => idx));
        setComparing([]);
        setIsAutoplay(false);
        setStatusText('Insertion Sort Finished!');
        return;
      }

      setComparing([j, j - 1]);
      if (j > 0 && arr[j] < arr[j - 1]) {
        let temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
        setArray(arr);
        setStatusText(`Shifting element: Swapping index ${j} and ${j - 1}`);
        setJ(j - 1);
      } else {
        setStatusText(`Element inserted at position ${j}`);
        setI(i + 1);
        setJ(i + 1);
      }
      setSorted(Array.from({ length: i + 1 }, (_, idx) => idx));
    }
  };

  useEffect(() => {
    if (!isAutoplay) return;

    if (activeSort === 'bubble' && i >= array.length - 1) {
      setIsAutoplay(false);
      return;
    }
    if (activeSort === 'selection' && i >= array.length - 1) {
      setIsAutoplay(false);
      return;
    }
    if (activeSort === 'insertion' && i >= array.length) {
      setIsAutoplay(false);
      return;
    }

    const timer = setTimeout(() => {
      runMockSortStep();
    }, speed);

    return () => clearTimeout(timer);
  }, [isAutoplay, speed, array, i, j, minIdx]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Sorting Algorithms Visualizer</h3>
        <span className="sim-badge">Sorting</span>
      </div>
      <div className="array-sim">
        <div className="array-sim__bars">
          {array.map((val, idx) => {
            let color = 'var(--accent-border)';
            if (comparing.includes(idx)) color = '#ef4444';
            else if (sorted.includes(idx)) color = '#10b981';

            return (
              <div key={idx} className="array-sim__bar-col">
                <div className="array-sim__bar" style={{ height: `${val * 2}px`, backgroundColor: color }} />
                <span className="array-sim__bar-val">{val}</span>
              </div>
            );
          })}
        </div>
        <div className="array-sim__controls">
          <select value={activeSort} onChange={(e) => setActiveSort(e.target.value)} className="regex-sim__input" style={{ width: '130px' }}>
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
          </select>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text)' }}>Interval: {speed}ms</span>
            <input type="range" min="100" max="1500" step="50" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="css-sim__slider" style={{ width: '110px' }} />
          </div>
          <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={resetArray} className="sim-btn sim-btn--secondary">Reset</button>
            <button onClick={() => setIsAutoplay(!isAutoplay)} className={`sim-btn ${isAutoplay ? 'sim-btn--secondary' : ''}`}>
              {isAutoplay ? 'Pause' : 'Auto Play'}
            </button>
            <button onClick={runMockSortStep} className="sim-btn" disabled={isAutoplay}>Step Swap</button>
          </div>
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
          <div>{statusText}</div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 5. RECURSION CALL TREE VISUALIZER (topic: recursion)
 * ========================================================================== */
export function RecursionVisualizer() {
  const [num, setNum] = useState(4);
  const [treeCalls, setTreeCalls] = useState([]);

  const traceFib = (n) => {
    const list = [];
    const run = (val, depth) => {
      list.push({ val, depth });
      if (val <= 1) return val;
      return run(val - 1, depth + 1) + run(val - 2, depth + 1);
    };
    run(n, 0);
    setTreeCalls(list);
  };

  useEffect(() => {
    traceFib(num);
  }, [num]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Recursion Tree Tracer</h3>
        <span className="sim-badge">Recursion</span>
      </div>
      <div className="regex-sim">
        <div className="array-sim__controls">
          <label className="css-sim__slider-label">Fibonacci Input (n)</label>
          <input type="number" min="1" max="5" value={num} onChange={(e) => setNum(Number(e.target.value))} className="array-sim__input" />
        </div>
        <div className="node-sim__display" style={{ flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-h)' }}>Call Execution Tree:</div>
          {treeCalls.map((item, idx) => (
            <div key={idx} style={{ paddingLeft: `${item.depth * 24}px`, fontFamily: 'var(--mono)', fontSize: '13px' }}>
              ↳ fib({item.val})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 6. BST TREE STRUCTURE (topic: trees)
 * ========================================================================== */
export function BstTreeSimulator() {
  const [nodes, setNodes] = useState([50, 30, 70, 20, 40]);
  const [insertVal, setInsertVal] = useState('');

  const insertNode = () => {
    if (!insertVal || nodes.includes(Number(insertVal))) return;
    setNodes([...nodes, Number(insertVal)]);
    setInsertVal('');
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Binary Search Tree Sandbox</h3>
        <span className="sim-badge">Trees</span>
      </div>
      <div className="node-sim">
        <div className="node-sim__display" style={{ minHeight: '260px' }}>
          <div className="node-sim__list" style={{ maxWidth: '500px' }}>
            {nodes.map((node, i) => (
              <div key={i} className="node-sim__node" style={{ borderRadius: '50%', width: '48px', height: '48px', justifyContent: 'center' }}>
                {node}
              </div>
            ))}
          </div>
        </div>
        <div className="array-sim__controls">
          <input type="number" value={insertVal} onChange={(e) => setInsertVal(e.target.value)} className="array-sim__input" placeholder="Node Value" />
          <button onClick={insertNode} className="sim-btn">Insert Node</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 7. GRAPH BFS/DFS PATHFINDER IN GRID WITH WALLS (topic: graphs)
 * ========================================================================== */
export function GraphVisualizer() {
  const [grid, setGrid] = useState(Array(25).fill('empty')); // 5x5 grid
  const [walls, setWalls] = useState([6, 7, 8, 12, 17, 18]);
  const [visited, setVisited] = useState([]);
  const [status, setStatus] = useState('Toggle wall cells by clicking them, then trigger Pathfinder.');

  const toggleWall = (idx) => {
    if (idx === 0 || idx === 24) return;
    if (walls.includes(idx)) {
      setWalls(walls.filter(w => w !== idx));
    } else {
      setWalls([...walls, idx]);
    }
  };

  const runBFS = async () => {
    setVisited([]);
    let queue = [0];
    let route = [];
    
    while (queue.length > 0) {
      let current = queue.shift();
      if (route.includes(current)) continue;
      
      route.push(current);
      setVisited([...route]);
      setStatus(`Scanning node ID: ${current}`);
      await new Promise(r => setTimeout(r, 120));

      if (current === 24) {
        setStatus('Shortest Path Found! Goal node reached.');
        return;
      }

      const neighbors = [];
      const row = Math.floor(current / 5);
      const col = current % 5;
      
      if (col < 4) neighbors.push(current + 1);
      if (row < 4) neighbors.push(current + 5);
      if (col > 0) neighbors.push(current - 1);
      if (row > 0) neighbors.push(current - 5);

      neighbors.forEach((n) => {
        if (!walls.includes(n) && !route.includes(n)) {
          queue.push(n);
        }
      });
    }
    setStatus('No path found! Obstacle barriers blocked execution.');
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Graph Pathfinding Visualizer</h3>
        <span className="sim-badge">Graphs</span>
      </div>
      <div className="regex-sim">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 42px)', gap: '6px', justifyContent: 'center', margin: '16px 0' }}>
          {grid.map((_, idx) => {
            let bg = 'var(--bg)';
            let label = '';
            
            if (idx === 0) { bg = '#3b82f6'; label = 'Start'; }
            else if (idx === 24) { bg = '#10b981'; label = 'Dest'; }
            else if (walls.includes(idx)) { bg = '#ef4444'; label = 'Wall'; }
            else if (visited.includes(idx)) { bg = '#fef08a'; }

            return (
              <div
                key={idx}
                onClick={() => toggleWall(idx)}
                style={{ width: '42px', height: '42px', border: '1px solid var(--border)', borderRadius: '4px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
              >
                {label}
              </div>
            );
          })}
        </div>
        <div className="array-sim__controls">
          <span style={{ fontSize: '13px', color: 'var(--text)', flexGrow: 1 }}>{status}</span>
          <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setVisited([]); setWalls([6, 7, 8, 12, 17, 18]); setStatus('Grid reset.'); }} className="sim-btn sim-btn--secondary">Reset</button>
            <button onClick={runBFS} className="sim-btn">Run BFS</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 8. BIG O COMPLEXITY SVG CURVE PLOTTER (topic: foundations)
 * ========================================================================== */
export function BigOVisualizer() {
  const [n, setN] = useState(40);
  const width = 360;
  const height = 200;

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Big O Complexity Curve Plotter</h3>
        <span className="sim-badge">Complexity</span>
      </div>
      <div className="regex-sim">
        <div className="css-sim__controls" style={{ marginBottom: '16px' }}>
          <label className="css-sim__slider-label">Input Size (N) = {n}</label>
          <input type="range" min="5" max="80" value={n} onChange={(e) => setN(Number(e.target.value))} className="css-sim__slider" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
          <svg className="svg-graph" viewBox={`0 0 ${width} ${height}`}>
            <line x1="20" y1="180" x2="340" y2="180" stroke="var(--border)" strokeWidth="1" />
            <line x1="20" y1="20" x2="20" y2="180" stroke="var(--border)" strokeWidth="1" />
            <line x1="20" y1="160" x2="340" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
            <text x="310" y="150" fill="#94a3b8" fontSize="9">O(1)</text>
            <path d={`M 20 180 Q 80 140 340 120`} fill="none" stroke="#60a5fa" strokeWidth="2" />
            <text x="310" y="110" fill="#60a5fa" fontSize="9">O(log N)</text>
            <line x1="20" y1="180" x2="340" y2="40" stroke="#f59e0b" strokeWidth="2" />
            <text x="310" y="30" fill="#f59e0b" fontSize="9">O(N)</text>
            <path d={`M 20 180 Q 120 180 200 20`} fill="none" stroke="#ef4444" strokeWidth="2" />
            <text x="210" y="25" fill="#ef4444" fontSize="9">O(N²)</text>
            <line x1={20 + n * 3.8} y1="20" x2={20 + n * 3.8} y2="180" stroke="var(--accent)" strokeWidth="1" strokeDasharray="3" />
            <circle cx={20 + n * 3.8} cy={160} r="4" fill="var(--accent)" />
            <circle cx={20 + n * 3.8} cy={180 - n * 1.7} r="4" fill="var(--accent)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 9. DYNAMIC PROGRAMMING STEP GRID (topic: dynamic-programming)
 * ========================================================================== */
export function DpVisualizer() {
  const [num, setNum] = useState(5);
  const [table, setTable] = useState([]);

  useEffect(() => {
    let dp = Array(num + 1).fill(0);
    dp[0] = 0;
    if (num > 0) dp[1] = 1;
    for (let i = 2; i <= num; i++) {
      dp[i] = dp[i - 1] + dp[i - 2];
    }
    setTable(dp);
  }, [num]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">DP Memoization Table</h3>
        <span className="sim-badge">Dynamic Programming</span>
      </div>
      <div className="regex-sim">
        <div className="array-sim__controls">
          <label className="css-sim__slider-label">DP Fibonacci State (N)</label>
          <input type="number" min="2" max="15" value={num} onChange={(e) => setNum(Number(e.target.value))} className="array-sim__input" />
        </div>
        <div className="node-sim__list" style={{ justifyContent: 'flex-start', border: '1px solid var(--border)', padding: '16px', borderRadius: '6px', backgroundColor: 'var(--bg)', flexWrap: 'nowrap', overflowX: 'auto' }}>
          {table.map((val, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border)', padding: '0 16px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text)' }}>dp[{idx}]</span>
              <span style={{ fontFamily: 'var(--mono)', fontSize: '15px', fontWeight: 'bold' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 10. STACKS & QUEUES SIMULATOR (topic: stacks-queues / linked-lists)
 * ========================================================================== */
export function ListSimulator() {
  const [nodes, setNodes] = useState(['Node A', 'Node B', 'Node C']);
  const [newValue, setNewValue] = useState('');
  const [mode, setMode] = useState('stack');

  const handlePush = () => {
    if (!newValue) return;
    setNodes([...nodes, newValue]);
    setNewValue('');
  };

  const handlePop = () => {
    if (nodes.length === 0) return;
    setNodes(nodes.slice(0, -1));
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Nodes, Stacks, & Queues</h3>
        <span className="sim-badge">Data Structures</span>
      </div>
      <div className="node-sim">
        <div style={{ display: 'flex', gap: '8px' }}>
          {['stack', 'queue', 'linkedlist'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setNodes(['Val X', 'Val Y', 'Val Z']); }} className={`sim-btn ${mode === m ? '' : 'sim-btn--secondary'}`} style={{ flex: 1, textTransform: 'capitalize' }}>
              {m}
            </button>
          ))}
        </div>
        <div className="node-sim__display">
          {mode === 'stack' && (
            <div className="node-sim__stack">
              {nodes.map((node, i) => (
                <div key={i} className="node-sim__node" style={{ width: '100%', justifyContent: 'center' }}>{node}</div>
              ))}
            </div>
          )}
          {mode === 'queue' && (
            <div className="node-sim__queue">
              {nodes.map((node, i) => (
                <div key={i} className="node-sim__node">{node}</div>
              ))}
            </div>
          )}
          {mode === 'linkedlist' && (
            <div className="node-sim__list">
              {nodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div className="node-sim__node">{node}</div>
                  {i < nodes.length - 1 && <span className="node-sim__arrow">➔</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div className="array-sim__controls">
          <input type="text" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="array-sim__input" style={{ width: '150px' }} placeholder="Value" />
          <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handlePush} className="sim-btn">Push Node</button>
            <button onClick={handlePop} className="sim-btn sim-btn--secondary">Delete Node</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 11. VARIABLE SCOPE INHERITANCE MAP (topic: oops)
 * ========================================================================== */
export function ScopeTrackerSimulator() {
  const [vars] = useState({
    jonas: '{ name: "Jonas", year: 1991 }',
    matilda: '{ firstName: "Matilda", year: 2017 }',
    this: 'Window Object'
  });

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Variables Scope Trace</h3>
        <span className="sim-badge">Lexical Bindings</span>
      </div>
      <div className="scope-sim">
        <div style={{ flexGrow: 1 }}>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text)' }}>
            This simulator tracks the variables and references generated on compiler runtimes. Add parameters to scripts in the editor to evaluate variables live inside logs.
          </p>
        </div>
        <div>
          <table className="scope-sim__table">
            <thead>
              <tr>
                <th className="scope-sim__th">Identifier</th>
                <th className="scope-sim__th">Bound Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(vars).map(([name, value]) => (
                <tr key={name}>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>{name}</td>
                  <td className="scope-sim__td">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 12. EVENT LOOP SCHEDULER SIMULATOR WITH AUTO PLAY (topic: async)
 * ========================================================================== */
export function EventLoopSimulator() {
  const [logs, setLogs] = useState([]);
  const [stack, setStack] = useState([]);
  const [microtask, setMicrotask] = useState([]);
  const [macrotask, setMacrotask] = useState([]);
  const [step, setStep] = useState(0);

  // Auto-play state
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const stepsList = [
    {
      description: 'Initial state: Async execution script loaded.',
      action: () => { setLogs([]); setStack([]); setMicrotask([]); setMacrotask([]); }
    },
    {
      description: 'Step 1: Execute console.log("1"). Push to stack, execute, and pop.',
      action: () => { setStack(['console.log("1")']); setLogs(['1']); }
    },
    {
      description: 'Step 2: Parse setTimeout(). Web API registers timer and pushes callback to Macrotask queue.',
      action: () => { setStack(['setTimeout()']); setMacrotask(['cb_setTimeout()']); }
    },
    {
      description: 'Step 3: Parse Promise.resolve().then(). Push callback handler to Microtask queue.',
      action: () => { setStack(['Promise.resolve()']); setMicrotask(['cb_Promise()']); }
    },
    {
      description: 'Step 4: Execute console.log("4"). Push to stack, write log, pop stack.',
      action: () => { setStack(['console.log("4")']); setLogs(prev => [...prev, '4']); }
    },
    {
      description: 'Step 5: Call Stack is now empty. Event Loop checks Microtask Queue first and executes Promise callback.',
      action: () => { setStack(['cb_Promise()']); setMicrotask([]); setLogs(prev => [...prev, '3 (Promise resolved)']); }
    },
    {
      description: 'Step 6: Microtask Queue is empty. Event Loop executes setTimeout callback from Macrotask Queue.',
      action: () => { setStack(['cb_setTimeout()']); setMacrotask([]); setLogs(prev => [...prev, '2 (Timeout completed)']); }
    }
  ];

  const handleNext = () => {
    if (step < stepsList.length) {
      stepsList[step].action();
      setStep(prev => prev + 1);
    } else {
      setIsAutoplay(false);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLogs([]);
    setStack([]);
    setMicrotask([]);
    setMacrotask([]);
    setIsAutoplay(false);
  };

  useEffect(() => {
    if (!isAutoplay) return;
    if (step >= stepsList.length) {
      setIsAutoplay(false);
      return;
    }

    const timer = setTimeout(() => {
      handleNext();
    }, speed);

    return () => clearTimeout(timer);
  }, [isAutoplay, speed, step]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Event Loop Engine Simulator</h3>
        <span className="sim-badge">Async</span>
      </div>
      <div className="regex-sim">
        <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--mono)', backgroundColor: 'var(--bg)' }}>
          console.log('1');<br/>
          setTimeout(() =&gt; console.log('2'), 0);<br/>
          Promise.resolve().then(() =&gt; console.log('3'));<br/>
          console.log('4');
        </div>
        <div className="loop-sim">
          <div className="loop-sim__lane">
            <span className="loop-sim__lane-title">Call Stack</span>
            {stack.map((item, i) => (
              <div key={i} className="loop-sim__item" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>{item}</div>
            ))}
          </div>
          <div className="loop-sim__lane">
            <span className="loop-sim__lane-title">Microtask (Promise)</span>
            {microtask.map((item, i) => (
              <div key={i} className="loop-sim__item" style={{ borderColor: '#34d399' }}>{item}</div>
            ))}
          </div>
          <div className="loop-sim__lane">
            <span className="loop-sim__lane-title">Macrotask (setTimeout)</span>
            {macrotask.map((item, i) => (
              <div key={i} className="loop-sim__item" style={{ borderColor: '#fbbf24' }}>{item}</div>
            ))}
          </div>
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
          {logs.length === 0 && <span style={{ opacity: 0.5 }}>logs empty</span>}
        </div>
        <div className="express-sim__pipeline" style={{ padding: '0px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-h)', flexGrow: 1 }}>
            {step === 0 ? 'Click Step Loop or Auto Play to begin.' : stepsList[step - 1].description}
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={handleReset} className="sim-btn sim-btn--secondary">Reset</button>
            <button onClick={() => setIsAutoplay(!isAutoplay)} className={`sim-btn ${isAutoplay ? 'sim-btn--secondary' : ''}`}>
              {isAutoplay ? 'Pause' : 'Auto Play'}
            </button>
            <button onClick={handleNext} disabled={step === stepsList.length || isAutoplay} className="sim-btn">Step Loop</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 13. EXPRESS ROUTE PACKET PIPELINE (topic: node)
 * ========================================================================== */
export function HttpRouteSimulator() {
  const [activeIdx, setActiveIdx] = useState(-1);
  const [log, setLog] = useState('Click Trigger Mock Request.');
  const [packet, setPacket] = useState({ headers: 'None', body: 'Empty' });

  const nodes = ['CORS Checks', 'Logger', 'Body Parser', 'Auth JWT Guard', 'Route Controller'];

  const triggerMockRequest = async () => {
    const messages = [
      'CORS Verified: Origin match accepted.',
      'Logger: POST /v1/tours - Payload received.',
      'BodyParser: req.body buffer parsed successfully.',
      'AuthGuard: JWT verification succeeded. User verified.',
      'Controller: tourController.createTour() saved document to MongoDB.'
    ];

    setPacket({ headers: 'Origin: localhost:5173', body: 'Raw Buffer Stream' });

    for (let i = 0; i < nodes.length; i++) {
      setActiveIdx(i);
      setLog(messages[i]);
      if (i === 2) setPacket({ headers: 'Origin: localhost:5173', body: '{ name: "Natours" }' });
      if (i === 3) setPacket({ headers: 'Authorization: Bearer <JWT>', body: '{ name: "Natours" }' });
      await new Promise(r => setTimeout(r, 1200));
    }
    setActiveIdx(-1);
    setLog('Response: 201 Created sent to client browser.');
    setPacket({ headers: 'None', body: 'Empty' });
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Express Route Pipeline Simulator</h3>
        <span className="sim-badge">Node / Express</span>
      </div>
      <div className="express-sim">
        <div className="express-sim__pipeline">
          {nodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <div className={`express-sim__node ${activeIdx === idx ? 'express-sim__node--active' : ''}`}>{node}</div>
              {idx < nodes.length - 1 && <span className="express-sim__arrow-down">⬇</span>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', flexGrow: 1 }}>
            <div className="note-block__console-title">Request Packet Context</div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
              <strong>Headers:</strong> {packet.headers} <br />
              <strong>Body:</strong> {packet.body}
            </div>
          </div>
          <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
            <div>{log}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={triggerMockRequest} disabled={activeIdx !== -1} className="sim-btn">
              {activeIdx === -1 ? 'Trigger Request' : 'Routing...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
