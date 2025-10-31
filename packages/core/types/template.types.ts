/**
 * Template type definitions
 *
 * Defines the structure for email/web templates
 */

import type { BaseComponent } from './component.types';
import type { TextStyles } from './base-components.types';
import type { BuilderTarget } from './config.types';

/**
 * Template metadata
 */
export interface TemplateMetadata {
  /**
   * Template ID
   */
  id: string;

  /**
   * Template name
   */
  name: string;

  /**
   * Template description
   */
  description?: string;

  /**
   * Template author
   */
  author?: string;

  /**
   * Template thumbnail
   */
  thumbnail?: string;

  /**
   * Template tags
   */
  tags?: string[];

  /**
   * Template category
   */
  category?: string;

  /**
   * Template version
   */
  version: string;

  /**
   * Creation timestamp
   */
  createdAt: number;

  /**
   * Last update timestamp
   */
  updatedAt: number;
}

/**
 * Canvas dimensions
 */
export interface CanvasDimensions {
  /**
   * Width (email: typically 600px, web: flexible)
   */
  width: number;

  /**
   * Max width
   */
  maxWidth?: number;

  /**
   * Min width
   */
  minWidth?: number;

  /**
   * Height (auto by default)
   */
  height?: number | 'auto';
}

/**
 * Responsive breakpoints
 */
export interface ResponsiveBreakpoints {
  /**
   * Mobile breakpoint (default: 480px)
   */
  mobile: number;

  /**
   * Tablet breakpoint (default: 768px)
   */
  tablet: number;

  /**
   * Desktop breakpoint (default: 1024px)
   */
  desktop: number;
}

/**
 * Typography preset for a text type
 */
export interface TypographyPreset {
  /**
   * Preset name
   */
  name: string;

  /**
   * Typography styles
   */
  styles: TextStyles;
}

/**
 * General template styles
 *
 * These are the default styles applied to the canvas and components
 */
export interface GeneralStyles {
  /**
   * Canvas background color
   */
  canvasBackgroundColor?: string;

  /**
   * Canvas background image
   */
  canvasBackgroundImage?: string;

  /**
   * Canvas border
   */
  canvasBorder?: string;

  /**
   * Default component background color
   */
  defaultComponentBackgroundColor?: string;

  /**
   * Default component border
   */
  defaultComponentBorder?: string;

  /**
   * Typography presets
   */
  typography?: {
    body?: TypographyPreset;
    paragraph?: TypographyPreset;
    heading1?: TypographyPreset;
    heading2?: TypographyPreset;
    heading3?: TypographyPreset;
    heading4?: TypographyPreset;
    heading5?: TypographyPreset;
    heading6?: TypographyPreset;
  };

  /**
   * Default link styles
   */
  linkStyles?: TextStyles & {
    hoverColor?: string;
    underline?: boolean;
  };

  /**
   * Default button styles
   */
  buttonStyles?: TextStyles & {
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    padding?: string;
    borderRadius?: string;
  };
}

/**
 * Template settings
 */
export interface TemplateSettings {
  /**
   * Target platform
   */
  target: BuilderTarget;

  /**
   * Canvas dimensions
   */
  canvasDimensions: CanvasDimensions;

  /**
   * Responsive breakpoints
   */
  breakpoints: ResponsiveBreakpoints;

  /**
   * Enable responsive design
   */
  responsive: boolean;

  /**
   * Language/locale
   */
  locale: string;

  /**
   * RTL support
   */
  rtl?: boolean;
}

/**
 * Component tree node (for hierarchical rendering)
 */
export interface ComponentTreeNode {
  /**
   * Component data
   */
  component: BaseComponent;

  /**
   * Child nodes
   */
  children: ComponentTreeNode[];

  /**
   * Parent node ID
   */
  parentId: string | null;

  /**
   * Depth in tree
   */
  depth: number;

  /**
   * Order/position
   */
  order: number;
}

/**
 * Template data injection configuration
 */
export interface DataInjectionConfig {
  /**
   * Data source identifier
   */
  sourceId?: string;

  /**
   * Placeholder mappings
   */
  placeholders?: Record<string, string>;

  /**
   * Enable data injection
   */
  enabled: boolean;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  /**
   * Is template valid
   */
  valid: boolean;

  /**
   * Validation errors
   */
  errors: Array<{
    componentId?: string;
    field?: string;
    message: string;
    severity: 'error' | 'warning';
  }>;

  /**
   * Email compatibility warnings (for hybrid/email targets)
   */
  compatibilityWarnings?: Array<{
    componentId: string;
    feature: string;
    message: string;
    suggestion?: string;
  }>;
}

/**
 * Template export options
 */
export interface TemplateExportOptions {
  /**
   * Inline CSS styles
   */
  inlineStyles: boolean;

  /**
   * Minify HTML
   */
  minify: boolean;

  /**
   * Include comments
   */
  includeComments: boolean;

  /**
   * Target format
   */
  format: 'html' | 'json' | 'both';

  /**
   * Pretty print
   */
  prettyPrint?: boolean;
}

/**
 * Complete template structure
 */
export interface Template {
  /**
   * Template metadata
   */
  metadata: TemplateMetadata;

  /**
   * Template settings
   */
  settings: TemplateSettings;

  /**
   * General styles
   */
  generalStyles: GeneralStyles;

  /**
   * Components (flat array, ordered)
   */
  components: BaseComponent[];

  /**
   * Component tree (for hierarchical rendering)
   */
  componentTree?: ComponentTreeNode[];

  /**
   * Data injection configuration
   */
  dataInjection?: DataInjectionConfig;

  /**
   * Custom metadata
   */
  customData?: Record<string, unknown>;
}

/**
 * Template save data (serialized)
 */
export interface TemplateSaveData {
  /**
   * Template data
   */
  template: Template;

  /**
   * Save timestamp
   */
  savedAt: number;

  /**
   * Checksum for integrity
   */
  checksum?: string;

  /**
   * Compression used
   */
  compressed?: boolean;
}

/**
 * Template list item (for template library)
 */
export interface TemplateListItem {
  /**
   * Template ID
   */
  id: string;

  /**
   * Template name
   */
  name: string;

  /**
   * Description
   */
  description?: string;

  /**
   * Thumbnail
   */
  thumbnail?: string;

  /**
   * Tags
   */
  tags?: string[];

  /**
   * Category
   */
  category?: string;

  /**
   * Last modified
   */
  updatedAt: number;

  /**
   * Target platform
   */
  target: BuilderTarget;

  /**
   * Is custom template
   */
  isCustom?: boolean;
}
