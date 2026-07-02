/**
 * ========================================================================
 * URL-BASED STATE PERSISTENCE (Jira-style Modal Reopen on Refresh)
 * ========================================================================
 * NOTES:
 * - Jira me humne notice kiya hai: Active Sprint board par, jab hum kisi ticket par click
 *   karte hain to modal khulta hai. Page refresh karne ke baad bhi wo modal open rehta hai!
 * - Normal React app me agar hum `const [isOpen, setIsOpen] = useState(false)` ya
 *   `const [selectedTicket, setSelectedTicket] = useState(null)` use karenge,
 *   to refresh hone par React state completely wipe out (reset) ho jayega.
 * - Solution: URL Query Params (Search Params) ko React state ki tarah use karna!
 *   E.g., `/active-sprint?ticketId=PROJ-101`
 * - Ise hum "URL as the Single Source of Truth" kehte hain.
 * 
 * ADVANTAGES OF THIS APPROACH:
 * 1. PERSISTENCE: Page refresh ya reload karne par bhi state save rehta hai.
 * 2. SHAREABILITY (Deep Linking): Agar hum ye URL kisi aur developer ko share karenge,
 *    to uske system pe bhi directly wahi ticket modal open hoga.
 * 3. BROWSER HISTORY: Browser ka Back button press karne par modal close hoga,
 *    aur Forward button se wapas modal open ho sakega.
 */


/**
 * ========================================================================
 * METHOD 1: React Router DOM (v6+) — Standard Single Page App (SPA)
 * ========================================================================
 * - Sabse popular tareeka. Hum `useSearchParams` hook ka use karte hain.
 * - Ye exact `useState` ki tarah hi behave karta hai, bas values URL me store hoti hain.
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';

// Mock active sprint tickets data
const MOCK_TICKETS = [
  { id: 'JIRA-101', title: 'Setup Redux Store', desc: 'Initialize redux toolkit and configure root reducer.' },
  { id: 'JIRA-102', title: 'API Integration', desc: 'Connect authentication APIs with login/signup forms.' },
  { id: 'JIRA-103', title: 'Fix CSS Grid Issues', desc: 'Resolve overlapping cards on dashboard layout.' }
];

export function ActiveSprintReactRouter() {
  // setSearchParams allows modifying search parameters in URL
  const [searchParams, setSearchParams] = useSearchParams();

  // URL se query param ko read karo (returns string or null)
  const activeTicketId = searchParams.get('selectedTicket');

  // URL wale ticket id ke base par array se ticket details filter karo
  const activeTicket = MOCK_TICKETS.find(ticket => ticket.id === activeTicketId);

  // Ticket card par click hone par URL me param insert karo
  const openTicketModal = (id) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('selectedTicket', id); // URL looks like: /sprint?selectedTicket=JIRA-101
    setSearchParams(newParams);
  };

  // Modal close hone par param ko URL se delete karo
  const closeTicketModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('selectedTicket'); // URL looks like: /sprint
    setSearchParams(newParams);
  };

  return (
    <div style={styles.container}>
      <h2>Active Sprint Board (React Router DOM)</h2>
      
      {/* Board Columns */}
      <div style={styles.board}>
        {MOCK_TICKETS.map(ticket => (
          <div 
            key={ticket.id} 
            onClick={() => openTicketModal(ticket.id)}
            style={{
              ...styles.card,
              borderLeft: activeTicketId === ticket.id ? '5px solid var(--accent)' : '1px solid var(--border)'
            }}
          >
            <strong>{ticket.id}</strong>
            <p>{ticket.title}</p>
          </div>
        ))}
      </div>

      {/* Modal: Tabhi render hoga jab current activeTicket context me milta hai */}
      {activeTicket && (
        <div style={styles.modalOverlay} onClick={closeTicketModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span style={styles.closeBtn} onClick={closeTicketModal}>&times;</span>
            <div style={styles.modalHeader}>
              <span style={styles.projectTag}>Active Sprint / {activeTicket.id}</span>
              <h3>{activeTicket.title}</h3>
            </div>
            <div style={styles.modalBody}>
              <h4>Description</h4>
              <p>{activeTicket.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/**
 * ========================================================================
 * METHOD 2: Next.js (App Router) — Server & Client Side Navigation
 * ========================================================================
 * - Next.js me directly `useSearchParams` update nahi hota.
 * - Next.js (App Router) me hum `useSearchParams` se read karte hain aur
 *   `useRouter` & `usePathname` ka use karke navigation dynamically push karte hain.
 */

/*
'use client'; // Required in Next.js App Router for client hooks

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function ActiveSprintNextJS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTicketId = searchParams.get('selectedTicket');
  const activeTicket = MOCK_TICKETS.find(ticket => ticket.id === activeTicketId);

  const openTicketModal = (id) => {
    // URLSearchParams creates a mutable copy of active search params
    const params = new URLSearchParams(searchParams.toString());
    params.set('selectedTicket', id);
    
    // Updates URL path: e.g. /sprint?selectedTicket=JIRA-101
    router.push(`${pathname}?${params.toString()}`);
  };

  const closeTicketModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('selectedTicket');
    
    // If other parameters are empty, push pathname only
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  // Rendering remains same as React Router DOM example
}
*/


/**
 * ========================================================================
 * METHOD 3: Custom Hook pattern (useQueryState)
 * ========================================================================
 * - Clean code ke liye hum custom hook bana sakte hain jo exact useState
 *   ki tarah return kare [value, setValue] but context backend pe URL me saved ho.
 */

export function useQueryState(key, defaultValue = '') {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(key) || defaultValue;
  
  const setValue = (newValue) => {
    const newParams = new URLSearchParams(searchParams);
    if (newValue === null || newValue === undefined || newValue === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, newValue);
    }
    setSearchParams(newParams);
  };
  
  return [value, setValue];
}

// Example usage of Custom Hook:
// const [activeTicketId, setActiveTicketId] = useQueryState('selectedTicket');
// open modal: setActiveTicketId('JIRA-101')
// close modal: setActiveTicketId('')



/**
 * ========================================================================
 * STYLES (Clean UI Preview)
 * ========================================================================
 */
const styles = {
  container: {
    padding: '40px',
    fontFamily: 'var(--sans)',
    backgroundColor: 'var(--bg)',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  board: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    padding: '20px',
    borderRadius: '8px',
    width: '280px',
    cursor: 'pointer',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    color: 'var(--text)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(120, 113, 108, 0.25)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(6px)',
  },
  modalContent: {
    backgroundColor: 'var(--bg-card)',
    padding: '32px',
    borderRadius: '10px',
    width: '600px',
    maxWidth: '90%',
    position: 'relative',
    border: '1px solid var(--border)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
    color: 'var(--text)',
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '20px',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'var(--text)',
  },
  modalHeader: {
    marginBottom: '20px',
  },
  projectTag: {
    fontSize: '12px',
    color: 'var(--accent)',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
  },
  modalBody: {
    lineHeight: '1.6',
    color: 'var(--text)',
  }
};

