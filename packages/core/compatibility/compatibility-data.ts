/**
 * Email client compatibility data for CSS properties
 *
 * Data sourced from caniemail.com, Email on Acid, and Litmus documentation
 *
 * @module compatibility
 */

import type {
  CompatibilityInfo,
  PropertySupport,
} from './compatibility.types';
import { PropertyCategory, SupportLevel } from './compatibility.types';

/**
 * Helper to create full support entry
 */
function fullSupport(notes?: string[]): PropertySupport {
  const result: PropertySupport = {
    level: SupportLevel.FULL,
  };
  if (notes) {
    result.notes = notes;
  }
  return result;
}

/**
 * Helper to create partial support entry
 */
function partialSupport(notes: string[], workarounds?: string[]): PropertySupport {
  const result: PropertySupport = {
    level: SupportLevel.PARTIAL,
    notes,
  };
  if (workarounds) {
    result.workarounds = workarounds;
  }
  return result;
}

/**
 * Helper to create no support entry
 */
function noSupport(workarounds?: string[]): PropertySupport {
  const result: PropertySupport = {
    level: SupportLevel.NONE,
    notes: ['Not supported'],
  };
  if (workarounds) {
    result.workarounds = workarounds;
  }
  return result;
}

/**
 * Complete compatibility database
 * Maps CSS property names to their compatibility information
 */
export const COMPATIBILITY_DATABASE: Record<string, CompatibilityInfo> = {
  // ========================================
  // BORDERS
  // ========================================
  'border-radius': {
    property: 'border-radius',
    category: PropertyCategory.BORDERS,
    description: 'Rounds the corners of an element',
    generalNotes: [
      'Outlook (Windows) using Word rendering engine does not support border-radius',
      'Works well in most modern email clients',
    ],
    safeAlternatives: ['Use rounded corner images for critical design elements'],
    support: {
      'outlook-2016-win': noSupport(['Use VML rounded rectangles', 'Use background images']),
      'outlook-2019-win': noSupport(['Use VML rounded rectangles', 'Use background images']),
      'outlook-2021-win': noSupport(['Use VML rounded rectangles', 'Use background images']),
      'outlook-365-win': noSupport(['Use VML rounded rectangles', 'Use background images']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  // ========================================
  // VISUAL EFFECTS
  // ========================================
  'box-shadow': {
    property: 'box-shadow',
    category: PropertyCategory.VISUAL_EFFECTS,
    description: 'Adds shadow effects around an element',
    generalNotes: [
      'Poor support across email clients',
      'Outlook (Windows) does not support',
      'Consider if shadows are essential to design',
    ],
    safeAlternatives: ['Use border for subtle depth', 'Use background images with shadows'],
    support: {
      'outlook-2016-win': noSupport(['Use border for definition', 'Use images with shadows']),
      'outlook-2019-win': noSupport(['Use border for definition', 'Use images with shadows']),
      'outlook-2021-win': noSupport(['Use border for definition', 'Use images with shadows']),
      'outlook-365-win': noSupport(['Use border for definition', 'Use images with shadows']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': partialSupport(['May be stripped in some Gmail configurations']),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  'background-image': {
    property: 'background-image',
    category: PropertyCategory.COLORS,
    description: 'Sets a background image for an element',
    generalNotes: [
      'Outlook (Windows) blocks by default unless using VML',
      'Gmail may strip in some cases',
      'Always provide background-color fallback',
    ],
    safeAlternatives: ['Use <img> tags instead', 'Use solid background-color'],
    support: {
      'outlook-2016-win': partialSupport(
        ['Requires VML for support'],
        ['Use VML background images', 'Use solid background-color fallback']
      ),
      'outlook-2019-win': partialSupport(
        ['Requires VML for support'],
        ['Use VML background images', 'Use solid background-color fallback']
      ),
      'outlook-2021-win': partialSupport(
        ['Requires VML for support'],
        ['Use VML background images', 'Use solid background-color fallback']
      ),
      'outlook-365-win': partialSupport(
        ['Requires VML for support'],
        ['Use VML background images', 'Use solid background-color fallback']
      ),
      'outlook-2016-mac': fullSupport(['Always provide background-color fallback']),
      'outlook-2019-mac': fullSupport(['Always provide background-color fallback']),
      'outlook-365-mac': fullSupport(['Always provide background-color fallback']),
      'outlook-web': fullSupport(['Always provide background-color fallback']),
      'gmail-webmail': partialSupport(
        ['May be stripped', 'Use background-color fallback'],
        ['Use <img> with text overlay']
      ),
      'yahoo-webmail': fullSupport(['Always provide background-color fallback']),
      'aol-webmail': fullSupport(['Always provide background-color fallback']),
      'apple-mail-ios': fullSupport(['Always provide background-color fallback']),
      'apple-mail-ipados': fullSupport(['Always provide background-color fallback']),
      'apple-mail-macos': fullSupport(['Always provide background-color fallback']),
      'gmail-ios': fullSupport(['Always provide background-color fallback']),
      'gmail-android': fullSupport(['Always provide background-color fallback']),
      'samsung-email': fullSupport(['Always provide background-color fallback']),
      'outlook-ios': fullSupport(['Always provide background-color fallback']),
      'outlook-android': fullSupport(['Always provide background-color fallback']),
    },
  },

  'background-color': {
    property: 'background-color',
    category: PropertyCategory.COLORS,
    description: 'Sets the background color of an element',
    generalNotes: ['Excellent support across all email clients', 'Safe to use everywhere'],
    support: {
      'outlook-2016-win': fullSupport(),
      'outlook-2019-win': fullSupport(),
      'outlook-2021-win': fullSupport(),
      'outlook-365-win': fullSupport(),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  // ========================================
  // SPACING
  // ========================================
  padding: {
    property: 'padding',
    category: PropertyCategory.SPACING,
    description: 'Sets the padding (inner spacing) of an element',
    generalNotes: [
      'Good support across email clients',
      'Best applied to <td> elements in table-based layouts',
    ],
    support: {
      'outlook-2016-win': fullSupport(['Works best on <td> elements']),
      'outlook-2019-win': fullSupport(['Works best on <td> elements']),
      'outlook-2021-win': fullSupport(['Works best on <td> elements']),
      'outlook-365-win': fullSupport(['Works best on <td> elements']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  margin: {
    property: 'margin',
    category: PropertyCategory.SPACING,
    description: 'Sets the margin (outer spacing) of an element',
    generalNotes: [
      'Support varies by email client',
      'Avoid for critical spacing - use padding or table cells instead',
    ],
    safeAlternatives: ['Use padding instead', 'Use empty <td> for spacing'],
    support: {
      'outlook-2016-win': partialSupport(
        ['Limited support', 'May not work as expected'],
        ['Use padding instead', 'Use spacer tables/cells']
      ),
      'outlook-2019-win': partialSupport(
        ['Limited support', 'May not work as expected'],
        ['Use padding instead', 'Use spacer tables/cells']
      ),
      'outlook-2021-win': partialSupport(
        ['Limited support', 'May not work as expected'],
        ['Use padding instead', 'Use spacer tables/cells']
      ),
      'outlook-365-win': partialSupport(
        ['Limited support', 'May not work as expected'],
        ['Use padding instead', 'Use spacer tables/cells']
      ),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  // ========================================
  // LAYOUT / DISPLAY
  // ========================================
  display: {
    property: 'display',
    category: PropertyCategory.DISPLAY,
    description: 'Sets the display type of an element',
    generalNotes: [
      'Only basic values supported (block, inline, table, table-cell)',
      'Flexbox and Grid not supported in emails',
      'Use table-based layouts for email',
    ],
    safeAlternatives: ['Use <table> for layouts instead of flex/grid'],
    support: {
      'outlook-2016-win': partialSupport(
        ['Only supports: block, inline, table, table-cell, none'],
        ['Use <table> elements for layout']
      ),
      'outlook-2019-win': partialSupport(
        ['Only supports: block, inline, table, table-cell, none'],
        ['Use <table> elements for layout']
      ),
      'outlook-2021-win': partialSupport(
        ['Only supports: block, inline, table, table-cell, none'],
        ['Use <table> elements for layout']
      ),
      'outlook-365-win': partialSupport(
        ['Only supports: block, inline, table, table-cell, none'],
        ['Use <table> elements for layout']
      ),
      'outlook-2016-mac': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'outlook-2019-mac': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'outlook-365-mac': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'outlook-web': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'gmail-webmail': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'yahoo-webmail': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'aol-webmail': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'apple-mail-ios': partialSupport(
        ['Flex and Grid not recommended'],
        ['Use <table> elements for cross-client compatibility']
      ),
      'apple-mail-ipados': partialSupport(
        ['Flex and Grid not recommended'],
        ['Use <table> elements for cross-client compatibility']
      ),
      'apple-mail-macos': partialSupport(
        ['Flex and Grid not recommended'],
        ['Use <table> elements for cross-client compatibility']
      ),
      'gmail-ios': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'gmail-android': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'samsung-email': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'outlook-ios': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
      'outlook-android': partialSupport(
        ['Flex and Grid not supported'],
        ['Use <table> elements for layout']
      ),
    },
  },

  position: {
    property: 'position',
    category: PropertyCategory.POSITIONING,
    description: 'Sets the positioning method (static, relative, absolute, fixed)',
    generalNotes: [
      'Not supported in email clients',
      'Use table-based layouts instead',
    ],
    safeAlternatives: ['Use nested tables for positioning', 'Use align and valign attributes'],
    support: {
      'outlook-2016-win': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-2019-win': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-2021-win': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-365-win': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-2016-mac': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-2019-mac': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-365-mac': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-web': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'gmail-webmail': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'yahoo-webmail': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'aol-webmail': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'apple-mail-ios': partialSupport(
        ['Limited support', 'Not recommended for emails'],
        ['Use table-based layout']
      ),
      'apple-mail-ipados': partialSupport(
        ['Limited support', 'Not recommended for emails'],
        ['Use table-based layout']
      ),
      'apple-mail-macos': partialSupport(
        ['Limited support', 'Not recommended for emails'],
        ['Use table-based layout']
      ),
      'gmail-ios': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'gmail-android': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'samsung-email': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-ios': noSupport(['Use table-based layout', 'Use align/valign attributes']),
      'outlook-android': noSupport(['Use table-based layout', 'Use align/valign attributes']),
    },
  },

  // ========================================
  // TYPOGRAPHY
  // ========================================
  color: {
    property: 'color',
    category: PropertyCategory.TYPOGRAPHY,
    description: 'Sets the text color',
    generalNotes: ['Excellent support across all email clients', 'Safe to use everywhere'],
    support: {
      'outlook-2016-win': fullSupport(),
      'outlook-2019-win': fullSupport(),
      'outlook-2021-win': fullSupport(),
      'outlook-365-win': fullSupport(),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  'font-family': {
    property: 'font-family',
    category: PropertyCategory.TYPOGRAPHY,
    description: 'Sets the font family',
    generalNotes: [
      'Good support with web-safe fonts',
      'Web fonts (custom fonts) have limited support',
      'Always include fallback fonts',
    ],
    safeAlternatives: [
      'Use web-safe fonts: Arial, Helvetica, Times New Roman, Georgia, Courier',
      'Include fallback stack: "Custom Font", Arial, sans-serif',
    ],
    support: {
      'outlook-2016-win': fullSupport(['Web-safe fonts recommended', 'Always include fallbacks']),
      'outlook-2019-win': fullSupport(['Web-safe fonts recommended', 'Always include fallbacks']),
      'outlook-2021-win': fullSupport(['Web-safe fonts recommended', 'Always include fallbacks']),
      'outlook-365-win': fullSupport(['Web-safe fonts recommended', 'Always include fallbacks']),
      'outlook-2016-mac': fullSupport(['Supports web fonts with @font-face']),
      'outlook-2019-mac': fullSupport(['Supports web fonts with @font-face']),
      'outlook-365-mac': fullSupport(['Supports web fonts with @font-face']),
      'outlook-web': fullSupport(['Supports web fonts with @font-face']),
      'gmail-webmail': fullSupport(['Supports web fonts with @font-face']),
      'yahoo-webmail': fullSupport(['Web fonts may be stripped']),
      'aol-webmail': fullSupport(['Web fonts may be stripped']),
      'apple-mail-ios': fullSupport(['Supports web fonts with @font-face']),
      'apple-mail-ipados': fullSupport(['Supports web fonts with @font-face']),
      'apple-mail-macos': fullSupport(['Supports web fonts with @font-face']),
      'gmail-ios': fullSupport(['Supports web fonts with @font-face']),
      'gmail-android': fullSupport(['Supports web fonts with @font-face']),
      'samsung-email': fullSupport(['Web-safe fonts recommended']),
      'outlook-ios': fullSupport(['Supports web fonts with @font-face']),
      'outlook-android': fullSupport(['Supports web fonts with @font-face']),
    },
  },

  'font-size': {
    property: 'font-size',
    category: PropertyCategory.TYPOGRAPHY,
    description: 'Sets the font size',
    generalNotes: ['Excellent support', 'Use px or pt units for consistency'],
    support: {
      'outlook-2016-win': fullSupport(['Use px or pt units']),
      'outlook-2019-win': fullSupport(['Use px or pt units']),
      'outlook-2021-win': fullSupport(['Use px or pt units']),
      'outlook-365-win': fullSupport(['Use px or pt units']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  'text-align': {
    property: 'text-align',
    category: PropertyCategory.TYPOGRAPHY,
    description: 'Sets the horizontal alignment of text',
    generalNotes: ['Excellent support', 'Safe to use everywhere'],
    support: {
      'outlook-2016-win': fullSupport(),
      'outlook-2019-win': fullSupport(),
      'outlook-2021-win': fullSupport(),
      'outlook-365-win': fullSupport(),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  'line-height': {
    property: 'line-height',
    category: PropertyCategory.TYPOGRAPHY,
    description: 'Sets the line height (spacing between lines)',
    generalNotes: ['Good support', 'Use unitless values or px for best results'],
    support: {
      'outlook-2016-win': fullSupport(['Use unitless values or px']),
      'outlook-2019-win': fullSupport(['Use unitless values or px']),
      'outlook-2021-win': fullSupport(['Use unitless values or px']),
      'outlook-365-win': fullSupport(['Use unitless values or px']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  // ========================================
  // BORDERS
  // ========================================
  border: {
    property: 'border',
    category: PropertyCategory.BORDERS,
    description: 'Sets border width, style, and color',
    generalNotes: ['Excellent support', 'Safe to use everywhere'],
    support: {
      'outlook-2016-win': fullSupport(),
      'outlook-2019-win': fullSupport(),
      'outlook-2021-win': fullSupport(),
      'outlook-365-win': fullSupport(),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  // ========================================
  // IMAGES
  // ========================================
  width: {
    property: 'width',
    category: PropertyCategory.IMAGES,
    description: 'Sets the width of an element',
    generalNotes: [
      'Good support',
      'For images, use both width attribute and CSS',
      'Use max-width for responsive images',
    ],
    support: {
      'outlook-2016-win': fullSupport(['Use width attribute on images']),
      'outlook-2019-win': fullSupport(['Use width attribute on images']),
      'outlook-2021-win': fullSupport(['Use width attribute on images']),
      'outlook-365-win': fullSupport(['Use width attribute on images']),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },

  'max-width': {
    property: 'max-width',
    category: PropertyCategory.IMAGES,
    description: 'Sets the maximum width of an element',
    generalNotes: [
      'Good support for responsive emails',
      'Essential for mobile-friendly images',
    ],
    support: {
      'outlook-2016-win': partialSupport(
        ['Limited support', 'Use width instead for Outlook'],
        ['Use fixed width for Outlook, max-width for others']
      ),
      'outlook-2019-win': partialSupport(
        ['Limited support', 'Use width instead for Outlook'],
        ['Use fixed width for Outlook, max-width for others']
      ),
      'outlook-2021-win': partialSupport(
        ['Limited support', 'Use width instead for Outlook'],
        ['Use fixed width for Outlook, max-width for others']
      ),
      'outlook-365-win': partialSupport(
        ['Limited support', 'Use width instead for Outlook'],
        ['Use fixed width for Outlook, max-width for others']
      ),
      'outlook-2016-mac': fullSupport(),
      'outlook-2019-mac': fullSupport(),
      'outlook-365-mac': fullSupport(),
      'outlook-web': fullSupport(),
      'gmail-webmail': fullSupport(),
      'yahoo-webmail': fullSupport(),
      'aol-webmail': fullSupport(),
      'apple-mail-ios': fullSupport(),
      'apple-mail-ipados': fullSupport(),
      'apple-mail-macos': fullSupport(),
      'gmail-ios': fullSupport(),
      'gmail-android': fullSupport(),
      'samsung-email': fullSupport(),
      'outlook-ios': fullSupport(),
      'outlook-android': fullSupport(),
    },
  },
};

/**
 * Get all CSS properties in the database
 */
export function getAllProperties(): string[] {
  return Object.keys(COMPATIBILITY_DATABASE);
}

/**
 * Get compatibility info for a specific property
 */
export function getPropertyInfo(property: string): CompatibilityInfo | undefined {
  return COMPATIBILITY_DATABASE[property];
}

/**
 * Get all properties in a category
 */
export function getPropertiesByCategory(category: PropertyCategory): CompatibilityInfo[] {
  return Object.values(COMPATIBILITY_DATABASE).filter((info) => info.category === category);
}

/**
 * Check if a property exists in the database
 */
export function hasProperty(property: string): boolean {
  return property in COMPATIBILITY_DATABASE;
}
