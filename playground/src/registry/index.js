import { lazy } from 'react';

// Custom visualizer metadata overrides
const CUSTOM_VISUALIZERS = {
  'jira-modal-persist': {
    description: 'Demonstrates URL search parameter state persistence. Open a ticket modal, refresh the browser, and see the same modal automatically restored.',
    tag: 'URL State',
    readTime: '5 mins'
  },
  'closure-visualizer': {
    description: 'Step-by-step interactive simulator to trace execution contexts, lexical scope chains, and closure memory spaces.',
    tag: 'Scope Chain',
    readTime: '10 mins'
  },
  'bubble-sort-visualizer': {
    description: 'Interactive grid rendering an array as bars. Control execution speeds and watch swaps and comparisons update colors in real-time.',
    tag: 'Sorting',
    readTime: '8 mins'
  },
  'http-client-flow': {
    description: 'Simulate the lifecycle of an HTTP request. Trace execution paths through Client headers, network routing, server middleware, and controllers.',
    tag: 'Network Flow',
    readTime: '12 mins'
  },
  'html-css-interview-masterclass': {
    description: 'Complete 100% comprehensive answers for all HTML & CSS interview questions with interactive simulators, code snippets, and visual layout diagrams.',
    tag: 'HTML & CSS Masterclass',
    readTime: '20 mins'
  },
  '02-html-css-interview-questions': {
    description: 'Comprehensive HTML & CSS interview question bank with code playgrounds, interactive visualizer tabs, and detailed notes.',
    tag: 'Interview Notes',
    readTime: '20 mins'
  }
};

// Scan domain subdirectories for note files (using Vite dynamic raw glob loaders)
const javascriptFiles = import.meta.glob('../../../01_JavaScript/**/*.js', { query: '?raw' });
const dsaFiles = import.meta.glob('../../../02_Dsa/**/*.js', { query: '?raw' });
const frontendFiles = import.meta.glob('../../../03_Frontend/**/*.js', { query: '?raw' });
const backendFiles = import.meta.glob('../../../04_Backend/**/*.js', { query: '?raw' }); // Force HMR 2

// Scan interview directory for visualizer components
const interviewFiles = import.meta.glob('../../../05_Interview/**/*.jsx');

function formatTitle(str) {
  return str
    .replace(/_/g, ' ')
    .replace(/,/g, ', ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function formatDirectoryLabel(folderName) {
  const numberMatch = folderName.match(/^(\d+)_/);
  const prefix = numberMatch ? `${numberMatch[1]}. ` : '';
  const cleanLabel = folderName.replace(/^\d+_/, '').replace(/_/g, ' ');
  const formattedLabel = cleanLabel
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return `${prefix}${formattedLabel}`;
}

function buildTree(files, domainPrefix) {
  const root = { name: 'Root', type: 'directory', children: {} };

  Object.entries(files).forEach(([filePath, importer]) => {
    // filePath: "../../../04_Backend/01_Node/02_NODE_FOUNDATIONS/Node_NPM_Core_Modules.js"
    const parts = filePath.split('/');
    const domainIdx = parts.indexOf(domainPrefix);
    if (domainIdx === -1) return;
    
    // relativeParts: ['01_Node', '02_NODE_FOUNDATIONS', 'Node_NPM_Core_Modules.js']
    const relativeParts = parts.slice(domainIdx + 1);
    
    let current = root;
    relativeParts.forEach((part, index) => {
      const isFile = index === relativeParts.length - 1;
      
      if (isFile) {
        const isJsx = part.endsWith('.jsx');
        const cleanName = part.replace(/\.(js|jsx)$/, '');
        const scenarioId = cleanName.toLowerCase().replace(/_/g, '-').replace(/,/g, '-');
        
        let component = null;
        if (isJsx) {
          component = lazy(() => importer().then((m) => ({ default: m.default || Object.values(m)[0] })));
        } else {
          // Resolve manual overrides for raw js notes
          if (scenarioId === 'closure-visualizer') {
            component = lazy(() => import('../../../05_Interview/01_JavaScript/01_Closures/ClosureVisualizer.jsx'));
          } else if (scenarioId === 'bubble-sort-visualizer') {
            component = lazy(() => import('../../../05_Interview/02_Dsa/01_Sorting/BubbleSortVisualizer.jsx'));
          } else if (scenarioId === 'jira-modal-persist') {
            component = lazy(() => import('../../../05_Interview/03_Frontend/01_React_Routing/Jira_Modal_Refresh_Persist.jsx').then(m => ({ default: m.ActiveSprintReactRouter })));
          } else if (scenarioId === 'http-client-flow') {
            component = lazy(() => import('../../../05_Interview/04_Backend/01_Http_Client/HttpClientVisualizer.jsx'));
          }
        }

        const customOverride = CUSTOM_VISUALIZERS[scenarioId];

        current.children[part] = {
          id: scenarioId,
          title: formatTitle(cleanName),
          description: customOverride ? customOverride.description : `Interactive script runner and notes for ${cleanName.toLowerCase().replace(/_/g, ' ')}.`,
          tag: customOverride ? customOverride.tag : 'Notes & Script',
          readTime: customOverride ? customOverride.readTime : '6 mins',
          type: 'file',
          fetchFile: isJsx ? null : importer,
          component: component
        };
      } else {
        if (!current.children[part]) {
          current.children[part] = {
            name: formatDirectoryLabel(part),
            slug: part.toLowerCase().replace(/_/g, '-'),
            type: 'directory',
            children: {}
          };
        }
        current = current.children[part];
      }
    });
  });

  return root;
}

export const DOMAINS = {
  javascript: {
    id: 'javascript',
    name: '01. JavaScript Playgrounds',
    description: 'Explore visual simulators for scopes, closures, execution contexts, and OOP rules.',
    icon: '🟨',
    tree: buildTree(javascriptFiles, '01_JavaScript')
  },
  dsa: {
    id: 'dsa',
    name: '02. DSA Visualizers',
    description: 'Animate and interact with sorting, recursion, heaps, graphs, and search algorithms.',
    icon: '🟦',
    tree: buildTree(dsaFiles, '02_Dsa')
  },
  frontend: {
    id: 'frontend',
    name: '03. Frontend Scenarios',
    description: 'Run interactive responsive designs, CSS layouts, and advanced UI state actions.',
    icon: '🟧',
    tree: buildTree(frontendFiles, '03_Frontend')
  },
  backend: {
    id: 'backend',
    name: '04. Backend & APIs',
    description: 'Visualize backend request routing, HTTP client connections, and Node internals.',
    icon: '🟩',
    tree: buildTree(backendFiles, '04_Backend')
  },
  interview: {
    id: 'interview',
    name: '05. Interview Questions',
    description: 'Explore premium scenario-based visualizers, machine coding challenges, and mock flows.',
    icon: '💼',
    tree: buildTree(interviewFiles, '05_Interview')
  }
};

export const DOMAIN_LIST = Object.values(DOMAINS);

export function getDomainById(id) {
  return DOMAINS[id] || null;
}

export function countFiles(node) {
  if (!node) return 0;
  if (node.type === 'file') return 1;
  let count = 0;
  Object.values(node.children).forEach((child) => {
    count += countFiles(child);
  });
  return count;
}

export function getContentsSorted(dirNode) {
  if (!dirNode || !dirNode.children) return [];
  
  return Object.entries(dirNode.children)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, undefined, { numeric: true }))
    .map(([_, val]) => val);
}

export function getNodeBySplatPath(domainId, splat) {
  const domain = getDomainById(domainId);
  if (!domain || !domain.tree) return null;
  if (!splat) return domain.tree;

  const segments = splat.split('/').filter(Boolean);
  let current = domain.tree;

  for (const segment of segments) {
    if (!current.children) return null;
    const found = Object.values(current.children).find(
      (child) => child.slug === segment || child.id === segment
    );
    if (!found) return null;
    current = found;
  }

  return current;
}
