/**
 * Component factories tests
 */

import { describe, it, expect } from 'vitest';
import {
  createButton,
  createText,
  createImage,
  createSeparator,
  createSpacer,
  createHeader,
  createFooter,
  createHero,
  createList,
  createCTA,
  generateId,
  createCSSValue,
  createDefaultSpacing,
  createUniformSpacing,
  createDefaultVisibility,
  getCurrentTimestamp,
  DEFAULT_VERSION,
} from './index';

describe('Factory Utilities', () => {
  describe('generateId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateId('button');
      const id2 = generateId('button');

      expect(id1).toMatch(/^button-\d+-[a-z0-9]+$/);
      expect(id2).toMatch(/^button-\d+-[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should use custom prefix', () => {
      const id = generateId('custom');

      expect(id).toMatch(/^custom-/);
    });
  });

  describe('createCSSValue', () => {
    it('should create CSS value with default unit (px)', () => {
      const value = createCSSValue(10);

      expect(value).toEqual({ value: 10, unit: 'px' });
    });

    it('should create CSS value with custom unit', () => {
      const value = createCSSValue(50, '%');

      expect(value).toEqual({ value: 50, unit: '%' });
    });

    it('should handle auto value', () => {
      const value = createCSSValue('auto');

      expect(value).toEqual({ value: 'auto', unit: 'px' });
    });
  });

  describe('createDefaultSpacing', () => {
    it('should create spacing with all sides 0px', () => {
      const spacing = createDefaultSpacing();

      expect(spacing.top).toEqual({ value: 0, unit: 'px' });
      expect(spacing.right).toEqual({ value: 0, unit: 'px' });
      expect(spacing.bottom).toEqual({ value: 0, unit: 'px' });
      expect(spacing.left).toEqual({ value: 0, unit: 'px' });
    });
  });

  describe('createUniformSpacing', () => {
    it('should create uniform spacing with px', () => {
      const spacing = createUniformSpacing(20);

      expect(spacing.top).toEqual({ value: 20, unit: 'px' });
      expect(spacing.right).toEqual({ value: 20, unit: 'px' });
      expect(spacing.bottom).toEqual({ value: 20, unit: 'px' });
      expect(spacing.left).toEqual({ value: 20, unit: 'px' });
    });

    it('should create uniform spacing with custom unit', () => {
      const spacing = createUniformSpacing(2, 'rem');

      expect(spacing.top).toEqual({ value: 2, unit: 'rem' });
      expect(spacing.right).toEqual({ value: 2, unit: 'rem' });
      expect(spacing.bottom).toEqual({ value: 2, unit: 'rem' });
      expect(spacing.left).toEqual({ value: 2, unit: 'rem' });
    });
  });

  describe('createDefaultVisibility', () => {
    it('should create visibility with all devices enabled', () => {
      const visibility = createDefaultVisibility();

      expect(visibility).toEqual({
        desktop: true,
        tablet: true,
        mobile: true,
      });
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should return current timestamp', () => {
      const timestamp = getCurrentTimestamp();
      const now = Date.now();

      expect(timestamp).toBeLessThanOrEqual(now);
      expect(timestamp).toBeGreaterThan(now - 1000);
    });
  });

  describe('DEFAULT_VERSION', () => {
    it('should be 1.0.0', () => {
      expect(DEFAULT_VERSION).toBe('1.0.0');
    });
  });
});

describe('Base Component Factories', () => {
  describe('createButton', () => {
    it('should create button with default values', () => {
      const button = createButton();

      expect(button.id).toMatch(/^button-/);
      expect(button.type).toBe('button');
      expect(button.metadata.name).toBe('Button');
      expect(button.metadata.category).toBe('base');
      expect(button.content.text).toBe('Click me');
      expect(button.content.link.href).toBe('https://example.com');
      expect(button.styles.backgroundColor).toBe('#007bff');
      expect(button.styles.color).toBe('#ffffff');
      expect(button.version).toBe('1.0.0');
    });

    it('should merge overrides', () => {
      const button = createButton({
        content: { text: 'Custom Button', link: { href: '#custom' } },
        styles: { backgroundColor: '#ff0000' },
      });

      expect(button.content.text).toBe('Custom Button');
      expect(button.content.link.href).toBe('#custom');
      expect(button.styles.backgroundColor).toBe('#ff0000');
    });

    it('should have timestamps', () => {
      const button = createButton();
      const now = Date.now();

      expect(button.createdAt).toBeLessThanOrEqual(now);
      expect(button.updatedAt).toBeLessThanOrEqual(now);
    });
  });

  describe('createText', () => {
    it('should create text with default values', () => {
      const text = createText();

      expect(text.id).toMatch(/^text-/);
      expect(text.type).toBe('text');
      expect(text.metadata.name).toBe('Text');
      expect(text.content.type).toBe('paragraph');
      expect(text.content.html).toContain('Enter your text here');
      expect(text.styles.fontSize).toEqual({ value: 16, unit: 'px' });
    });

    it('should merge overrides', () => {
      const text = createText({
        content: { type: 'heading-1', html: '<h1>Title</h1>', plainText: 'Title' },
      });

      expect(text.content.type).toBe('heading-1');
      expect(text.content.html).toBe('<h1>Title</h1>');
    });
  });

  describe('createImage', () => {
    it('should create image with default values', () => {
      const image = createImage();

      expect(image.id).toMatch(/^image-/);
      expect(image.type).toBe('image');
      expect(image.metadata.name).toBe('Image');
      expect(image.content.src).toContain('placeholder');
      expect(image.content.alt).toBe('Placeholder image');
      expect(image.content.lazy).toBe(true);
      expect(image.styles.width).toEqual({ value: 100, unit: '%' });
    });

    it('should merge overrides', () => {
      const image = createImage({
        content: { src: 'custom.jpg', alt: 'Custom image' },
      });

      expect(image.content.src).toBe('custom.jpg');
      expect(image.content.alt).toBe('Custom image');
    });
  });

  describe('createSeparator', () => {
    it('should create separator with default values', () => {
      const separator = createSeparator();

      expect(separator.id).toMatch(/^separator-/);
      expect(separator.type).toBe('separator');
      expect(separator.metadata.name).toBe('Separator');
      expect(separator.content.orientation).toBe('horizontal');
      expect(separator.content.thickness).toEqual({ value: 1, unit: 'px' });
      expect(separator.content.color).toBe('#e0e0e0');
      expect(separator.content.style).toBe('solid');
    });

    it('should merge overrides', () => {
      const separator = createSeparator({
        content: { orientation: 'vertical', color: '#000000' },
      });

      expect(separator.content.orientation).toBe('vertical');
      expect(separator.content.color).toBe('#000000');
    });
  });

  describe('createSpacer', () => {
    it('should create spacer with default values', () => {
      const spacer = createSpacer();

      expect(spacer.id).toMatch(/^spacer-/);
      expect(spacer.type).toBe('spacer');
      expect(spacer.metadata.name).toBe('Spacer');
      expect(spacer.content.height).toEqual({ value: 20, unit: 'px' });
    });

    it('should merge overrides', () => {
      const spacer = createSpacer({
        content: { height: { value: 40, unit: 'px' } },
      });

      expect(spacer.content.height).toEqual({ value: 40, unit: 'px' });
    });
  });
});

describe('Email Component Factories', () => {
  describe('createHeader', () => {
    it('should create header with default values', () => {
      const header = createHeader();

      expect(header.id).toMatch(/^header-/);
      expect(header.type).toBe('header');
      expect(header.metadata.name).toBe('Header');
      expect(header.metadata.category).toBe('navigation');
      expect(header.content.layout).toBe('image-left');
      expect(header.content.image.alt).toBe('Company Logo');
      expect(header.content.navigationLinks).toHaveLength(3);
      expect(header.content.showNavigation).toBe(true);
    });

    it('should have navigation links with IDs', () => {
      const header = createHeader();

      header.content.navigationLinks.forEach((link) => {
        expect(link.id).toMatch(/^nav-link-/);
        expect(link.text).toBeDefined();
        expect(link.link.href).toBeDefined();
      });
    });

    it('should merge overrides', () => {
      const header = createHeader({
        content: { layout: 'logo-center', showNavigation: false },
      });

      expect(header.content.layout).toBe('logo-center');
      expect(header.content.showNavigation).toBe(false);
    });
  });

  describe('createFooter', () => {
    it('should create footer with default values', () => {
      const footer = createFooter();

      expect(footer.id).toMatch(/^footer-/);
      expect(footer.type).toBe('footer');
      expect(footer.metadata.name).toBe('Footer');
      expect(footer.content.textSections).toHaveLength(1);
      expect(footer.content.socialLinks).toHaveLength(3);
      expect(footer.content.showSocialLinks).toBe(true);
      expect(footer.content.copyrightText).toContain('©');
      expect(footer.content.copyrightText).toContain(new Date().getFullYear().toString());
    });

    it('should have social links with platforms', () => {
      const footer = createFooter();

      expect(footer.content.socialLinks[0].platform).toBe('facebook');
      expect(footer.content.socialLinks[1].platform).toBe('twitter');
      expect(footer.content.socialLinks[2].platform).toBe('instagram');
    });

    it('should merge overrides', () => {
      const footer = createFooter({
        content: { showSocialLinks: false },
      });

      expect(footer.content.showSocialLinks).toBe(false);
    });
  });

  describe('createHero', () => {
    it('should create hero with default values', () => {
      const hero = createHero();

      expect(hero.id).toMatch(/^hero-/);
      expect(hero.type).toBe('hero');
      expect(hero.metadata.name).toBe('Hero');
      expect(hero.content.layout).toBe('image-top');
      expect(hero.content.heading.plainText).toContain('Welcome');
      expect(hero.content.description).toBeDefined();
      expect(hero.content.button?.text).toBe('Get Started');
      expect(hero.content.showButton).toBe(true);
    });

    it('should have styling for heading and description', () => {
      const hero = createHero();

      expect(hero.styles.headingStyles?.fontSize).toEqual({ value: 48, unit: 'px' });
      expect(hero.styles.descriptionStyles?.fontSize).toEqual({ value: 18, unit: 'px' });
      expect(hero.styles.contentAlign).toBe('center');
    });

    it('should merge overrides', () => {
      const hero = createHero({
        content: { layout: 'image-left', showButton: false },
      });

      expect(hero.content.layout).toBe('image-left');
      expect(hero.content.showButton).toBe(false);
    });
  });

  describe('createList', () => {
    it('should create list with default values', () => {
      const list = createList();

      expect(list.id).toMatch(/^list-/);
      expect(list.type).toBe('list');
      expect(list.metadata.name).toBe('List');
      expect(list.content.orientation).toBe('horizontal');
      expect(list.content.itemLayout).toBe('image-top');
      expect(list.content.columns).toBe(3);
      expect(list.content.items).toHaveLength(3);
    });

    it('should have list items with all properties', () => {
      const list = createList();

      list.content.items.forEach((item, index) => {
        expect(item.id).toMatch(/^list-item-/);
        expect(item.title.plainText).toContain('Feature');
        expect(item.description).toBeDefined();
        expect(item.button?.text).toBe('Learn More');
        expect(item.showImage).toBe(true);
        expect(item.showButton).toBe(true);
        expect(item.order).toBe(index);
      });
    });

    it('should merge overrides', () => {
      const list = createList({
        content: { orientation: 'vertical', columns: 2 },
      });

      expect(list.content.orientation).toBe('vertical');
      expect(list.content.columns).toBe(2);
    });
  });

  describe('createCTA', () => {
    it('should create CTA with default values', () => {
      const cta = createCTA();

      expect(cta.id).toMatch(/^cta-/);
      expect(cta.type).toBe('cta');
      expect(cta.metadata.name).toBe('Call to Action');
      expect(cta.content.layout).toBe('centered');
      expect(cta.content.heading.plainText).toContain('Ready');
      expect(cta.content.primaryButton.text).toBe('Start Free Trial');
      expect(cta.content.secondaryButton?.text).toBe('Learn More');
      expect(cta.content.showSecondaryButton).toBe(true);
      expect(cta.content.showDescription).toBe(true);
    });

    it('should have styling', () => {
      const cta = createCTA();

      expect(cta.styles.backgroundColor).toBe('#007bff');
      expect(cta.styles.headingStyles?.color).toBe('#ffffff');
      expect(cta.styles.descriptionStyles?.color).toBe('#ffffff');
    });

    it('should merge overrides', () => {
      const cta = createCTA({
        content: { layout: 'left-aligned', showSecondaryButton: false },
      });

      expect(cta.content.layout).toBe('left-aligned');
      expect(cta.content.showSecondaryButton).toBe(false);
    });
  });
});

describe('Component Common Properties', () => {
  it('should have unique IDs for all components', () => {
    const components = [
      createButton(),
      createText(),
      createImage(),
      createSeparator(),
      createSpacer(),
      createHeader(),
      createFooter(),
      createHero(),
      createList(),
      createCTA(),
    ];

    const ids = components.map((c) => c.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(components.length);
  });

  it('should have timestamps for all components', () => {
    const components = [
      createButton(),
      createText(),
      createImage(),
      createSeparator(),
      createSpacer(),
      createHeader(),
      createFooter(),
      createHero(),
      createList(),
      createCTA(),
    ];

    const now = Date.now();

    components.forEach((component) => {
      expect(component.createdAt).toBeLessThanOrEqual(now);
      expect(component.updatedAt).toBeLessThanOrEqual(now);
      expect(component.createdAt).toBeGreaterThan(now - 1000);
      expect(component.updatedAt).toBeGreaterThan(now - 1000);
    });
  });

  it('should have version 1.0.0 for all components', () => {
    const components = [
      createButton(),
      createText(),
      createImage(),
      createSeparator(),
      createSpacer(),
      createHeader(),
      createFooter(),
      createHero(),
      createList(),
      createCTA(),
    ];

    components.forEach((component) => {
      expect(component.version).toBe('1.0.0');
    });
  });

  it('should have visibility for all components', () => {
    const components = [
      createButton(),
      createText(),
      createImage(),
      createSeparator(),
      createSpacer(),
      createHeader(),
      createFooter(),
      createHero(),
      createList(),
      createCTA(),
    ];

    components.forEach((component) => {
      expect(component.visibility).toEqual({
        desktop: true,
        tablet: true,
        mobile: true,
      });
    });
  });

  it('should have metadata for all components', () => {
    const components = [
      createButton(),
      createText(),
      createImage(),
      createSeparator(),
      createSpacer(),
      createHeader(),
      createFooter(),
      createHero(),
      createList(),
      createCTA(),
    ];

    components.forEach((component) => {
      expect(component.metadata.name).toBeDefined();
      expect(component.metadata.description).toBeDefined();
      expect(component.metadata.icon).toBeDefined();
      expect(component.metadata.category).toBeDefined();
      expect(component.metadata.tags).toBeInstanceOf(Array);
    });
  });
});
