/**
 * Design tokens barrel file
 * Central export for all design tokens
 */

import type { ColorToken } from './colors';
import type { SpacingToken } from './spacing';
import type { ShadowToken } from './shadows';
import type { TypographyToken } from './typography';
import type { TransitionToken } from './transitions';
import type { BorderRadiusToken } from './borderRadius';

export { colors } from './colors';
export { spacing } from './spacing';
export { shadows } from './shadows';
export { typography } from './typography';
export { transitions } from './transitions';
export { borderRadius } from './borderRadius';

export type { ColorToken, SpacingToken, ShadowToken, TypographyToken, TransitionToken, BorderRadiusToken };

// Combined design tokens type
export interface DesignTokens {
  colors: ColorToken;
  spacing: SpacingToken;
  shadows: ShadowToken;
  typography: TypographyToken;
  transitions: TransitionToken;
  borderRadius: BorderRadiusToken;
}
