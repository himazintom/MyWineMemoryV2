/**
 * Shadow design tokens - Elevation system
 */

export const shadows = {
  // Light theme shadows
  light: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 8px rgba(0, 0, 0, 0.12)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.18)',
    xxl: '0 16px 32px rgba(0, 0, 0, 0.2)',

    // Hover states
    hover: {
      sm: '0 4px 8px rgba(0, 0, 0, 0.15)',
      md: '0 6px 12px rgba(0, 0, 0, 0.18)',
      lg: '0 12px 20px rgba(0, 0, 0, 0.2)',
    },

    // Inner shadows
    inner: {
      sm: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      md: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  },

  // Dark theme shadows (stronger)
  dark: {
    none: 'none',
    xs: '0 1px 2px rgba(0, 0, 0, 0.2)',
    sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
    md: '0 4px 8px rgba(0, 0, 0, 0.35)',
    lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.45)',
    xxl: '0 16px 32px rgba(0, 0, 0, 0.5)',

    // Hover states
    hover: {
      sm: '0 4px 8px rgba(0, 0, 0, 0.4)',
      md: '0 6px 12px rgba(0, 0, 0, 0.45)',
      lg: '0 12px 20px rgba(0, 0, 0, 0.5)',
    },

    // Inner shadows
    inner: {
      sm: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
      md: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
    },
  },
} as const;

export type ShadowToken = typeof shadows;
