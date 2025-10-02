/**
 * Transition and animation design tokens
 */

export const transitions = {
  // Duration
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },

  // Timing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',

    // Custom cubic-bezier curves
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Common transition combinations
  common: {
    base: 'all 200ms ease',
    fast: 'all 150ms ease',
    slow: 'all 300ms ease',
    transform: 'transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    opacity: 'opacity 200ms ease',
    color: 'color 200ms ease',
  },
} as const;

export type TransitionToken = typeof transitions;
