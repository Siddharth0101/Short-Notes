'use strict';

/**
 * ========================================================================
 * STYLING IN REACT - STYLED COMPONENTS, CSS MODULES & TAILWIND [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas covers CSS Modules, Styled Components, and Tailwind CSS in the React course.
 *
 * STYLING OPTIONS COMPARISON:
 * ┌──────────────────────┬───────────────────────────────┬────────────────────────┐
 * │ Option               │ Syntax                        │ Scope                  │
 * ├──────────────────────┼───────────────────────────────┼────────────────────────┤
 * │ Inline Styles        │ style={{ color: 'red' }}      │ Local element          │
 * │ Global CSS           │ import './index.css'          │ Global (can collide)   │
 * │ CSS Modules          │ import styles from '.module'  │ Scoped to component    │
 * │ Styled Components    │ styled.button`color: red;`     │ Component + Dynamic JS │
 * │ Tailwind CSS         │ className="p-4 bg-blue-500"   │ Utility classes        │
 * └──────────────────────┴───────────────────────────────┴────────────────────────┘
 */


/**
 * ========================================================================
 * 1. STYLED COMPONENTS (CSS-in-JS)
 * ========================================================================
 * NOTES:
 * - Write actual CSS inside JS using tagged template literals.
 * - Dynamic styling based on component props.
 * - Used in Jonas's "The Wild Oasis" project.
 */

// import styled, { css } from 'styled-components';

// const Button = styled.button`
//   font-size: 1.4rem;
//   padding: 1.2rem 1.6rem;
//   font-weight: 500;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//
//   /* Props-based dynamic styling */
//   background-color: ${props => props.variation === 'danger' ? '#ef4444' : '#4f46e5'};
//   color: #fff;
//
//   &:hover {
//     background-color: ${props => props.variation === 'danger' ? '#dc2626' : '#4338ca'};
//   }
// `;
//
// // Usage: <Button variation="danger">Delete</Button>


/**
 * ========================================================================
 * 2. CSS MODULES
 * ========================================================================
 * NOTES:
 * - CSS file named `Button.module.css`.
 * - Styles are scoped automatically with unique generated class names.
 */

// import styles from './Button.module.css';
//
// function Button({ children }) {
//     return <button className={styles.btn}>{children}</button>;
// }


/**
 * ========================================================================
 * 3. TAILWIND CSS IN REACT
 * ========================================================================
 * NOTES:
 * - Utility-first CSS framework used in Jonas's "Fast React Pizza" project.
 */

// function PizzaCard({ name, price }) {
//     return (
//         <div className="flex items-center gap-4 p-4 bg-stone-100 rounded-lg shadow-md hover:bg-stone-200 transition-colors">
//             <h3 className="text-lg font-bold text-stone-800">{name}</h3>
//             <p className="text-sm font-semibold text-stone-600">₹{price}</p>
//         </div>
//     );
// }
