/**
 * EmailBuilder Unit Tests
 *
 * Comprehensive test suite for the headless EmailBuilder API
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { EmailBuilder } from './EmailBuilder';
import type { Template } from '../types';

describe('EmailBuilder', () => {
  let builder: EmailBuilder;

  beforeEach(() => {
    // Create a fresh builder instance for each test
    builder = new EmailBuilder();
  });

  afterEach(() => {
    // Clean up
    if (builder) {
      builder.getBuilder().destroy();
    }
  });

  // ============================================================================
  // Initialization Tests
  // ============================================================================

  describe('Initialization', () => {
    it('should create a builder instance', () => {
      expect(builder).toBeDefined();
      expect(builder).toBeInstanceOf(EmailBuilder);
    });

    it('should initialize with default config', async () => {
      await builder.initialize();
      expect(builder.isInitialized()).toBe(true);
    });

    it('should initialize with custom config', async () => {
      const customBuilder = new EmailBuilder({
        name: 'Test Email',
        subject: 'Test Subject',
        description: 'Test Description',
        author: 'Test Author',
        category: 'Test',
        tags: ['test', 'email'],
      });

      await customBuilder.initialize();

      const template = customBuilder.getTemplate();
      expect(template).toBeDefined();
      expect(template?.metadata.name).toBe('Test Email');
      expect(template?.metadata.description).toBe('Test Description');
      expect(template?.metadata.author).toBe('Test Author');
      expect(template?.metadata.category).toBe('Test');
      expect(template?.metadata.tags).toEqual(['test', 'email']);

      customBuilder.getBuilder().destroy();
    });

    it('should not allow double initialization', async () => {
      await builder.initialize();
      const firstInit = builder.getTemplate();

      await builder.initialize();
      const secondInit = builder.getTemplate();

      expect(firstInit).toBe(secondInit);
    });

    it('should throw error when using methods before initialization', async () => {
      expect(() => builder.setName('Test')).not.toThrow();
      // Most methods should throw when not initialized
      await expect(builder.addText({ content: 'test' })).rejects.toThrow();
    });
  });

  // ============================================================================
  // Metadata Methods Tests
  // ============================================================================

  describe('Metadata Methods', () => {
    beforeEach(async () => {
      await builder.initialize();
    });

    it('should set template name', () => {
      builder.setName('New Name');
      const template = builder.getTemplate();
      expect(template?.metadata.name).toBe('New Name');
    });

    it('should set template subject', () => {
      builder.setSubject('New Subject');
      const template = builder.getTemplate();
      expect(template?.customData?.['subject']).toBe('New Subject');
    });

    it('should set template description', () => {
      builder.setDescription('New Description');
      const template = builder.getTemplate();
      expect(template?.metadata.description).toBe('New Description');
    });

    it('should set template author', () => {
      builder.setAuthor('New Author');
      const template = builder.getTemplate();
      expect(template?.metadata.author).toBe('New Author');
    });

    it('should set template category', () => {
      builder.setCategory('Newsletter');
      const template = builder.getTemplate();
      expect(template?.metadata.category).toBe('Newsletter');
    });

    it('should set template tags', () => {
      builder.setTags(['tag1', 'tag2', 'tag3']);
      const template = builder.getTemplate();
      expect(template?.metadata.tags).toEqual(['tag1', 'tag2', 'tag3']);
    });

    it('should set background color', () => {
      builder.setBackgroundColor('#f0f0f0');
      const template = builder.getTemplate();
      expect(template?.generalStyles.canvasBackgroundColor).toBe('#f0f0f0');
    });

    it('should chain metadata methods', () => {
      builder
        .setName('Chained Email')
        .setSubject('Chained Subject')
        .setDescription('Chained Description')
        .setAuthor('Chained Author')
        .setCategory('Chained')
        .setTags(['chain', 'test'])
        .setBackgroundColor('#ffffff');

      const template = builder.getTemplate();
      expect(template?.metadata.name).toBe('Chained Email');
      expect(template?.customData?.['subject']).toBe('Chained Subject');
      expect(template?.metadata.description).toBe('Chained Description');
      expect(template?.metadata.author).toBe('Chained Author');
      expect(template?.metadata.category).toBe('Chained');
      expect(template?.metadata.tags).toEqual(['chain', 'test']);
      expect(template?.generalStyles.canvasBackgroundColor).toBe('#ffffff');
    });
  });

  // ============================================================================
  // Component Methods Tests
  // ============================================================================

  describe('Component Methods', () => {
    beforeEach(async () => {
      await builder.initialize();
    });

    describe('addHeader', () => {
      it('should add a header component', async () => {
        await builder.addHeader({
          logo: 'https://example.com/logo.png',
          logoAlt: 'Logo',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('header');
      });

      it('should add header with navigation links', async () => {
        await builder.addHeader({
          logo: 'https://example.com/logo.png',
          links: [
            { text: 'Home', url: 'https://example.com' },
            { text: 'About', url: 'https://example.com/about' },
          ],
          showNavigation: true,
        });

        const template = builder.getTemplate();
        const header = template?.components[0] as any;
        expect(header.content.navigationLinks).toHaveLength(2);
        expect(header.content.navigationLinks[0].text).toBe('Home');
        expect(header.content.navigationLinks[1].text).toBe('About');
      });

      it('should apply custom background color to header', async () => {
        await builder.addHeader({
          logo: 'https://example.com/logo.png',
          backgroundColor: '#f8f9fa',
        });

        const template = builder.getTemplate();
        const header = template?.components[0];
        expect(header?.styles.backgroundColor).toBe('#f8f9fa');
      });
    });

    describe('addFooter', () => {
      it('should add a footer component', async () => {
        await builder.addFooter({
          companyName: 'Acme Inc.',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('footer');
      });

      it('should add footer with company info', async () => {
        await builder.addFooter({
          companyName: 'Acme Inc.',
          address: '123 Main St',
          text: '<p>Copyright 2024</p>',
        });

        const template = builder.getTemplate();
        const footer = template?.components[0] as any;
        expect(footer.content.textSections).toHaveLength(1);
        expect(footer.content.textSections[0].html).toContain('Acme Inc.');
        expect(footer.content.textSections[0].html).toContain('123 Main St');
      });

      it('should add footer with social links', async () => {
        await builder.addFooter({
          companyName: 'Acme Inc.',
          socialLinks: {
            facebook: 'https://facebook.com/acme',
            twitter: 'https://twitter.com/acme',
            linkedin: 'https://linkedin.com/company/acme',
          },
        });

        const template = builder.getTemplate();
        const footer = template?.components[0] as any;
        expect(footer.content.socialLinks).toHaveLength(3);
        expect(footer.content.socialLinks[0].platform).toBe('facebook');
        expect(footer.content.socialLinks[1].platform).toBe('twitter');
        expect(footer.content.socialLinks[2].platform).toBe('linkedin');
      });
    });

    describe('addHero', () => {
      it('should add a hero component', async () => {
        await builder.addHero({
          heading: 'Welcome!',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('hero');
      });

      it('should add hero with heading and description', async () => {
        await builder.addHero({
          heading: 'Welcome to Our Platform',
          description: 'Start building amazing things today.',
        });

        const template = builder.getTemplate();
        const hero = template?.components[0] as any;
        expect(hero.content.heading.html).toBe('Welcome to Our Platform');
        expect(hero.content.description.html).toBe('Start building amazing things today.');
      });

      it('should add hero with image', async () => {
        await builder.addHero({
          heading: 'Welcome!',
          image: 'https://example.com/hero.jpg',
          imageAlt: 'Hero Image',
        });

        const template = builder.getTemplate();
        const hero = template?.components[0] as any;
        expect(hero.content.image.src).toBe('https://example.com/hero.jpg');
        expect(hero.content.image.alt).toBe('Hero Image');
      });

      it('should add hero with primary button', async () => {
        await builder.addHero({
          heading: 'Welcome!',
          buttonText: 'Get Started',
          buttonUrl: 'https://example.com/start',
        });

        const template = builder.getTemplate();
        const hero = template?.components[0] as any;
        expect(hero.content['buttons']).toHaveLength(1);
        expect(hero.content['buttons'][0].text).toBe('Get Started');
        expect(hero.content['buttons'][0].link.href).toBe('https://example.com/start');
      });

      it('should add hero with primary and secondary buttons', async () => {
        await builder.addHero({
          heading: 'Welcome!',
          buttonText: 'Sign Up',
          buttonUrl: 'https://example.com/signup',
          secondaryButtonText: 'Learn More',
          secondaryButtonUrl: 'https://example.com/learn',
        });

        const template = builder.getTemplate();
        const hero = template?.components[0] as any;
        expect(hero.content['buttons']).toHaveLength(2);
        expect(hero.content['buttons'][0].text).toBe('Sign Up');
        expect(hero.content['buttons'][1].text).toBe('Learn More');
      });

      it('should apply text alignment to hero', async () => {
        await builder.addHero({
          heading: 'Welcome!',
          textAlign: 'center',
        });

        const template = builder.getTemplate();
        const hero = template?.components[0];
        expect(hero?.styles.textAlign).toBe('center');
      });
    });

    describe('addCTA', () => {
      it('should add a CTA component', async () => {
        await builder.addCTA({
          heading: 'Ready to start?',
          buttonText: 'Get Started',
          buttonUrl: 'https://example.com/start',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('cta');
      });

      it('should add CTA with description', async () => {
        await builder.addCTA({
          heading: 'Join Us Today',
          description: 'Sign up and get 30 days free.',
          buttonText: 'Sign Up',
          buttonUrl: 'https://example.com/signup',
        });

        const template = builder.getTemplate();
        const cta = template?.components[0] as any;
        expect(cta.content.heading.html).toBe('Join Us Today');
        expect(cta.content.description.html).toBe('Sign up and get 30 days free.');
      });

      it('should add CTA with two buttons', async () => {
        await builder.addCTA({
          heading: 'Take Action',
          buttonText: 'Primary Action',
          buttonUrl: 'https://example.com/primary',
          secondaryButtonText: 'Secondary Action',
          secondaryButtonUrl: 'https://example.com/secondary',
        });

        const template = builder.getTemplate();
        const cta = template?.components[0] as any;
        expect(cta.content['buttons']).toHaveLength(2);
      });
    });

    describe('addText', () => {
      it('should add a text component', async () => {
        await builder.addText({
          content: '<p>Hello World</p>',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('text');
      });

      it('should add text with HTML content', async () => {
        await builder.addText({
          content: '<p>This is <strong>bold</strong> text.</p>',
        });

        const template = builder.getTemplate();
        const text = template?.components[0] as any;
        expect(text.content.html).toBe('<p>This is <strong>bold</strong> text.</p>');
      });

      it('should apply text styles', async () => {
        await builder.addText({
          content: '<p>Styled text</p>',
          fontSize: 18,
          color: '#333333',
          textAlign: 'center',
        });

        const template = builder.getTemplate();
        const text = template?.components[0];
        expect(text?.styles.fontSize).toEqual({ value: 18, unit: 'px' });
        expect(text?.styles.color).toBe('#333333');
        expect(text?.styles.textAlign).toBe('center');
      });
    });

    describe('addImage', () => {
      it('should add an image component', async () => {
        await builder.addImage({
          src: 'https://example.com/image.jpg',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('image');
      });

      it('should add image with alt text', async () => {
        await builder.addImage({
          src: 'https://example.com/image.jpg',
          alt: 'Product Image',
          title: 'Our Product',
        });

        const template = builder.getTemplate();
        const image = template?.components[0] as any;
        expect(image.content['image'].src).toBe('https://example.com/image.jpg');
        expect(image.content['image'].alt).toBe('Product Image');
        expect(image.content['image'].title).toBe('Our Product');
      });

      it('should add image with link', async () => {
        await builder.addImage({
          src: 'https://example.com/image.jpg',
          link: 'https://example.com/products',
        });

        const template = builder.getTemplate();
        const image = template?.components[0] as any;
        expect(image.content.link.href).toBe('https://example.com/products');
      });

      it('should apply image dimensions', async () => {
        await builder.addImage({
          src: 'https://example.com/image.jpg',
          width: 600,
          height: 400,
        });

        const template = builder.getTemplate();
        const image = template?.components[0];
        expect(image?.styles.width).toEqual({ value: 600, unit: 'px' });
        expect(image?.styles.height).toEqual({ value: 400, unit: 'px' });
      });

      it('should apply image alignment', async () => {
        await builder.addImage({
          src: 'https://example.com/image.jpg',
          align: 'center',
        });

        const template = builder.getTemplate();
        const image = template?.components[0];
        expect(image?.styles.horizontalAlign).toBe('center');
      });
    });

    describe('addButton', () => {
      it('should add a button component', async () => {
        await builder.addButton({
          text: 'Click Me',
          url: 'https://example.com',
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('button');
      });

      it('should add button with link', async () => {
        await builder.addButton({
          text: 'Learn More',
          url: 'https://example.com/learn',
        });

        const template = builder.getTemplate();
        const button = template?.components[0] as any;
        expect(button.content.text).toBe('Learn More');
        expect(button.content.link.href).toBe('https://example.com/learn');
      });

      it('should apply button styles', async () => {
        await builder.addButton({
          text: 'Styled Button',
          url: 'https://example.com',
          backgroundColor: '#ff6b6b',
          color: '#ffffff',
          variant: 'filled',
        });

        const template = builder.getTemplate();
        const button = template?.components[0];
        expect(button?.styles.backgroundColor).toBe('#ff6b6b');
        expect(button?.styles.color).toBe('#ffffff');
        expect(button?.styles.variant).toBe('filled');
      });
    });

    describe('addList', () => {
      it('should add a list component', async () => {
        await builder.addList({
          items: [
            { title: 'Item 1' },
            { title: 'Item 2' },
          ],
        });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('list');
      });

      it('should add list with items', async () => {
        await builder.addList({
          items: [
            {
              title: 'Feature One',
              description: 'Description of feature one',
            },
            {
              title: 'Feature Two',
              description: 'Description of feature two',
            },
            {
              title: 'Feature Three',
              description: 'Description of feature three',
            },
          ],
        });

        const template = builder.getTemplate();
        const list = template?.components[0] as any;
        expect(list.content.items).toHaveLength(3);
        expect(list.content.items[0].title.html).toBe('Feature One');
        expect(list.content.items[1].title.html).toBe('Feature Two');
        expect(list.content.items[2].title.html).toBe('Feature Three');
      });

      it('should add list with icons', async () => {
        await builder.addList({
          items: [
            {
              title: 'Feature One',
              icon: 'ri-check-line',
            },
            {
              title: 'Feature Two',
              icon: 'ri-star-line',
            },
          ],
        });

        const template = builder.getTemplate();
        const list = template?.components[0] as any;
        expect(list.content.items[0].showImage).toBe(true);
        expect(list.content.items[0].image.src).toBe('ri-check-line');
        expect(list.content.items[1].showImage).toBe(true);
        expect(list.content.items[1].image.src).toBe('ri-star-line');
      });
    });

    describe('addSpacer', () => {
      it('should add a spacer component', async () => {
        await builder.addSpacer();

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('spacer');
      });

      it('should add spacer with custom height', async () => {
        await builder.addSpacer({ height: 60 });

        const template = builder.getTemplate();
        const spacer = template?.components[0];
        expect(spacer?.styles.height).toEqual({ value: 60, unit: 'px' });
      });
    });

    describe('addSeparator', () => {
      it('should add a separator component', async () => {
        await builder.addSeparator();

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(1);
        expect(template?.components[0].type).toBe('separator');
      });

      it('should add separator with custom color', async () => {
        await builder.addSeparator({
          color: '#e0e0e0',
          height: 2,
          width: 80,
        });

        const template = builder.getTemplate();
        const separator = template?.components[0];
        expect(separator?.styles.backgroundColor).toBe('#e0e0e0');
        expect(separator?.styles.height).toEqual({ value: 2, unit: 'px' });
        expect(separator?.styles.width).toEqual({ value: 80, unit: '%' });
      });
    });

    describe('Component Chaining', () => {
      it('should add multiple components sequentially', async () => {
        await builder.addHeader({ logo: 'logo.png' });
        await builder.addSpacer({ height: 40 });
        await builder.addHero({ heading: 'Welcome!' });
        await builder.addSpacer({ height: 40 });
        await builder.addText({ content: '<p>Content</p>' });
        await builder.addSpacer({ height: 40 });
        await builder.addFooter({ companyName: 'Acme' });

        const template = builder.getTemplate();
        expect(template?.components).toHaveLength(7);
        expect(template?.components[0].type).toBe('header');
        expect(template?.components[1].type).toBe('spacer');
        expect(template?.components[2].type).toBe('hero');
        expect(template?.components[3].type).toBe('spacer');
        expect(template?.components[4].type).toBe('text');
        expect(template?.components[5].type).toBe('spacer');
        expect(template?.components[6].type).toBe('footer');
      });
    });
  });

  // ============================================================================
  // Export Methods Tests
  // ============================================================================

  describe('Export Methods', () => {
    beforeEach(async () => {
      await builder.initialize();
    });

    describe('toJSON', () => {
      it('should export template as JSON', () => {
        const json = builder.toJSON();
        expect(json).toBeDefined();
        expect(json).toHaveProperty('metadata');
        expect(json).toHaveProperty('settings');
        expect(json).toHaveProperty('components');
      });

      it('should export template with components', async () => {
        await builder.addText({ content: '<p>Test</p>' });

        const json = builder.toJSON();
        expect(json?.components).toHaveLength(1);
        expect(json?.components[0].type).toBe('text');
      });
    });

    describe('toHTML', () => {
      it('should export template as HTML', async () => {
        const html = await builder.toHTML();
        expect(html).toBeDefined();
        expect(typeof html).toBe('string');
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<html>');
        expect(html).toContain('</html>');
      });

      it('should export template with components as HTML', async () => {
        await builder.addText({ content: '<p>Hello World</p>' });
        const html = await builder.toHTML();

        expect(html).toContain('Hello World');
      });

      it('should export multiple components as HTML', async () => {
        await builder.addText({ content: '<h1>Heading</h1>' });
        await builder.addText({ content: '<p>Paragraph</p>' });
        await builder.addButton({ text: 'Click Me', url: 'https://example.com' });

        const html = await builder.toHTML();
        expect(html).toContain('Heading');
        expect(html).toContain('Paragraph');
        expect(html).toContain('Click Me');
      });
    });

    describe('getTemplate', () => {
      it('should return current template', () => {
        const template = builder.getTemplate();
        expect(template).toBeDefined();
        expect(template).toHaveProperty('metadata');
      });

      it('should return null before initialization', () => {
        const uninitializedBuilder = new EmailBuilder();
        expect(uninitializedBuilder.getTemplate()).toBeNull();
      });
    });
  });

  // ============================================================================
  // Storage Methods Tests
  // ============================================================================

  describe('Storage Methods', () => {
    beforeEach(async () => {
      await builder.initialize();
    });

    describe('save', () => {
      it('should save template', async () => {
        await builder.addText({ content: '<p>Test</p>' });
        await expect(builder.save()).resolves.not.toThrow();
      });
    });

    describe('load', () => {
      it('should load template', async () => {
        // Save a template first
        await builder
          .setName('Saved Template')
          .addText({ content: '<p>Saved content</p>' });

        await builder.save();

        const templateId = builder.getTemplate()?.metadata.id;
        expect(templateId).toBeDefined();

        // Create new builder and load the saved template
        const newBuilder = new EmailBuilder();
        await newBuilder.load(templateId!);

        const loadedTemplate = newBuilder.getTemplate();
        expect(loadedTemplate?.metadata.name).toBe('Saved Template');
        expect(loadedTemplate?.components).toHaveLength(1);

        newBuilder.getBuilder().destroy();
      });
    });

    describe('listTemplates', () => {
      it('should list templates', async () => {
        const templates = await builder.listTemplates();
        expect(Array.isArray(templates)).toBe(true);
      });
    });

    describe('delete', () => {
      it('should delete template', async () => {
        await builder.addText({ content: '<p>To be deleted</p>' });
        await builder.save();

        const templateId = builder.getTemplate()?.metadata.id;
        expect(templateId).toBeDefined();

        await expect(builder.delete(templateId!)).resolves.not.toThrow();
      });
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should build a complete welcome email', async () => {
      await builder.initialize();

      // Set metadata (synchronous)
      builder
        .setName('Welcome Email')
        .setSubject('Welcome to our platform!')
        .setBackgroundColor('#f5f5f5');

      // Add components (async)
      await builder.addHeader({
        logo: 'https://example.com/logo.png',
        links: [
          { text: 'Home', url: 'https://example.com' },
          { text: 'About', url: 'https://example.com/about' },
        ],
        backgroundColor: '#ffffff',
      });
      await builder.addSpacer({ height: 40 });
      await builder.addHero({
        heading: 'Welcome!',
        description: 'We\'re excited to have you on board.',
        image: 'https://example.com/hero.jpg',
        buttonText: 'Get Started',
        buttonUrl: 'https://example.com/start',
        textAlign: 'center',
      });
      await builder.addSpacer({ height: 40 });
      await builder.addText({
        content: '<p>Here are some things you can do:</p>',
      });
      await builder.addList({
        items: [
          { title: 'Complete your profile', description: 'Add your information' },
          { title: 'Explore features', description: 'Discover what you can do' },
          { title: 'Connect with others', description: 'Join the community' },
        ],
      });
      await builder.addSpacer({ height: 40 });
      await builder.addCTA({
        heading: 'Ready to start?',
        buttonText: 'Let\'s Go',
        buttonUrl: 'https://example.com/dashboard',
        backgroundColor: '#007bff',
      });
      await builder.addSpacer({ height: 40 });
      await builder.addFooter({
        companyName: 'Acme Inc.',
        address: '123 Main St, San Francisco, CA 94102',
        socialLinks: {
          facebook: 'https://facebook.com/acme',
          twitter: 'https://twitter.com/acme',
        },
      });

      const template = builder.getTemplate();
      expect(template?.components).toHaveLength(10);

      const html = await builder.toHTML();
      expect(html).toContain('Welcome!');
      expect(html).toContain('Acme Inc.');
    });

    it('should build a newsletter email', async () => {
      await builder.initialize();

      // Set metadata (synchronous)
      builder
        .setName('Weekly Newsletter')
        .setSubject('This week\'s highlights');

      // Add components (async)
      await builder.addHeader({ logo: 'https://example.com/logo.png' });
      await builder.addText({ content: '<h2>This Week\'s Highlights</h2>', textAlign: 'center' });
      await builder.addList({
        items: [
          { title: 'New Feature', description: 'Check out our latest feature' },
          { title: 'Community Spotlight', description: 'Meet this week\'s featured member' },
          { title: 'Tips & Tricks', description: 'Learn something new' },
        ],
      });
      await builder.addCTA({
        heading: 'Want more updates?',
        buttonText: 'Read Full Newsletter',
        buttonUrl: 'https://example.com/newsletter',
      });
      await builder.addFooter({ companyName: 'Newsletter Co.' });

      const template = builder.getTemplate();
      expect(template?.components).toHaveLength(5);
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should throw error when exporting before initialization', async () => {
      const uninitializedBuilder = new EmailBuilder();
      await expect(uninitializedBuilder.toHTML()).rejects.toThrow();
    });

    it('should throw error when adding components before initialization', async () => {
      const uninitializedBuilder = new EmailBuilder();
      await expect(uninitializedBuilder.addText({ content: 'test' })).rejects.toThrow();
    });

    it('should handle missing required parameters', async () => {
      await builder.initialize();
      // @ts-expect-error Testing missing required parameter
      await expect(builder.addButton({})).rejects.toThrow();
    });
  });

  // ============================================================================
  // Advanced Features Tests
  // ============================================================================

  describe('Advanced Features', () => {
    beforeEach(async () => {
      await builder.initialize();
    });

    it('should access underlying Builder instance', () => {
      const coreBuilder = builder.getBuilder();
      expect(coreBuilder).toBeDefined();
      expect(coreBuilder.isInitialized()).toBe(true);
    });

    it('should access component registry', () => {
      const registry = builder.getBuilder().getComponentRegistry();
      expect(registry).toBeDefined();

      const buttonDef = registry.get('button');
      expect(buttonDef).toBeDefined();
      expect(buttonDef?.metadata.name).toBe('Button');
    });

    it('should access preset manager', () => {
      const presetManager = builder.getBuilder().getPresetManager();
      expect(presetManager).toBeDefined();
    });

    it('should check compatibility', () => {
      const report = builder.getBuilder().checkCompatibility();
      expect(report).toBeDefined();
      expect(report).toHaveProperty('overallScore');
      expect(report).toHaveProperty('issues');
    });
  });
});
