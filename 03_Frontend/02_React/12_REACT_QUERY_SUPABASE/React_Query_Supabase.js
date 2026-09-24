/**
 * ## Quick revision
 *
 * - Server state — remote data; loading, freshness, retry aur invalidation sambhalni padti hai.
 * - Query key — resource + filters + tenant/user scope se cache identity banao.
 * - Stale time — kitni der fresh maano; cache retention alag setting hai.
 * - Mutation — server write; success par related queries update/invalidate karo.
 * - Optimistic update — pehle UI badlo; failure par rollback aur reconcile.
 * - Race — old response ko newer query/result overwrite na karne do.
 * - Supabase — client convenience ke saath database RLS policies bhi enforce karo.
 * - Auth change — old user ka private cache clear/isolate karo.
 * - Pagination — cursor/page ko query key mein include karo.
 * - Dependent query — required ID/auth ready ho tab fetch; undefined identity par accidental call avoid.
 * - Background refresh — cached data dikhate hue refresh status separately handle karo.
 * - Mutation ordering — rapid writes out-of-order aa sakti hain; version/reconciliation rule chahiye.
 */

'use strict';


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
