'use strict';

/**
 * ========================================================================
 * 04. PAGINATION COMPONENT [⚡ MACHINE CODING PATTERNS]
 * ========================================================================
 * SOURCE: Frontend Machine Coding Interviews
 *
 * REQUIREMENTS:
 * - Given `totalItems`, `itemsPerPage`, and `currentPage`.
 * - Render navigation buttons (Prev/Next).
 * - Render page numbers.
 * - Implement logic to show ellipses "..." when there are too many pages (e.g., 1, 2, ..., 9, 10).
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     REACT IMPLEMENTATION LOGIC                      │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ```jsx
 * import React, { useState } from 'react';
 *
 * const Pagination = ({ totalItems = 100, itemsPerPage = 10 }) => {
 *   const [currentPage, setCurrentPage] = useState(1);
 *   const totalPages = Math.ceil(totalItems / itemsPerPage);
 *
 *   const selectPageHandler = (selectedPage) => {
 *     if (selectedPage >= 1 && selectedPage <= totalPages && selectedPage !== currentPage) {
 *       setCurrentPage(selectedPage);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       {totalPages > 0 && (
 *         <div className="pagination">
 *           <span
 *             onClick={() => selectPageHandler(currentPage - 1)}
 *             className={currentPage > 1 ? "" : "pagination__disable"}
 *           >
 *             ◀
 *           </span>
 *
 *           {[...Array(totalPages)].map((_, i) => {
 *             return (
 *               <span
 *                 key={i}
 *                 className={currentPage === i + 1 ? "pagination__selected" : ""}
 *                 onClick={() => selectPageHandler(i + 1)}
 *               >
 *                 {i + 1}
 *               </span>
 *             );
 *           })}
 *
 *           <span
 *             onClick={() => selectPageHandler(currentPage + 1)}
 *             className={currentPage < totalPages ? "" : "pagination__disable"}
 *           >
 *             ▶
 *           </span>
 *         </div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     ADVANCED: ELLIPSES LOGIC                        │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * If `totalPages` is 100, you don't render 100 spans. You need logic to return
 * an array like: [1, 2, 3, '...', 99, 100].
 *
 * ```javascript
 * const getPaginationRange = (currentPage, totalPages) => {
 *   const siblingCount = 1;
 *   const totalPageNumbers = siblingCount + 5; // First, Last, Current, 2 Siblings
 *
 *   if (totalPageNumbers >= totalPages) return [...Array(totalPages)].map((_, i) => i + 1);
 *
 *   const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
 *   const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
 *
 *   const showLeftDots = leftSiblingIndex > 2;
 *   const showRightDots = rightSiblingIndex < totalPages - 2;
 *
 *   const firstPageIndex = 1;
 *   const lastPageIndex = totalPages;
 *
 *   if (!showLeftDots && showRightDots) {
 *     let leftItemCount = 3 + 2 * siblingCount;
 *     let leftRange = [...Array(leftItemCount)].map((_, i) => i + 1);
 *     return [...leftRange, '...', totalPages];
 *   }
 *
 *   if (showLeftDots && !showRightDots) {
 *     let rightItemCount = 3 + 2 * siblingCount;
 *     let rightRange = [...Array(rightItemCount)].map((_, i) => totalPages - rightItemCount + i + 1);
 *     return [firstPageIndex, '...', ...rightRange];
 *   }
 *
 *   if (showLeftDots && showRightDots) {
 *     let middleRange = [...Array(rightSiblingIndex - leftSiblingIndex + 1)].map((_, i) => leftSiblingIndex + i);
 *     return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
 *   }
 * };
 * ```
 */

console.log('✅ Pagination Machine Coding Pattern parsed successfully.');
