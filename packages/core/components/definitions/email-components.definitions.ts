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
