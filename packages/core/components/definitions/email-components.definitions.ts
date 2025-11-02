/**
 * Email component definitions
 *
 * ComponentDefinition objects for all email-specific components
 */

import {
  ComponentType,
  ComponentCategory,
} from '../../types';
import type {
  ComponentDefinition,
  HeaderComponent,
  FooterComponent,
  HeroComponent,
  ListComponent,
  CTAComponent,
} from '../../types';
import {
  createHeader,
  createFooter,
  createHero,
  createList,
  createCTA,
} from '../factories';
import { createCSSValue, createUniformSpacing } from '../factories/utils';

/**
 * Header component definition
 */
export const headerDefinition: ComponentDefinition = {
  type: ComponentType.HEADER,
  metadata: {
    name: 'Header',
    description: 'A header component with logo and navigation',
    icon: 'ri-layout-top-line',
    category: ComponentCategory.NAVIGATION,
    tags: ['header', 'navigation', 'logo'],
  },
  defaultContent: {
    layout: 'image-left',
    image: {
      src: 'https://via.placeholder.com/200x60',
      alt: 'Company Logo',
      title: 'Logo',
    },
    navigationLinks: [],
    showNavigation: true,
  },
  defaultStyles: {
    backgroundColor: '#ffffff',
    padding: createUniformSpacing(20),
    linkStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(14),
      fontWeight: 500,
      color: '#333333',
      textDecoration: 'none',
    },
    linkHoverColor: '#007bff',
    navigationGap: createCSSValue(24),
    imageMaxWidth: createCSSValue(200),
    imageMaxHeight: createCSSValue(60),
  },
  presets: [
    {
      id: 'header-centered',
      name: 'Centered',
      description: 'Centered header with logo',
      styles: {
        backgroundColor: '#ffffff',
        padding: createUniformSpacing(24),
        textAlign: 'center',
        linkStyles: {
          fontSize: createCSSValue(14),
          fontWeight: 500,
          color: '#333333',
        },
        linkHoverColor: '#0066CC',
        navigationGap: createCSSValue(24),
      },
      isCustom: false,
    },
    {
      id: 'header-left-aligned',
      name: 'Left Aligned',
      description: 'Left-aligned header with navigation',
      styles: {
        backgroundColor: '#ffffff',
        padding: createUniformSpacing(20),
        textAlign: 'left',
        linkStyles: {
          fontSize: createCSSValue(14),
          fontWeight: 500,
          color: '#333333',
        },
        linkHoverColor: '#0066CC',
        navigationGap: createCSSValue(20),
      },
      isCustom: false,
    },
    {
      id: 'header-with-background',
      name: 'With Background',
      description: 'Header with colored background',
      styles: {
        backgroundColor: '#1a1a1a',
        padding: createUniformSpacing(24),
        textAlign: 'center',
        linkStyles: {
          fontSize: createCSSValue(14),
          fontWeight: 500,
          color: '#ffffff',
        },
        linkHoverColor: '#0066CC',
        navigationGap: createCSSValue(24),
      },
      isCustom: false,
    },
  ],
  create: () => createHeader(),
  validate: (component) => {
    const errors: string[] = [];
    const header = component as HeaderComponent;

    if (!header.content?.image?.src) {
      errors.push('Header image/logo is required');
    }

    if (!header.content?.image?.alt) {
      errors.push('Header image alt text is required for accessibility');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};

/**
 * Footer component definition
 */
export const footerDefinition: ComponentDefinition = {
  type: ComponentType.FOOTER,
  metadata: {
    name: 'Footer',
    description: 'A footer component with text and social links',
    icon: 'ri-layout-bottom-line',
    category: ComponentCategory.NAVIGATION,
    tags: ['footer', 'social', 'copyright'],
  },
  defaultContent: {
    textSections: [],
    socialLinks: [],
    showSocialLinks: true,
    copyrightText: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  },
  defaultStyles: {
    backgroundColor: '#f8f9fa',
    padding: createUniformSpacing(40),
    textStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(14),
      color: '#6c757d',
      lineHeight: createCSSValue(1.6),
    },
    socialIconSize: createCSSValue(24),
    socialIconGap: createCSSValue(16),
    socialIconColor: '#6c757d',
    socialIconHoverColor: '#007bff',
    sectionGap: createCSSValue(24),
  },
  presets: [
    {
      id: 'footer-simple',
      name: 'Simple',
      description: 'Simple footer with copyright text',
      styles: {
        backgroundColor: '#f8f9fa',
        padding: createUniformSpacing(32),
        textAlign: 'center',
        textStyles: {
          fontSize: createCSSValue(12),
          color: '#6c757d',
        },
      },
      isCustom: false,
    },
    {
      id: 'footer-social',
      name: 'Social',
      description: 'Footer with prominent social media links',
      styles: {
        backgroundColor: '#ffffff',
        padding: createUniformSpacing(40),
        textAlign: 'center',
        textStyles: {
          fontSize: createCSSValue(14),
          color: '#6c757d',
        },
        socialIconSize: createCSSValue(32),
        socialIconGap: createCSSValue(20),
        socialIconColor: '#0066CC',
        socialIconHoverColor: '#0052A3',
      },
      isCustom: false,
    },
    {
      id: 'footer-detailed',
      name: 'Detailed',
      description: 'Detailed footer with multiple sections',
      styles: {
        backgroundColor: '#1a1a1a',
        padding: createUniformSpacing(48),
        textAlign: 'left',
        textStyles: {
          fontSize: createCSSValue(14),
          color: '#cccccc',
        },
        socialIconSize: createCSSValue(24),
        socialIconGap: createCSSValue(16),
        socialIconColor: '#ffffff',
        socialIconHoverColor: '#0066CC',
        sectionGap: createCSSValue(32),
      },
      isCustom: false,
    },
  ],
  create: () => createFooter(),
  validate: (component) => {
    const errors: string[] = [];
    const footer = component as FooterComponent;

    if (!footer.content?.copyrightText) {
      errors.push('Footer copyright text is recommended');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};

/**
 * Hero component definition
 */
export const heroDefinition: ComponentDefinition = {
  type: ComponentType.HERO,
  metadata: {
    name: 'Hero',
    description: 'A hero section with image, heading, and CTA',
    icon: 'ri-layout-5-line',
    category: ComponentCategory.CONTENT,
    tags: ['hero', 'banner', 'cta'],
  },
  defaultContent: {
    layout: 'image-top',
    image: {
      src: 'https://via.placeholder.com/1200x600',
      alt: 'Hero image',
      title: 'Hero',
    },
    heading: {
      html: '<h1>Welcome to Our Platform</h1>',
      plainText: 'Welcome to Our Platform',
    },
    description: {
      html: '<p>Discover amazing features and start your journey with us today.</p>',
      plainText: 'Discover amazing features and start your journey with us today.',
    },
    button: {
      text: 'Get Started',
      link: {
        href: '#get-started',
        target: '_self',
      },
    },
    showButton: true,
  },
  defaultStyles: {
    backgroundColor: '#f8f9fa',
    padding: createUniformSpacing(60),
    headingStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(48),
      fontWeight: 700,
      color: '#212529',
      lineHeight: createCSSValue(1.2),
    },
    descriptionStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(18),
      fontWeight: 400,
      color: '#6c757d',
      lineHeight: createCSSValue(1.6),
    },
    contentMaxWidth: createCSSValue(600),
    contentAlign: 'center',
  },
  presets: [
    {
      id: 'hero-bold',
      name: 'Bold',
      description: 'Bold hero with large text and strong colors',
      styles: {
        backgroundColor: '#0066CC',
        padding: createUniformSpacing(80),
        headingStyles: {
          fontSize: createCSSValue(56),
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: createCSSValue(1.1),
        },
        descriptionStyles: {
          fontSize: createCSSValue(20),
          fontWeight: 400,
          color: '#e6f0ff',
          lineHeight: createCSSValue(1.6),
        },
        contentAlign: 'center',
      },
      isCustom: false,
    },
    {
      id: 'hero-minimal',
      name: 'Minimal',
      description: 'Clean minimal hero with subtle styling',
      styles: {
        backgroundColor: '#ffffff',
        padding: createUniformSpacing(60),
        headingStyles: {
          fontSize: createCSSValue(40),
          fontWeight: 600,
          color: '#1a1a1a',
          lineHeight: createCSSValue(1.3),
        },
        descriptionStyles: {
          fontSize: createCSSValue(16),
          fontWeight: 400,
          color: '#666666',
          lineHeight: createCSSValue(1.6),
        },
        contentAlign: 'left',
      },
      isCustom: false,
    },
    {
      id: 'hero-image-focus',
      name: 'Image Focus',
      description: 'Hero emphasizing the image with overlay text',
      styles: {
        backgroundColor: 'transparent',
        padding: createUniformSpacing(100),
        headingStyles: {
          fontSize: createCSSValue(48),
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: createCSSValue(1.2),
        },
        descriptionStyles: {
          fontSize: createCSSValue(18),
          fontWeight: 400,
          color: '#ffffff',
          lineHeight: createCSSValue(1.6),
        },
        contentAlign: 'center',
      },
      isCustom: false,
    },
  ],
  create: () => createHero(),
  validate: (component) => {
    const errors: string[] = [];
    const hero = component as HeroComponent;

    if (!hero.content?.heading?.html && !hero.content?.heading?.plainText) {
      errors.push('Hero heading is required');
    }

    if (!hero.content?.image?.src) {
      errors.push('Hero image is required');
    }

    if (!hero.content?.image?.alt) {
      errors.push('Hero image alt text is required for accessibility');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};

/**
 * List component definition
 */
export const listDefinition: ComponentDefinition = {
  type: ComponentType.LIST,
  metadata: {
    name: 'List',
    description: 'A list of items with images, titles, and descriptions',
    icon: 'ri-list-check',
    category: ComponentCategory.CONTENT,
    tags: ['list', 'items', 'grid'],
  },
  defaultContent: {
    orientation: 'horizontal',
    itemLayout: 'image-top',
    columns: 3,
    items: [],
  },
  defaultStyles: {
    padding: createUniformSpacing(40),
    itemGap: createCSSValue(24),
    titleStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(20),
      fontWeight: 600,
      color: '#212529',
    },
    descriptionStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(14),
      fontWeight: 400,
      color: '#6c757d',
      lineHeight: createCSSValue(1.6),
    },
    itemBackgroundColor: '#ffffff',
    itemPadding: createCSSValue(20),
    imageMaxWidth: createCSSValue(100, '%'),
    imageMaxHeight: createCSSValue(200),
  },
  presets: [
    {
      id: 'list-compact',
      name: 'Compact',
      description: 'Compact list with minimal spacing',
      styles: {
        padding: createUniformSpacing(24),
        itemGap: createCSSValue(16),
        titleStyles: {
          fontSize: createCSSValue(16),
          fontWeight: 600,
          color: '#212529',
        },
        descriptionStyles: {
          fontSize: createCSSValue(14),
          color: '#6c757d',
        },
        itemPadding: createCSSValue(12),
      },
      isCustom: false,
    },
    {
      id: 'list-spacious',
      name: 'Spacious',
      description: 'Spacious list with generous padding',
      styles: {
        padding: createUniformSpacing(48),
        itemGap: createCSSValue(32),
        titleStyles: {
          fontSize: createCSSValue(24),
          fontWeight: 600,
          color: '#212529',
        },
        descriptionStyles: {
          fontSize: createCSSValue(16),
          color: '#6c757d',
          lineHeight: createCSSValue(1.6),
        },
        itemPadding: createCSSValue(24),
        itemBackgroundColor: '#f8f9fa',
      },
      isCustom: false,
    },
    {
      id: 'list-grid',
      name: 'Grid',
      description: 'Grid layout for items',
      styles: {
        padding: createUniformSpacing(40),
        itemGap: createCSSValue(24),
        titleStyles: {
          fontSize: createCSSValue(18),
          fontWeight: 600,
          color: '#212529',
        },
        descriptionStyles: {
          fontSize: createCSSValue(14),
          color: '#6c757d',
        },
        itemPadding: createCSSValue(16),
        itemBackgroundColor: '#ffffff',
      },
      isCustom: false,
    },
  ],
  create: () => createList(),
  validate: (component) => {
    const errors: string[] = [];
    const list = component as ListComponent;

    if (!list.content?.items || list.content.items.length === 0) {
      errors.push('List must contain at least one item');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};

/**
 * CTA (Call to Action) component definition
 */
export const ctaDefinition: ComponentDefinition = {
  type: ComponentType.CALL_TO_ACTION,
  metadata: {
    name: 'Call to Action',
    description: 'A call-to-action section with buttons',
    icon: 'ri-external-link-line',
    category: ComponentCategory.CONTENT,
    tags: ['cta', 'action', 'conversion'],
  },
  defaultContent: {
    layout: 'centered',
    heading: {
      html: '<h2>Ready to Get Started?</h2>',
      plainText: 'Ready to Get Started?',
    },
    description: {
      html: '<p>Join thousands of users who trust our platform.</p>',
      plainText: 'Join thousands of users who trust our platform.',
    },
    primaryButton: {
      text: 'Start Free Trial',
      link: {
        href: '#signup',
        target: '_self',
      },
    },
    secondaryButton: {
      text: 'Learn More',
      link: {
        href: '#learn-more',
        target: '_self',
      },
    },
    showSecondaryButton: true,
    showDescription: true,
  },
  defaultStyles: {
    backgroundColor: '#007bff',
    padding: createUniformSpacing(60),
    headingStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(36),
      fontWeight: 700,
      color: '#ffffff',
      lineHeight: createCSSValue(1.2),
    },
    descriptionStyles: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: createCSSValue(18),
      fontWeight: 400,
      color: '#ffffff',
      lineHeight: createCSSValue(1.6),
    },
    buttonGap: createCSSValue(16),
    contentMaxWidth: createCSSValue(600),
  },
  presets: [
    {
      id: 'cta-bold',
      name: 'Bold',
      description: 'Bold CTA with strong colors',
      styles: {
        backgroundColor: '#0066CC',
        padding: createUniformSpacing(64),
        headingStyles: {
          fontSize: createCSSValue(40),
          fontWeight: 700,
          color: '#ffffff',
        },
        descriptionStyles: {
          fontSize: createCSSValue(18),
          color: '#e6f0ff',
        },
        buttonGap: createCSSValue(16),
      },
      isCustom: false,
    },
    {
      id: 'cta-subtle',
      name: 'Subtle',
      description: 'Subtle CTA with light background',
      styles: {
        backgroundColor: '#f8f9fa',
        padding: createUniformSpacing(48),
        headingStyles: {
          fontSize: createCSSValue(32),
          fontWeight: 600,
          color: '#212529',
        },
        descriptionStyles: {
          fontSize: createCSSValue(16),
          color: '#6c757d',
        },
        buttonGap: createCSSValue(12),
      },
      isCustom: false,
    },
    {
      id: 'cta-boxed',
      name: 'Boxed',
      description: 'CTA in a contained box with border',
      styles: {
        backgroundColor: '#ffffff',
        padding: createUniformSpacing(40),
        border: {
          width: { value: 2, unit: 'px' },
          style: 'solid',
          color: '#0066CC',
          radius: {
            topLeft: { value: 12, unit: 'px' },
            topRight: { value: 12, unit: 'px' },
            bottomRight: { value: 12, unit: 'px' },
            bottomLeft: { value: 12, unit: 'px' },
          },
        },
        headingStyles: {
          fontSize: createCSSValue(28),
          fontWeight: 600,
          color: '#212529',
        },
        descriptionStyles: {
          fontSize: createCSSValue(16),
          color: '#6c757d',
        },
        buttonGap: createCSSValue(16),
      },
      isCustom: false,
    },
  ],
  create: () => createCTA(),
  validate: (component) => {
    const errors: string[] = [];
    const cta = component as CTAComponent;

    if (!cta.content?.heading?.html && !cta.content?.heading?.plainText) {
      errors.push('CTA heading is required');
    }

    if (!cta.content?.primaryButton?.text) {
      errors.push('CTA primary button text is required');
    }

    if (!cta.content?.primaryButton?.link?.href) {
      errors.push('CTA primary button link is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  },
};

/**
 * All email component definitions
 */
export const emailComponentDefinitions: ComponentDefinition[] = [
  headerDefinition,
  footerDefinition,
  heroDefinition,
  listDefinition,
  ctaDefinition,
];
