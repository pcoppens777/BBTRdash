import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  // Fix: Explicitly provide an argument to `useRef` to resolve the "Expected 1 arguments, but got 0" error.
  // This is necessary for some build tools that don't support an empty `useRef()` call.
  // The ref's type is now `T | undefined` to accommodate the initial `undefined` value.
  const ref = useRef<T | undefined>(undefined);
  
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
