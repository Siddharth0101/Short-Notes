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
 * - Style specificity — generated class aur global override ke conflict mein cascade inspect karo.
 * - Theme token — colors/spacing semantic names se; every component mein magic values repeat mat karo.
 * - Dynamic classes — build-time class discovery ke saath runtime-generated names ka compatibility verify.
 */

'use strict';


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


// import styles from './Button.module.css';
//
// function Button({ children }) {
//     return <button className={styles.btn}>{children}</button>;
// }


// function PizzaCard({ name, price }) {
//     return (
//         <div className="flex items-center gap-4 p-4 bg-stone-100 rounded-lg shadow-md hover:bg-stone-200 transition-colors">
//             <h3 className="text-lg font-bold text-stone-800">{name}</h3>
//             <p className="text-sm font-semibold text-stone-600">₹{price}</p>
//         </div>
//     );
// }
