import { DependencyList, useMemo } from 'react';

function debounce<Args extends unknown[]>(fn: (...args: Args) => void, delay: number) {
  let timeoutID: number | undefined;
  let lastArgs: Args | undefined;

  const run = () => {
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = undefined;
    }
  };

  const debounced = (...args: Args) => {
    clearTimeout(timeoutID);
    lastArgs = args;
    timeoutID = window.setTimeout(run, delay);
  };

  debounced.flush = () => {
    clearTimeout(timeoutID);
    run();
  };

  return debounced;
}

export function useDebounce<Args extends unknown[]>(
  cb: (...args: Args) => void,
  delay: number,
  deps: DependencyList,
) {
  return useMemo(() => debounce(cb, delay), deps);
}