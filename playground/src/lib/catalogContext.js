import { createContext, useContext } from 'react';
import { BASE_CATALOG } from '../data/localized.js';

export const CatalogContext = createContext({ ...BASE_CATALOG, loading: false });
// Chapters, stages and interview questions in the reader's language.
export const useCatalog = () => useContext(CatalogContext);
