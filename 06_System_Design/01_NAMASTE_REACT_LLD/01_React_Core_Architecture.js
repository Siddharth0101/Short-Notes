/**
 * ## Quick revision
 *
 * - Component — props se UI return karne wala function.
 * - JSX — JS mein UI syntax; expressions `{}` ke andar.
 * - Props — parent se input; child mutate nahi karta.
 * - Children — nested content ko composition ke liye pass karo.
 * - Render — pure calculation; network/DOM side effects render mein mat chalao.
 * - Capital name — custom component `<Card />`; lowercase tag native element.
 * - Fragment — extra DOM wrapper bina elements group karo.
 * - Key — siblings ki stable identity; array position se bachna jab list badalti ho.
 * - Render — next UI calculate; commit — DOM updates apply.
 * - Reconciliation — type, position aur key se identity match hoti hai.
 * - Stable key — item ID use karo; random key har render remount kar sakti hai.
 * - State reset — component type/key badalne se local state reset ho sakti hai.
 * - Conditional UI — `0 && <Item />` zero dikha sakta hai.
 * - Strict Mode — development mein extra checks; render/effect ko safe rakho.
 * - Class lifecycle — mount/update/unmount; Hooks mein responsibilities ke hisaab se socho.
 * - Error boundary — descendant render errors ke fallback; har async/event error nahi pakadti.
 * - Event prop — handler pass karo: `onClick={save}`; `save()` render ke time call hota hai.
 * - JSX attributes — className aur htmlFor use; inline style JS object hota hai.
 * - Key prop — React identity ke liye; child ko ID chahiye toh separate prop do.
 */

'use strict';


// Simulation of React.createElement under the hood
function simulateCreateElement(type, props, ...children) {
  return {
    $$typeof: Symbol.for('react.element'),
    type: type,
    key: props?.key || null,
    ref: props?.ref || null,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children
    }
  };
}

const headingElement = simulateCreateElement('h1', { id: 'heading', className: 'hero-title' }, 'Namaste React!');
console.log('--- React Element Simulation ---');
console.log('Type of element:', typeof headingElement);
console.log('Element Object:', headingElement);


// Pure JS demonstration of Component Composition
function Title() {
  return simulateCreateElement('h2', { className: 'sub-title' }, 'Deep Frontend Mastery');
}

function HeaderComponent() {
  return simulateCreateElement(
    'header',
    { className: 'main-header' },
    simulateCreateElement('h1', null, 'Akshay Saini Namaste React Architecture'),
    Title()
  );
}

const renderedHeader = HeaderComponent();
console.log('--- Component Composition Output ---');
console.log('Header props children:', renderedHeader.props.children);
