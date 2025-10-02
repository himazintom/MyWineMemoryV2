/**
 * Color design tokens for MyWineMemory
 * WCAG AA compliant color palette
 */

export const colors = {
  // Primary - Wine theme
  primary: {
    main: '#722F37',      // Main wine red
    light: '#d4636f',     // Light wine for dark theme
    dark: '#5a2429',      // Darker wine for better contrast
    contrast: '#ffffff',  // Text on primary
  },

  // Semantic colors
  success: {
    main: '#28a745',
    light: '#34ce57',
    dark: '#1e7e34',
    contrast: '#ffffff',
  },
  error: {
    main: '#dc3545',
    light: '#e4606d',
    dark: '#bd2130',
    contrast: '#ffffff',
  },
  warning: {
    main: '#ffc107',
    light: '#ffd54f',
    dark: '#c79100',
    contrast: '#000000',
  },
  info: {
    main: '#17a2b8',
    light: '#58c4d4',
    dark: '#117a8b',
    contrast: '#ffffff',
  },

  // Neutral colors - Light theme
  light: {
    bg: {
      primary: '#FFF8E1',    // Cream background
      secondary: '#FFFBF0',  // Lighter cream
      tertiary: '#F5F0E8',   // Darker cream
      card: '#FFFFFF',       // White cards
    },
    text: {
      primary: '#1a1a1a',    // Almost black (contrast: 16:1)
      secondary: '#4a4a4a',  // Dark gray (contrast: 7:1)
      tertiary: '#757575',   // Medium gray (contrast: 4.5:1)
      muted: '#9e9e9e',      // Light gray
      inverse: '#ffffff',    // White text
    },
    border: '#e0e0e0',
    divider: '#f0f0f0',
  },

  // Neutral colors - Dark theme
  dark: {
    bg: {
      primary: '#1a1a1a',    // Almost black
      secondary: '#2a2a2a',  // Dark gray
      tertiary: '#3a3a3a',   // Medium dark gray
      card: '#242424',       // Card background
    },
    text: {
      primary: '#ffffff',    // White
      secondary: '#e0e0e0',  // Light gray
      tertiary: '#b0b0b0',   // Medium gray
      muted: '#808080',      // Gray
      inverse: '#1a1a1a',    // Dark text
    },
    border: '#404040',
    divider: '#333333',
  },

  // Special colors
  accent: {
    gold: '#FFD700',
    bronze: '#CD7F32',
    silver: '#C0C0C0',
  },
} as const;

// Type for color paths
export type ColorToken = typeof colors;
