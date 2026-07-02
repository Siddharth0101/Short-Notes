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
 * 11. VARIABLE SCOPE, PROTOTYPES, & THIS BINDING (topic: oops / general scopes)
 * ========================================================================== */
export function ScopeTrackerSimulator() {
  const [activeTab, setActiveTab] = useState('scope'); // scope, prototype, this
  const [thisLog, setThisLog] = useState('Select an execution type below to trace "this" bindings.');
  
  const vars = {
    jonas: '{ name: "Jonas", year: 1991 }',
    matilda: '{ firstName: "Matilda", year: 2017 }',
    this: 'Window Object'
  };

  const runThisTrace = (type) => {
    if (type === 'method') {
      setThisLog(`🔊 Method Call: jonas.calcAge();\n👉 Rule: "this" always refers to the object calling the method (dot ke pehle wala object).\n📍 "this" is bound to jonas Object: { name: "Jonas", year: 1991 }`);
    } else if (type === 'simple') {
      setThisLog(`🔊 Simple Function Call: calcAge();\n👉 Rule: Strict Mode me normal function call ka "this" undefined hota hai.\n📍 "this" = undefined`);
    } else if (type === 'arrow') {
      setThisLog(`🔊 Arrow Function Call: () => { console.log(this) };\n👉 Rule: Arrow function ka apna "this" nahi hota. Woh external lexical context se inherit karta hai.\n📍 "this" = Window Object (Parent global context)`);
    } else if (type === 'event') {
      setThisLog(`🔊 Event Listener: button.addEventListener("click", function() { ... });\n👉 Rule: DOM Event handler callback me "this" target DOM element ko reference karta hai.\n📍 "this" = <button> HTML Element`);
    }
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Scopes, Prototypes, & "this" Keyword</h3>
        <span className="sim-badge">OOP Runtime</span>
      </div>
      
      {/* Scope Simulator Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        {['scope', 'prototype', 'this'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`sim-btn ${activeTab === tab ? '' : 'sim-btn--secondary'}`}
            style={{ flex: 1, fontSize: '11px', padding: '6px 0', textTransform: 'capitalize' }}
          >
            {tab === 'scope' && 'Variables Scope'}
            {tab === 'prototype' && 'Prototype Chain'}
            {tab === 'this' && '"this" Binding'}
          </button>
        ))}
      </div>

      <div className="node-sim__display" style={{ minHeight: '180px', flexDirection: 'column', padding: '16px' }}>
        {activeTab === 'scope' && (
          <div className="scope-sim" style={{ width: '100%' }}>
            <div style={{ flexGrow: 1, marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text)' }}>
                Tracks variable declarations inside execution environments. Add variables in the sandbox editor to print them live in the console.
              </p>
            </div>
            <div style={{ width: '100%', overflowX: 'auto' }}>
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
        )}

        {activeTab === 'prototype' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', textAlign: 'center', maxWidth: '420px', lineHeight: '1.5' }}>
              <strong>Prototype Lookup Chain:</strong> matilda variable calling <code>calcAge()</code> links prototypes upward!
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <div className="node-sim__node" style={{ fontSize: '11px', padding: '6px 12px' }}>
                matilda instance
              </div>
              <span className="node-sim__arrow">➔</span>
              <div className="node-sim__node" style={{ fontSize: '11px', padding: '6px 12px', backgroundColor: 'var(--accent)', color: '#fff' }}>
                Person.prototype (has calcAge)
              </div>
              <span className="node-sim__arrow">➔</span>
              <div className="node-sim__node" style={{ fontSize: '11px', padding: '6px 12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)' }}>
                Object.prototype
              </div>
              <span className="node-sim__arrow">➔</span>
              <div style={{ fontSize: '11px', opacity: 0.5 }}>null</div>
            </div>
          </div>
        )}

        {activeTab === 'this' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '80px' }}>
              <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {thisLog}
              </pre>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button onClick={() => runThisTrace('method')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>Method Call</button>
              <button onClick={() => runThisTrace('simple')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>Simple Call</button>
              <button onClick={() => runThisTrace('arrow')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>Arrow Call</button>
              <button onClick={() => runThisTrace('event')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>Event Handler</button>
            </div>
          </div>
        )}
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
 * 13. EXPRESS ROUTE PACKET PIPELINE (topic: node/express)
 * ========================================================================== */
export function HttpRouteSimulator() {
  const [activeTab, setActiveTab] = useState('pipeline'); // pipeline, mvc, postman, config
  
  // Tab 1: Middleware pipeline state
  const [activeIdx, setActiveIdx] = useState(-1);
  const [log, setLog] = useState('Click Trigger Mock Request to watch middleware phases execution.');
  const [packet, setPacket] = useState({ headers: 'None', body: 'Empty' });
  const nodes = ['CORS Checks', 'Logger (morgan)', 'Body Parser (express.json)', 'checkBody Validator', 'Route Controller'];

  // Tab 2: MVC file state
  const [mvcStep, setMvcStep] = useState(0);

  // Tab 3: Postman mock state
  const [postmanMethod, setPostmanMethod] = useState('GET');
  const [postmanUrl, setPostmanUrl] = useState('/api/v1/tours');
  const [postmanBody, setPostmanBody] = useState('{\n  "name": "The Desert Safari",\n  "price": 299\n}');
  const [postmanResponse, setPostmanResponse] = useState('Send request to inspect Express HTTP server outputs.');
  const [postmanStatus, setPostmanStatus] = useState(200);

  // Tab 4: app vs server config checks
  const [configFocus, setConfigFocus] = useState(0);

  const triggerMockRequest = async () => {
    const messages = [
      'CORS Verified: Origin match accepted by cors() middleware.',
      'Logger (morgan): POST /api/v1/tours - Morgan printed log to terminal stdout.',
      'BodyParser: express.json() parsed buffer string into JSON req.body Object.',
      'checkBody: Custom param validation middleware verified name & price fields exist.',
      'Controller: tourController.createTour() saved document using Mongoose Model.'
    ];

    setPacket({ headers: 'Origin: localhost:5173', body: 'Raw Buffer Stream' });

    for (let i = 0; i < nodes.length; i++) {
      setActiveIdx(i);
      setLog(messages[i]);
      if (i === 2) setPacket({ headers: 'Origin: localhost:5173', body: '{ name: "Natours", price: 397 }' });
      if (i === 3) setPacket({ headers: 'Content-Type: application/json', body: '{ name: "Natours", price: 397 }' });
      await new Promise(r => setTimeout(r, 1100));
    }
    setActiveIdx(-1);
    setLog('Response Sent: 201 Created payload returned to client browser successfully.');
    setPacket({ headers: 'None', body: 'Empty' });
  };

  const executePostmanMock = () => {
    if (postmanMethod === 'GET' && postmanUrl === '/api/v1/tours') {
      setPostmanStatus(200);
      setPostmanResponse(JSON.stringify({
        status: 'success',
        results: 2,
        data: {
          tours: [
            { id: 1, name: 'The Forest Hiker', price: 497 },
            { id: 2, name: 'The Sea Explorer', price: 897 }
          ]
        }
      }, null, 2));
    } else if (postmanMethod === 'POST' && postmanUrl === '/api/v1/tours') {
      try {
        const bodyObj = JSON.parse(postmanBody);
        if (!bodyObj.name || !bodyObj.price) {
          setPostmanStatus(400);
          setPostmanResponse(JSON.stringify({
            status: 'fail',
            message: 'Validation failed: Missing name or price parameter!'
          }, null, 2));
        } else {
          setPostmanStatus(201);
          setPostmanResponse(JSON.stringify({
            status: 'success',
            data: {
              tour: {
                id: Math.floor(Math.random() * 100) + 3,
                name: bodyObj.name,
                price: Number(bodyObj.price)
              }
            }
          }, null, 2));
        }
      } catch (e) {
        setPostmanStatus(400);
        setPostmanResponse(JSON.stringify({
          status: 'fail',
          message: 'Syntax Error: Invalid JSON body format.'
        }, null, 2));
      }
    } else if (postmanMethod === 'DELETE') {
      setPostmanStatus(204);
      setPostmanResponse('204 No Content (Document deleted successfully from DB)');
    } else {
      setPostmanStatus(404);
      setPostmanResponse(JSON.stringify({
        status: 'fail',
        message: `Route Handler not found for: ${postmanMethod} ${postmanUrl}`
      }, null, 2));
    }
  };

  return (
    <div className="sim-container" style={{ minHeight: '440px' }}>
      <div className="sim-header">
        <h3 className="sim-title">Express REST API Engine</h3>
        <span className="sim-badge">MVC & Routing</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        {['pipeline', 'mvc', 'postman', 'config'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`sim-btn ${activeTab === tab ? '' : 'sim-btn--secondary'}`}
            style={{ flex: 1, fontSize: '10px', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {tab === 'pipeline' && 'Middleware Pipeline'}
            {tab === 'mvc' && 'MVC File Flow'}
            {tab === 'postman' && 'Postman Client'}
            {tab === 'config' && 'App vs Server'}
          </button>
        ))}
      </div>

      <div className="regex-sim" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Tab 1: Middleware Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="express-sim" style={{ width: '100%' }}>
            <div className="express-sim__pipeline" style={{ minWidth: '150px' }}>
              {nodes.map((node, idx) => (
                <React.Fragment key={idx}>
                  <div 
                    className={`express-sim__node ${activeIdx === idx ? 'express-sim__node--active' : ''}`}
                    style={{ fontSize: '10px', padding: '6px' }}
                  >
                    {node}
                  </div>
                  {idx < nodes.length - 1 && <span className="express-sim__arrow-down" style={{ fontSize: '10px', margin: '2px 0' }}>⬇</span>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
              <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
                <div className="note-block__console-title">Request HTTP Packet State</div>
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  <strong>Headers:</strong> {packet.headers} <br />
                  <strong>Body:</strong> {packet.body}
                </div>
              </div>
              <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px' }}>{log}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={triggerMockRequest} disabled={activeIdx !== -1} className="sim-btn">
                  {activeIdx === -1 ? 'Trigger Mock Request ⚡' : 'Routing...'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: MVC File Flow */}
        {activeTab === 'mvc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              Express apps organize files under the **Model-View-Controller (MVC)** standard. Click stages to trace:
            </div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { id: 1, name: '1. server.js', desc: 'Port listening & Database connection configs.' },
                { id: 2, name: '2. app.js', desc: 'Middleware setup and route mappings.' },
                { id: 3, name: '3. routes.js', desc: 'Maps route paths (e.g. /tours) to specific handlers.' },
                { id: 4, name: '4. controllers.js', desc: 'Contains req/res logic and calls model schemas.' },
                { id: 5, name: '5. model.js', desc: 'Defines Mongoose schema validations & connects to DB.' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setMvcStep(item.id)}
                  className={`thread-card ${mvcStep === item.id ? 'thread-card--active' : ''}`}
                  style={{ flex: 1, minWidth: '110px', border: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.name}</div>
                  <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '90px' }}>
              <div className="note-block__console-title">Directory Flow execution summary</div>
              {mvcStep === 0 && <div style={{ fontSize: '11px', opacity: 0.6 }}>Click a file segment box above to track files execution chain.</div>}
              {mvcStep === 1 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>server.js (Main Bootstrap Entry point):</strong><br />
                  - Loads configuration variables using dotenv <code>dotenv.config()</code>.<br />
                  - Initiates database connection <code>mongoose.connect()</code>.<br />
                  - Starts the listening port server listener <code>app.listen(port)</code>.
                </div>
              )}
              {mvcStep === 2 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>app.js (Express configuration module):</strong><br />
                  - Instantiates Express application object: <code>const app = express()</code>.<br />
                  - Mounts global middlewares: <code>app.use(express.json())</code>.<br />
                  - Mounts domain routes: <code>app.use('/api/v1/tours', tourRouter)</code>.
                </div>
              )}
              {mvcStep === 3 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>tourRoutes.js (Routes mapping router):</strong><br />
                  - Maps specific request pathways to their controller functions:<br />
                  <code>router.route('/').get(tourController.getAllTours).post(tourController.createTour);</code>
                </div>
              )}
              {mvcStep === 4 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>tourController.js (Request & Response handler):</strong><br />
                  - Communicates with model layers to query documents.<br />
                  - Formats HTTP responses: <code>res.status(200).json(...)</code>.<br />
                  - Handles errors or sends success payload back.
                </div>
              )}
              {mvcStep === 5 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>tourModel.js (Database document schema rules):</strong><br />
                  - Configures data field rules (types, required validations, default values).<br />
                  - E.g. <code>name: &#123; type: String, required: [true, 'A tour must have a name'] &#125;</code>.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Postman Client */}
        {activeTab === 'postman' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select 
                value={postmanMethod} 
                onChange={(e) => {
                  setPostmanMethod(e.target.value);
                  if (e.target.value === 'POST') {
                    setPostmanUrl('/api/v1/tours');
                  } else if (e.target.value === 'DELETE') {
                    setPostmanUrl('/api/v1/tours/5');
                  } else {
                    setPostmanUrl('/api/v1/tours');
                  }
                }}
                className="sim-btn sim-btn--secondary"
                style={{ width: '100px', padding: '6px' }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="DELETE">DELETE</option>
              </select>

              <input 
                type="text" 
                value={postmanUrl} 
                onChange={(e) => setPostmanUrl(e.target.value)} 
                style={{ flex: 1, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)', color: 'var(--text-h)', fontFamily: 'var(--mono)', fontSize: '12px' }}
              />

              <button onClick={executePostmanMock} className="sim-btn">Send 🚀</button>
            </div>

            {postmanMethod === 'POST' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>JSON Request Body Payload:</span>
                <textarea 
                  value={postmanBody} 
                  onChange={(e) => setPostmanBody(e.target.value)} 
                  style={{ width: '100%', height: '80px', fontFamily: 'var(--mono)', fontSize: '11px', padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)', color: 'var(--text-h)' }}
                />
              </div>
            )}

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>
                <span className="note-block__console-title">Mock API Response Output</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: postmanStatus >= 400 ? '#ef4444' : '#10b981' }}>
                  Status: {postmanStatus}
                </span>
              </div>
              <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>
                {postmanResponse}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: App vs Server Configuration */}
        {activeTab === 'config' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              Separation of concerns in clean environments: config decisions should split logically!
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => setConfigFocus(1)}
                className={`thread-card ${configFocus === 1 ? 'thread-card--active' : ''}`}
                style={{ flex: 1, border: '1px solid var(--border)', cursor: 'pointer', padding: '12px' }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>🛠️ Inside app.js</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '10px', textAlign: 'left', lineHeight: '1.4' }}>
                  <li>Middleware configurations</li>
                  <li>Router attachments</li>
                  <li>CORS / JSON parser rules</li>
                  <li>Global error handlers</li>
                </ul>
              </button>

              <button 
                onClick={() => setConfigFocus(2)}
                className={`thread-card ${configFocus === 2 ? 'thread-card--active' : ''}`}
                style={{ flex: 1, border: '1px solid var(--border)', cursor: 'pointer', padding: '12px' }}
              >
                <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>⚡ Inside server.js</h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '10px', textAlign: 'left', lineHeight: '1.4' }}>
                  <li>dotenv environment loading</li>
                  <li>Database instance connecting</li>
                  <li>Main Server listen binding</li>
                  <li>Unhandled Promise catchers</li>
                </ul>
              </button>
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '80px' }}>
              <div className="note-block__console-title">Architectural Rationale</div>
              {configFocus === 0 && <div style={{ fontSize: '11px', opacity: 0.6 }}>Click a box above to read separation rules.</div>}
              {configFocus === 1 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>Why isolate app.js?</strong><br />
                  It decouples the API logic (middlewares, routing) from server runtime bindings. This allows you to test the API easily in automated environments (like Jest/Supertest) without opening active network listening sockets!
                </div>
              )}
              {configFocus === 2 && (
                <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  <strong>Why isolate server.js?</strong><br />
                  It acts as the system bootstrap layer. It wraps DB connection failures or global node crash events (unhandled rejections) in one entry point, keeping the API routing logic completely clean.
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
 * 14. WEB BACKEND FUNDAMENTALS (topic: course-overview / How the Web Works)
 * ========================================================================== */
export function WebFundamentalsSimulator() {
  const [phase, setPhase] = useState('DNS'); // DNS, TCP, HTTP, RENDER
  const [step, setStep] = useState(0);
  const [log, setLog] = useState('Client (Browser) me "google.com" enter kiya. DNS resolution start.');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const dnsSteps = [
    { label: 'Browser Cache', desc: '1. Browser ne local cache memory check kari: "google.com kahan hai?" (Result: Cache Miss)' },
    { label: 'OS Cache', desc: '2. Browser ne Windows/Mac OS local DNS cache hosts check kiye: (Result: DNS cache miss)' },
    { label: 'ISP Resolver', desc: '3. Query recursive resolver (Jio/Airtel/BSNL DNS Server) ke paas gayi.' },
    { label: 'Root Server', desc: '4. ISP Resolver ne Root Name Server (. Librarian) se pucha. Root bola: ".com TLD Server ke paas jao."' },
    { label: 'TLD Server', desc: '5. Resolver TLD Server (.com) ke paas gaya. TLD bola: "Google Authoritative Server ke paas jao."' },
    { label: 'Authoritative DNS', desc: '6. Authoritative Server (The Final Boss) ne exact IP address return kiya: 142.250.190.46!' }
  ];

  const tcpSteps = [
    { label: 'SYN', desc: '1. Client -> Server: SYN (seq=100) packet bheja. "Hello Server! Kya tum ready ho? Mujhe connection banana hai."' },
    { label: 'SYN-ACK', desc: '2. Server -> Client: SYN-ACK (seq=300, ack=101) packet. "Haan bhai, main completely ready hu!"' },
    { label: 'ACK', desc: '3. Client -> Server: ACK (ack=301) packet. "Done! Baat shuru karte hain." Connection ESTABLISHED!' }
  ];

  const httpSteps = [
    { label: 'HTTP GET Request', desc: 'HTTP GET Request headers dispatched:\nGET /search?q=javascript HTTP/1.1\nHost: google.com\nUser-Agent: Chrome' },
    { label: 'HTTP 200 Response', desc: 'Server returns response payload:\nHTTP/1.1 200 OK\nContent-Type: text/html\nContent-Length: 4500\n\n(HTML content returned)' }
  ];

  const renderSteps = [
    { label: 'DOM Parsing', desc: '1. Browser HTML content parse karke DOM (Document Object Model) tree build kar raha hai.' },
    { label: 'CSSOM Parsing', desc: '2. CSS styles read karke CSSOM rules model map kiye.' },
    { label: 'Layout Calculation', desc: '3. DOM + CSSOM match karke coordinate geometry calculate kari.' },
    { label: 'Paint Page', desc: '4. Pixels screen pe draw painting complete! Web page rendered successfully!' }
  ];

  const handleNext = () => {
    if (phase === 'DNS') {
      if (step < dnsSteps.length - 1) {
        setStep(prev => prev + 1);
        setLog(dnsSteps[step + 1].desc);
      } else {
        setPhase('TCP');
        setStep(0);
        setLog(tcpSteps[0].desc);
      }
    } else if (phase === 'TCP') {
      if (step < tcpSteps.length - 1) {
        setStep(prev => prev + 1);
        setLog(tcpSteps[step + 1].desc);
      } else {
        setPhase('HTTP');
        setStep(0);
        setLog(httpSteps[0].desc);
      }
    } else if (phase === 'HTTP') {
      if (step < httpSteps.length - 1) {
        setStep(prev => prev + 1);
        setLog(httpSteps[step + 1].desc);
      } else {
        setPhase('RENDER');
        setStep(0);
        setLog(renderSteps[0].desc);
      }
    } else if (phase === 'RENDER') {
      if (step < renderSteps.length - 1) {
        setStep(prev => prev + 1);
        setLog(renderSteps[step + 1].desc);
      } else {
        setIsAutoplay(false);
        setLog('🎉 Web Request complete! Website successfully rendered.');
      }
    }
  };

  const handleReset = () => {
    setPhase('DNS');
    setStep(0);
    setIsAutoplay(false);
    setLog('Client (Browser) me "google.com" enter kiya. DNS resolution start.');
  };

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setTimeout(() => {
      const isDnsDone = phase === 'DNS' && step >= dnsSteps.length - 1;
      const isTcpDone = phase === 'TCP' && step >= tcpSteps.length - 1;
      const isHttpDone = phase === 'HTTP' && step >= httpSteps.length - 1;
      const isRenderDone = phase === 'RENDER' && step >= renderSteps.length - 1;

      if (isRenderDone) {
        setIsAutoplay(false);
        setLog('🎉 Web Request complete! Website successfully rendered.');
        return;
      }

      handleNext();
    }, speed);

    return () => clearTimeout(timer);
  }, [isAutoplay, speed, phase, step]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Detailed: How the Web Works</h3>
        <span className="sim-badge">Web Architecture</span>
      </div>

      {/* Stepper Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        {['DNS', 'TCP', 'HTTP', 'RENDER'].map((p) => (
          <button
            key={p}
            onClick={() => { setPhase(p); setStep(0); setIsAutoplay(false); }}
            className={`sim-btn ${phase === p ? '' : 'sim-btn--secondary'}`}
            style={{ flex: 1, fontSize: '11px', padding: '6px 0' }}
          >
            {p === 'DNS' && '1. DNS Lookup'}
            {p === 'TCP' && '2. TCP Handshake'}
            {p === 'HTTP' && '3. HTTP Req/Res'}
            {p === 'RENDER' && '4. Rendering'}
          </button>
        ))}
      </div>

      {/* Visual Canvas */}
      <div className="node-sim__display" style={{ minHeight: '180px', flexDirection: 'column' }}>
        {phase === 'DNS' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {dnsSteps.map((node, i) => (
              <div
                key={i}
                className="node-sim__node"
                style={{
                  fontSize: '11px',
                  padding: '6px 12px',
                  backgroundColor: i === step ? 'var(--accent)' : 'var(--accent-bg)',
                  color: i === step ? '#fff' : 'var(--text)',
                  border: '1px solid var(--border)'
                }}
              >
                {node.label}
              </div>
            ))}
          </div>
        )}

        {phase === 'TCP' && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <div className="node-sim__node" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>Client</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '4px' }}>
                {step === 0 && 'SYN ➔'}
                {step === 1 && '◀ SYN-ACK'}
                {step === 2 && 'ACK ➔'}
              </span>
              <div style={{ width: '120px', height: '2px', backgroundColor: 'var(--border)' }} />
            </div>
            <div className="node-sim__node" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text-h)' }}>Server</div>
          </div>
        )}

        {phase === 'HTTP' && (
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--mono)', opacity: step === 0 ? 1 : 0.4 }}>
              <strong>Request Headers</strong><br />
              GET / HTTP/1.1<br />
              Host: google.com<br />
              User-Agent: Chrome
            </div>
            <div style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11px', fontFamily: 'var(--mono)', opacity: step === 1 ? 1 : 0.4 }}>
              <strong>Response Headers</strong><br />
              HTTP/1.1 200 OK<br />
              Content-Type: text/html<br />
              Content-Length: 4500
            </div>
          </div>
        )}

        {phase === 'RENDER' && (
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {renderSteps.map((node, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: i === step ? 'var(--accent)' : 'var(--accent-bg)',
                    color: i === step ? '#fff' : 'var(--text)',
                    border: '1px solid var(--border)',
                    textAlign: 'center'
                  }}
                >
                  {node.label}
                </div>
              ))}
            </div>
            {step === 3 && (
              <div
                style={{
                  width: '120px',
                  height: '80px',
                  border: '1px solid var(--accent)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--accent-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: 'var(--accent)',
                  boxShadow: 'var(--shadow)',
                  animation: 'fadeIn 0.5s ease'
                }}
              >
                Mock Google Page
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Console */}
      <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
        <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
          {log}
        </pre>
      </div>

      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text)' }}>Interval: {speed}ms</span>
          <input type="range" min="400" max="2500" step="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="css-sim__slider" style={{ width: '110px' }} />
        </div>
        <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleReset} className="sim-btn sim-btn--secondary">Reset</button>
          <button onClick={() => setIsAutoplay(!isAutoplay)} className={`sim-btn ${isAutoplay ? 'sim-btn--secondary' : ''}`}>
            {isAutoplay ? 'Pause' : 'Auto Play'}
          </button>
          <button onClick={handleNext} disabled={isAutoplay} className="sim-btn">Next Step</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 15. NODE REQ MODULE BINDINGS (topic: node-foundations)
 * ========================================================================== */
export function NodeFoundationsSimulator() {
  const [log, setLog] = useState('Select an action to trace CommonJS modules exports.');

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">CommonJS Require Module Linker</h3>
        <span className="sim-badge">Node Modules</span>
      </div>
      <div className="regex-sim">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--mono)', backgroundColor: 'var(--bg)' }}>
            <strong>// math.js</strong><br />
            exports.add = (a, b) =&gt; a + b;<br />
            exports.multiply = (a, b) =&gt; a * b;
          </div>
          <div style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px', fontFamily: 'var(--mono)', backgroundColor: 'var(--bg)' }}>
            <strong>// app.js</strong><br />
            const math = require('./math.js');<br />
            console.log(math.add(5, 10));
          </div>
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
          <div className="note-block__console-title">Console Trace Logs</div>
          <div>{log}</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={() => setLog('Loaded require("./math.js"): Object properties mapping exports successfully.')} className="sim-btn sim-btn--secondary">Require modules</button>
          <button onClick={() => setLog('math.add(5, 10) output: 15')} className="sim-btn">Execute add()</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 16. NODE INTERNALS EVENT LOOP & THREAD POOL (topic: node-internals)
 * ========================================================================== */
export function NodeInternalsSimulator() {
  const [activeTab, setActiveTab] = useState('pool'); // pool, loop, streams, require
  
  // Tab 1: Thread pool state
  const [activeThread, setActiveThread] = useState(-1);
  const [poolLog, setPoolLog] = useState('Dispatch tasks to trace Thread Pool workers offloading.');

  // Tab 2: Event Loop Phases state
  const [loopPhase, setLoopPhase] = useState(0); // 0: Timers, 1: Pending, 2: Poll, 3: Check, 4: Close
  const [loopLogs, setLoopLogs] = useState([]);
  
  // Tab 3: Streams state
  const [streamProgress, setStreamProgress] = useState(0);
  const [streamLog, setStreamLog] = useState('Click "Simulate Pipe Stream" to begin streaming chunks.');
  const [isSlowWritable, setIsSlowWritable] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // Tab 4: require() state
  const [requireStep, setRequireStep] = useState(0);

  const runPoolTask = async (taskType) => {
    if (taskType === 'sync') {
      setPoolLog('Main Thread: Executing console.log("Direct add"). Instantly pops off call stack.');
      return;
    }

    if (taskType === 'os') {
      setPoolLog('Event Loop: HTTP task offloaded directly to OS Kernel network threads. Freeing Call Stack.');
      await new Promise(r => setTimeout(r, 1200));
      setPoolLog('OS Kernel: Packet returned. Event loop triggers HTTP callback.');
      return;
    }

    const threadIdx = Math.floor(Math.random() * 4);
    setActiveThread(threadIdx);
    setPoolLog(`Event Loop: Offloaded heavy ${taskType} task to worker Thread #${threadIdx + 1}`);
    
    await new Promise(r => setTimeout(r, 1500));
    
    setActiveThread(-1);
    setPoolLog(`Thread #${threadIdx + 1}: Task finished! Pushes callback back to Callback queue.`);
  };

  const advanceLoopPhase = () => {
    const phases = [
      { name: '1. Timers Phase', desc: 'setTimeout / setInterval callbacks execute.' },
      { name: '2. Pending Callbacks', desc: 'Executes deferred I/O callbacks (like TCP connection failures).' },
      { name: '3. Poll Phase', desc: 'Retrieved new I/O events. Executes file/network callbacks. Node will block here if no callbacks are pending.' },
      { name: '4. Check Phase', desc: 'setImmediate callbacks run. (Runs right after Poll phase).' },
      { name: '5. Close Callbacks', desc: 'Runs socket/file close event callbacks, e.g., socket.on("close").' }
    ];
    
    setLoopPhase((prev) => {
      const next = (prev + 1) % phases.length;
      setLoopLogs((logs) => [
        `🔄 Transition to: ${phases[next].name} - ${phases[next].desc}`,
        ...logs.slice(0, 5)
      ]);
      return next;
    });
  };

  const startStream = async () => {
    if (isStreaming) return;
    setIsStreaming(true);
    setStreamProgress(0);
    setStreamLog('Reading local source file chunks: [fs.createReadStream] initiated...');
    
    const chunks = ['Chunk #1 (16KB)', 'Chunk #2 (32KB)', 'Chunk #3 (48KB)', 'Chunk #4 (64KB)', 'Chunk #5 (80KB)'];
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      setStreamProgress(((i + 1) / chunks.length) * 100);
      
      if (isSlowWritable && i === 2) {
        setStreamLog(`⚠️ Backpressure Encountered: Writable response buffer full! Pausing readStream flows at ${chunks[i]}...`);
        await new Promise((r) => setTimeout(r, 2000));
        setStreamLog(`✅ Drain Event Fired: Writable buffers emptied. Resuming readStream pipe...`);
        await new Promise((r) => setTimeout(r, 1000));
      }
      
      setStreamLog(`Pipe Transfer: readableStream emitted data ➔ writing ${chunks[i]} to HTTP response...`);
    }
    
    await new Promise((r) => setTimeout(r, 800));
    setStreamLog('SUCCESS: readable.pipe(res) completed successfully. Streams closed.');
    setIsStreaming(false);
  };

  return (
    <div className="sim-container" style={{ minHeight: '440px' }}>
      <div className="sim-header">
        <h3 className="sim-title">Node Internals Execution Engine</h3>
        <span className="sim-badge">V8 & libuv</span>
      </div>

      {/* Selector Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        {['pool', 'loop', 'streams', 'require'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`sim-btn ${activeTab === tab ? '' : 'sim-btn--secondary'}`}
            style={{ flex: 1, fontSize: '10px', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {tab === 'pool' && 'Thread Pool'}
            {tab === 'loop' && 'Event Loop'}
            {tab === 'streams' && 'Streams'}
            {tab === 'require' && 'require() Wrapper'}
          </button>
        ))}
      </div>

      <div className="regex-sim" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Tab 1: Thread Pool */}
        {activeTab === 'pool' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="loop-sim">
              <div className="loop-sim__lane" style={{ minHeight: '90px' }}>
                <span className="loop-sim__lane-title">Main Call Stack (Single Thread)</span>
                <div className="loop-sim__item" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>JS Execution</div>
              </div>
              <div className="loop-sim__lane" style={{ minHeight: '90px' }}>
                <span className="loop-sim__lane-title">libuv Event Loop</span>
                <div className="loop-sim__item" style={{ borderColor: 'var(--accent)' }}>Orchestrator</div>
              </div>
            </div>

            <div>
              <span className="loop-sim__lane-title" style={{ fontSize: '11px', marginBottom: '6px', display: 'block' }}>
                Worker Thread Pool (Default size = 4, configurable via <code>UV_THREADPOOL_SIZE</code>)
              </span>
              <div className="threads-grid">
                {[1, 2, 3, 4].map((t, idx) => (
                  <div key={idx} className={`thread-card ${activeThread === idx ? 'thread-card--active' : ''}`}>
                    Thread #{t} {activeThread === idx ? '[Offloaded Task]' : '[Idle]'}
                  </div>
                ))}
              </div>
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
              <div className="note-block__console-title">libuv Console Logs</div>
              <div>{poolLog}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button onClick={() => runPoolTask('sync')} className="sim-btn sim-btn--secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>console.log() (Sync)</button>
              <button onClick={() => runPoolTask('os')} className="sim-btn sim-btn--secondary" style={{ fontSize: '11px', padding: '6px 12px' }}>HTTPS task (OS Kernel)</button>
              <button onClick={() => runPoolTask('Crypto Hash')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>pbkdf2 (Thread Pool)</button>
              <button onClick={() => runPoolTask('File IO')} className="sim-btn" style={{ fontSize: '11px', padding: '6px 12px' }}>fs.readFile (Thread Pool)</button>
            </div>
          </div>
        )}

        {/* Tab 2: Event Loop Phases */}
        {activeTab === 'loop' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="loop-sim__lane-title" style={{ fontSize: '11px' }}>Event Loop Phase Pipeline</span>
                {[
                  '1. Timers (setTimeout)',
                  '2. Pending Callbacks (I/O Errors)',
                  '3. Poll (Execute FS, Network callbacks)',
                  '4. Check (setImmediate)',
                  '5. Close Callbacks (socket close)'
                ].map((name, idx) => (
                  <div
                    key={idx}
                    className={`loop-sim__item`}
                    style={{
                      borderColor: loopPhase === idx ? 'var(--accent)' : 'var(--border)',
                      backgroundColor: loopPhase === idx ? 'var(--accent-bg)' : 'transparent',
                      fontWeight: loopPhase === idx ? 'bold' : 'normal',
                      padding: '8px',
                      fontSize: '11px'
                    }}
                  >
                    {name} {loopPhase === idx ? '◀ ACTIVE' : ''}
                  </div>
                ))}
              </div>

              <div style={{ width: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>Microtasks: nextTick</div>
                  <div style={{ fontSize: '10px', marginTop: '4px', fontFamily: 'var(--mono)', color: 'var(--accent)' }}>process.nextTick()</div>
                </div>
                <div style={{ padding: '8px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)' }}>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}>Microtasks: Promises</div>
                  <div style={{ fontSize: '10px', marginTop: '4px', fontFamily: 'var(--mono)', color: 'var(--accent)' }}>Promise.then()</div>
                </div>
                <div style={{ fontSize: '10px', opacity: 0.8, fontStyle: 'italic', lineHeight: '1.4' }}>
                  Microtask queues execute completely before transitioning to the next phase!
                </div>
              </div>
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '90px' }}>
              <div className="note-block__console-title">Tick Callback Outputs</div>
              <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>
                {loopLogs.join('\n') || 'Click "Advance Phase" to cycle the event loop.'}
              </pre>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={advanceLoopPhase} className="sim-btn">
                Advance Phase 🔄
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Streams & Backpressure */}
        {activeTab === 'streams' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              <strong>Streams:</strong> Processes files chunk-by-chunk instead of loading the entire file buffer into RAM.
            </div>
            
            <div style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '16px', backgroundColor: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>
                <span>[fs.createReadStream]</span>
                <span>[res.write / pipe]</span>
                <span>[Client Browser]</span>
              </div>
              <div style={{ height: '10px', backgroundColor: 'var(--border)', borderRadius: '99px', overflow: 'hidden', position: 'relative' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${streamProgress}%`, 
                    backgroundColor: 'var(--accent)', 
                    transition: 'width 0.4s ease' 
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                id="slowWritable" 
                checked={isSlowWritable} 
                onChange={(e) => setIsSlowWritable(e.target.checked)} 
              />
              <label htmlFor="slowWritable" style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-h)', cursor: 'pointer' }}>
                Simulate Backpressure (Slow Writable Socket buffer limit)
              </label>
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
              <div className="note-block__console-title">Buffer Stream pipe logs</div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>{streamLog}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={startStream} disabled={isStreaming} className="sim-btn">
                {isStreaming ? 'Streaming...' : 'Simulate Pipe Stream 🔗'}
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: How require() Works */}
        {activeTab === 'require' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              Every time you call <code>require()</code>, Node wraps and executes your code. Click steps to trace the engine workflow:
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
              {[
                { step: 1, name: '1. Path Resolve', desc: 'Finds absolute filepath coordinates.' },
                { step: 2, name: '2. Load File', desc: 'Reads source script content.' },
                { step: 3, name: '3. Wrap Function', desc: 'Wraps code in Wrapper function.' },
                { step: 4, name: '4. Execute Wrapper', desc: 'Runs function, injecting require and exports.' },
                { step: 5, name: '5. Cache result', desc: 'Stores module in require.cache for reuse.' }
              ].map((item) => (
                <button
                  key={item.step}
                  onClick={() => setRequireStep(item.step)}
                  className={`thread-card ${requireStep === item.step ? 'thread-card--active' : ''}`}
                  style={{ flex: 1, minWidth: '110px', border: '1px solid var(--border)', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.name}</div>
                  <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '4px' }}>{item.desc}</div>
                </button>
              ))}
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '90px' }}>
              <div className="note-block__console-title">Wrapper Template & Memory cache lookup</div>
              {requireStep === 0 && <div style={{ fontSize: '11px', opacity: 0.6 }}>Click a step box above to visualize Node wrapper bindings.</div>}
              {requireStep === 1 && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  🔍 Absolute path mapping:<br />
                  <code>require('./calculator') ➔ /Users/sidd/project/lib/calculator.js</code>
                </div>
              )}
              {requireStep === 2 && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  📂 File Loader:<br />
                  Reads calculator.js source text from filesystem block buffers into RAM memory modules.
                </div>
              )}
              {requireStep === 3 && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  🛡️ Function Wrapper Code:<br />
                  <pre style={{ margin: '8px 0', padding: '8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px', overflowX: 'auto' }}>
{`(function(exports, require, module, __filename, __dirname) {
  // Your calculator.js code lives here!
  module.exports = { add: (a,b) => a+b };
});`}
                  </pre>
                </div>
              )}
              {requireStep === 4 && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  ⚡ Code Execution:<br />
                  Node calls the compiled wrapper function, injecting the parameters and executing V8 machine code.
                </div>
              )}
              {requireStep === 5 && (
                <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>
                  💾 require.cache mapping:<br />
                  <code>require.cache['/Users/sidd/project/lib/calculator.js'] = module.exports</code><br />
                  Next lookup is instantaneous!
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


/* ==========================================================================
 * 17. MONGOOSE SCHEMA VALIDATOR SIMULATOR (topic: no-sql)
 * ========================================================================== */
export function MongooseMongoSimulator() {
  const [activeTab, setActiveTab] = useState('validation'); // validation, gridfs, sql, compass
  
  // Tab 1: Validation state
  const [tourName, setTourName] = useState('');
  const [tourPrice, setTourPrice] = useState('');
  const [collections, setCollections] = useState([
    { _id: '507f1f77bcf86cd799439011', name: 'The Forest Hiker', price: 497 },
    { _id: '507f1f77bcf86cd799439012', name: 'The Sea Explorer', price: 897 }
  ]);
  const [validationLog, setValidationLog] = useState('Enter values and click Insert to validate Mongoose models.');

  // Tab 2: GridFS state
  const [fileSizeMB, setFileSizeMB] = useState(1.2);
  const [gridfsLog, setGridfsLog] = useState('Enter file size and click "Upload to GridFS" to slice chunks.');
  const [gridfsChunks, setGridfsChunks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Tab 4: Compass state
  const [activeCommand, setActiveCommand] = useState('db.tours.find()');
  const [compassOutput, setCompassOutput] = useState([]);

  useEffect(() => {
    // Sync Compass outputs on mount or collection changes
    runCompassQuery(activeCommand);
  }, [collections, activeCommand]);

  const handleInsert = () => {
    if (!tourName) {
      setValidationLog('❌ Mongoose Validation Error: Tour Name is a required field!');
      return;
    }
    if (!tourPrice || isNaN(tourPrice) || Number(tourPrice) <= 0) {
      setValidationLog('❌ Mongoose Validation Error: Tour Price must be a positive number!');
      return;
    }

    const docId = Math.random().toString(16).substring(2, 14);
    const newDoc = { _id: docId, name: tourName, price: Number(tourPrice) };

    setCollections([...collections, newDoc]);
    setTourName('');
    setTourPrice('');
    setValidationLog(`✅ Tour document successfully validated and written to MongoDB Collection as BSON!`);
  };

  const uploadToGridFS = async () => {
    setIsUploading(true);
    setGridfsChunks([]);
    setGridfsLog(`Checking BSON limits: File size is ${fileSizeMB} MB...`);
    
    await new Promise(r => setTimeout(r, 800));

    if (fileSizeMB <= 16) {
      setGridfsLog(`ℹ️ Note: File size ${fileSizeMB} MB fits within the 16 MB BSON document limit. Direct BSON insert is supported, but storing as GridFS is recommended for large binary assets.`);
    } else {
      setGridfsLog(`⚠️ Warning: File size ${fileSizeMB} MB exceeds the 16 MB BSON limit! MongoDB WILL reject a single BSON document insert. Forcing GridFS chunking...`);
    }

    await new Promise(r => setTimeout(r, 1200));

    const totalKBs = Math.round(fileSizeMB * 1024);
    const chunkSizeKB = 255;
    const numChunks = Math.ceil(totalKBs / chunkSizeKB);
    
    setGridfsLog(`Slicing Binary: Splitting ${totalKBs} KB file into chunks of ${chunkSizeKB} KB each...`);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const chunksList = [];
    for (let i = 1; i <= Math.min(numChunks, 8); i++) {
      chunksList.push({ id: i, size: i === numChunks ? (totalKBs % chunkSizeKB || chunkSizeKB) : chunkSizeKB });
    }
    setGridfsChunks(chunksList);
    
    setGridfsLog(`SUCCESS: Uploaded ${numChunks} chunks to fs.chunks collection. File metadata saved in fs.files. Reassembled automatically on fetch!`);
    setIsUploading(false);
  };

  const runCompassQuery = (cmd) => {
    if (cmd === 'db.tours.find()') {
      setCompassOutput(collections);
    } else if (cmd === 'db.tours.find({ price: { $lte: 500 } })') {
      setCompassOutput(collections.filter(c => c.price <= 500));
    } else if (cmd === 'db.tours.find({ price: { $gt: 500 } })') {
      setCompassOutput(collections.filter(c => c.price > 500));
    }
  };

  return (
    <div className="sim-container" style={{ minHeight: '440px' }}>
      <div className="sim-header">
        <h3 className="sim-title">MongoDB & Mongoose Schema Engine</h3>
        <span className="sim-badge">ODM Layer</span>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px' }}>
        {['validation', 'gridfs', 'sql', 'compass'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`sim-btn ${activeTab === tab ? '' : 'sim-btn--secondary'}`}
            style={{ flex: 1, fontSize: '10px', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {tab === 'validation' && 'Mongoose Schema'}
            {tab === 'gridfs' && 'GridFS Chunks'}
            {tab === 'sql' && 'SQL vs NoSQL'}
            {tab === 'compass' && 'Compass Shell'}
          </button>
        ))}
      </div>

      <div className="regex-sim" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Tab 1: Validation */}
        {activeTab === 'validation' && (
          <div className="css-sim" style={{ width: '100%' }}>
            <div className="css-sim__controls">
              <div className="regex-sim__field">
                <label className="css-sim__slider-label">Tour Name</label>
                <input type="text" value={tourName} onChange={(e) => setTourName(e.target.value)} className="regex-sim__input" placeholder="e.g. Forest Hiker" />
              </div>
              <div className="regex-sim__field">
                <label className="css-sim__slider-label">Price ($)</label>
                <input type="text" value={tourPrice} onChange={(e) => setTourPrice(e.target.value)} className="regex-sim__input" placeholder="e.g. 497" />
              </div>
              <button onClick={handleInsert} className="sim-btn" style={{ marginTop: '12px' }}>Insert Document</button>
            </div>
            <div className="regex-sim">
              <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px' }}>{validationLog}</div>
              </div>
              <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', flexGrow: 1, minHeight: '120px' }}>
                <div className="note-block__console-title">MongoDB Collection: db.tours.find()</div>
                <pre style={{ fontSize: '11px', fontFamily: 'var(--mono)', margin: 0 }}>
                  {JSON.stringify(collections, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GridFS */}
        {activeTab === 'gridfs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              BSON documents are limited to **16 MB**. Larger files are split into **255 KB** chunks using **GridFS**:
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Mock File Size:</span>
              <input 
                type="number" 
                value={fileSizeMB} 
                onChange={(e) => setFileSizeMB(Number(e.target.value))} 
                step="0.5"
                style={{ width: '80px', padding: '6px', border: '1px solid var(--border)', borderRadius: '6px', backgroundColor: 'var(--bg)', color: 'var(--text-h)' }}
              />
              <span style={{ fontSize: '12px' }}>MB</span>
              <button onClick={uploadToGridFS} disabled={isUploading} className="sim-btn">
                {isUploading ? 'Uploading...' : 'Upload to GridFS 🚀'}
              </button>
            </div>

            {gridfsChunks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="loop-sim__lane-title" style={{ fontSize: '11px' }}>fs.chunks collection (Visualized Chunks Partitioning)</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {gridfsChunks.map((chunk) => (
                    <div 
                      key={chunk.id} 
                      className="loop-sim__item" 
                      style={{ 
                        flex: '1 0 80px', 
                        fontSize: '9px', 
                        borderColor: 'var(--accent)', 
                        textAlign: 'center', 
                        padding: '6px',
                        backgroundColor: 'var(--accent-bg)'
                      }}
                    >
                      📦 Chunk #{chunk.id}<br />({chunk.size} KB)
                    </div>
                  ))}
                  {fileSizeMB * 1024 / 255 > 8 && (
                    <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: '11px', opacity: 0.6 }}>
                      ... and {Math.ceil((fileSizeMB * 1024) / 255) - 8} more chunks
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
              <div className="note-block__console-title">GridFS Engine Logger</div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--mono)' }}>{gridfsLog}</div>
            </div>
          </div>
        )}

        {/* Tab 3: SQL vs NoSQL mapping */}
        {activeTab === 'sql' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text)', lineHeight: '1.5' }}>
              Relational SQL tables vs document BSON MongoDB structures:
            </div>
            
            <table className="scope-sim__table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className="scope-sim__th">SQL Concepts (Relational)</th>
                  <th className="scope-sim__th">MongoDB Concepts (BSON Documents)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>Table</td>
                  <td className="scope-sim__td">Collection (Flexible schema)</td>
                </tr>
                <tr>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>Row / Tuple</td>
                  <td className="scope-sim__td">Document (Stored as BSON object)</td>
                </tr>
                <tr>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>Column / Field</td>
                  <td className="scope-sim__td">Field (Key-value property)</td>
                </tr>
                <tr>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>Primary Key</td>
                  <td className="scope-sim__td">Object ID (Autogenerated 12-byte hex <code>_id</code>)</td>
                </tr>
                <tr>
                  <td className="scope-sim__td" style={{ fontWeight: 'bold' }}>Foreign Key Join</td>
                  <td className="scope-sim__td">Embedding (Nested JSON) / Referencing + Populate</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Compass CRUD Console */}
        {activeTab === 'compass' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                'db.tours.find()',
                'db.tours.find({ price: { $lte: 500 } })',
                'db.tours.find({ price: { $gt: 500 } })'
              ].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setActiveCommand(cmd);
                    runCompassQuery(cmd);
                  }}
                  className={`sim-btn ${activeCommand === cmd ? '' : 'sim-btn--secondary'}`}
                  style={{ fontSize: '10px', padding: '6px 12px', fontFamily: 'var(--mono)' }}
                >
                  {cmd}
                </button>
              ))}
            </div>

            <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', flexGrow: 1, minHeight: '140px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '4px', marginBottom: '8px' }}>
                <span className="note-block__console-title">MongoDB Compass shell output</span>
                <span style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'var(--mono)' }}>natours_db ➔ db.tours</span>
              </div>
              <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'var(--mono)', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(compassOutput, null, 2)}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ==========================================================================
 * 18. GIT PRODUCTION DEPLOYMENT PIPELINE (topic: deployment)
 * ========================================================================== */
export function DeploymentSimulator() {
  const [activeStep, setActiveStep] = useState(-1);
  const [log, setLog] = useState('Click Deploy App to start Production Build.');

  const runBuild = async () => {
    const steps = [
      'Git Push triggered: uploading assets to Git remote branches.',
      'CI/CD checks: running lint constraints and NPM package installations.',
      'Vite bundle compiler: minifying CSS variables and splitting JS chunks.',
      'Environment bindings loaded: reading secret port keys.',
      'Deployment complete: notes playground live on Netlify servers!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      setLog(steps[i]);
      await new Promise(r => setTimeout(r, 1200));
    }
    setActiveStep(-1);
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Git Production CI/CD Pipeline</h3>
        <span className="sim-badge">Deployment</span>
      </div>
      <div className="express-sim">
        <div className="express-sim__pipeline">
          {['Git Hook', 'Lint Checks', 'Webpack Bundling', 'Live server'].map((node, idx) => (
            <div key={idx} className={`express-sim__node ${activeStep === idx ? 'express-sim__node--active' : ''}`}>{node}</div>
          ))}
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
          <div className="note-block__console-title">Build Server CLI Output</div>
          <div>{log}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={runBuild} disabled={activeStep !== -1} className="sim-btn">
            {activeStep === -1 ? 'Deploy App' : 'Building...'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 19. PROBLEM SOLVING PATTERNS (topic: patterns)
 * ========================================================================== */
export function PatternsSimulator() {
  const [array] = useState([2, 5, 8, 1, 9, 3, 7]);
  const [mode, setMode] = useState('window'); // window, pointers
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(6);
  const [winStart, setWinStart] = useState(0);

  const stepPatterns = () => {
    if (mode === 'pointers') {
      if (left < right) {
        setLeft(prev => prev + 1);
        setRight(prev => prev - 1);
      } else {
        setLeft(0);
        setRight(6);
      }
    } else {
      if (winStart < 4) {
        setWinStart(prev => prev + 1);
      } else {
        setWinStart(0);
      }
    }
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Algorithm Patterns Simulator</h3>
        <span className="sim-badge">DSA Patterns</span>
      </div>
      <div className="node-sim">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMode('window')} className={`sim-btn ${mode === 'window' ? '' : 'sim-btn--secondary'}`} style={{ flex: 1 }}>Sliding Window</button>
          <button onClick={() => setMode('pointers')} className={`sim-btn ${mode === 'pointers' ? '' : 'sim-btn--secondary'}`} style={{ flex: 1 }}>Two Pointers</button>
        </div>
        <div className="node-sim__display">
          <div className="node-sim__list">
            {array.map((val, idx) => {
              let isHighlighted = false;
              let pointerLabel = '';
              
              if (mode === 'pointers') {
                if (idx === left) { isHighlighted = true; pointerLabel = 'L'; }
                if (idx === right) { isHighlighted = true; pointerLabel = 'R'; }
              } else {
                if (idx >= winStart && idx < winStart + 3) { isHighlighted = true; }
              }

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="node-sim__node" style={{ backgroundColor: isHighlighted ? 'var(--accent)' : 'var(--accent-bg)', color: isHighlighted ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}>
                    {val}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', height: '15px' }}>{pointerLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="array-sim__controls">
          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
            {mode === 'pointers' ? `Pointers at index L:${left} and R:${right}` : `Window bounding indices ${winStart} to ${winStart + 2}`}
          </span>
          <button onClick={stepPatterns} className="sim-btn">Step Progress</button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 20. BINARY HEAP VISUALIZER (topic: heaps)
 * ========================================================================== */
export function HeapSimulator() {
  const [heap] = useState([95, 75, 80, 55, 60, 45, 50]);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Max-Binary Heap Array Tree</h3>
        <span className="sim-badge">Binary Heap</span>
      </div>
      <div className="node-sim">
        <div className="node-sim__display" style={{ minHeight: '220px' }}>
          <div className="node-sim__list">
            {heap.map((val, idx) => (
              <div key={idx} className="node-sim__node" style={{ borderRadius: '50%', width: '42px', height: '42px', justifyContent: 'center' }}>
                {val}
              </div>
            ))}
          </div>
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', width: '100%' }}>
          <div className="note-block__console-title">Parent/Child Index Math Relations</div>
          <div style={{ fontSize: '12px', fontFamily: 'var(--mono)' }}>
            Left child = 2 * index + 1 | Right child = 2 * index + 2 | Parent = Math.floor((index - 1) / 2)
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 21. HASH TABLE COLLISIONS (topic: hash-tables)
 * ========================================================================== */
export function HashTableSimulator() {
  const [buckets, setBuckets] = useState(Array(8).fill(null).map(() => []));
  const [keyInput, setKeyInput] = useState('');
  const [valInput, setValInput] = useState('');
  const [status, setStatus] = useState('Type a key and value to hash insert.');

  const handleHashInsert = () => {
    if (!keyInput || !valInput) return;
    // Simple hash sum
    let hash = 0;
    for (let i = 0; i < keyInput.length; i++) hash += keyInput.charCodeAt(i);
    const bucketIdx = hash % 8;

    const copy = [...buckets];
    copy[bucketIdx] = [...copy[bucketIdx], { key: keyInput, val: valInput }];
    
    setBuckets(copy);
    setKeyInput('');
    setValInput('');
    setStatus(`Hashed key "${keyInput}" to bucket index: ${bucketIdx} (hash sum: ${hash})`);
  };

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">Hash Table separate Chaining</h3>
        <span className="sim-badge">Hash Tables</span>
      </div>
      <div className="css-sim">
        <div className="css-sim__controls">
          <div className="regex-sim__field">
            <label className="css-sim__slider-label">Key</label>
            <input type="text" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} className="regex-sim__input" placeholder="e.g. name" />
          </div>
          <div className="regex-sim__field">
            <label className="css-sim__slider-label">Value</label>
            <input type="text" value={valInput} onChange={(e) => setValInput(e.target.value)} className="regex-sim__input" placeholder="e.g. jonas" />
          </div>
          <button onClick={handleHashInsert} className="sim-btn" style={{ marginTop: '8px' }}>Hash Insert</button>
        </div>
        <div className="regex-sim">
          <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)' }}>
            <div>{status}</div>
          </div>
          <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', maxHeight: '180px', overflowY: 'auto' }}>
            {buckets.map((b, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', padding: '6px 0', fontSize: '12px' }}>
                <strong style={{ width: '80px' }}>Bucket #{idx}:</strong>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {b.map((item, i) => (
                    <span key={i} style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontFamily: 'var(--mono)', fontSize: '11px' }}>
                      {item.key}: {item.val}
                    </span>
                  ))}
                  {b.length === 0 && <span style={{ opacity: 0.5 }}>empty</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
 * 22. ADVANCED DSA INTERACTIVE FLASHCARDS (topic: advanced / cheatsheets)
 * ========================================================================== */
export function CheatSheetSimulator() {
  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    { title: 'Graph Dijkstra Complexity', term: 'O((V + E) log V)', desc: 'Finds the shortest path on a weighted graph using a Priority Queue / Heap.' },
    { title: 'Binary Search Bounds', term: 'O(log N)', desc: 'Halves search intervals at every step. Requires pre-sorted arrays.' },
    { title: 'Dynamic Programming Memo', term: 'O(N) Time, O(N) Space', desc: 'Saves sub-problems in a cache array to skip overlapping recursion branches.' },
    { title: 'Tree traversals', term: 'Inorder = Left, Root, Right', desc: 'Traverses complete BST node chains in sorted ascending numerical order.' }
  ];

  return (
    <div className="sim-container">
      <div className="sim-header">
        <h3 className="sim-title">DSA Flashcard Interview Prep</h3>
        <span className="sim-badge">Cheat Sheets</span>
      </div>
      <div className="regex-sim">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cards.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCard(idx)}
              className={`sim-btn ${selectedCard === idx ? '' : 'sim-btn--secondary'}`}
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              {c.title}
            </button>
          ))}
        </div>
        <div className="note-block__console" style={{ backgroundColor: 'var(--bg)', color: 'var(--text-h)', border: '1px solid var(--border)', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '8px' }}>
            {cards[selectedCard].term}
          </div>
          <div style={{ fontSize: '13px', opacity: 0.8 }}>
            {cards[selectedCard].desc}
          </div>
        </div>
      </div>
    </div>
  );
}
