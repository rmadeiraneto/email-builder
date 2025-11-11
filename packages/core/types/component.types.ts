/**
 * Component type definitions
 *
 * Defines the base component interface and all component-specific types
 */

/**
 * Component category for organization
 */
export enum ComponentCategory {
  BASE = 'base',
  NAVIGATION = 'navigation',
  CONTENT = 'content',
  CUSTOM = 'custom',
}

/**
 * Component type identifiers
 */
export enum ComponentType {
  // Base components
  BUTTON = 'button',
  TEXT = 'text',
  IMAGE = 'image',
  SEPARATOR = 'separator',
  SPACER = 'spacer',

  // Email/Navigation components
  HEADER = 'header',
  FOOTER = 'footer',

  // Content components
  HERO = 'hero',
  LIST = 'list',
  CALL_TO_ACTION = 'cta',

  // Custom
  CUSTOM = 'custom',
}

/**
 * CSS unit types
 */
export type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw' | 'auto';

/**
 * CSS value with unit
 */
export interface CSSValue {
  value: number | 'auto';
  unit: CSSUnit;
}

/**
 * Spacing configuration (for padding, margin)
 */
export interface Spacing {
  top: CSSValue;
  right: CSSValue;
  bottom: CSSValue;
  left: CSSValue;
}

/**
 * Border configuration
 */
export interface Border {
  width: CSSValue;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius?: BorderRadius;
}

/**
 * Border radius configuration
 */
export interface BorderRadius {
  topLeft: CSSValue;
  topRight: CSSValue;
  bottomRight: CSSValue;
  bottomLeft: CSSValue;
}

/**
 * Alignment options
 */
export type HorizontalAlign = 'left' | 'center' | 'right' | 'justify';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

/**
 * Base styles that all components support
 */
export interface BaseStyles {
  /**
   * Background color (hex, rgb, rgba)
   */
  backgroundColor?: string;

  /**
   * Background image
   */
  backgroundImage?: string;

  /**
   * Border configuration
   */
  border?: Border;

  /**
   * Padding
   */
  padding?: Spacing;

  /**
   * Margin
   */
  margin?: Spacing;

  /**
   * Width
   */
  width?: CSSValue;

  /**
   * Height
   */
  height?: CSSValue;

  /**
   * Horizontal alignment
   */
  horizontalAlign?: HorizontalAlign;

  /**
   * Vertical alignment
   */
  verticalAlign?: VerticalAlign;

  /**
   * Custom CSS classes
   */
  customClasses?: string[];

  /**
   * Custom inline styles (for advanced users)
   */
  customStyles?: Record<string, string>;

  /**
   * Font family
   */
  fontFamily?: string;

  /**
   * Font size
   */
  fontSize?: CSSValue;

  /**
   * Font weight
   */
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';

  /**
   * Text color
   */
  color?: string;

  /**
   * Text alignment
   */
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  /**
   * Line height
   */
  lineHeight?: CSSValue | string;

  /**
   * Display mode
   */
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';

  /**
   * Object fit for images
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

  /**
   * Link styles configuration
   */
  linkStyles?: {
    fontFamily?: string;
    fontSize?: CSSValue | string;
    fontWeight?: number;
    color?: string;
    textDecoration?: string;
    hover?: {
      color?: string;
      textDecoration?: string;
    };
  };

  /**
   * Text styles configuration
   */
  textStyles?: {
    fontFamily?: string;
    fontSize?: CSSValue | string;
    lineHeight?: CSSValue | string;
    color?: string;
  };

  /**
   * Heading styles (for Hero, CTA components)
   */
  headingStyles?: {
    fontFamily?: string;
    fontSize?: CSSValue;
    fontWeight?: number;
    color?: string;
    lineHeight?: CSSValue;
  };

  /**
   * Description styles (for Hero, CTA components)
   */
  descriptionStyles?: {
    fontFamily?: string;
    fontSize?: CSSValue;
    fontWeight?: number;
    color?: string;
    lineHeight?: CSSValue;
  };

  /**
   * Title styles (for List component)
   */
  titleStyles?: {
    fontFamily?: string;
    fontSize?: CSSValue;
    fontWeight?: number;
    color?: string;
    lineHeight?: CSSValue;
  };

  /**
   * Item gap (for List component)
   */
  itemGap?: CSSValue;

  /**
   * Social icon size (for Footer component)
   */
  socialIconSize?: CSSValue;

  /**
   * Content maximum width (for Email components)
   */
  contentMaxWidth?: CSSValue;

  /**
   * Button gap (for CTA component)
   */
  buttonGap?: CSSValue;

  /**
   * Item padding (for List component)
   */
  itemPadding?: CSSValue;

  /**
   * Component variant (for styling variations)
   */
  variant?: string;

  /**
   * Social icon gap (for Footer component)
   */
  socialIconGap?: CSSValue;

  /**
   * Social icon color (for Footer component)
   */
  socialIconColor?: string;

  /**
   * Social icon hover color (for Footer component)
   */
  socialIconHoverColor?: string;

  /**
   * Content alignment (for Email components)
   */
  contentAlign?: 'left' | 'center' | 'right';

  /**
   * Hover background color
   */
  hoverBackgroundColor?: string;

  /**
   * Hover color
   */
  hoverColor?: string;

  /**
   * Link hover color
   */
  linkHoverColor?: string;

  /**
   * Navigation gap (for Header/Footer components)
   */
  navigationGap?: CSSValue;

  /**
   * Section gap (for Footer component)
   */
  sectionGap?: CSSValue;

  /**
   * Image maximum width
   */
  imageMaxWidth?: CSSValue;

  /**
   * Image maximum height
   */
  imageMaxHeight?: CSSValue;
}

/**
 * Component visibility per device
 * @deprecated Use ResponsiveVisibility from responsive.types.ts instead
 */
export interface ResponsiveVisibility {
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
}

/**
 * Component metadata (for UI display and organization)
 */
export interface ComponentMetadata {
  /**
   * Display name
   */
  name: string;

  /**
   * Component description
   */
  description?: string;

  /**
   * Icon name (Remix Icon)
   */
  icon?: string;

  /**
   * Component category
   */
  category: ComponentCategory;

  /**
   * Tags for search/filtering
   */
  tags?: string[];

  /**
   * Preview thumbnail URL
   */
  thumbnail?: string;

  /**
   * Whether this is a custom component
   */
  isCustom?: boolean;
}

/**
 * Component validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Component serialized data (for save/load)
 */
export interface SerializedComponent {
  id: string;
  type: ComponentType | string;
  content: Record<string, unknown>;
  styles: BaseStyles;
  metadata: ComponentMetadata;
  children?: SerializedComponent[];
  version: string;
}

/**
 * Base component interface
 *
 * All components must implement this interface
 *
 * @template TContent - The type of the component's content
 * @template TStyles - The type of the component's styles (extends BaseStyles)
 */
export interface BaseComponent<
  TContent = Record<string, unknown>,
  TStyles extends BaseStyles = BaseStyles
> {
  /**
   * Unique component ID
   */
  id: string;

  /**
   * Component type
   */
  type: ComponentType | string;

  /**
   * Component metadata
   */
  metadata: ComponentMetadata;

  /**
   * Base styles (desktop/default)
   *
   * For Mobile Dev Mode: This is the desktop/base style.
   * Mobile overrides are stored in `mobileStyles`.
   */
  styles: TStyles;

  /**
   * Mobile style overrides (Mobile Dev Mode)
   *
   * Optional partial styles that override desktop styles on mobile.
   * Properties not specified inherit from `styles` (desktop).
   */
  mobileStyles?: Partial<TStyles>;

  /**
   * Component-specific content
   */
  content: TContent;

  /**
   * Child components (for container components)
   */
  children?: BaseComponent[];

  /**
   * Parent component ID (if nested)
   */
  parentId?: string;

  /**
   * Component visibility per device (Mobile Dev Mode)
   */
  visibility?: import('../mobile').ComponentVisibility;

  /**
   * Responsive configuration (legacy system)
   * @deprecated Use Mobile Dev Mode (mobileStyles, visibility) instead
   */
  responsive?: import('./responsive.types').ComponentResponsiveConfig;

  /**
   * Creation timestamp
   */
  createdAt: number;

  /**
   * Last update timestamp
   */
  updatedAt: number;

  /**
   * Component version (for migration/compatibility)
   */
  version: string;
}

/**
 * Component definition (registry entry)
 */
export interface ComponentDefinition {
  /**
   * Component type
   */
  type: ComponentType | string;

  /**
   * Component metadata
   */
  metadata: ComponentMetadata;

  /**
   * Default content
   */
  defaultContent: Record<string, unknown>;

  /**
   * Default styles
   */
  defaultStyles: BaseStyles;

  /**
   * Content schema for validation
   */
  contentSchema?: Record<string, unknown>;

  /**
   * Available style presets
   */
  presets?: ComponentPreset[];

  /**
   * Factory function to create new instance
   */
  create: () => BaseComponent;

  /**
   * Validation function
   */
  validate?: (component: BaseComponent) => ValidationResult;

  /**
   * Render function (returns HTML)
   */
  render?: (component: BaseComponent) => string;
}

/**
 * Component style preset
 */
export interface ComponentPreset {
  /**
   * Preset ID
   */
  id: string;

  /**
   * Preset name
   */
  name: string;

  /**
   * Preset description
   */
  description?: string | undefined;

  /**
   * Preview thumbnail
   */
  thumbnail?: string | undefined;

  /**
   * Preset styles (can include component-specific styles beyond BaseStyles)
   */
  styles: any;

  /**
   * Whether this is a custom preset
   */
  isCustom?: boolean | undefined;

  /**
   * Creation timestamp
   */
  createdAt?: number | undefined;
}
