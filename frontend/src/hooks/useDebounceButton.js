import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to debounce button click handlers, preventing rapid double clicking.
 * 
 * @param {Function} onClickHandler - The async or sync function to execute on click
 * @param {number} delay - Debounce cool-down period in milliseconds (default 800ms)
 * @returns {Array} [handleClick, isDebouncing]
 */
export function useDebounceButton(onClickHandler, delay = 800) {
  const [isDebouncing, setIsDebouncing] = useState(false);
  const isExecutingRef = useRef(false);
  const timerRef = useRef(null);

  const handleClick = useCallback(
    async (...args) => {
      if (isExecutingRef.current) return;

      isExecutingRef.current = true;
      setIsDebouncing(true);

      try {
        if (onClickHandler) {
          await onClickHandler(...args);
        }
      } catch (err) {
        console.error('Error during debounced click action:', err);
      } finally {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          isExecutingRef.current = false;
          setIsDebouncing(false);
        }, delay);
      }
    },
    [onClickHandler, delay]
  );

  return [handleClick, isDebouncing];
}

export default useDebounceButton;
