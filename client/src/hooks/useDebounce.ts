import React from 'react';

export function useDebouncedCallback(callback: (...args: any[]) => void, delay?: number): (...args: any[]) => void {
  const debouncedCallback = React.useCallback(
    (...args: any[]) => {
      const timer = setTimeout(() => {
        callback(...args);
      }, delay || 500);

      return () => {
        clearTimeout(timer);
      };
    },
    [callback, delay]
  );

  return debouncedCallback;
}