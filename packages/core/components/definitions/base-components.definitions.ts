/**
 * Base component definitions
 *
 * ComponentDefinition objects for all base components
 */

import {
  ComponentType,
  ComponentCategory,
} from '../../types';
import type {
  ComponentDefinition,
  ButtonComponent,
  TextComponent,
  ImageComponent,
  SeparatorComponent,
  SpacerComponent,
} from '../../types';
import {
  createButton,
  createText,
  createImage,
  createSeparator,
  createSpacer,
} from '../factories';

/**
 * Button component definition
 */
export const buttonDefinition: ComponentDefinition = {
  type: ComponentType.BUTTON,
  metadata: {
    name: 'Button',
    description: 'A clickable button component',
    icon: 'ri-link',
    category: ComponentCategory.BASE,
    tags: ['button', 'cta', 'action'],
  },
  defaultContent: {
    text: 'Click me',
    link: {
      href: 'https://example.com',
      target: '_blank',
    },
  },
  defaultStyles: {
    backgroundColor: '#007bff',
    padding: {
      top: { value: 12, unit: 'px' },
      right: { value: 24, unit: 'px' },
      bottom: { value: 12, unit: 'px' },
      left: { value: 24, unit: 'px' },
    },
    border: {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: '#007bff',
      radius: {
        topLeft: { value: 4, unit: 'px' },
        topRight: { value: 4, unit: 'px' },
        bottomRight: { value: 4, unit: 'px' },
        bottomLeft: { value: 4, unit: 'px' },
      },
    },
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { value: 16, unit: 'px' },
    fontWeight: 500,
    color: '#ffffff',
    textAlign: 'center',
    variant: 'filled',
    hoverBackgroundColor: '#0056b3',
    hoverColor: '#ffffff',
  },
  presets: [
    {
      id: 'button-primary',
      name: 'Primary',
      description: 'Primary action button with bold blue styling',
      styles: {
        backgroundColor: '#0066CC',
        padding: {
          top: { value: 12, unit: 'px' },
          right: { value: 24, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
          left: { value: 24, unit: 'px' },
        },
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 600,
        color: '#ffffff',
        textAlign: 'center',
        hoverBackgroundColor: '#0052A3',
      },
      isCustom: false,
    },
    {
      id: 'button-secondary',
      name: 'Secondary',
      description: 'Secondary action button with outline style',
      styles: {
        backgroundColor: 'transparent',
        padding: {
          top: { value: 12, unit: 'px' },
          right: { value: 24, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
          left: { value: 24, unit: 'px' },
        },
        border: {
          width: { value: 2, unit: 'px' },
          style: 'solid',
          color: '#0066CC',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 500,
        color: '#0066CC',
        textAlign: 'center',
        hoverBackgroundColor: '#F0F7FF',
      },
      isCustom: false,
    },
    {
      id: 'button-success',
      name: 'Success',
      description: 'Success action button in green',
      styles: {
        backgroundColor: '#28A745',
        padding: {
          top: { value: 12, unit: 'px' },
          right: { value: 24, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
          left: { value: 24, unit: 'px' },
        },
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 600,
        color: '#ffffff',
        textAlign: 'center',
        hoverBackgroundColor: '#218838',
      },
      isCustom: false,
    },
    {
      id: 'button-danger',
      name: 'Danger',
      description: 'Danger/destructive action button in red',
      styles: {
        backgroundColor: '#DC3545',
        padding: {
          top: { value: 12, unit: 'px' },
          right: { value: 24, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
          left: { value: 24, unit: 'px' },
        },
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 600,
        color: '#ffffff',
        textAlign: 'center',
        hoverBackgroundColor: '#C82333',
      },
      isCustom: false,
    },
    {
      id: 'button-warning',
      name: 'Warning',
      description: 'Warning action button in yellow/orange',
      styles: {
        backgroundColor: '#FFC107',
        padding: {
          top: { value: 12, unit: 'px' },
          right: { value: 24, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
          left: { value: 24, unit: 'px' },
        },
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 600,
        color: '#212529',
        textAlign: 'center',
        hoverBackgroundColor: '#E0A800',
      },
      isCustom: false,
    },
    {
      id: 'button-link',
      name: 'Link',
      description: 'Text link style button without background',
      styles: {
        backgroundColor: 'transparent',
        padding: {
          top: { value: 4, unit: 'px' },
          right: { value: 8, unit: 'px' },
          bottom: { value: 4, unit: 'px' },
          left: { value: 8, unit: 'px' },
        },
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 0, unit: 'px' },
            topRight: { value: 0, unit: 'px' },
            bottomRight: { value: 0, unit: 'px' },
            bottomLeft: { value: 0, unit: 'px' },
          },
        },
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 400,
        color: '#0066CC',
        textAlign: 'left',
        hoverColor: '#0052A3',
      },
      isCustom: false,
    },
  ],
  create: () => createButton(),
  validate: (component) => {
    const errors: string[] = [];
    const btn = component as ButtonComponent;

    if (!btn.content?.text) {
      errors.push('Button text is required');
    }

    if (!btn.content?.link?.href) {
      errors.push('Button link href is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  },
};

/**
 * Text component definition
 */
export const textDefinition: ComponentDefinition = {
  type: ComponentType.TEXT,
  metadata: {
    name: 'Text',
    description: 'A text content component',
    icon: 'ri-text',
    category: ComponentCategory.BASE,
    tags: ['text', 'content', 'paragraph'],
  },
  defaultContent: {
    type: 'paragraph',
    html: '<p>Enter your text here...</p>',
    plainText: 'Enter your text here...',
  },
  defaultStyles: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: { value: 16, unit: 'px' },
    fontWeight: 400,
    color: '#333333',
    lineHeight: { value: 1.5, unit: '' },
    textAlign: 'left',
  },
  presets: [
    {
      id: 'text-heading-1',
      name: 'Heading 1',
      description: 'Large heading for page titles',
      styles: {
        fontSize: { value: 32, unit: 'px' },
        fontWeight: 700,
        color: '#1a1a1a',
        lineHeight: { value: 1.2, unit: '' },
        textAlign: 'left',
        margin: {
          top: { value: 0, unit: 'px' },
          bottom: { value: 16, unit: 'px' },
        },
      },
      isCustom: false,
    },
    {
      id: 'text-heading-2',
      name: 'Heading 2',
      description: 'Medium heading for section titles',
      styles: {
        fontSize: { value: 24, unit: 'px' },
        fontWeight: 600,
        color: '#1a1a1a',
        lineHeight: { value: 1.3, unit: '' },
        textAlign: 'left',
        margin: {
          top: { value: 0, unit: 'px' },
          bottom: { value: 12, unit: 'px' },
        },
      },
      isCustom: false,
    },
    {
      id: 'text-heading-3',
      name: 'Heading 3',
      description: 'Small heading for subsections',
      styles: {
        fontSize: { value: 20, unit: 'px' },
        fontWeight: 600,
        color: '#1a1a1a',
        lineHeight: { value: 1.4, unit: '' },
        textAlign: 'left',
        margin: {
          top: { value: 0, unit: 'px' },
          bottom: { value: 8, unit: 'px' },
        },
      },
      isCustom: false,
    },
    {
      id: 'text-paragraph',
      name: 'Paragraph',
      description: 'Standard body text',
      styles: {
        fontSize: { value: 16, unit: 'px' },
        fontWeight: 400,
        color: '#333333',
        lineHeight: { value: 1.6, unit: '' },
        textAlign: 'left',
        margin: {
          top: { value: 0, unit: 'px' },
          bottom: { value: 16, unit: 'px' },
        },
      },
      isCustom: false,
    },
    {
      id: 'text-small',
      name: 'Small Text',
      description: 'Smaller text for captions and notes',
      styles: {
        fontSize: { value: 14, unit: 'px' },
        fontWeight: 400,
        color: '#666666',
        lineHeight: { value: 1.5, unit: '' },
        textAlign: 'left',
        margin: {
          top: { value: 0, unit: 'px' },
          bottom: { value: 8, unit: 'px' },
        },
      },
      isCustom: false,
    },
  ],
  create: () => createText(),
  validate: (component) => {
    const errors: string[] = [];
    const txt = component as TextComponent;

    if (!txt.content?.html && !txt.content?.plainText) {
      errors.push('Text content is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  },
};

/**
 * Image component definition
 */
export const imageDefinition: ComponentDefinition = {
  type: ComponentType.IMAGE,
  metadata: {
    name: 'Image',
    description: 'An image component',
    icon: 'ri-image-line',
    category: ComponentCategory.BASE,
    tags: ['image', 'media', 'photo'],
  },
  defaultContent: {
    src: 'https://placehold.co/600x400',
    alt: 'Placeholder image',
    title: 'Image',
    lazy: true,
  },
  defaultStyles: {
    width: { value: 100, unit: '%' },
    objectFit: 'cover',
    display: 'block',
  },
  presets: [
    {
      id: 'image-full-width',
      name: 'Full Width',
      description: 'Full width responsive image',
      styles: {
        width: { value: 100, unit: '%' },
        height: { value: 'auto', unit: '' },
        objectFit: 'cover',
        display: 'block',
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 0, unit: 'px' },
            topRight: { value: 0, unit: 'px' },
            bottomRight: { value: 0, unit: 'px' },
            bottomLeft: { value: 0, unit: 'px' },
          },
        },
      },
      isCustom: false,
    },
    {
      id: 'image-thumbnail',
      name: 'Thumbnail',
      description: 'Small thumbnail image with border',
      styles: {
        width: { value: 150, unit: 'px' },
        height: { value: 150, unit: 'px' },
        objectFit: 'cover',
        display: 'block',
        border: {
          width: { value: 1, unit: 'px' },
          style: 'solid',
          color: '#dddddd',
          radius: {
            topLeft: { value: 4, unit: 'px' },
            topRight: { value: 4, unit: 'px' },
            bottomRight: { value: 4, unit: 'px' },
            bottomLeft: { value: 4, unit: 'px' },
          },
        },
      },
      isCustom: false,
    },
    {
      id: 'image-avatar',
      name: 'Avatar',
      description: 'Circular avatar image',
      styles: {
        width: { value: 100, unit: 'px' },
        height: { value: 100, unit: 'px' },
        objectFit: 'cover',
        display: 'block',
        border: {
          width: { value: 2, unit: 'px' },
          style: 'solid',
          color: '#ffffff',
          radius: {
            topLeft: { value: 50, unit: '%' },
            topRight: { value: 50, unit: '%' },
            bottomRight: { value: 50, unit: '%' },
            bottomLeft: { value: 50, unit: '%' },
          },
        },
      },
      isCustom: false,
    },
    {
      id: 'image-banner',
      name: 'Banner',
      description: 'Wide banner image with aspect ratio',
      styles: {
        width: { value: 100, unit: '%' },
        height: { value: 300, unit: 'px' },
        objectFit: 'cover',
        display: 'block',
        border: {
          width: { value: 0, unit: 'px' },
          style: 'none',
          color: 'transparent',
          radius: {
            topLeft: { value: 8, unit: 'px' },
            topRight: { value: 8, unit: 'px' },
            bottomRight: { value: 8, unit: 'px' },
            bottomLeft: { value: 8, unit: 'px' },
          },
        },
      },
      isCustom: false,
    },
  ],
  create: () => createImage(),
  validate: (component) => {
    const errors: string[] = [];
    const img = component as ImageComponent;

    if (!img.content?.src) {
      errors.push('Image src is required');
    }

    if (!img.content?.alt) {
      errors.push('Image alt text is required for accessibility');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  },
};

/**
 * Separator component definition
 */
export const separatorDefinition: ComponentDefinition = {
  type: ComponentType.SEPARATOR,
  metadata: {
    name: 'Separator',
    description: 'A horizontal or vertical separator line',
    icon: 'ri-separator',
    category: ComponentCategory.BASE,
    tags: ['separator', 'divider', 'line'],
  },
  defaultContent: {
    orientation: 'horizontal',
    thickness: { value: 1, unit: 'px' },
    color: '#e0e0e0',
    style: 'solid',
  },
  defaultStyles: {},
  create: () => createSeparator(),
  validate: (component) => {
    const errors: string[] = [];
    const sep = component as SeparatorComponent;

    if (!sep.content?.orientation) {
      errors.push('Separator orientation is required');
    }

    if (!sep.content?.thickness) {
      errors.push('Separator thickness is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  },
};

/**
 * Spacer component definition
 */
export const spacerDefinition: ComponentDefinition = {
  type: ComponentType.SPACER,
  metadata: {
    name: 'Spacer',
    description: 'A flexible spacing component',
    icon: 'ri-space',
    category: ComponentCategory.BASE,
    tags: ['spacer', 'spacing', 'gap'],
  },
  defaultContent: {
    height: { value: 20, unit: 'px' },
  },
  defaultStyles: {},
  create: () => createSpacer(),
  validate: (component) => {
    const errors: string[] = [];
    const spacer = component as SpacerComponent;

    if (!spacer.content?.height) {
      errors.push('Spacer height is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : [],
    };
  },
};

/**
 * All base component definitions
 */
export const baseComponentDefinitions: ComponentDefinition[] = [
  buttonDefinition,
  textDefinition,
  imageDefinition,
  separatorDefinition,
  spacerDefinition,
];
