'use strict';

/**
 * ========================================================================
 * TANSTACK REACT QUERY & SUPABASE - COMPLETE SHORT NOTES [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Jonas ka "The Wild Oasis" project section.
 * - TanStack React Query (v5): Server state management (fetching, caching, invalidation).
 * - Supabase: Backend-as-a-Service (PostgreSQL database, Auth, Storage).
 *
 * REACT QUERY ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  UI Component                                               │
 * │  const { data, isLoading, error } = useQuery(...)           │
 * │                       │                                     │
 * │                       ▼                                     │
 * │               QUERY CLIENT CACHE                            │
 * │      (Stale time, automatic background refetching)          │
 * │                       │                                     │
 * │                       ▼ (Async queryFn)                     │
 * │             SUPABASE / REST BACKEND                         │
 * └─────────────────────────────────────────────────────────────┘
 */


/**
 * ========================================================================
 * 1. SETUP REACT QUERY
 * ========================================================================
 */

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
//
// const queryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//             staleTime: 60 * 1000, // 1 minute before data is considered stale
//         },
//     },
// });
//
// function App() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <ReactQueryDevtools initialIsOpen={false} />
//             <Cabins />
//         </QueryClientProvider>
//     );
// }


/**
 * ========================================================================
 * 2. FETCHING DATA (useQuery)
 * ========================================================================
 * NOTES:
 * - queryKey: array identifying data uniquely in cache.
 * - queryFn: async function returning data.
 */

// import { useQuery } from '@tanstack/react-query';
// import { getCabins } from '../services/apiCabins';
//
// function useCabins() {
//     const { isLoading, data: cabins, error } = useQuery({
//         queryKey: ['cabins'],
//         queryFn: getCabins,
//     });
//     return { isLoading, cabins, error };
// }


/**
 * ========================================================================
 * 3. MUTATIONS & INVALIDATION (useMutation & useQueryClient)
 * ========================================================================
 * NOTES:
 * - useMutation: Create, Update, Delete operations.
 * - queryClient.invalidateQueries({ queryKey: ['...'] }): Refetch automatically on success.
 */

// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { deleteCabin as deleteCabinApi } from '../services/apiCabins';
// import toast from 'react-hot-toast';
//
// function useDeleteCabin() {
//     const queryClient = useQueryClient();
//
//     const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
//         mutationFn: deleteCabinApi,
//         onSuccess: () => {
//             toast.success('Cabin deleted successfully');
//             queryClient.invalidateQueries({ queryKey: ['cabins'] }); // re-fetches list!
//         },
//         onError: (err) => toast.error(err.message),
//     });
//
//     return { isDeleting, deleteCabin };
// }


/**
 * ========================================================================
 * 4. SUPABASE CLIENT & QUERIES
 * ========================================================================
 * NOTES:
 * - Supabase exposes JavaScript client to query Postgres directly with RLS (Row Level Security).
 */

// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
// const supabaseKey = 'YOUR_ANON_KEY';
// export const supabase = createClient(supabaseUrl, supabaseKey);

// Read query:
// export async function getCabins() {
//     const { data, error } = await supabase.from('cabins').select('*');
//     if (error) throw new Error('Cabins could not be loaded');
//     return data;
// }

// Insert query:
// export async function createCabin(newCabin) {
//     const { data, error } = await supabase.from('cabins').insert([newCabin]).select();
//     if (error) throw new Error('Cabin could not be created');
//     return data;
// }
