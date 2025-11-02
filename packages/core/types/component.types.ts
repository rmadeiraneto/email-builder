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
}

/**
 * Component visibility per device
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
   * Base styles
   */
  styles: TStyles;

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
   * Responsive visibility
   */
  visibility?: ResponsiveVisibility;

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
