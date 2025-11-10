/**
 * Default English (US) Translations
 *
 * This file contains all translatable strings for the email builder.
 * Keys use dot notation for organization: section.subsection.key
 */

import type { TranslationDictionary } from '../types';

export const enUS: TranslationDictionary = {
  // ===========================
  // UI - Toolbar
  // ===========================
  ui: {
    toolbar: {
      new: 'New',
      save: 'Save',
      load: 'Load',
      undo: 'Undo',
      redo: 'Redo',
      export: 'Export',
      preview: 'Preview',
      check: 'Check',
      test: 'Test',
      settings: 'Settings',
      testMode: 'Test Mode',
      newTemplateTitle: 'Create new template',
      saveTemplateTitle: 'Save template',
      loadTemplateTitle: 'Load template',
      undoTitle: 'Undo last action',
      redoTitle: 'Redo last action',
      exportTitle: 'Export template',
      previewTitle: 'Preview template',
      checkCompatibilityTitle: 'Check email client compatibility',
      testEmailClientsTitle: 'Test in email clients',
      emailTestingSettingsTitle: 'Email testing settings',
    },

    // Component Palette
    palette: {
      searchPlaceholder: 'Search components...',
      allComponents: 'All',
      emptyState: 'No components found',
      categories: {
        all: 'All',
        base: 'Base',
        email: 'Email',
        custom: 'Custom',
      },
    },

    // Property Panel
    panel: {
      content: 'Content',
      styles: 'Style',
      settings: 'Settings',
      noSelection: 'No component selected',
      selectComponent: 'Select a component to edit its properties',
      generalSettings: 'General Settings',
      componentProperties: 'Component Properties',
      stylePresets: 'Style Presets',
      applyPreset: 'Apply Preset',
      createPreset: 'Create Preset',
      managePresets: 'Manage Presets',
      tabs: {
        components: 'Components',
        general: 'General Styles',
      },
    },

    // Modals
    modal: {
      close: 'Close',
      cancel: 'Cancel',
      save: 'Save',
      create: 'Create',
      delete: 'Delete',
      confirm: 'Confirm',
      apply: 'Apply',
    },

    // Common UI
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
    },
  },

  // ===========================
  // Properties - Canvas Settings
  // ===========================
  property: {
    canvas: {
      width: 'Canvas Width',
      widthDescription: 'Canvas width in pixels (email: typically 600px)',
      maxWidth: 'Max Width',
      maxWidthDescription: 'Maximum width for responsive layouts',
      background: 'Canvas Background',
      border: 'Canvas Border',
      borderPlaceholder: '1px solid #ddd',
      borderDescription: 'CSS border shorthand (e.g., "1px solid #ddd")',
    },

    // Default Component Styles
    defaultComponent: {
      background: 'Default Component Background',
      border: 'Default Component Border',
      borderPlaceholder: '1px solid #eee',
      borderDescription: 'CSS border shorthand',
    },

    // Typography
    typography: {
      // Body
      bodyFontFamily: 'Body Font Family',
      bodyFontSize: 'Body Font Size',
      bodyTextColor: 'Body Text Color',
      bodyLineHeight: 'Body Line Height',

      // Paragraph
      paragraphFontSize: 'Paragraph Font Size',
      paragraphColor: 'Paragraph Color',
      paragraphLineHeight: 'Paragraph Line Height',

      // Headings
      h1FontSize: 'H1 Font Size',
      h1Color: 'H1 Color',
      h1Weight: 'H1 Weight',
      h2FontSize: 'H2 Font Size',
      h2Color: 'H2 Color',
      h2Weight: 'H2 Weight',
      h3FontSize: 'H3 Font Size',
      h3Color: 'H3 Color',
      h3Weight: 'H3 Weight',

      // Font options
      fontFamily: {
        arial: 'Arial',
        georgia: 'Georgia',
        helvetica: 'Helvetica',
        timesNewRoman: 'Times New Roman',
        verdana: 'Verdana',
      },

      // Font weights
      fontWeight: {
        normal: 'Normal',
        bold: 'Bold',
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
      },
    },

    // Link Styles
    link: {
      color: 'Link Color',
      hoverColor: 'Link Hover Color',
    },

    // Button Styles
    button: {
      background: 'Button Background',
      textColor: 'Button Text Color',
      borderRadius: 'Button Border Radius',
      padding: 'Button Padding',
      text: 'Button Text',
      textPlaceholder: 'Enter button text',
      linkUrl: 'Link URL',
      linkUrlPlaceholder: 'https://example.com',
    },

    // Text Component
    text: {
      content: 'Text Content',
      contentPlaceholder: 'Enter text content',
      fontFamily: 'Font Family',
      fontSize: 'Font Size',
      fontSizePlaceholder: '16px',
      fontWeight: 'Font Weight',
      textColor: 'Text Color',
      textAlign: 'Text Align',
      textAlignOptions: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify',
      },
      lineHeight: 'Line Height',
      lineHeightPlaceholder: '1.5',
    },

    // Image Component
    image: {
      url: 'Image URL',
      urlPlaceholder: 'https://example.com/image.jpg',
      altText: 'Alt Text',
      altTextPlaceholder: 'Describe the image',
      width: 'Width',
      height: 'Height',
      alignment: 'Alignment',
      alignmentOptions: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
      },
    },

    // Separator Component
    separator: {
      height: 'Height',
      color: 'Color',
      style: 'Style',
      styleOptions: {
        solid: 'Solid',
        dashed: 'Dashed',
        dotted: 'Dotted',
      },
    },

    // Spacer Component
    spacer: {
      height: 'Height',
      heightPlaceholder: '20px',
    },

    // General
    general: {
      backgroundColor: 'Background Color',
      textColor: 'Text Color',
      borderColor: 'Border Color',
      margin: 'Margin',
      padding: 'Padding',
    },
  },

  // ===========================
  // Section Headers
  // ===========================
  section: {
    canvasDimensions: 'Canvas Dimensions',
    canvasAppearance: 'Canvas Appearance',
    defaultComponentStyles: 'Default Component Styles',
    typography: 'Typography',
    bodyTypography: 'Body Typography',
    paragraphTypography: 'Paragraph Typography',
    headingTypography: 'Heading Typography',
    linkStyles: 'Link Styles',
    buttonStyles: 'Button Styles',
    content: 'Content',
    styles: 'Styles',
    advanced: 'Advanced',
  },

  // ===========================
  // Components
  // ===========================
  component: {
    // Base Components
    button: {
      name: 'Button',
      description: 'A clickable button with customizable text and link',
      presets: {
        primary: {
          name: 'Primary',
          description: 'Bold blue button for primary actions',
        },
        secondary: {
          name: 'Secondary',
          description: 'Subtle gray button for secondary actions',
        },
        ghost: {
          name: 'Ghost',
          description: 'Transparent button with border',
        },
      },
    },

    text: {
      name: 'Text',
      description: 'Rich text content with formatting options',
      presets: {
        paragraph: {
          name: 'Paragraph',
          description: 'Standard paragraph text',
        },
        heading: {
          name: 'Heading',
          description: 'Large heading text',
        },
        small: {
          name: 'Small',
          description: 'Small text for footnotes',
        },
      },
    },

    image: {
      name: 'Image',
      description: 'Display images with alt text and alignment',
      presets: {
        standard: {
          name: 'Standard',
          description: 'Full-width responsive image',
        },
        thumbnail: {
          name: 'Thumbnail',
          description: 'Small thumbnail image',
        },
      },
    },

    separator: {
      name: 'Separator',
      description: 'Horizontal line to separate content',
      presets: {
        thin: {
          name: 'Thin',
          description: 'Thin subtle separator',
        },
        thick: {
          name: 'Thick',
          description: 'Thick bold separator',
        },
      },
    },

    spacer: {
      name: 'Spacer',
      description: 'Vertical spacing between components',
      presets: {
        small: {
          name: 'Small',
          description: 'Small spacing (20px)',
        },
        medium: {
          name: 'Medium',
          description: 'Medium spacing (40px)',
        },
        large: {
          name: 'Large',
          description: 'Large spacing (60px)',
        },
      },
    },

    // Email Components
    header: {
      name: 'Header',
      description: 'Email header with logo and branding',
      presets: {
        centered: {
          name: 'Centered',
          description: 'Centered logo header',
        },
        leftAligned: {
          name: 'Left Aligned',
          description: 'Left-aligned logo with menu',
        },
      },
    },

    footer: {
      name: 'Footer',
      description: 'Email footer with links and copyright',
      presets: {
        simple: {
          name: 'Simple',
          description: 'Simple footer with copyright',
        },
        detailed: {
          name: 'Detailed',
          description: 'Footer with social links and unsubscribe',
        },
      },
    },

    hero: {
      name: 'Hero',
      description: 'Large hero section with image and text',
      presets: {
        imageBackground: {
          name: 'Image Background',
          description: 'Hero with background image',
        },
        colorBackground: {
          name: 'Color Background',
          description: 'Hero with solid color background',
        },
      },
    },

    list: {
      name: 'List',
      description: 'Bulleted or numbered list of items',
      presets: {
        bulleted: {
          name: 'Bulleted',
          description: 'List with bullet points',
        },
        numbered: {
          name: 'Numbered',
          description: 'Numbered list',
        },
      },
    },

    cta: {
      name: 'Call-to-Action',
      description: 'Prominent call-to-action section',
      presets: {
        centered: {
          name: 'Centered',
          description: 'Centered CTA with button',
        },
        split: {
          name: 'Split',
          description: 'Split layout with image and CTA',
        },
      },
    },
  },

  // ===========================
  // Messages & Notifications
  // ===========================
  message: {
    saveSuccess: 'Template saved successfully',
    saveError: 'Failed to save template',
    loadSuccess: 'Template loaded successfully',
    loadError: 'Failed to load template',
    deleteSuccess: 'Template deleted successfully',
    deleteError: 'Failed to delete template',
    exportSuccess: 'Template exported successfully',
    exportError: 'Failed to export template',
    undoSuccess: 'Action undone',
    redoSuccess: 'Action redone',
    noUndoHistory: 'Nothing to undo',
    noRedoHistory: 'Nothing to redo',
    missingTranslation: 'Translation missing for key: {{key}}',
  },

  // ===========================
  // Validation & Errors
  // ===========================
  validation: {
    required: 'This field is required',
    invalidUrl: 'Please enter a valid URL',
    invalidEmail: 'Please enter a valid email address',
    invalidColor: 'Please enter a valid color',
    minValue: 'Value must be at least {{min}}',
    maxValue: 'Value must be at most {{max}}',
  },
};

export default enUS;
