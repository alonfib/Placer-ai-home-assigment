import React from 'react';

export function useDebouncedCallback(callback: (...args: any[]) => void, delay?: number): (...args: any[]) => void {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>();

  const debouncedCallback = React.useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        timeoutRef.current = undefined;
      }, delay || 500);
    },
    [callback, delay]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
