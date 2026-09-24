/**
 * ## Quick revision
 *
 * - Composition — small components ko `children`/props se jodo.
 * - Container — data/control sambhalo; presentational component UI dikhaye.
 * - Compound components — related parts shared contract/state ke saath kaam karein.
 * - Controlled API — parent state own kare; uncontrolled API — component own kare.
 * - CSS Modules — class names scoped; global styles ka accidental clash kam.
 * - Tailwind — utility classes se style; repeated pattern ko readable rakho.
 * - Styled components — component ke saath styles; runtime/build tradeoff dekho.
 * - Accessibility — reusable component mein label, keyboard aur focus contract rakho.
 * - Testing Library — user ke visible behavior se tests likho.
 * - Query — accessible role/name prefer; implementation selector se bacho.
 * - User event — realistic typing/click; async interaction await karo.
 * - `findBy` — async appearance; `queryBy` — absence check.
 * - Mock network — loading, error, retry aur out-of-order response cover karo.
 * - Accessibility — semantic HTML, labels, contrast aur keyboard flow.
 * - Focus — modal/route/error ke baad focus meaningful jagah par rahe.
 * - Coverage — line percentage se zyada important user journeys aur failure cases.
 * - Design token — shared colors/spacing/type values; theme mein centrally update.
 * - Micro-frontend — independent ownership/deploy; duplicate dependencies, consistency aur runtime integration cost.
 * - Module federation — runtime module sharing; version/security/fallback contract chahiye.
 * - Render prop — function prop se caller ko rendering customize karne do.
 * - Prop spreading — internal/private props blindly DOM par forward mat karo.
 * - Component boundary — reusable API small rakho; har styling detail ko configuration prop mat banao.
 */

'use strict';


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
