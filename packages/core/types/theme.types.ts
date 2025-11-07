/**
 * Theme System Types
 * Comprehensive theming system for email builder customization
 */

import type { CSSValue } from './component.types';

// ============================================================================
// COLOR SYSTEM
// ============================================================================

/**
 * Color palette definition
 */
export interface ColorPalette {
  /** Primary brand colors */
  primary: ColorScale;
  /** Secondary brand colors */
  secondary: ColorScale;
  /** Accent colors for highlights */
  accent: ColorScale;
  /** Neutral grays */
  neutral: ColorScale;
  /** Semantic colors */
  semantic: SemanticColors;
  /** Custom color definitions */
  custom?: Record<string, string | ColorScale>;
}

/**
 * Color scale with numeric keys (50-900)
 */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string; // Base color
  600: string;
  700: string;
  800: string;
  900: string;
}

/**
 * Semantic color definitions
 */
export interface SemanticColors {
  success: ColorScale;
  warning: ColorScale;
  danger: ColorScale;
  info: ColorScale;
}

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

/**
 * Typography configuration
 */
export interface TypographyConfig {
  /** Font family definitions */
  fontFamilies: FontFamilyConfig;
  /** Font size scale */
  fontSizes: FontSizeScale;
  /** Font weight scale */
  fontWeights: FontWeightScale;
  /** Line height scale */
  lineHeights: LineHeightScale;
  /** Letter spacing scale */
  letterSpacing: LetterSpacingScale;
  /** Text styles (headings, body, etc.) */
  textStyles: Record<string, TextStyle>;
}

export interface FontFamilyConfig {
  heading: string;
  body: string;
  mono: string;
  custom?: Record<string, string>;
}

export interface FontSizeScale {
  xs: CSSValue;
  sm: CSSValue;
  base: CSSValue;
  lg: CSSValue;
  xl: CSSValue;
  '2xl': CSSValue;
  '3xl': CSSValue;
  '4xl': CSSValue;
  '5xl': CSSValue;
  '6xl': CSSValue;
}

export interface FontWeightScale {
  thin: number;
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
  extrabold: number;
  black: number;
}

export interface LineHeightScale {
  none: number;
  tight: number;
  snug: number;
  normal: number;
  relaxed: number;
  loose: number;
}

export interface LetterSpacingScale {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: CSSValue;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

// ============================================================================
// SPACING SYSTEM
// ============================================================================

/**
 * Spacing scale for margins, padding, gaps
 */
export interface SpacingScale {
  0: CSSValue;
  1: CSSValue;
  2: CSSValue;
  3: CSSValue;
  4: CSSValue;
  5: CSSValue;
  6: CSSValue;
  8: CSSValue;
  10: CSSValue;
  12: CSSValue;
  16: CSSValue;
  20: CSSValue;
  24: CSSValue;
  32: CSSValue;
  40: CSSValue;
  48: CSSValue;
  56: CSSValue;
  64: CSSValue;
  custom?: Record<string, CSSValue>;
}

// ============================================================================
// VISUAL EFFECTS
// ============================================================================

/**
 * Border radius scale
 */
export interface RadiusScale {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

/**
 * Shadow definitions
 */
export interface ShadowScale {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

// ============================================================================
// THEME DEFINITION
// ============================================================================

/**
 * Complete theme configuration
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version: string;

  /** Color system */
  colors: ColorPalette;

  /** Typography system */
  typography: TypographyConfig;

  /** Spacing system */
  spacing: SpacingScale;

  /** Border radius */
  radius: RadiusScale;

  /** Shadows */
  shadows: ShadowScale;

  /** Theme metadata */
  metadata: ThemeMetadata;

  /** Custom extensions */
  custom?: Record<string, unknown>;
}

export interface ThemeMetadata {
  category?: 'business' | 'ecommerce' | 'newsletter' | 'transactional' | 'custom';
  tags?: string[];
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// THEME TOKENS
// ============================================================================

/**
 * Resolved theme tokens for use in components
 */
export interface ThemeTokens {
  color: (path: string) => string;
  fontSize: (size: keyof FontSizeScale) => CSSValue;
  fontWeight: (weight: keyof FontWeightScale) => number;
  spacing: (scale: keyof SpacingScale | number) => CSSValue;
  radius: (size: keyof RadiusScale) => string;
  shadow: (size: keyof ShadowScale) => string;
  textStyle: (name: string) => TextStyle | undefined;
}

// ============================================================================
// THEME OVERRIDES
// ============================================================================

/**
 * Partial theme overrides
 */
export type ThemeOverride = Partial<Omit<Theme, 'id' | 'metadata'>>;

/**
 * Theme variant configuration
 */
export interface ThemeVariant {
  id: string;
  name: string;
  baseThemeId: string;
  overrides: ThemeOverride;
}

export default Theme;
