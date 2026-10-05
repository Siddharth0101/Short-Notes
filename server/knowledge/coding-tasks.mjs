// Interview-sized additions for tracks without a machine-coding entry in the original bank.
export const supplementalCodingTasks = [
  {
    id: 'agent-rn-search-list',
    track: 'react-native',
    noteId: 'rn-lists-images',
    level: 'Intermediate',
    question: 'Machine coding: Searchable React Native contact list',
    promptCode:
      '**Timebox:** 25 minutes. Build a React Native screen with a TextInput and a FlatList of local contacts. Search by name, show a useful empty state, and allow selecting a contact.\n\n**Acceptance checks:**\n- Use stable IDs for row keys.\n- Changing the query updates the list; clearing it restores all contacts.\n- Selection updates the correct row without mutating the contact data.\n- Input and selectable rows have useful accessibility labels.\n\nStart with local data; networking, persistence, and navigation are optional follow-ups only if time remains.',
    answer:
      'Separate query and selected contact ID from source data. Derive the filtered list; do not mutate contacts. Use stable keyExtractor IDs and pass selection-dependent state to FlatList when row rendering depends on it. Keep row updates understandable before adding memoization. Test empty query, no matches, case-insensitive matching, and selecting a row after filtering.',
    followUp:
      'How would you add cancellable remote search while preventing stale responses from replacing newer results?',
    tags: ['machine-coding', 'react-native', 'flatlist', 'state', 'accessibility'],
  },
];
