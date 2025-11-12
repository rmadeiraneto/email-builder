# Component API Reference

Complete reference for all email builder components, their properties, and how to use them programmatically.

## Table of Contents

- [Component Types](#component-types)
- [Base Components](#base-components)
- [Email Components](#email-components)
- [Creating Custom Components](#creating-custom-components)
- [Common Patterns](#common-patterns)
- [Component Styles Reference](#component-styles-reference)

## Component Types

The email builder provides 10 built-in component types:

### Base Components
- **Button** - Clickable button with link
- **Text** - Rich text content (paragraphs, headings)
- **Image** - Images with optional links
- **Separator** - Horizontal/vertical dividers
- **Spacer** - Empty spacing elements

### Email Components
- **Header** - Email header with logo and navigation
- **Footer** - Email footer with text and social links
- **Hero** - Hero section with heading, description, image, and buttons
- **List** - List of items with icons/images
- **CTA** - Call-to-action section with buttons

---

## Base Components

### Button Component

A clickable button that links to a URL.

**Type:** `ComponentType.BUTTON`

#### Content Properties

```typescript
interface ButtonContent {
  text: string;                     // Button text (required)
  link: LinkConfig;                 // Link configuration (required)
  icon?: string;                    // Remix Icon name (optional)
  iconPosition?: 'left' | 'right'; // Icon position
}

interface LinkConfig {
  href: string;                     // URL (required)
  target?: '_blank' | '_self' | '_parent' | '_top';
  title?: string;                   // Accessibility title
  rel?: string;                     // Link relationship
  tracking?: Record<string, string>; // Tracking parameters
}
```

#### Style Properties

```typescript
interface ButtonStyles extends BaseStyles {
  variant?: 'filled' | 'outlined' | 'text';
  hoverBackgroundColor?: string;
  hoverColor?: string;
  hoverBorderColor?: string;

  // Typography
  fontFamily?: string;
  fontSize?: CSSValue;
  fontWeight?: 100-900 | 'normal' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}
```

#### Programmatic Usage

```typescript
import { createButton } from '@email-builder/core/components/factories';

const button = createButton({
  content: {
    text: 'Click Me',
    link: {
      href: 'https://example.com',
      target: '_blank',
    },
    icon: 'ri-arrow-right-line',
    iconPosition: 'right',
  },
  styles: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    variant: 'filled',
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
        topLeft: { value: 4, unit: 'px' },
        topRight: { value: 4, unit: 'px' },
        bottomRight: { value: 4, unit: 'px' },
        bottomLeft: { value: 4, unit: 'px' },
      },
    },
    hoverBackgroundColor: '#0056b3',
  },
});
```

---

### Text Component

Rich text content with support for paragraphs and headings.

**Type:** `ComponentType.TEXT`

#### Content Properties

```typescript
interface TextContent {
  type: TextContentType;           // Text type (required)
  html: string;                     // HTML content (required)
  plainText?: string;               // Plain text fallback
  editorState?: string;             // Lexical editor state
}

type TextContentType =
  | 'paragraph'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'heading-5'
  | 'heading-6';
```

#### Style Properties

```typescript
interface TextStyles extends BaseStyles {
  fontFamily?: string;
  fontSize?: CSSValue;
  fontWeight?: 100-900 | 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic' | 'oblique';
  color?: string;
  lineHeight?: CSSValue;
  letterSpacing?: CSSValue;
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}
```

#### Programmatic Usage

```typescript
import { createText } from '@email-builder/core/components/factories';

const text = createText({
  content: {
    type: 'paragraph',
    html: '<p>Hello <strong>World</strong>!</p>',
    plainText: 'Hello World!',
  },
  styles: {
    fontSize: { value: 16, unit: 'px' },
    color: '#333333',
    lineHeight: { value: 1.6, unit: 'px' },
    textAlign: 'left',
  },
});
```

---

### Image Component

Displays images with optional links.

**Type:** `ComponentType.IMAGE`

#### Content Properties

```typescript
interface ImageContent {
  src: string;                      // Image URL (required)
  alt: string;                      // Alt text (required)
  title?: string;                   // Image title
  link?: LinkConfig;                // Optional link
  originalWidth?: number;           // Original width
  originalHeight?: number;          // Original height
  lazy?: boolean;                   // Lazy loading
}
```

#### Style Properties

```typescript
interface ImageStyles extends BaseStyles {
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  display?: 'block' | 'inline-block' | 'inline';
}
```

#### Programmatic Usage

```typescript
import { createImage } from '@email-builder/core/components/factories';

const image = createImage({
  content: {
    src: 'https://example.com/image.jpg',
    alt: 'Product Image',
    title: 'Our Amazing Product',
    link: {
      href: 'https://example.com/products',
      target: '_blank',
    },
    lazy: true,
  },
  styles: {
    width: { value: 600, unit: 'px' },
    objectFit: 'cover',
    horizontalAlign: 'center',
  },
});
```

---

### Separator Component

Horizontal or vertical dividing line.

**Type:** `ComponentType.SEPARATOR`

#### Content Properties

```typescript
interface SeparatorContent {
  orientation: 'horizontal' | 'vertical';
  thickness: CSSValue;
  color: string;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
}
```

#### Programmatic Usage

```typescript
import { createSeparator } from '@email-builder/core/components/factories';

const separator = createSeparator({
  content: {
    orientation: 'horizontal',
    thickness: { value: 1, unit: 'px' },
    color: '#e0e0e0',
    style: 'solid',
  },
  styles: {
    margin: {
      top: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 0, unit: 'px' },
      right: { value: 0, unit: 'px' },
    },
  },
});
```

---

### Spacer Component

Empty space for layout control.

**Type:** `ComponentType.SPACER`

#### Content Properties

```typescript
interface SpacerContent {
  height?: CSSValue;  // Height for horizontal spacing
  width?: CSSValue;   // Width for vertical spacing
}
```

#### Programmatic Usage

```typescript
import { createSpacer } from '@email-builder/core/components/factories';

const spacer = createSpacer({
  content: {
    height: { value: 40, unit: 'px' },
  },
  styles: {
    height: { value: 40, unit: 'px' },
  },
});
```

---

## Email Components

### Header Component

Email header with logo and navigation links.

**Type:** `ComponentType.HEADER`

#### Content Properties

```typescript
interface HeaderContent {
  layout: HeaderLayout;
  image: ImageContent;              // Logo
  navigationLinks: NavigationLink[];
  showNavigation: boolean;
}

type HeaderLayout =
  | 'image-top'
  | 'image-left'
  | 'image-right'
  | 'logo-center';

interface NavigationLink {
  id: string;
  text: string;
  link: LinkConfig;
  icon?: string;
  order: number;
}
```

#### Style Properties

```typescript
interface HeaderStyles extends BaseStyles {
  linkStyles?: TextStyles;
  linkHoverColor?: string;
  navigationGap?: CSSValue;
  imageMaxWidth?: CSSValue;
  imageMaxHeight?: CSSValue;
}
```

#### Programmatic Usage

```typescript
import { createHeader } from '@email-builder/core/components/factories';

const header = createHeader({
  content: {
    layout: 'image-left',
    image: {
      src: 'https://example.com/logo.png',
      alt: 'Company Logo',
      title: 'My Company',
    },
    navigationLinks: [
      {
        id: 'nav-1',
        text: 'Home',
        link: { href: 'https://example.com' },
        order: 0,
      },
      {
        id: 'nav-2',
        text: 'Products',
        link: { href: 'https://example.com/products' },
        order: 1,
      },
      {
        id: 'nav-3',
        text: 'Contact',
        link: { href: 'https://example.com/contact' },
        order: 2,
      },
    ],
    showNavigation: true,
  },
  styles: {
    backgroundColor: '#ffffff',
    padding: {
      top: { value: 20, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
    linkStyles: {
      fontSize: { value: 14, unit: 'px' },
      color: '#333333',
      fontWeight: 500,
    },
    linkHoverColor: '#007bff',
    navigationGap: { value: 24, unit: 'px' },
  },
});
```

---

### Footer Component

Email footer with text sections and social media links.

**Type:** `ComponentType.FOOTER`

#### Content Properties

```typescript
interface FooterContent {
  textSections: FooterTextSection[];
  socialLinks: SocialLink[];
  showSocialLinks: boolean;
  copyrightText?: string;
}

interface FooterTextSection {
  id: string;
  html: string;
  plainText?: string;
  order: number;
}

interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  icon: string;              // Remix Icon or custom URL
  label: string;             // Accessibility label
  order: number;
}

type SocialPlatform =
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'pinterest'
  | 'custom';
```

#### Style Properties

```typescript
interface FooterStyles extends BaseStyles {
  textStyles?: TextStyles;
  socialIconSize?: CSSValue;
  socialIconGap?: CSSValue;
  socialIconColor?: string;
  socialIconHoverColor?: string;
  sectionGap?: CSSValue;
}
```

#### Programmatic Usage

```typescript
import { createFooter } from '@email-builder/core/components/factories';

const footer = createFooter({
  content: {
    textSections: [
      {
        id: 'footer-text-1',
        html: '<p><strong>Acme Inc.</strong></p><p>123 Main St, San Francisco, CA 94102</p>',
        plainText: 'Acme Inc.\n123 Main St, San Francisco, CA 94102',
        order: 0,
      },
    ],
    socialLinks: [
      {
        id: 'social-facebook',
        label: 'Facebook',
        platform: 'facebook',
        url: 'https://facebook.com/acme',
        icon: 'ri-facebook-fill',
        order: 0,
      },
      {
        id: 'social-twitter',
        label: 'Twitter',
        platform: 'twitter',
        url: 'https://twitter.com/acme',
        icon: 'ri-twitter-fill',
        order: 1,
      },
    ],
    showSocialLinks: true,
    copyrightText: '© 2024 Acme Inc. All rights reserved.',
  },
  styles: {
    backgroundColor: '#f8f9fa',
    padding: {
      top: { value: 40, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 40, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
    textStyles: {
      fontSize: { value: 14, unit: 'px' },
      color: '#6c757d',
    },
    socialIconSize: { value: 24, unit: 'px' },
    socialIconGap: { value: 16, unit: 'px' },
    socialIconColor: '#6c757d',
    socialIconHoverColor: '#007bff',
  },
});
```

---

### Hero Component

Hero section with heading, description, image, and buttons.

**Type:** `ComponentType.HERO`

#### Content Properties

```typescript
interface HeroContent {
  layout: HeroLayout;
  image: ImageContent;
  heading: {
    html: string;
    plainText?: string;
  };
  description?: {
    html: string;
    plainText?: string;
  };
  button?: ButtonContent;
  showButton: boolean;
}

type HeroLayout =
  | 'image-background'
  | 'image-left'
  | 'image-right'
  | 'image-top';
```

#### Style Properties

```typescript
interface HeroStyles extends BaseStyles {
  headingStyles?: TextStyles;
  descriptionStyles?: TextStyles;
  contentMaxWidth?: CSSValue;
  contentAlign?: 'left' | 'center' | 'right';
  overlayColor?: string;           // For image-background
  overlayOpacity?: number;         // 0-1
}
```

#### Programmatic Usage

```typescript
import { createHero } from '@email-builder/core/components/factories';

const hero = createHero({
  content: {
    layout: 'image-top',
    image: {
      src: 'https://example.com/hero.jpg',
      alt: 'Hero Image',
    },
    heading: {
      html: 'Welcome to Our Platform',
      plainText: 'Welcome to Our Platform',
    },
    description: {
      html: 'Start building amazing email templates today.',
      plainText: 'Start building amazing email templates today.',
    },
    button: {
      text: 'Get Started',
      link: { href: 'https://example.com/start', target: '_blank' },
    },
    showButton: true,
  },
  styles: {
    backgroundColor: '#ffffff',
    padding: {
      top: { value: 60, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 60, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
    headingStyles: {
      fontSize: { value: 36, unit: 'px' },
      fontWeight: 700,
      color: '#333333',
    },
    descriptionStyles: {
      fontSize: { value: 18, unit: 'px' },
      color: '#666666',
    },
    contentAlign: 'center',
    textAlign: 'center',
  },
});
```

---

### List Component

List of items with optional images, titles, descriptions, and buttons.

**Type:** `ComponentType.LIST`

#### Content Properties

```typescript
interface ListContent {
  orientation: 'vertical' | 'horizontal';
  itemLayout: ListItemLayout;
  items: ListItem[];
  columns?: number;            // For horizontal layout
}

type ListItemLayout =
  | 'image-top'
  | 'image-left'
  | 'image-right'
  | 'image-background';

interface ListItem {
  id: string;
  image?: ImageContent;
  title: {
    html: string;
    plainText?: string;
  };
  description?: {
    html: string;
    plainText?: string;
  };
  button?: ButtonContent;
  showImage: boolean;
  showButton: boolean;
  order: number;
}
```

#### Style Properties

```typescript
interface ListStyles extends BaseStyles {
  itemGap?: CSSValue;
  titleStyles?: TextStyles;
  descriptionStyles?: TextStyles;
  itemBackgroundColor?: string;
  itemBorder?: string;
  itemPadding?: CSSValue;
  imageMaxWidth?: CSSValue;
  imageMaxHeight?: CSSValue;
}
```

#### Programmatic Usage

```typescript
import { createList } from '@email-builder/core/components/factories';

const list = createList({
  content: {
    orientation: 'vertical',
    itemLayout: 'image-left',
    items: [
      {
        id: 'item-1',
        image: {
          src: 'https://example.com/icon1.png',
          alt: 'Feature 1',
        },
        title: {
          html: 'Feature One',
          plainText: 'Feature One',
        },
        description: {
          html: 'Description of the first feature.',
          plainText: 'Description of the first feature.',
        },
        showImage: true,
        showButton: false,
        order: 0,
      },
      {
        id: 'item-2',
        image: {
          src: 'https://example.com/icon2.png',
          alt: 'Feature 2',
        },
        title: {
          html: 'Feature Two',
          plainText: 'Feature Two',
        },
        description: {
          html: 'Description of the second feature.',
          plainText: 'Description of the second feature.',
        },
        showImage: true,
        showButton: false,
        order: 1,
      },
    ],
  },
  styles: {
    itemGap: { value: 20, unit: 'px' },
    itemBackgroundColor: '#f8f9fa',
    itemPadding: { value: 20, unit: 'px' },
    titleStyles: {
      fontSize: { value: 18, unit: 'px' },
      fontWeight: 600,
      color: '#333333',
    },
    descriptionStyles: {
      fontSize: { value: 14, unit: 'px' },
      color: '#666666',
    },
  },
});
```

---

### CTA (Call to Action) Component

Call-to-action section with heading, description, and buttons.

**Type:** `ComponentType.CALL_TO_ACTION`

#### Content Properties

```typescript
interface CTAContent {
  layout: CTALayout;
  heading: {
    html: string;
    plainText?: string;
  };
  description?: {
    html: string;
    plainText?: string;
  };
  primaryButton: ButtonContent;
  secondaryButton?: ButtonContent;
  showSecondaryButton: boolean;
  showDescription: boolean;
}

type CTALayout =
  | 'centered'
  | 'left-aligned'
  | 'right-aligned'
  | 'two-column';
```

#### Style Properties

```typescript
interface CTAStyles extends BaseStyles {
  headingStyles?: TextStyles;
  descriptionStyles?: TextStyles;
  buttonGap?: CSSValue;
  contentMaxWidth?: CSSValue;
}
```

#### Programmatic Usage

```typescript
import { createCTA } from '@email-builder/core/components/factories';

const cta = createCTA({
  content: {
    layout: 'centered',
    heading: {
      html: 'Ready to Get Started?',
      plainText: 'Ready to Get Started?',
    },
    description: {
      html: 'Join thousands of satisfied customers today.',
      plainText: 'Join thousands of satisfied customers today.',
    },
    primaryButton: {
      text: 'Sign Up Now',
      link: { href: 'https://example.com/signup', target: '_blank' },
    },
    secondaryButton: {
      text: 'Learn More',
      link: { href: 'https://example.com/about', target: '_blank' },
    },
    showSecondaryButton: true,
    showDescription: true,
  },
  styles: {
    backgroundColor: '#007bff',
    padding: {
      top: { value: 60, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 60, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
    headingStyles: {
      fontSize: { value: 32, unit: 'px' },
      fontWeight: 700,
      color: '#ffffff',
    },
    descriptionStyles: {
      fontSize: { value: 16, unit: 'px' },
      color: '#ffffff',
    },
    buttonGap: { value: 16, unit: 'px' },
    textAlign: 'center',
  },
});
```

---

## Component Styles Reference

### BaseStyles

All components inherit from `BaseStyles`, which provides common styling properties:

```typescript
interface BaseStyles {
  // Background
  backgroundColor?: string;
  backgroundImage?: string;

  // Border
  border?: {
    width: CSSValue;
    style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
    color: string;
    radius?: {
      topLeft: CSSValue;
      topRight: CSSValue;
      bottomRight: CSSValue;
      bottomLeft: CSSValue;
    };
  };

  // Spacing
  padding?: {
    top: CSSValue;
    right: CSSValue;
    bottom: CSSValue;
    left: CSSValue;
  };

  margin?: {
    top: CSSValue;
    right: CSSValue;
    bottom: CSSValue;
    left: CSSValue;
  };

  // Dimensions
  width?: CSSValue;
  height?: CSSValue;

  // Alignment
  horizontalAlign?: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';

  // Typography (when applicable)
  fontFamily?: string;
  fontSize?: CSSValue;
  fontWeight?: 100-900 | 'normal' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: CSSValue | string;

  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';

  // Custom
  customClasses?: string[];
  customStyles?: Record<string, string>;
}

interface CSSValue {
  value: number | 'auto';
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw' | 'auto';
}
```

---

## Creating Custom Components

### Using the Component Registry

```typescript
import { ComponentRegistry } from '@email-builder/core';
import { ComponentType, ComponentCategory } from '@email-builder/core';

const registry = new ComponentRegistry();

// Define a custom component
registry.register({
  type: 'custom-banner',
  metadata: {
    name: 'Banner',
    description: 'A custom banner component',
    icon: 'ri-image-line',
    category: ComponentCategory.CUSTOM,
    tags: ['custom', 'banner', 'promotion'],
  },
  defaultContent: {
    text: 'Custom Banner',
    imageUrl: '',
    link: '',
  },
  defaultStyles: {
    backgroundColor: '#ff6b6b',
    padding: {
      top: { value: 40, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 40, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
    fontSize: { value: 24, unit: 'px' },
    color: '#ffffff',
    textAlign: 'center',
  },
  create: () => ({
    id: `custom-banner-${Date.now()}`,
    type: 'custom-banner',
    metadata: {
      name: 'Banner',
      description: 'A custom banner component',
      icon: 'ri-image-line',
      category: ComponentCategory.CUSTOM,
    },
    content: {
      text: 'Custom Banner',
      imageUrl: '',
      link: '',
    },
    styles: {
      backgroundColor: '#ff6b6b',
      padding: {
        top: { value: 40, unit: 'px' },
        right: { value: 20, unit: 'px' },
        bottom: { value: 40, unit: 'px' },
        left: { value: 20, unit: 'px' },
      },
      fontSize: { value: 24, unit: 'px' },
      color: '#ffffff',
      textAlign: 'center',
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: '1.0.0',
  }),
  validate: (component) => {
    const errors: string[] = [];
    if (!component.content.text) {
      errors.push('Text is required');
    }
    return {
      valid: errors.length === 0,
      errors,
    };
  },
});

// Use the custom component
const customComponent = registry.create('custom-banner');
```

---

## Common Patterns

### Creating Components Programmatically

```typescript
import {
  createButton,
  createText,
  createImage,
  createHeader,
  createFooter,
  createHero,
} from '@email-builder/core/components/factories';

// Create multiple components
const components = [
  createHeader({
    content: {
      layout: 'image-left',
      image: { src: 'logo.png', alt: 'Logo' },
      navigationLinks: [],
      showNavigation: false,
    },
  }),
  createHero({
    content: {
      layout: 'image-top',
      heading: { html: 'Welcome!', plainText: 'Welcome!' },
      image: { src: 'hero.jpg', alt: 'Hero' },
      showButton: false,
    },
  }),
  createText({
    content: {
      type: 'paragraph',
      html: '<p>Main content here</p>',
    },
  }),
  createFooter({
    content: {
      textSections: [],
      socialLinks: [],
      showSocialLinks: false,
    },
  }),
];
```

### Applying Presets

```typescript
import { PresetManager } from '@email-builder/core';

const presetManager = builder.getBuilder().getPresetManager();

// Create a custom preset
await presetManager.createPreset({
  componentType: 'button',
  name: 'Primary Button',
  description: 'Primary button style',
  styles: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    fontSize: { value: 16, unit: 'px' },
    fontWeight: 600,
    padding: {
      top: { value: 12, unit: 'px' },
      right: { value: 24, unit: 'px' },
      bottom: { value: 12, unit: 'px' },
      left: { value: 24, unit: 'px' },
    },
  },
});

// Apply preset to a component
await presetManager.applyPreset(componentId, presetId);
```

### Working with Templates

```typescript
import { TemplateManager } from '@email-builder/core';

const templateManager = builder.getBuilder().getTemplateManager();

// Create template
const template = await templateManager.create({
  name: 'My Template',
  description: 'A custom template',
  settings: {
    target: 'email',
    canvasDimensions: {
      width: 600,
      maxWidth: 600,
    },
    breakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
    },
    responsive: true,
    locale: 'en-US',
  },
  components: [
    createHeader(),
    createHero(),
    createFooter(),
  ],
});

// Update template
await templateManager.update(template.metadata.id, {
  components: [
    ...template.components,
    createText({
      content: {
        type: 'paragraph',
        html: '<p>Additional content</p>',
      },
    }),
  ],
});
```

---

## Next Steps

- See [HEADLESS_API.md](./HEADLESS_API.md) for the high-level EmailBuilder API
- Check [examples](./packages/core/examples/) for real-world usage
- Explore [component definitions](./packages/core/components/definitions/) for implementation details
- Review [tests](./packages/core/builder/EmailBuilder.test.ts) for usage patterns
