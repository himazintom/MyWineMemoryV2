/**
 * Custom hook for keyboard navigation
 * Provides arrow key navigation and Enter key selection for lists
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationOptions {
  onSelect?: (index: number) => void;
  onEscape?: () => void;
  enabled?: boolean;
  loop?: boolean; // Whether to loop from end to start
}

/**
 * Hook for managing keyboard navigation in lists
 * @param itemCount - Number of items in the list
 * @param options - Configuration options
 * @returns focusedIndex and helper functions
 */
export function useKeyboardNavigation(
  itemCount: number,
  options: UseKeyboardNavigationOptions = {}
) {
  const {
    onSelect,
    onEscape,
    enabled = true,
    loop = true,
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // Register item ref
  const registerItemRef = useCallback((index: number, element: HTMLElement | null) => {
    itemRefs.current[index] = element;
  }, []);

  // Move focus to specific index
  const moveFocus = useCallback((index: number) => {
    const clampedIndex = loop
      ? (index + itemCount) % itemCount
      : Math.max(0, Math.min(index, itemCount - 1));

    setFocusedIndex(clampedIndex);

    // Focus the element
    const element = itemRefs.current[clampedIndex];
    if (element) {
      element.focus();
    }
  }, [itemCount, loop]);

  // Keyboard event handler
  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
        case 'Down': // IE/Edge support
          e.preventDefault();
          moveFocus(focusedIndex + 1);
          break;

        case 'ArrowUp':
        case 'Up': // IE/Edge support
          e.preventDefault();
          moveFocus(focusedIndex - 1);
          break;

        case 'Home':
          e.preventDefault();
          moveFocus(0);
          break;

        case 'End':
          e.preventDefault();
          moveFocus(itemCount - 1);
          break;

        case 'Enter':
        case ' ': // Space key
          e.preventDefault();
          if (onSelect) {
            onSelect(focusedIndex);
          }
          break;

        case 'Escape':
        case 'Esc': // IE/Edge support
          e.preventDefault();
          if (onEscape) {
            onEscape();
          }
          setFocusedIndex(0);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, itemCount, focusedIndex, onSelect, onEscape, moveFocus]);

  return {
    focusedIndex,
    setFocusedIndex,
    moveFocus,
    registerItemRef,
  };
}
