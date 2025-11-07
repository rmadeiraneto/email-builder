# Headless Email Builder API

The headless Email Builder API allows you to create email templates programmatically without requiring a user interface. This is perfect for:

- **AI Agents** - Automatically generate personalized email templates
- **Backend Services** - Create email templates on the server
- **Automation** - Generate emails based on data or events
- **Testing** - Programmatically create test email templates
- **Integration** - Embed email building capabilities in your application

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Use Cases](#use-cases)
- [Best Practices](#best-practices)

## Installation

```bash
npm install @email-builder/core
```

## Quick Start

```typescript
import { EmailBuilder } from '@email-builder/core';

// Create a new email builder
const builder = new EmailBuilder({
  name: 'Welcome Email',
  subject: 'Welcome to our platform!',
});

// Initialize the builder
await builder.initialize();

// Build your email using a fluent API
await builder
  .addHeader({
    logo: 'https://example.com/logo.png',
    links: [
      { text: 'Home', url: 'https://example.com' },
      { text: 'About', url: 'https://example.com/about' },
    ],
  })
  .addHero({
    heading: 'Welcome!',
    description: 'We\'re excited to have you.',
    buttonText: 'Get Started',
    buttonUrl: 'https://example.com/start',
  })
  .addFooter({
    companyName: 'Acme Inc.',
    socialLinks: {
      facebook: 'https://facebook.com/acme',
      twitter: 'https://twitter.com/acme',
    },
  });

// Export to HTML
const html = await builder.toHTML();

// Or export to JSON
const json = builder.toJSON();
```

## API Reference

### EmailBuilder Class

#### Constructor

```typescript
new EmailBuilder(config?: EmailBuilderConfig)
```

**Configuration Options:**

```typescript
interface EmailBuilderConfig {
  name?: string;              // Template name
  subject?: string;           // Email subject line
  description?: string;       // Template description
  author?: string;            // Template author
  category?: string;          // Template category
  tags?: string[];           // Template tags
  width?: number;            // Canvas width (default: 600px)
  backgroundColor?: string;   // Canvas background color
  storage?: StorageConfig;   // Storage configuration
  debug?: boolean;           // Debug mode
}
```

#### Methods

##### Initialize

```typescript
async initialize(): Promise<EmailBuilder>
```

Initializes the builder. Must be called before using any other methods.

##### Metadata Methods

```typescript
setName(name: string): EmailBuilder
setSubject(subject: string): EmailBuilder
setDescription(description: string): EmailBuilder
setAuthor(author: string): EmailBuilder
setCategory(category: string): EmailBuilder
setTags(tags: string[]): EmailBuilder
setBackgroundColor(color: string): EmailBuilder
```

All metadata methods are chainable and return the builder instance.

##### Component Methods

###### addHeader

```typescript
async addHeader(options: AddHeaderOptions): Promise<EmailBuilder>
```

Adds a header component with logo and navigation links.

**Options:**

```typescript
interface AddHeaderOptions {
  logo?: string;                    // Logo image URL
  logoAlt?: string;                 // Logo alt text
  links?: Array<{                   // Navigation links
    text: string;
    url: string;
  }>;
  backgroundColor?: string;         // Background color
  showNavigation?: boolean;         // Show navigation links
}
```

###### addFooter

```typescript
async addFooter(options: AddFooterOptions): Promise<EmailBuilder>
```

Adds a footer component with company info and social links.

**Options:**

```typescript
interface AddFooterOptions {
  companyName?: string;             // Company name
  address?: string;                 // Company address
  text?: string;                    // Footer text (HTML)
  socialLinks?: {                   // Social media links
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  backgroundColor?: string;         // Background color
}
```

###### addHero

```typescript
async addHero(options: AddHeroOptions): Promise<EmailBuilder>
```

Adds a hero section with heading, description, image, and buttons.

**Options:**

```typescript
interface AddHeroOptions {
  heading: string;                  // Hero heading (required)
  description?: string;             // Hero description
  image?: string;                   // Hero image URL
  imageAlt?: string;                // Image alt text
  buttonText?: string;              // Primary button text
  buttonUrl?: string;               // Primary button URL
  secondaryButtonText?: string;     // Secondary button text
  secondaryButtonUrl?: string;      // Secondary button URL
  backgroundColor?: string;         // Background color
  textAlign?: 'left' | 'center' | 'right';  // Text alignment
}
```

###### addCTA

```typescript
async addCTA(options: AddCTAOptions): Promise<EmailBuilder>
```

Adds a call-to-action section with heading, description, and buttons.

**Options:**

```typescript
interface AddCTAOptions {
  heading: string;                  // CTA heading (required)
  description?: string;             // CTA description
  buttonText: string;               // Primary button text (required)
  buttonUrl: string;                // Primary button URL (required)
  secondaryButtonText?: string;     // Secondary button text
  secondaryButtonUrl?: string;      // Secondary button URL
  backgroundColor?: string;         // Background color
  textAlign?: 'left' | 'center' | 'right';  // Text alignment
}
```

###### addText

```typescript
async addText(options: AddTextOptions): Promise<EmailBuilder>
```

Adds a text component with HTML content.

**Options:**

```typescript
interface AddTextOptions {
  content: string;                  // Text content (HTML, required)
  backgroundColor?: string;         // Background color
  textAlign?: 'left' | 'center' | 'right' | 'justify';  // Text alignment
  fontSize?: number;                // Font size in pixels
  color?: string;                   // Text color
}
```

###### addImage

```typescript
async addImage(options: AddImageOptions): Promise<EmailBuilder>
```

Adds an image component.

**Options:**

```typescript
interface AddImageOptions {
  src: string;                      // Image URL (required)
  alt?: string;                     // Alt text
  title?: string;                   // Image title
  link?: string;                    // Link URL (makes image clickable)
  width?: number;                   // Image width in pixels
  height?: number;                  // Image height in pixels
  align?: 'left' | 'center' | 'right';  // Image alignment
}
```

###### addButton

```typescript
async addButton(options: AddButtonOptions): Promise<EmailBuilder>
```

Adds a button component.

**Options:**

```typescript
interface AddButtonOptions {
  text: string;                     // Button text (required)
  url: string;                      // Button URL (required)
  backgroundColor?: string;         // Button background color
  color?: string;                   // Button text color
  align?: 'left' | 'center' | 'right';  // Button alignment
  variant?: 'filled' | 'outlined' | 'text';  // Button style variant
}
```

###### addList

```typescript
async addList(options: AddListOptions): Promise<EmailBuilder>
```

Adds a list component with items.

**Options:**

```typescript
interface AddListOptions {
  items: Array<{                    // List items (required)
    title: string;                  // Item title
    description?: string;           // Item description
    icon?: string;                  // Item icon (Remix Icon name or URL)
  }>;
  backgroundColor?: string;         // Background color
}
```

###### addSpacer

```typescript
async addSpacer(options?: AddSpacerOptions): Promise<EmailBuilder>
```

Adds a spacer component for vertical spacing.

**Options:**

```typescript
interface AddSpacerOptions {
  height?: number;                  // Spacer height in pixels (default: 20)
}
```

###### addSeparator

```typescript
async addSeparator(options?: AddSeparatorOptions): Promise<EmailBuilder>
```

Adds a horizontal separator line.

**Options:**

```typescript
interface AddSeparatorOptions {
  color?: string;                   // Separator color
  height?: number;                  // Separator thickness in pixels
  width?: number;                   // Separator width percentage (0-100)
}
```

##### Export Methods

###### toHTML

```typescript
async toHTML(options?: Partial<EmailExportOptions>): Promise<string>
```

Exports the template to email-safe HTML.

**Options:**

```typescript
interface EmailExportOptions {
  inlineCSS?: boolean;              // Inline CSS styles (default: true)
  minify?: boolean;                 // Minify HTML (default: false)
  useTableLayout?: boolean;         // Use table-based layout (default: true)
  addOutlookFixes?: boolean;        // Add Outlook compatibility fixes (default: true)
  removeIncompatibleCSS?: boolean;  // Remove email-incompatible CSS (default: true)
  optimizeStructure?: boolean;      // Optimize HTML structure (default: true)
}
```

###### toJSON

```typescript
toJSON(): Template | null
```

Exports the template as a JSON object.

##### Storage Methods

###### save

```typescript
async save(): Promise<void>
```

Saves the template to storage.

###### load

```typescript
async load(templateId: string): Promise<EmailBuilder>
```

Loads a template from storage.

###### listTemplates

```typescript
async listTemplates(): Promise<TemplateListItem[]>
```

Lists all templates in storage.

###### delete

```typescript
async delete(templateId: string): Promise<void>
```

Deletes a template from storage.

##### Advanced Methods

###### getTemplate

```typescript
getTemplate(): Template | null
```

Gets the current template object.

###### getBuilder

```typescript
getBuilder(): Builder
```

Gets the underlying Builder instance for advanced features.

## Examples

### Basic Welcome Email

```typescript
import { EmailBuilder } from '@email-builder/core';

const builder = new EmailBuilder({
  name: 'Welcome Email',
  subject: 'Welcome aboard!',
});

await builder.initialize();

await builder
  .setBackgroundColor('#f5f5f5')
  .addHeader({
    logo: 'https://example.com/logo.png',
    links: [{ text: 'Home', url: 'https://example.com' }],
  })
  .addHero({
    heading: 'Welcome!',
    description: 'Thanks for signing up.',
    buttonText: 'Get Started',
    buttonUrl: 'https://example.com/start',
  })
  .addFooter({ companyName: 'Acme Inc.' });

const html = await builder.toHTML();
```

### Newsletter Email

```typescript
const builder = new EmailBuilder({
  name: 'Weekly Newsletter',
  subject: 'This week\'s highlights',
});

await builder.initialize();

await builder
  .addHeader({ logo: 'https://example.com/logo.png' })
  .addText({
    content: '<h2>This Week\'s Highlights</h2>',
    textAlign: 'center',
  })
  .addList({
    items: [
      {
        title: 'New Feature Launch',
        description: 'We launched an amazing new feature',
        icon: 'ri-rocket-line',
      },
      {
        title: 'Community Spotlight',
        description: 'Meet our community member of the week',
        icon: 'ri-user-star-line',
      },
    ],
  })
  .addCTA({
    heading: 'Want more updates?',
    buttonText: 'Read Full Newsletter',
    buttonUrl: 'https://example.com/newsletter',
  })
  .addFooter({
    companyName: 'Acme Inc.',
    socialLinks: {
      facebook: 'https://facebook.com/acme',
      twitter: 'https://twitter.com/acme',
    },
  });

const html = await builder.toHTML({ minify: true });
```

### Promotional Email

```typescript
const builder = new EmailBuilder({
  name: 'Holiday Sale',
  subject: '50% OFF Everything!',
});

await builder.initialize();

await builder
  .setBackgroundColor('#ff6b6b')
  .addText({
    content: '<h1 style="color: white; text-align: center;">HOLIDAY SALE</h1>',
  })
  .addSpacer({ height: 40 })
  .addCTA({
    heading: '50% OFF Everything!',
    description: 'Limited time offer. Sale ends Sunday.',
    buttonText: 'Shop Now',
    buttonUrl: 'https://example.com/sale',
    backgroundColor: '#ffffff',
  })
  .addSpacer({ height: 40 })
  .addImage({
    src: 'https://example.com/products.jpg',
    alt: 'Featured Products',
    align: 'center',
  })
  .addFooter({ companyName: 'Acme Store' });

const html = await builder.toHTML();
```

### Transactional Email

```typescript
const builder = new EmailBuilder({
  name: 'Order Confirmation',
  subject: 'Your order has been confirmed',
});

await builder.initialize();

await builder
  .addHeader({ logo: 'https://example.com/logo.png' })
  .addText({
    content: `
      <h2>Order Confirmed!</h2>
      <p>Thank you for your order. We'll send you a shipping confirmation email as soon as your order ships.</p>
    `,
  })
  .addSeparator()
  .addText({
    content: `
      <h3>Order Details</h3>
      <p><strong>Order Number:</strong> #12345</p>
      <p><strong>Order Date:</strong> January 15, 2024</p>
      <p><strong>Total:</strong> $99.99</p>
    `,
  })
  .addSeparator()
  .addButton({
    text: 'View Order',
    url: 'https://example.com/orders/12345',
    align: 'center',
  })
  .addFooter({
    companyName: 'Acme Store',
    address: '123 Main St, San Francisco, CA 94102',
  });

const html = await builder.toHTML();
```

## Use Cases

### 1. AI-Powered Email Generation

Use the headless API to let AI agents generate personalized emails:

```typescript
async function generatePersonalizedEmail(userData: UserData) {
  const builder = new EmailBuilder({
    name: `Personalized Email for ${userData.name}`,
  });

  await builder.initialize();

  // AI determines content based on user data
  await builder
    .addHeader({ logo: userData.companyLogo })
    .addHero({
      heading: `Hi ${userData.name}!`,
      description: generatePersonalizedMessage(userData),
      buttonText: 'Continue',
      buttonUrl: userData.dashboardUrl,
    });

  // AI adds relevant content sections
  for (const recommendation of userData.recommendations) {
    await builder.addText({
      content: generateRecommendationHTML(recommendation),
    });
  }

  await builder.addFooter({ companyName: userData.companyName });

  return await builder.toHTML();
}
```

### 2. Automated Marketing Campaigns

Programmatically create email campaigns:

```typescript
async function createCampaignEmails(campaign: Campaign) {
  const templates = [];

  for (const variant of campaign.variants) {
    const builder = new EmailBuilder({
      name: `${campaign.name} - ${variant.name}`,
      subject: variant.subject,
    });

    await builder.initialize();

    // Build variant-specific email
    await builder
      .addHeader({ logo: campaign.logo })
      .addHero({
        heading: variant.heading,
        description: variant.description,
        buttonText: variant.ctaText,
        buttonUrl: variant.ctaUrl,
      })
      .addFooter({ companyName: campaign.companyName });

    templates.push({
      variant: variant.name,
      html: await builder.toHTML(),
      json: builder.toJSON(),
    });
  }

  return templates;
}
```

### 3. Template Generation from Data

Create emails from structured data:

```typescript
async function emailFromData(data: EmailData) {
  const builder = new EmailBuilder({
    name: data.name,
    subject: data.subject,
  });

  await builder.initialize();

  // Add components based on data structure
  for (const section of data.sections) {
    switch (section.type) {
      case 'hero':
        await builder.addHero(section.content);
        break;
      case 'text':
        await builder.addText(section.content);
        break;
      case 'list':
        await builder.addList(section.content);
        break;
      case 'cta':
        await builder.addCTA(section.content);
        break;
    }
  }

  return await builder.toHTML();
}
```

### 4. Testing and Automation

Programmatically create test templates:

```typescript
describe('Email Templates', () => {
  it('should generate valid welcome email', async () => {
    const builder = new EmailBuilder({ name: 'Test Welcome Email' });
    await builder.initialize();

    await builder
      .addHeader({ logo: 'https://example.com/logo.png' })
      .addHero({
        heading: 'Welcome!',
        buttonText: 'Start',
        buttonUrl: 'https://example.com',
      });

    const html = await builder.toHTML();

    expect(html).toContain('Welcome!');
    expect(html).toContain('https://example.com');
  });
});
```

## Best Practices

### 1. Always Initialize

Always call `initialize()` before using the builder:

```typescript
const builder = new EmailBuilder();
await builder.initialize();  // Required!
```

### 2. Use Method Chaining

Take advantage of the fluent API:

```typescript
await builder
  .setName('My Email')
  .setSubject('Hello!')
  .addHeader({ logo: '...' })
  .addText({ content: '...' })
  .addFooter({ companyName: '...' });
```

### 3. Handle Errors

Wrap builder calls in try-catch blocks:

```typescript
try {
  const builder = new EmailBuilder();
  await builder.initialize();
  // ... build email
  const html = await builder.toHTML();
} catch (error) {
  console.error('Email generation failed:', error);
}
```

### 4. Optimize for Email Clients

Use the export options to ensure compatibility:

```typescript
const html = await builder.toHTML({
  inlineCSS: true,              // Required for most email clients
  useTableLayout: true,         // Better compatibility
  addOutlookFixes: true,        // Fix Outlook issues
  removeIncompatibleCSS: true,  // Remove unsupported CSS
});
```

### 5. Reuse Builder Instances

You can reuse a builder instance for multiple emails:

```typescript
const builder = new EmailBuilder();
await builder.initialize();

// First email
await builder.addText({ content: 'Email 1' });
const html1 = await builder.toHTML();
await builder.save();

// Load and modify for second email
await builder.load(templateId);
// ... modify template
const html2 = await builder.toHTML();
```

### 6. Use TypeScript

Take advantage of TypeScript for better type safety:

```typescript
import type { AddHeroOptions } from '@email-builder/core';

const heroOptions: AddHeroOptions = {
  heading: 'Welcome!',
  description: 'Get started today',
  buttonText: 'Start',
  buttonUrl: 'https://example.com',
};

await builder.addHero(heroOptions);
```

### 7. Store Templates

Save templates for reuse:

```typescript
// Save template
await builder.save();

// List templates
const templates = await builder.listTemplates();

// Load template
await builder.load(templateId);

// Delete template
await builder.delete(templateId);
```

## Advanced Usage

### Access the Underlying Builder

For advanced features, access the core Builder instance:

```typescript
const coreBuilder = builder.getBuilder();

// Use advanced features
const registry = coreBuilder.getComponentRegistry();
const presetManager = coreBuilder.getPresetManager();
const compatibilityService = coreBuilder.getCompatibilityService();

// Check compatibility
const report = coreBuilder.checkCompatibility();
```

### Custom Storage

Configure custom storage:

```typescript
const builder = new EmailBuilder({
  storage: {
    method: 'custom',
    adapter: new MyCustomStorageAdapter(),
    keyPrefix: 'my-app',
  },
});
```

### Debug Mode

Enable debug mode for troubleshooting:

```typescript
const builder = new EmailBuilder({
  debug: true,  // Enables console logging
});
```

## Next Steps

- See [examples](./packages/core/examples/) for more code samples
- Read the [core documentation](./packages/core/README.md) for advanced features
- Check out the [UI documentation](./apps/dev/README.md) for the drag-and-drop interface
- Explore [component definitions](./packages/core/components/definitions/) to understand available components

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/your-repo/email-builder).
