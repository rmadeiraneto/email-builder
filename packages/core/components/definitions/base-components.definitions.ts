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
      errors: errors.length > 0 ? errors : undefined,
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
  create: () => createText(),
  validate: (component) => {
    const errors: string[] = [];
    const txt = component as TextComponent;

    if (!txt.content?.html && !txt.content?.plainText) {
      errors.push('Text content is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
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
    src: 'https://via.placeholder.com/600x400',
    alt: 'Placeholder image',
    title: 'Image',
    lazy: true,
  },
  defaultStyles: {
    width: { value: 100, unit: '%' },
    objectFit: 'cover',
    display: 'block',
  },
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
      errors: errors.length > 0 ? errors : undefined,
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
      errors: errors.length > 0 ? errors : undefined,
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
      errors: errors.length > 0 ? errors : undefined,
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
