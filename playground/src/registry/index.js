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
  }
};

// Scan domain subdirectories for note files (using Vite dynamic raw glob loaders)
const javascriptFiles = import.meta.glob('../../../01_JavaScript/**/*.js', { query: '?raw' });
const dsaFiles = import.meta.glob('../../../02_Dsa/**/*.js', { query: '?raw' });
const frontendFiles = import.meta.glob('../../../03_Frontend/**/*.js', { query: '?raw' });
const backendFiles = import.meta.glob('../../../04_Backend/**/*.js', { query: '?raw' });

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

function parseGlob(files) {
  const topicsMap = {};

  Object.entries(files).forEach(([filePath, importer]) => {
    const parts = filePath.split('/');
    if (parts.length < 5) return;
    
    const topicFolderName = parts[parts.length - 2];
    const fileName = parts[parts.length - 1];
    
    const numberMatch = topicFolderName.match(/^(\d+)_/);
    const prefix = numberMatch ? `${numberMatch[1]}. ` : '';
    const cleanLabel = topicFolderName.replace(/^\d+_/, '').replace(/_/g, ' ');
    const formattedLabel = cleanLabel
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    
    const topicLabel = `${prefix}${formattedLabel}`;
    const topicSlug = topicFolderName.toLowerCase().replace(/_/g, '-');
    
    const scenarioId = fileName.replace(/\.js$/, '').toLowerCase().replace(/_/g, '-').replace(/,/g, '-');
    const scenarioTitle = formatTitle(fileName.replace(/\.js$/, ''));
    
    if (!topicsMap[topicFolderName]) {
      topicsMap[topicFolderName] = {
        topic: topicLabel,
        slug: topicSlug,
        scenarios: []
      };
    }
    
    // Resolve components if override is defined
    let component = null;
    if (scenarioId === 'closure-visualizer') {
      component = lazy(() => import('../../../05_Interview/01_JavaScript/01_Closures/ClosureVisualizer.jsx'));
    } else if (scenarioId === 'bubble-sort-visualizer') {
      component = lazy(() => import('../../../05_Interview/02_Dsa/01_Sorting/BubbleSortVisualizer.jsx'));
    } else if (scenarioId === 'jira-modal-persist') {
      component = lazy(() => import('../../../05_Interview/03_Frontend/01_React_Routing/Jira_Modal_Refresh_Persist.jsx').then(m => ({ default: m.ActiveSprintReactRouter })));
    } else if (scenarioId === 'http-client-flow') {
      component = lazy(() => import('../../../05_Interview/04_Backend/01_Http_Client/HttpClientVisualizer.jsx'));
    }

    const customOverride = CUSTOM_VISUALIZERS[scenarioId];
    
    topicsMap[topicFolderName].scenarios.push({
      id: scenarioId,
      title: scenarioTitle,
      description: customOverride ? customOverride.description : `Interactive script runner and notes for ${scenarioTitle.toLowerCase()}.`,
      tag: customOverride ? customOverride.tag : 'Notes & Script',
      readTime: customOverride ? customOverride.readTime : '6 mins',
      fetchFile: importer,
      component: component
    });
  });

  return Object.entries(topicsMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, undefined, { numeric: true }))
    .map(([_, data]) => data);
}

function parseInterviewGlob(files) {
  const topicsMap = {};

  Object.entries(files).forEach(([filePath, importer]) => {
    const parts = filePath.split('/');
    if (parts.length < 6) return;
    
    // Group by category folders under 05_Interview: parts[4]
    const topicFolderName = parts[4];
    const fileName = parts[parts.length - 1];
    
    const numberMatch = topicFolderName.match(/^(\d+)_/);
    const prefix = numberMatch ? `${numberMatch[1]}. ` : '';
    const cleanLabel = topicFolderName.replace(/^\d+_/, '').replace(/_/g, ' ');
    const formattedLabel = cleanLabel
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
    
    const topicLabel = `${prefix}${formattedLabel}`;
    const topicSlug = topicFolderName.toLowerCase().replace(/_/g, '-');
    
    const scenarioId = fileName.replace(/\.jsx$/, '').toLowerCase().replace(/_/g, '-');
    const scenarioTitle = formatTitle(fileName.replace(/\.jsx$/, ''));
    
    if (!topicsMap[topicFolderName]) {
      topicsMap[topicFolderName] = {
        topic: topicLabel,
        slug: topicSlug,
        scenarios: []
      };
    }
    
    const customOverride = CUSTOM_VISUALIZERS[scenarioId];
    
    topicsMap[topicFolderName].scenarios.push({
      id: scenarioId,
      title: scenarioTitle,
      description: customOverride ? customOverride.description : `Interactive interview question for ${scenarioTitle.toLowerCase()}.`,
      tag: customOverride ? customOverride.tag : 'Interview Scenario',
      readTime: customOverride ? customOverride.readTime : '8 mins',
      fetchFile: null,
      component: lazy(() => importer().then((m) => ({ default: m.default || Object.values(m)[0] })))
    });
  });

  return Object.entries(topicsMap)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB, undefined, { numeric: true }))
    .map(([_, data]) => data);
}

export const DOMAINS = {
  javascript: {
    id: 'javascript',
    name: '01. JavaScript Playgrounds',
    description: 'Explore visual simulators for scopes, closures, execution contexts, and OOP rules.',
    icon: '🟨',
    topics: parseGlob(javascriptFiles)
  },
  dsa: {
    id: 'dsa',
    name: '02. DSA Visualizers',
    description: 'Animate and interact with sorting, recursion, heaps, graphs, and search algorithms.',
    icon: '🟦',
    topics: parseGlob(dsaFiles)
  },
  frontend: {
    id: 'frontend',
    name: '03. Frontend Scenarios',
    description: 'Run interactive responsive designs, CSS layouts, and advanced UI state actions.',
    icon: '🟧',
    topics: parseGlob(frontendFiles)
  },
  backend: {
    id: 'backend',
    name: '04. Backend & APIs',
    description: 'Visualize backend request routing, HTTP client connections, and Node internals.',
    icon: '🟩',
    topics: parseGlob(backendFiles)
  },
  interview: {
    id: 'interview',
    name: '05. Interview Questions',
    description: 'Explore premium scenario-based visualizers, machine coding challenges, and mock flows.',
    icon: '💼',
    topics: parseInterviewGlob(interviewFiles)
  }
};

export const DOMAIN_LIST = Object.values(DOMAINS);

export function getDomainById(id) {
  return DOMAINS[id] || null;
}

export function getTopicBySlug(domainId, slug) {
  const domain = getDomainById(domainId);
  return domain?.topics.find((t) => t.slug === slug) || null;
}

export function getAllScenarios() {
  const list = [];
  DOMAIN_LIST.forEach((domain) => {
    domain.topics.forEach((topic) => {
      topic.scenarios.forEach((scenario) => {
        list.push({
          ...scenario,
          domainId: domain.id,
          topicSlug: topic.slug,
          badge: topic.topic
        });
      });
    });
  });
  return list;
}
