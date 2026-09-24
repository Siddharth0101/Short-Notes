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
 * - Profiler — pehle slow render/interaction measure karo.
 * - `memo` — same props par render skip kar sakta hai; state/context updates phir bhi aa sakti hain.
 * - `useMemo` — expensive calculation cache; correctness ispar depend mat karao.
 * - `useCallback` — function identity cache; har callback ko wrap karna zaroori nahi.
 * - Lazy loading — route/component code zaroorat par load karo.
 * - Suspense — supported suspending work ka fallback; normal effect fetch auto-handle nahi hota.
 * - Transition — non-urgent update mark; computation magically cheap nahi hoti.
 * - Virtualization — visible list window render; stable identity/accessibility preserve karo.
 * - Production — bundle, errors, accessibility aur real-user performance verify karo.
 * - Render prop — function prop se caller ko rendering customize karne do.
 * - Prop spreading — internal/private props blindly DOM par forward mat karo.
 * - Component boundary — reusable API small rakho; har styling detail ko configuration prop mat banao.
 */

'use strict';


// Simulated custom hook logic
function createUseOnlineStatusSimulator() {
  let isOnline = true;
  const listeners = [];

  return {
    getSnapshot: () => isOnline,
    setNetworkStatus: (status) => {
      isOnline = status;
      listeners.forEach((fn) => fn(isOnline));
    },
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        const idx = listeners.indexOf(listener);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    }
  };
}

const networkTracker = createUseOnlineStatusSimulator();
const unsubscribe = networkTracker.subscribe((status) => {
  console.log(`[Network Event] Online Status Changed: ${status ? '🟢 CONNECTED' : '🔴 OFFLINE'}`);
});

console.log('--- Custom Hook Simulation ---');
console.log('Current status:', networkTracker.getSnapshot());
networkTracker.setNetworkStatus(false);
networkTracker.setNetworkStatus(true);
unsubscribe();


// HOC pattern simulation in plain JS
function withPromotedBadge(CardComponent) {
  return function PromotedCard(props) {
    return {
      type: 'div',
      badge: '🔥 BESTSELLER',
      original: CardComponent(props)
    };
  };
}

function BaseRestaurantCard(props) {
  return {
    name: props.name,
    rating: props.rating,
    cuisine: props.cuisine
  };
}

const PromotedRestaurantCard = withPromotedBadge(BaseRestaurantCard);
const renderedCard = PromotedRestaurantCard({ name: 'Meghana Foods', rating: 4.6, cuisine: 'Biryani' });

console.log('--- Higher Order Component Output ---');
console.log(renderedCard);
