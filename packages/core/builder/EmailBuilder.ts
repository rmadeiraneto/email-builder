/**
 * Email Builder - Headless API
 *
 * A fluent, chainable API for building email templates programmatically.
 * This API is designed to work both with and without a UI.
 *
 * @example
 * ```ts
 * const builder = new EmailBuilder()
 *   .setName('Welcome Email')
 *   .setSubject('Welcome to our platform!')
 *   .addHeader({
 *     logo: 'https://example.com/logo.png',
 *     links: [
 *       { text: 'Home', url: 'https://example.com' }
 *     ]
 *   })
 *   .addHero({
 *     heading: 'Welcome!',
 *     description: 'We are excited to have you.',
 *     buttonText: 'Get Started',
 *     buttonUrl: 'https://example.com/start'
 *   });
 *
 * const html = await builder.toHTML();
 * const json = builder.toJSON();
 * ```
 */

import { Builder } from './Builder';
import type { BuilderConfig, Template, BaseComponent } from '../types';
import type {
  ButtonComponent,
  TextComponent,
  ImageComponent,
} from '../types';
import {
  createHeader,
  createFooter,
  createHero,
  createList,
  createCTA,
  createButton,
  createText,
  createImage,
  createSeparator,
  createSpacer,
} from '../components/factories';
import { EmailExportService } from '../services/EmailExportService';
import type { EmailExportOptions } from '../services/email-export.types';

/**
 * Configuration options for EmailBuilder
 */
export interface EmailBuilderConfig {
  /**
   * Template name
   */
  name?: string;

  /**
   * Email subject line
   */
  subject?: string;

  /**
   * Template description
   */
  description?: string;

  /**
   * Template author
   */
  author?: string;

  /**
   * Template category
   */
  category?: string;

  /**
   * Template tags
   */
  tags?: string[];

  /**
   * Canvas width (default: 600px for emails)
   */
  width?: number;

  /**
   * Canvas background color
   */
  backgroundColor?: string;

  /**
   * Storage configuration
   */
  storage?: BuilderConfig['storage'];

  /**
   * Debug mode
   */
  debug?: boolean;
}

/**
 * Options for adding a header component
 */
export interface AddHeaderOptions {
  /**
   * Logo image URL
   */
  logo?: string;

  /**
   * Logo alt text
   */
  logoAlt?: string;

  /**
   * Navigation links
   */
  links?: Array<{
    text: string;
    url: string;
  }>;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Show navigation links
   */
  showNavigation?: boolean;
}

/**
 * Options for adding a footer component
 */
export interface AddFooterOptions {
  /**
   * Company name
   */
  companyName?: string;

  /**
   * Company address
   */
  address?: string;

  /**
   * Footer text (HTML)
   */
  text?: string;

  /**
   * Social media links
   */
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };

  /**
   * Background color
   */
  backgroundColor?: string;
}

/**
 * Options for adding a hero component
 */
export interface AddHeroOptions {
  /**
   * Hero heading
   */
  heading: string;

  /**
   * Hero description
   */
  description?: string;

  /**
   * Hero image URL
   */
  image?: string;

  /**
   * Image alt text
   */
  imageAlt?: string;

  /**
   * Primary button text
   */
  buttonText?: string;

  /**
   * Primary button URL
   */
  buttonUrl?: string;

  /**
   * Secondary button text
   */
  secondaryButtonText?: string;

  /**
   * Secondary button URL
   */
  secondaryButtonUrl?: string;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Text alignment
   */
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Options for adding a CTA component
 */
export interface AddCTAOptions {
  /**
   * CTA heading
   */
  heading: string;

  /**
   * CTA description
   */
  description?: string;

  /**
   * Primary button text
   */
  buttonText: string;

  /**
   * Primary button URL
   */
  buttonUrl: string;

  /**
   * Secondary button text
   */
  secondaryButtonText?: string;

  /**
   * Secondary button URL
   */
  secondaryButtonUrl?: string;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Text alignment
   */
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Options for adding a text component
 */
export interface AddTextOptions {
  /**
   * Text content (HTML)
   */
  content: string;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Text alignment
   */
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  /**
   * Font size
   */
  fontSize?: number;

  /**
   * Text color
   */
  color?: string;
}

/**
 * Options for adding an image component
 */
export interface AddImageOptions {
  /**
   * Image URL
   */
  src: string;

  /**
   * Alt text
   */
  alt?: string;

  /**
   * Image title
   */
  title?: string;

  /**
   * Link URL (makes image clickable)
   */
  link?: string;

  /**
   * Image width
   */
  width?: number;

  /**
   * Image height
   */
  height?: number;

  /**
   * Image alignment
   */
  align?: 'left' | 'center' | 'right';
}

/**
 * Options for adding a button component
 */
export interface AddButtonOptions {
  /**
   * Button text
   */
  text: string;

  /**
   * Button URL
   */
  url: string;

  /**
   * Button background color
   */
  backgroundColor?: string;

  /**
   * Button text color
   */
  color?: string;

  /**
   * Button alignment
   */
  align?: 'left' | 'center' | 'right';

  /**
   * Button style variant
   */
  variant?: 'filled' | 'outlined' | 'text';
}

/**
 * Options for adding a list component
 */
export interface AddListOptions {
  /**
   * List items
   */
  items: Array<{
    /**
     * Item title
     */
    title: string;

    /**
     * Item description
     */
    description?: string;

    /**
     * Item icon (Remix Icon name or URL)
     */
    icon?: string;
  }>;

  /**
   * Background color
   */
  backgroundColor?: string;
}

/**
 * Options for adding a spacer component
 */
export interface AddSpacerOptions {
  /**
   * Spacer height in pixels
   */
  height?: number;
}

/**
 * Options for adding a separator component
 */
export interface AddSeparatorOptions {
  /**
   * Separator color
   */
  color?: string;

  /**
   * Separator height/thickness
   */
  height?: number;

  /**
   * Separator width percentage
   */
  width?: number;
}

/**
 * EmailBuilder - Headless API for building email templates
 *
 * Provides a fluent, chainable interface for creating email templates
 * programmatically without requiring a UI.
 */
export class EmailBuilder {
  private builder: Builder;
  private template: Template | null = null;
  private initialized: boolean = false;
  private templateName: string = 'Untitled Template';
  private templateDescription?: string;
  private templateAuthor?: string;
  private templateCategory?: string;
  private templateTags?: string[];

  constructor(config: EmailBuilderConfig = {}) {
    // Build the core Builder configuration
    const builderConfig: BuilderConfig = {
      target: 'email',
      storage: config.storage || {
        method: 'local',
        keyPrefix: 'email-builder',
      },
      debug: config.debug || false,
    };

    // Create the core builder instance
    this.builder = new Builder(builderConfig);

    // Store template metadata
    if (config.name) this.templateName = config.name;
    if (config.description) this.templateDescription = config.description;
    if (config.author) this.templateAuthor = config.author;
    if (config.category) this.templateCategory = config.category;
    if (config.tags) this.templateTags = config.tags;

    // Store subject in customData if provided
    if (config.subject && this.template) {
      if (!this.template.customData) {
        this.template.customData = {};
      }
      this.template.customData['subject'] = config.subject;
    }
  }

  /**
   * Initializes the builder
   * Must be called before using any other methods
   */
  async initialize(): Promise<this> {
    if (this.initialized) {
      return this;
    }

    await this.builder.initialize();

    // Create a new template with default settings
    const createOptions: any = {
      name: this.templateName,
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
    };

    if (this.templateDescription !== undefined) {
      createOptions.description = this.templateDescription;
    }
    if (this.templateAuthor !== undefined) {
      createOptions.author = this.templateAuthor;
    }
    if (this.templateCategory !== undefined) {
      createOptions.category = this.templateCategory;
    }
    if (this.templateTags !== undefined) {
      createOptions.tags = this.templateTags;
    }

    this.template = await this.builder.createTemplate(createOptions);

    this.initialized = true;
    return this;
  }

  /**
   * Ensures the builder is initialized
   */
  private ensureInitialized(): void {
    if (!this.initialized || !this.template) {
      throw new Error('EmailBuilder not initialized. Call initialize() first.');
    }
  }

  /**
   * Sets the template name
   */
  setName(name: string): this {
    this.templateName = name;
    if (this.template) {
      this.template.metadata.name = name;
    }
    return this;
  }

  /**
   * Sets the email subject line
   */
  setSubject(subject: string): this {
    if (this.template) {
      // Store subject in custom data
      this.template.customData = this.template.customData || {};
      this.template.customData['subject'] = subject;
    }
    return this;
  }

  /**
   * Sets the template description
   */
  setDescription(description: string): this {
    this.templateDescription = description;
    if (this.template) {
      this.template.metadata.description = description;
    }
    return this;
  }

  /**
   * Sets the template author
   */
  setAuthor(author: string): this {
    this.templateAuthor = author;
    if (this.template) {
      this.template.metadata.author = author;
    }
    return this;
  }

  /**
   * Sets the template category
   */
  setCategory(category: string): this {
    this.templateCategory = category;
    if (this.template) {
      this.template.metadata.category = category;
    }
    return this;
  }

  /**
   * Sets the template tags
   */
  setTags(tags: string[]): this {
    this.templateTags = tags;
    if (this.template) {
      this.template.metadata.tags = tags;
    }
    return this;
  }

  /**
   * Sets the canvas background color
   */
  setBackgroundColor(color: string): this {
    this.ensureInitialized();
    if (this.template) {
      this.template.generalStyles.canvasBackgroundColor = color;
    }
    return this;
  }

  /**
   * Adds a header component
   */
  async addHeader(options: AddHeaderOptions = {}): Promise<this> {
    this.ensureInitialized();

    const header = createHeader();

    // Apply options
    if (options.logo) {
      header.content.image = {
        src: options.logo,
        alt: options.logoAlt || 'Logo',
        title: options.logoAlt || 'Logo',
      };
    }

    if (options.links) {
      header.content.navigationLinks = options.links.map((link, index) => ({
        id: `nav-link-${index}`,
        text: link.text,
        link: { href: link.url },
        order: index,
      }));
    }

    if (options.backgroundColor) {
      header.styles.backgroundColor = options.backgroundColor;
    }

    if (options.showNavigation !== undefined) {
      header.content.showNavigation = options.showNavigation;
    }

    await this.addComponent(header);
    return this;
  }

  /**
   * Adds a footer component
   */
  async addFooter(options: AddFooterOptions = {}): Promise<this> {
    this.ensureInitialized();

    const footer = createFooter();

    // Build footer text
    const textParts: string[] = [];
    if (options.companyName) textParts.push(`<p><strong>${options.companyName}</strong></p>`);
    if (options.address) textParts.push(`<p>${options.address}</p>`);
    if (options.text) textParts.push(options.text);

    if (textParts.length > 0) {
      footer.content.textSections = [
        {
          id: 'footer-text-1',
          html: textParts.join(''),
          plainText: textParts.join(' ').replace(/<[^>]*>/g, ''),
          order: 0,
        },
      ];
    }

    // Add social links
    if (options.socialLinks) {
      footer.content.socialLinks = [];
      let order = 0;

      if (options.socialLinks.facebook) {
        footer.content.socialLinks.push({
          id: `social-facebook`,
          label: 'Facebook',
          platform: 'facebook',
          url: options.socialLinks.facebook,
          icon: 'ri-facebook-fill',
          order: order++,
        });
      }

      if (options.socialLinks.twitter) {
        footer.content.socialLinks.push({
          id: `social-twitter`,
          label: 'Twitter',
          platform: 'twitter',
          url: options.socialLinks.twitter,
          icon: 'ri-twitter-fill',
          order: order++,
        });
      }

      if (options.socialLinks.instagram) {
        footer.content.socialLinks.push({
          id: `social-instagram`,
          label: 'Instagram',
          platform: 'instagram',
          url: options.socialLinks.instagram,
          icon: 'ri-instagram-fill',
          order: order++,
        });
      }

      if (options.socialLinks.linkedin) {
        footer.content.socialLinks.push({
          id: `social-linkedin`,
          label: 'LinkedIn',
          platform: 'linkedin',
          url: options.socialLinks.linkedin,
          icon: 'ri-linkedin-fill',
          order: order++,
        });
      }

      if (options.socialLinks.youtube) {
        footer.content.socialLinks.push({
          id: `social-youtube`,
          label: 'YouTube',
          platform: 'youtube',
          url: options.socialLinks.youtube,
          icon: 'ri-youtube-fill',
          order: order++,
        });
      }
    }

    if (options.backgroundColor) {
      footer.styles.backgroundColor = options.backgroundColor;
    }

    await this.addComponent(footer);
    return this;
  }

  /**
   * Adds a hero component
   */
  async addHero(options: AddHeroOptions): Promise<this> {
    this.ensureInitialized();

    const hero = createHero();

    // Apply options
    hero.content.heading = {
      html: options.heading,
      plainText: options.heading,
    };

    if (options.description) {
      hero.content.description = {
        html: options.description,
        plainText: options.description,
      };
    }

    if (options.image) {
      hero.content.image = {
        src: options.image,
        alt: options.imageAlt || 'Hero image',
        title: options.imageAlt || 'Hero image',
      };
    }

    if (options.buttonText && options.buttonUrl) {
      hero.content['buttons'] = [
        {
          id: 'hero-button-1',
          text: options.buttonText,
          link: { href: options.buttonUrl, target: '_blank' },
          variant: 'filled',
          order: 0,
        },
      ];

      if (options.secondaryButtonText && options.secondaryButtonUrl) {
        (hero.content['buttons'] as any[]).push({
          id: 'hero-button-2',
          text: options.secondaryButtonText,
          link: { href: options.secondaryButtonUrl, target: '_blank' },
          variant: 'outlined',
          order: 1,
        });
      }
    }

    if (options.backgroundColor) {
      hero.styles.backgroundColor = options.backgroundColor;
    }

    if (options.textAlign) {
      hero.styles.textAlign = options.textAlign;
    }

    await this.addComponent(hero);
    return this;
  }

  /**
   * Adds a CTA (Call to Action) component
   */
  async addCTA(options: AddCTAOptions): Promise<this> {
    this.ensureInitialized();

    const cta = createCTA();

    // Apply options
    cta.content.heading = {
      html: options.heading,
      plainText: options.heading,
    };

    if (options.description) {
      cta.content.description = {
        html: options.description,
        plainText: options.description,
      };
    }

    cta.content['buttons'] = [
      {
        id: 'cta-button-1',
        text: options.buttonText,
        link: { href: options.buttonUrl, target: '_blank' },
        variant: 'filled',
        order: 0,
      },
    ];

    if (options.secondaryButtonText && options.secondaryButtonUrl) {
      (cta.content['buttons'] as any[]).push({
        id: 'cta-button-2',
        text: options.secondaryButtonText,
        link: { href: options.secondaryButtonUrl, target: '_blank' },
        variant: 'outlined',
        order: 1,
      });
    }

    if (options.backgroundColor) {
      cta.styles.backgroundColor = options.backgroundColor;
    }

    if (options.textAlign) {
      cta.styles.textAlign = options.textAlign;
    }

    await this.addComponent(cta);
    return this;
  }

  /**
   * Adds a text component
   */
  async addText(options: AddTextOptions): Promise<this> {
    this.ensureInitialized();

    const text = createText();

    // Apply options
    text.content.html = options.content;
    text.content.plainText = options.content.replace(/<[^>]*>/g, '');

    if (options.backgroundColor) {
      text.styles.backgroundColor = options.backgroundColor;
    }

    if (options.textAlign) {
      text.styles.textAlign = options.textAlign;
    }

    if (options.fontSize) {
      text.styles.fontSize = { value: options.fontSize, unit: 'px' };
    }

    if (options.color) {
      text.styles.color = options.color;
    }

    await this.addComponent(text);
    return this;
  }

  /**
   * Adds an image component
   */
  async addImage(options: AddImageOptions): Promise<this> {
    this.ensureInitialized();

    const image = createImage();

    // Apply options
    image.content['image'] = {
      src: options.src,
      alt: options.alt || '',
      title: options.title || options.alt || '',
    };

    if (options.link) {
      image.content.link = {
        href: options.link,
        target: '_blank',
      };
    }

    if (options.width) {
      image.styles.width = { value: options.width, unit: 'px' };
    }

    if (options.height) {
      image.styles.height = { value: options.height, unit: 'px' };
    }

    if (options.align) {
      image.styles.horizontalAlign = options.align;
    }

    await this.addComponent(image);
    return this;
  }

  /**
   * Adds a button component
   */
  async addButton(options: AddButtonOptions): Promise<this> {
    this.ensureInitialized();

    const button = createButton();

    // Apply options
    button.content.text = options.text;
    button.content.link = {
      href: options.url,
      target: '_blank',
    };

    if (options.backgroundColor) {
      button.styles.backgroundColor = options.backgroundColor;
    }

    if (options.color) {
      button.styles.color = options.color;
    }

    if (options.align) {
      button.styles.horizontalAlign = options.align;
    }

    if (options.variant) {
      button.styles.variant = options.variant;
    }

    await this.addComponent(button);
    return this;
  }

  /**
   * Adds a list component
   */
  async addList(options: AddListOptions): Promise<this> {
    this.ensureInitialized();

    const list = createList();

    // Apply options
    list.content.items = options.items.map((item, index) => ({
      id: `list-item-${index}`,
      title: {
        html: item.title,
        plainText: item.title,
      },
      description: item.description ? {
        html: item.description,
        plainText: item.description,
      } : undefined,
      image: item.icon ? {
        src: item.icon,
        alt: item.title,
        title: item.title,
      } : undefined,
      showImage: !!item.icon,
      showButton: false,
      order: index,
    }));

    if (options.backgroundColor) {
      list.styles.backgroundColor = options.backgroundColor;
    }

    await this.addComponent(list);
    return this;
  }

  /**
   * Adds a spacer component
   */
  async addSpacer(options: AddSpacerOptions = {}): Promise<this> {
    this.ensureInitialized();

    const spacer = createSpacer();

    if (options.height) {
      spacer.styles.height = { value: options.height, unit: 'px' };
    }

    await this.addComponent(spacer);
    return this;
  }

  /**
   * Adds a separator component
   */
  async addSeparator(options: AddSeparatorOptions = {}): Promise<this> {
    this.ensureInitialized();

    const separator = createSeparator();

    if (options.color) {
      separator.styles.backgroundColor = options.color;
    }

    if (options.height) {
      separator.styles.height = { value: options.height, unit: 'px' };
    }

    if (options.width) {
      separator.styles.width = { value: options.width, unit: '%' };
    }

    await this.addComponent(separator);
    return this;
  }

  /**
   * Adds a component to the template
   */
  private async addComponent(component: BaseComponent): Promise<void> {
    this.ensureInitialized();

    if (!this.template) return;

    // Add component to the template's components array
    this.template.components.push(component);

    // Update the template in storage
    await this.builder.saveTemplate(this.template);
  }

  /**
   * Gets the current template
   */
  getTemplate(): Template | null {
    return this.template;
  }

  /**
   * Exports the template to JSON
   */
  toJSON(): Template | null {
    return this.template;
  }

  /**
   * Exports the template to HTML
   */
  async toHTML(_options: Partial<EmailExportOptions> = {}): Promise<string> {
    this.ensureInitialized();

    if (!this.template) {
      throw new Error('No template to export');
    }

    const exportService = new EmailExportService();

    // TODO: We need to render the template to HTML first
    // For now, we'll create a basic HTML structure
    // In the future, we should use a proper renderer

    const html = this.renderTemplateToHTML(this.template);

    // Note: EmailExportService.export() doesn't currently accept options
    // The service applies default export behavior
    const result = exportService.export(html);

    return result.html;
  }

  /**
   * Basic HTML renderer for templates
   * TODO: This should be replaced with a proper rendering engine
   */
  private renderTemplateToHTML(template: Template): string {
    const components = template.components || [];
    const componentsHTML = components.map((component) => this.renderComponentToHTML(component)).join('\n');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${template.metadata.name}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: ${template.generalStyles.canvasBackgroundColor || '#f5f5f5'};">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${template.generalStyles.canvasBackgroundColor || '#f5f5f5'};">
            <tr>
              <td align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" width="${template.settings.canvasDimensions.width || 600}" style="max-width: ${template.settings.canvasDimensions.maxWidth || 600}px;">
                  ${componentsHTML}
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  /**
   * Basic component renderer
   * TODO: This should be replaced with proper component renderers
   */
  private renderComponentToHTML(component: BaseComponent): string {
    // This is a very basic renderer
    // In production, each component type should have its own renderer

    const bgColor = component.styles.backgroundColor || 'transparent';
    const padding = component.styles.padding
      ? `${component.styles.padding.top.value}${component.styles.padding.top.unit} ${component.styles.padding.right.value}${component.styles.padding.right.unit} ${component.styles.padding.bottom.value}${component.styles.padding.bottom.unit} ${component.styles.padding.left.value}${component.styles.padding.left.unit}`
      : '0';

    return `
      <tr>
        <td style="background-color: ${bgColor}; padding: ${padding};">
          <!-- ${component.type} component -->
          <div data-component-id="${component.id}" data-component-type="${component.type}">
            ${this.renderComponentContent(component)}
          </div>
        </td>
      </tr>
    `;
  }

  /**
   * Renders component content based on type
   * TODO: This should be replaced with proper component content renderers
   */
  private renderComponentContent(component: BaseComponent): string {
    switch (component.type) {
      case 'text':
        return (component as TextComponent).content.html || '';

      case 'button':
        const button = component as ButtonComponent;
        return `<a href="${button.content.link?.href || '#'}" style="display: inline-block; padding: 12px 24px; background-color: ${component.styles.backgroundColor}; color: ${component.styles.color}; text-decoration: none; border-radius: 4px;">${button.content.text}</a>`;

      case 'image':
        const image = component as ImageComponent;
        const imageData = image.content['image'] as any;
        return `<img src="${imageData.src}" alt="${imageData.alt}" style="max-width: 100%; height: auto;" />`;

      case 'separator':
        return `<hr style="border: none; border-top: 1px solid ${component.styles.backgroundColor || '#ddd'}; margin: 20px 0;" />`;

      case 'spacer':
        const height = component.styles.height?.value || 20;
        return `<div style="height: ${height}px;"></div>`;

      default:
        return `<!-- ${component.type} component -->`;
    }
  }

  /**
   * Saves the template to storage
   */
  async save(): Promise<void> {
    this.ensureInitialized();

    if (!this.template) {
      throw new Error('No template to save');
    }

    await this.builder.saveTemplate(this.template);
  }

  /**
   * Loads a template from storage
   */
  async load(templateId: string): Promise<this> {
    await this.builder.initialize();
    this.template = await this.builder.loadTemplate(templateId);
    this.initialized = true;

    // Update metadata from loaded template
    if (this.template) {
      this.templateName = this.template.metadata.name;
      if (this.template.metadata.description !== undefined) {
        this.templateDescription = this.template.metadata.description;
      }
      if (this.template.metadata.author !== undefined) {
        this.templateAuthor = this.template.metadata.author;
      }
      if (this.template.metadata.category !== undefined) {
        this.templateCategory = this.template.metadata.category;
      }
      if (this.template.metadata.tags !== undefined) {
        this.templateTags = this.template.metadata.tags;
      }
    }

    return this;
  }

  /**
   * Lists all templates in storage
   */
  async listTemplates() {
    if (!this.initialized) {
      await this.builder.initialize();
    }
    return this.builder.listTemplates();
  }

  /**
   * Deletes a template from storage
   */
  async delete(templateId: string): Promise<void> {
    if (!this.initialized) {
      await this.builder.initialize();
    }
    await this.builder.deleteTemplate(templateId);
  }

  /**
   * Gets the underlying Builder instance
   * This allows access to advanced features
   */
  getBuilder(): Builder {
    return this.builder;
  }
}
