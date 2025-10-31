/**
 * Base component factories
 *
 * Factory functions for creating base components with default values
 */

import {
  ComponentType,
  ComponentCategory,
} from '../../types';
import type {
  ButtonComponent,
  TextComponent,
  ImageComponent,
  SeparatorComponent,
  SpacerComponent,
} from '../../types';
import {
  generateId,
  createCSSValue,
  createDefaultSpacing,
  createDefaultVisibility,
  getCurrentTimestamp,
  DEFAULT_VERSION,
} from './utils';

/**
 * Creates a Button component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Button component
 */
export function createButton(
  overrides?: Partial<ButtonComponent>
): ButtonComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('button'),
    type: ComponentType.BUTTON,
    metadata: {
      name: 'Button',
      description: 'A clickable button component',
      icon: 'ri-link',
      category: ComponentCategory.BASE,
      tags: ['button', 'cta', 'action'],
    },
    styles: {
      backgroundColor: '#007bff',
      padding: createDefaultSpacing(),
      border: {
        width: createCSSValue(1),
        style: 'solid',
        color: '#007bff',
        radius: {
          topLeft: createCSSValue(4),
          topRight: createCSSValue(4),
          bottomRight: createCSSValue(4),
          bottomLeft: createCSSValue(4),
        },
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(16),
      fontWeight: 500,
      color: '#ffffff',
      textAlign: 'center',
      variant: 'filled',
      hoverBackgroundColor: '#0056b3',
      hoverColor: '#ffffff',
    },
    content: {
      text: 'Click me',
      link: {
        href: 'https://example.com',
        target: '_blank',
      },
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a Text component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Text component
 */
export function createText(
  overrides?: Partial<TextComponent>
): TextComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('text'),
    type: ComponentType.TEXT,
    metadata: {
      name: 'Text',
      description: 'A text content component',
      icon: 'ri-text',
      category: ComponentCategory.BASE,
      tags: ['text', 'content', 'paragraph'],
    },
    styles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(16),
      fontWeight: 400,
      color: '#333333',
      lineHeight: createCSSValue(1.5),
      textAlign: 'left',
    },
    content: {
      type: 'paragraph',
      html: '<p>Enter your text here...</p>',
      plainText: 'Enter your text here...',
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates an Image component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Image component
 */
export function createImage(
  overrides?: Partial<ImageComponent>
): ImageComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('image'),
    type: ComponentType.IMAGE,
    metadata: {
      name: 'Image',
      description: 'An image component',
      icon: 'ri-image-line',
      category: ComponentCategory.BASE,
      tags: ['image', 'media', 'photo'],
    },
    styles: {
      width: createCSSValue(100, '%'),
      objectFit: 'cover',
      display: 'block',
    },
    content: {
      src: 'https://via.placeholder.com/600x400',
      alt: 'Placeholder image',
      title: 'Image',
      lazy: true,
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a Separator component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Separator component
 */
export function createSeparator(
  overrides?: Partial<SeparatorComponent>
): SeparatorComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('separator'),
    type: ComponentType.SEPARATOR,
    metadata: {
      name: 'Separator',
      description: 'A horizontal or vertical separator line',
      icon: 'ri-separator',
      category: ComponentCategory.BASE,
      tags: ['separator', 'divider', 'line'],
    },
    styles: {},
    content: {
      orientation: 'horizontal',
      thickness: createCSSValue(1),
      color: '#e0e0e0',
      style: 'solid',
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a Spacer component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Spacer component
 */
export function createSpacer(
  overrides?: Partial<SpacerComponent>
): SpacerComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('spacer'),
    type: ComponentType.SPACER,
    metadata: {
      name: 'Spacer',
      description: 'A flexible spacing component',
      icon: 'ri-space',
      category: ComponentCategory.BASE,
      tags: ['spacer', 'spacing', 'gap'],
    },
    styles: {},
    content: {
      height: createCSSValue(20),
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}
