# Headless Email Builder Examples

This directory contains examples demonstrating how to use the headless Email Builder API to create email templates programmatically.

## Examples

### 1. Simple Example (`headless-simple.ts`)

A comprehensive example showing how to build a complete welcome email with all major components:
- Header with logo and navigation
- Hero section
- Text content
- Lists
- Call-to-action
- Footer with social links

**Run it:**
```bash
npx tsx packages/core/examples/headless-simple.ts
```

**What you'll learn:**
- Basic EmailBuilder setup
- How to use the fluent API
- Adding various component types
- Exporting to HTML and JSON
- Saving templates

### 2. AI Agent Example (`headless-ai-agent.ts`)

An advanced example demonstrating how an AI agent could dynamically generate personalized email templates based on user data and requirements.

**Features:**
- Dynamic content generation based on user interests
- Multiple email types (welcome, newsletter, promotional, transactional)
- Personalization using user data
- Conditional content based on requirements

**Run it:**
```bash
npx tsx packages/core/examples/headless-ai-agent.ts
```

**What you'll learn:**
- Building emails programmatically with dynamic data
- Creating reusable email generation logic
- Implementing personalization
- Supporting multiple email types
- AI agent integration patterns

### 3. Minimal Example (`headless-minimal.ts`)

Ultra-minimal examples showing the absolute minimum code needed to create emails.

**Features:**
- Quick one-off emails
- Method chaining patterns
- Minimal configuration

**Run it:**
```bash
npx tsx packages/core/examples/headless-minimal.ts
```

**What you'll learn:**
- Quickest way to create an email
- Minimal API usage
- Chaining patterns

## Common Patterns

### Basic Email Creation

```typescript
import { EmailBuilder } from '@email-builder/core';

const builder = new EmailBuilder({ name: 'My Email' });
await builder.initialize();

await builder
  .addHeader({ logo: 'https://example.com/logo.png' })
  .addText({ content: '<p>Hello World!</p>' })
  .addFooter({ companyName: 'Acme Inc.' });

const html = await builder.toHTML();
```

### Personalized Email

```typescript
async function createPersonalizedEmail(user: User) {
  const builder = new EmailBuilder({
    name: `Email for ${user.name}`,
    subject: `Hi ${user.name}!`,
  });

  await builder.initialize();

  await builder
    .addHero({
      heading: `Welcome, ${user.name}!`,
      description: `We're glad to have you, ${user.name}.`,
      buttonText: 'Get Started',
      buttonUrl: user.dashboardUrl,
    });

  return await builder.toHTML();
}
```

### Multiple Emails

```typescript
async function createMultipleEmails(users: User[]) {
  const emails = [];

  for (const user of users) {
    const builder = new EmailBuilder();
    await builder.initialize();

    await builder
      .addText({ content: `<p>Hi ${user.name}!</p>` })
      .addButton({ text: 'Click Here', url: user.url });

    emails.push({
      user: user.email,
      html: await builder.toHTML(),
    });
  }

  return emails;
}
```

### Email from Template

```typescript
async function emailFromTemplate(templateId: string, data: any) {
  const builder = new EmailBuilder();
  await builder.load(templateId);

  // The template is now loaded, you can:
  // 1. Export it as-is
  const html = await builder.toHTML();

  // 2. Or modify it before exporting
  await builder.addText({ content: data.customMessage });
  const modifiedHtml = await builder.toHTML();

  return { html, modifiedHtml };
}
```

## Use Cases

### 1. Backend Email Service

```typescript
// email-service.ts
import { EmailBuilder } from '@email-builder/core';

export class EmailService {
  async sendWelcomeEmail(user: User) {
    const builder = new EmailBuilder();
    await builder.initialize();

    await builder
      .setSubject(`Welcome ${user.name}!`)
      .addHeader({ logo: process.env.LOGO_URL })
      .addHero({
        heading: `Hi ${user.name}!`,
        buttonText: 'Get Started',
        buttonUrl: `${process.env.APP_URL}/onboarding`,
      });

    const html = await builder.toHTML();

    await this.sendEmail({
      to: user.email,
      subject: `Welcome ${user.name}!`,
      html,
    });
  }
}
```

### 2. Marketing Automation

```typescript
// campaign-generator.ts
import { EmailBuilder } from '@email-builder/core';

export async function generateCampaign(campaign: Campaign) {
  const variants = [];

  for (const variant of campaign.abTestVariants) {
    const builder = new EmailBuilder({
      name: `${campaign.name} - Variant ${variant.id}`,
    });

    await builder.initialize();

    await builder
      .addHeader({ logo: campaign.logo })
      .addHero({
        heading: variant.headline,
        description: variant.description,
        buttonText: variant.ctaText,
        buttonUrl: campaign.landingPage,
      });

    variants.push({
      id: variant.id,
      html: await builder.toHTML(),
    });
  }

  return variants;
}
```

### 3. Newsletter Generation

```typescript
// newsletter-builder.ts
import { EmailBuilder } from '@email-builder/core';

export async function buildNewsletter(articles: Article[]) {
  const builder = new EmailBuilder({
    name: 'Weekly Newsletter',
    subject: 'This week\'s top stories',
  });

  await builder.initialize();

  await builder
    .addHeader({ logo: 'https://example.com/logo.png' })
    .addText({
      content: '<h1>This Week\'s Highlights</h1>',
      textAlign: 'center',
    });

  for (const article of articles) {
    await builder
      .addImage({
        src: article.image,
        alt: article.title,
        align: 'center',
      })
      .addText({
        content: `
          <h2>${article.title}</h2>
          <p>${article.excerpt}</p>
        `,
      })
      .addButton({
        text: 'Read More',
        url: article.url,
        align: 'center',
      })
      .addSpacer({ height: 40 });
  }

  await builder.addFooter({
    companyName: 'Newsletter Inc.',
    socialLinks: {
      twitter: 'https://twitter.com/newsletter',
      facebook: 'https://facebook.com/newsletter',
    },
  });

  return await builder.toHTML();
}
```

## Tips

1. **Always initialize**: Call `await builder.initialize()` before using the builder
2. **Use method chaining**: Most methods return `this` for easy chaining
3. **Handle errors**: Wrap async operations in try-catch blocks
4. **Optimize exports**: Use `toHTML({ inlineCSS: true })` for email client compatibility
5. **Reuse instances**: You can reuse a builder instance for multiple emails
6. **Save templates**: Use `save()` and `load()` for reusable templates
7. **Type safety**: Use TypeScript for better developer experience

## Next Steps

- Read the [Headless API documentation](../../../HEADLESS_API.md)
- Explore [component definitions](../components/definitions/)
- Check out the [UI builder](../../../apps/dev/) for visual editing
- Learn about [email compatibility](../compatibility/)

## Questions or Issues?

Please open an issue on our [GitHub repository](https://github.com/your-repo/email-builder).
