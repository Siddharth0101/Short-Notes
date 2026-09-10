'use strict';

/**
 * ========================================================================
 * 06. DESIGN SYSTEMS & ADVANCED COMPONENT ARCHITECTURE [⚡ CHIRAG GOEL]
 * ========================================================================
 * SOURCE: Chirag Goel (Frontend System Design)
 *
 * WHAT IS A PRODUCTION DESIGN SYSTEM?
 * - A single source of truth connecting designers and developers:
 *   Design Tokens ──► Primitive Atoms ──► Compound Organisms ──► Full App Layouts.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     ATOMIC DESIGN METHODOLOGY                       │
 * │                                                                     │
 * │  Atoms      ──► Button, Input, Icon, Typography Text                │
 * │  Molecules  ──► SearchBar (Input + Button + Icon)                   │
 * │  Organisms  ──► Navbar (Logo + SearchBar + UserMenu + Cart)         │
 * │  Templates  ──► Dashboard Layout (Sidebar + Header + Content Slot)  │
 * │  Pages      ──► Final page with live API data hydrated              │
 * └─────────────────────────────────────────────────────────────────────┘
 */

/**
 * ========================================================================
 * 1. DESIGN TOKENS (CSS VARIABLES)
 * ========================================================================
 * - Abstract design decisions (colors, radii, spacing, fonts) into tokens.
 * - Enables instant theming (Dark Mode, High Contrast, Brand Reskinning).
 */

// Design Tokens definition simulation
const designTokens = {
  colors: {
    brandPrimary: '#6366f1',
    brandSuccess: '#10b981',
    brandDanger: '#ef4444',
    bgDark: '#0f172a',
    textLight: '#f8fafc'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    full: '9999px'
  }
};

console.log('--- Design Tokens Palette ---');
console.log('Primary brand color:', designTokens.colors.brandPrimary);
console.log('Base spacing unit:', designTokens.spacing.md);

/**
 * ========================================================================
 * 2. COMPOUND COMPONENTS PATTERN (LLD PATTERN)
 * ========================================================================
 * - Used by Radix UI, Headless UI, and modern React libraries.
 * - Components share state implicitly via React Context without prop drilling.
 *
 * Example:
 * ```jsx
 * <Accordion defaultOpen={0}>
 *   <Accordion.Item index={0}>
 *     <Accordion.Header>What is LLD?</Accordion.Header>
 *     <Accordion.Body>Low-Level Design focuses on component APIs...</Accordion.Body>
 *   </Accordion.Item>
 * </Accordion>
 * ```
 */

/**
 * ========================================================================
 * 3. ACCESSIBILITY (A11Y) & FOCUS TRAPPING
 * ========================================================================
 * Top requirements for accessible UI (WCAG 2.1 AA):
 * 1. Keyboard Navigation: All interactive elements reachable via `Tab`, triggered via `Enter` / `Space`.
 * 2. Focus Trap in Modals:
 *    - When modal opens, focus moves inside the modal.
 *    - Pressing `Tab` cycles focus ONLY inside modal elements (never escapes to body).
 *    - Pressing `Escape` closes the modal and returns focus to the trigger button!
 * 3. Screen Readers: `aria-expanded`, `aria-label`, `aria-live="polite"` for dynamic content alerts.
 */

// Focus Trap cycle simulator in pure JS
function simulateFocusTrapCycle(focusableElements) {
  let currentIndex = 0;

  return {
    getCurrentElement: () => focusableElements[currentIndex],
    tabForward: () => {
      currentIndex = (currentIndex + 1) % focusableElements.length;
      return focusableElements[currentIndex];
    },
    tabBackward: () => {
      currentIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      return focusableElements[currentIndex];
    }
  };
}

const modalTrap = simulateFocusTrapCycle(['ModalCloseBtn', 'NameInput', 'SubmitBtn']);
console.log('--- Modal Focus Trap Traversal ---');
console.log('Initial focus:', modalTrap.getCurrentElement());
console.log('Tab 1:', modalTrap.tabForward());
console.log('Tab 2:', modalTrap.tabForward());
console.log('Tab 3 (Trapped, loops back to first!):', modalTrap.tabForward());

/**
 * ========================================================================
 * 4. MICRO-FRONTENDS & MODULE FEDERATION
 * ========================================================================
 * - Decomposing a large frontend monolith into autonomous, independently deployable micro-apps.
 * - Module Federation (Webpack 5 / Vite):
 *   - Host App dynamically downloads and mounts Remote App components at runtime over HTTP!
 *   - Shared dependencies (e.g. `react`, `react-dom`) loaded only once across all micro-apps.
 */
