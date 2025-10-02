/**
 * Border radius design tokens
 */

export const borderRadius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  full: '9999px',

  // Component-specific
  component: {
    button: '8px',
    card: '12px',
    input: '8px',
    badge: '4px',
    pill: '9999px',
  },
} as const;

export type BorderRadiusToken = typeof borderRadius;
