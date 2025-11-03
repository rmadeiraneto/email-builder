/**
 * Email component factories
 *
 * Factory functions for creating email components with default values
 */

import {
  ComponentType,
  ComponentCategory,
} from '../../types';
import type {
  HeaderComponent,
  FooterComponent,
  HeroComponent,
  ListComponent,
  CTAComponent,
} from '../../types';
import {
  generateId,
  createCSSValue,
  createUniformSpacing,
  createDefaultVisibility,
  getCurrentTimestamp,
  DEFAULT_VERSION,
} from './utils';

/**
 * Creates a Header component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Header component
 */
export function createHeader(
  overrides?: Partial<HeaderComponent>
): HeaderComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('header'),
    type: ComponentType.HEADER,
    metadata: {
      name: 'Header',
      description: 'A header component with logo and navigation',
      icon: 'ri-layout-top-line',
      category: ComponentCategory.NAVIGATION,
      tags: ['header', 'navigation', 'logo'],
    },
    styles: {
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
    content: {
      layout: 'image-left',
      image: {
        src: 'https://placehold.co/200x60',
        alt: 'Company Logo',
        title: 'Logo',
      },
      navigationLinks: [
        {
          id: generateId('nav-link'),
          text: 'Home',
          link: { href: '#home' },
          order: 0,
        },
        {
          id: generateId('nav-link'),
          text: 'About',
          link: { href: '#about' },
          order: 1,
        },
        {
          id: generateId('nav-link'),
          text: 'Contact',
          link: { href: '#contact' },
          order: 2,
        },
      ],
      showNavigation: true,
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a Footer component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Footer component
 */
export function createFooter(
  overrides?: Partial<FooterComponent>
): FooterComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('footer'),
    type: ComponentType.FOOTER,
    metadata: {
      name: 'Footer',
      description: 'A footer component with text and social links',
      icon: 'ri-layout-bottom-line',
      category: ComponentCategory.NAVIGATION,
      tags: ['footer', 'social', 'copyright'],
    },
    styles: {
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
    content: {
      textSections: [
        {
          id: generateId('footer-section'),
          html: '<p>Stay connected with us on social media</p>',
          plainText: 'Stay connected with us on social media',
          order: 0,
        },
      ],
      socialLinks: [
        {
          id: generateId('social-link'),
          platform: 'facebook',
          url: 'https://facebook.com',
          icon: 'ri-facebook-fill',
          label: 'Facebook',
          order: 0,
        },
        {
          id: generateId('social-link'),
          platform: 'twitter',
          url: 'https://twitter.com',
          icon: 'ri-twitter-fill',
          label: 'Twitter',
          order: 1,
        },
        {
          id: generateId('social-link'),
          platform: 'instagram',
          url: 'https://instagram.com',
          icon: 'ri-instagram-fill',
          label: 'Instagram',
          order: 2,
        },
      ],
      showSocialLinks: true,
      copyrightText: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a Hero component with default values
 *
 * @param overrides - Optional property overrides
 * @returns Hero component
 */
export function createHero(
  overrides?: Partial<HeroComponent>
): HeroComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('hero'),
    type: ComponentType.HERO,
    metadata: {
      name: 'Hero',
      description: 'A hero section with image, heading, and CTA',
      icon: 'ri-layout-5-line',
      category: ComponentCategory.CONTENT,
      tags: ['hero', 'banner', 'cta'],
    },
    styles: {
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
    content: {
      layout: 'image-top',
      image: {
        src: 'https://placehold.co/1200x600',
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
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a List component with default values
 *
 * @param overrides - Optional property overrides
 * @returns List component
 */
export function createList(
  overrides?: Partial<ListComponent>
): ListComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('list'),
    type: ComponentType.LIST,
    metadata: {
      name: 'List',
      description: 'A list of items with images, titles, and descriptions',
      icon: 'ri-list-check',
      category: ComponentCategory.CONTENT,
      tags: ['list', 'items', 'grid'],
    },
    styles: {
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
    content: {
      orientation: 'horizontal',
      itemLayout: 'image-top',
      columns: 3,
      items: [
        {
          id: generateId('list-item'),
          image: {
            src: 'https://placehold.co/400x300',
            alt: 'Item 1',
          },
          title: {
            html: '<h3>Feature One</h3>',
            plainText: 'Feature One',
          },
          description: {
            html: '<p>Description of the first feature goes here.</p>',
            plainText: 'Description of the first feature goes here.',
          },
          button: {
            text: 'Learn More',
            link: { href: '#feature-1' },
          },
          showImage: true,
          showButton: true,
          order: 0,
        },
        {
          id: generateId('list-item'),
          image: {
            src: 'https://placehold.co/400x300',
            alt: 'Item 2',
          },
          title: {
            html: '<h3>Feature Two</h3>',
            plainText: 'Feature Two',
          },
          description: {
            html: '<p>Description of the second feature goes here.</p>',
            plainText: 'Description of the second feature goes here.',
          },
          button: {
            text: 'Learn More',
            link: { href: '#feature-2' },
          },
          showImage: true,
          showButton: true,
          order: 1,
        },
        {
          id: generateId('list-item'),
          image: {
            src: 'https://placehold.co/400x300',
            alt: 'Item 3',
          },
          title: {
            html: '<h3>Feature Three</h3>',
            plainText: 'Feature Three',
          },
          description: {
            html: '<p>Description of the third feature goes here.</p>',
            plainText: 'Description of the third feature goes here.',
          },
          button: {
            text: 'Learn More',
            link: { href: '#feature-3' },
          },
          showImage: true,
          showButton: true,
          order: 2,
        },
      ],
    },
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}

/**
 * Creates a CTA (Call to Action) component with default values
 *
 * @param overrides - Optional property overrides
 * @returns CTA component
 */
export function createCTA(
  overrides?: Partial<CTAComponent>
): CTAComponent {
  const timestamp = getCurrentTimestamp();

  return {
    id: generateId('cta'),
    type: ComponentType.CALL_TO_ACTION,
    metadata: {
      name: 'Call to Action',
      description: 'A call-to-action section with buttons',
      icon: 'ri-external-link-line',
      category: ComponentCategory.CONTENT,
      tags: ['cta', 'action', 'conversion'],
    },
    styles: {
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
    content: {
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
    visibility: createDefaultVisibility(),
    createdAt: timestamp,
    updatedAt: timestamp,
    version: DEFAULT_VERSION,
    ...overrides,
  };
}
