'use strict';

/**
 * ========================================================================
 * 06. TESTING WITH REACT TESTING LIBRARY (RTL) & JEST [⚡ NAMASTE REACT]
 * ========================================================================
 * SOURCE: Akshay Saini (Namaste React - Ep 13)
 *
 * TESTING PYRAMID:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                                                                     │
 * │                             /   E2E   \      (Cypress / Playwright) │
 * │                            / Integration\    (RTL Multi-Component)  │
 * │                           /     Unit     \   (RTL / Jest Isolated)  │
 * │                                                                     │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * RTL PHILOSOPHY:
 * - Test user behavior, NOT implementation details!
 * - Never assert internal state values (e.g. component.state.count === 2).
 * - Instead assert user-visible elements (e.g. expect(screen.getByText('Cart (2)')).toBeInTheDocument()).
 */

/**
 * ========================================================================
 * 1. QUERY PRIORITY IN REACT TESTING LIBRARY
 * ========================================================================
 * Always prefer accessible queries that reflect user interaction:
 * 1. getByRole (e.g., getByRole('button', { name: /submit/i })) 🌟 BEST
 * 2. getByLabelText (form fields with associated <label>)
 * 3. getByPlaceholderText (search inputs)
 * 4. getByText (headings, paragraphs)
 * 5. getByDisplayValue (input current value)
 * 6. getByTestId (data-testid="cart-badge") - LAST RESORT ONLY!
 *
 * getBy vs queryBy vs findBy:
 * - getBy: Returns element or THROWS immediate error (use for elements that MUST exist).
 * - queryBy: Returns element or NULL (use when asserting element is NOT in the DOM).
 * - findBy: Returns a PROMISE (use for async elements loaded via API / useEffect).
 */

// Simulation of RTL Test Runner assertions
class TestRunner {
  constructor() {
    this.passCount = 0;
    this.failCount = 0;
  }

  test(description, testFn) {
    try {
      testFn();
      console.log(`✅ PASS: ${description}`);
      this.passCount++;
    } catch (err) {
      console.log(`❌ FAIL: ${description} -> ${err.message}`);
      this.failCount++;
    }
  }

  expect(actual) {
    return {
      toBe: (expected) => {
        if (actual !== expected) throw new Error(`Expected ${expected} but received ${actual}`);
      },
      toBeGreaterThan: (expected) => {
        if (!(actual > expected)) throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    };
  }
}

const runner = new TestRunner();

console.log('--- React Testing Runner Simulation ---');
runner.test('Should calculate cart total correctly', () => {
  const cartItems = [{ price: 200 }, { price: 350 }, { price: 50 }];
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);
  runner.expect(total).toBe(600);
});

runner.test('Should filter top-rated restaurants with rating > 4.0', () => {
  const restaurants = [
    { name: 'A', rating: 4.5 },
    { name: 'B', rating: 3.8 },
    { name: 'C', rating: 4.2 }
  ];
  const topRated = restaurants.filter((r) => r.rating > 4.0);
  runner.expect(topRated.length).toBe(2);
});

/**
 * ========================================================================
 * 2. MOCKING ASYNC APIS & FETCH
 * ========================================================================
 * In Jest / RTL:
 * ```javascript
 * global.fetch = jest.fn(() =>
 *   Promise.resolve({
 *     json: () => Promise.resolve(mockRestaurantData)
 *   })
 * );
 * ```
 * - Always wrap async state transitions in `act()` or use RTL's `await waitFor(...)`
 *   to avoid "Warning: An update to Component inside a test was not wrapped in act(...)".
 */
