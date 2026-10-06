import { createContext, useContext } from 'react';

export const RouteContext = createContext(null);

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useRoute must be used inside Router');
  return context;
}
