/**
 * Base component type definitions
 *
 * Specific types for base components (Button, Text, Image, Separator, Spacer)
 */

import type { BaseComponent, ComponentType, CSSValue, BaseStyles } from './component.types';

/**
 * Typography styles
 */
export interface TextStyles {
  fontFamily?: string;
  fontSize?: CSSValue;
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  color?: string;
  lineHeight?: CSSValue;
  letterSpacing?: CSSValue;
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

/**
 * Link configuration
 */
export interface LinkConfig {
  /**
   * URL
   */
  href: string;

  /**
   * Link target
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Link title (accessibility)
   */
  title?: string;

  /**
   * Link rel attribute
   */
  rel?: string;

  /**
   * Tracking parameters
   */
  tracking?: Record<string, string>;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

/**
 * Button content
 */
export interface ButtonContent {
  /**
   * Button text
   */
  text: string;

  /**
   * Link configuration
   */
  link: LinkConfig;

  /**
   * Button icon (Remix Icon name)
   */
  icon?: string;

  /**
   * Icon position
   */
  iconPosition?: 'left' | 'right';
}

/**
 * Button styles (extends base styles)
 */
export interface ButtonStyles extends TextStyles {
  /**
   * Button variant
   */
  variant?: 'filled' | 'outlined' | 'text';

  /**
   * Hover background color
   */
  hoverBackgroundColor?: string;

  /**
   * Hover text color
   */
  hoverColor?: string;

  /**
   * Hover border color
   */
  hoverBorderColor?: string;
}

/**
 * Button component
 */
export interface ButtonComponent extends BaseComponent<ButtonContent, ButtonStyles & BaseStyles> {
  type: ComponentType.BUTTON;
}

// ============================================================================
// TEXT COMPONENT
// ============================================================================

/**
 * Text content type
 */
export type TextContentType = 'paragraph' | 'heading-1' | 'heading-2' | 'heading-3' | 'heading-4' | 'heading-5' | 'heading-6';

/**
 * Text content
 */
export interface TextContent {
  /**
   * Text type
   */
  type: TextContentType;

  /**
   * HTML content (from Lexical editor)
   */
  html: string;

  /**
   * Plain text (for fallback/email)
   */
  plainText?: string;

  /**
   * Lexical editor state (for editing)
   */
  editorState?: string;
}

/**
 * Text component
 */
export interface TextComponent extends BaseComponent<TextContent, TextStyles & BaseStyles> {
  type: ComponentType.TEXT;
}

// ============================================================================
// IMAGE COMPONENT
// ============================================================================

/**
 * Image content
 */
export interface ImageContent {
  /**
   * Image source URL
   */
  src: string;

  /**
   * Image alt text (accessibility)
   */
  alt: string;

  /**
   * Image title
   */
  title?: string;

  /**
   * Link configuration (optional)
   */
  link?: LinkConfig;

  /**
   * Image width (original)
   */
  originalWidth?: number;

  /**
   * Image height (original)
   */
  originalHeight?: number;

  /**
   * Lazy loading
   */
  lazy?: boolean;
}

/**
 * Image styles
 */
export interface ImageStyles {
  /**
   * Object fit
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Object position
   */
  objectPosition?: string;

  /**
   * Image display mode
   */
  display?: 'block' | 'inline-block' | 'inline';
}

/**
 * Image component
 */
export interface ImageComponent extends BaseComponent<ImageContent, ImageStyles & BaseStyles> {
  type: ComponentType.IMAGE;
}

// ============================================================================
// SEPARATOR COMPONENT
// ============================================================================

/**
 * Separator orientation
 */
export type SeparatorOrientation = 'horizontal' | 'vertical';

/**
 * Separator content
 */
export interface SeparatorContent {
  /**
   * Separator orientation
   */
  orientation: SeparatorOrientation;

  /**
   * Separator thickness
   */
  thickness: CSSValue;

  /**
   * Separator color
   */
  color: string;

  /**
   * Separator style
   */
  style: 'solid' | 'dashed' | 'dotted' | 'double';
}

/**
 * Separator component
 */
export interface SeparatorComponent extends BaseComponent<SeparatorContent> {
  type: ComponentType.SEPARATOR;
}

// ============================================================================
// SPACER COMPONENT
// ============================================================================

/**
 * Spacer content
 */
export interface SpacerContent {
  /**
   * Spacer height (for horizontal spacing)
   */
  height?: CSSValue;

  /**
   * Spacer width (for vertical spacing)
   */
  width?: CSSValue;
}

/**
 * Spacer component
 */
export interface SpacerComponent extends BaseComponent<SpacerContent> {
  type: ComponentType.SPACER;
}

// ============================================================================
// UNION TYPE
// ============================================================================

/**
 * Union of all base component types
 */
export type AnyBaseComponent =
  | ButtonComponent
  | TextComponent
  | ImageComponent
  | SeparatorComponent
  | SpacerComponent;
