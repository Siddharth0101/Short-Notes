'use strict';

/**
 * ========================================================================
 * 03. FILE EXPLORER (FOLDER TREE) [⚡ MACHINE CODING PATTERNS]
 * ========================================================================
 * SOURCE: Akshay Saini (Ace Machine Coding Round)
 *
 * REQUIREMENTS:
 * - Given a deeply nested JSON object representing files and folders.
 * - Render them recursively.
 * - Folders should be collapsible/expandable on click.
 * - Ability to add a new file/folder inside an existing folder.
 */

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                     REACT IMPLEMENTATION LOGIC                      │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ```jsx
 * import React, { useState } from 'react';
 *
 * const Folder = ({ explorer, handleInsertNode }) => {
 *   const [expand, setExpand] = useState(false);
 *   const [showInput, setShowInput] = useState({
 *     visible: false,
 *     isFolder: null
 *   });
 *
 *   const handleNewFolder = (e, isFolder) => {
 *     e.stopPropagation();
 *     setExpand(true);
 *     setShowInput({ visible: true, isFolder });
 *   };
 *
 *   const onAddFolder = (e) => {
 *     if (e.keyCode === 13 && e.target.value) { // Enter key
 *       // Calls the state-updating logic passed down from root
 *       handleInsertNode(explorer.id, e.target.value, showInput.isFolder);
 *       setShowInput({ ...showInput, visible: false });
 *     }
 *   };
 *
 *   if (explorer.isFolder) {
 *     return (
 *       <div style={{ marginTop: 5 }}>
 *         <div className="folder" onClick={() => setExpand(!expand)}>
 *           <span>📁 {explorer.name}</span>
 *           <div>
 *             <button onClick={(e) => handleNewFolder(e, true)}>Folder +</button>
 *             <button onClick={(e) => handleNewFolder(e, false)}>File +</button>
 *           </div>
 *         </div>
 *
 *         <div style={{ display: expand ? "block" : "none", paddingLeft: 25 }}>
 *           {showInput.visible && (
 *             <div className="inputContainer">
 *               <span>{showInput.isFolder ? "📁" : "📄"}</span>
 *               <input
 *                 type="text"
 *                 onKeyDown={onAddFolder}
 *                 onBlur={() => setShowInput({ ...showInput, visible: false })}
 *                 autoFocus
 *               />
 *             </div>
 *           )}
 *           {explorer.items.map((exp) => (
 *             <Folder
 *               handleInsertNode={handleInsertNode}
 *               explorer={exp}
 *               key={exp.id}
 *             />
 *           ))}
 *         </div>
 *       </div>
 *     );
 *   } else {
 *     return <span className="file">📄 {explorer.name}</span>;
 *   }
 * };
 *
 * // --- CUSTOM HOOK FOR STATE MANAGEMENT (Node Insertion) ---
 * // This is needed because you have to traverse the tree to update it.
 * const useTraverseTree = () => {
 *   function insertNode(tree, folderId, item, isFolder) {
 *     if (tree.id === folderId && tree.isFolder) {
 *       tree.items.unshift({
 *         id: new Date().getTime(),
 *         name: item,
 *         isFolder,
 *         items: []
 *       });
 *       return tree;
 *     }
 *     let latestNode = [];
 *     latestNode = tree.items.map((ob) => {
 *       return insertNode(ob, folderId, item, isFolder);
 *     });
 *     return { ...tree, items: latestNode };
 *   }
 *   return { insertNode };
 * };
 * ```
 */

console.log('✅ File Explorer Tree Machine Coding Pattern parsed successfully.');
