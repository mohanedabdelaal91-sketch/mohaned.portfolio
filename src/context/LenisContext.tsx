import { createContext, useContext, type ReactNode } from 'react';
import { useLenis } from '@/hooks/useLenis';
import type Lenis from 'lenis';

const LenisContext = createContext<React.MutableRefObject<Lenis | null>>({ current: null });

export function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useLenis();

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisContext() {
  return useContext(LenisContext);
}
