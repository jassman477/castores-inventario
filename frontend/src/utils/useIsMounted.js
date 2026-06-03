import { useEffect, useRef } from 'react';

/** Indica si el componente sigue montado (evita setState tras logout/navegación). */
export function useIsMounted() {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
