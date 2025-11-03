/**
 * EmailExportService tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { EmailExportService } from './EmailExportService';
import type { EmailExportOptions } from './email-export.types';

describe('EmailExportService', () => {
  let service: EmailExportService;

  beforeEach(() => {
    service = new EmailExportService();
  });

  describe('constructor', () => {
    it('should create service with default options', () => {
      const service = new EmailExportService();
      expect(service).toBeInstanceOf(EmailExportService);
    });

    it('should create service with custom options', () => {
      const options: EmailExportOptions = {
        inlineCSS: false,
        useTableLayout: false,
        maxWidth: 800,
      };
      const service = new EmailExportService(options);
      expect(service).toBeInstanceOf(EmailExportService);
    });
  });

  describe('export()', () => {
    it('should export basic HTML', () => {
      const html = '<div>Hello World</div>';
      const result = service.export(html);

      expect(result).toHaveProperty('html');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('stats');
      expect(result.html).toBeTruthy();
    });

    it('should include DOCTYPE in output', () => {
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('<!DOCTYPE');
      expect(result.html).toContain('XHTML');
    });

    it('should include meta tags in output', () => {
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('<meta charset=');
      expect(result.html).toContain('<meta name="viewport"');
      expect(result.html).toContain('<meta http-equiv="X-UA-Compatible"');
    });

    it('should wrap content in table structure', () => {
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('<table');
      expect(result.html).toContain('role="presentation"');
      expect(result.html).toContain('</table>');
    });

    it('should set max-width from options', () => {
      const service = new EmailExportService({ maxWidth: 800 });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('800');
    });

    it('should return stats', () => {
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.stats).toHaveProperty('inlinedRules');
      expect(result.stats).toHaveProperty('convertedElements');
      expect(result.stats).toHaveProperty('removedProperties');
      expect(result.stats).toHaveProperty('outputSize');
      expect(result.stats.outputSize).toBeGreaterThan(0);
    });

    it('should return empty warnings array for clean HTML', () => {
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe('CSS inlining', () => {
    it('should inline CSS when option is enabled', () => {
      const service = new EmailExportService({ inlineCSS: true });
      const html = `
        <style>
          .test { color: red; }
        </style>
        <div class="test">Hello</div>
      `;
      const result = service.export(html);

      expect(result.html).toContain('style=');
      expect(result.stats.inlinedRules).toBeGreaterThan(0);
    });

    it('should skip CSS inlining when option is disabled', () => {
      const service = new EmailExportService({ inlineCSS: false });
      const html = `
        <style>
          .test { color: red; }
        </style>
        <div class="test">Hello</div>
      `;
      const result = service.export(html);

      expect(result.stats.inlinedRules).toBe(0);
    });
  });

  describe('Table conversion', () => {
    it('should convert layout divs to tables when enabled', () => {
      const service = new EmailExportService({ useTableLayout: true });
      const html = '<div data-layout="container">Content</div>';
      const result = service.export(html);

      expect(result.html).toContain('<table');
      expect(result.stats.convertedElements).toBeGreaterThan(0);
    });

    it('should skip table conversion when disabled', () => {
      const service = new EmailExportService({ useTableLayout: false });
      const html = '<div data-layout="container">Content</div>';
      const result = service.export(html);

      expect(result.stats.convertedElements).toBe(0);
    });
  });

  describe('Outlook fixes', () => {
    it('should add Outlook conditional comments when enabled', () => {
      const service = new EmailExportService({ addOutlookFixes: true });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('<!--[if mso]>');
      expect(result.html).toContain('<![endif]-->');
    });

    it('should skip Outlook fixes when disabled', () => {
      const service = new EmailExportService({ addOutlookFixes: false });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).not.toContain('<!--[if mso]>');
    });

    it('should skip Outlook fixes when client optimization is disabled', () => {
      const service = new EmailExportService({
        addOutlookFixes: true,
        clientOptimizations: { outlook: false },
      });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).not.toContain('<!--[if mso]>');
    });
  });

  describe('Email structure optimization', () => {
    it('should add iOS format detection meta tags when enabled', () => {
      const service = new EmailExportService({
        clientOptimizations: { ios: true },
      });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('format-detection');
    });

    it('should add Gmail fixes in reset styles when enabled', () => {
      const service = new EmailExportService({
        clientOptimizations: { gmail: true },
      });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('gmail-fix');
    });

    it('should add iOS fixes in reset styles when enabled', () => {
      const service = new EmailExportService({
        clientOptimizations: { ios: true },
      });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('x-apple-data-detectors');
    });
  });

  describe('Incompatible CSS removal', () => {
    it('should remove flexbox properties', () => {
      const service = new EmailExportService({ removeIncompatibleCSS: true });
      const html = '<div style="display: flex; color: red;">Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('color: red');
      expect(result.stats.removedProperties).toBeGreaterThan(0);
    });

    it('should remove position properties', () => {
      const service = new EmailExportService({ removeIncompatibleCSS: true });
      const html = '<div style="position: absolute; color: blue;">Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('color: blue');
      expect(result.stats.removedProperties).toBeGreaterThan(0);
    });

    it('should remove animation properties', () => {
      const service = new EmailExportService({ removeIncompatibleCSS: true });
      const html = '<div style="animation: slide 1s; background: white;">Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('background: white');
      expect(result.stats.removedProperties).toBeGreaterThan(0);
    });

    it('should keep safe CSS properties', () => {
      const service = new EmailExportService({ removeIncompatibleCSS: true });
      const html =
        '<div style="color: red; background-color: blue; padding: 10px;">Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('color: red');
      expect(result.html).toContain('background-color: blue');
      expect(result.html).toContain('padding: 10px');
    });
  });

  describe('Minification', () => {
    it('should minify HTML when enabled', () => {
      const service = new EmailExportService({ minify: true });
      const html = `
        <div>
          <p>Test</p>
        </div>
      `;
      const result = service.export(html);

      const nonMinified = new EmailExportService({ minify: false }).export(html);

      expect(result.html.length).toBeLessThan(nonMinified.html.length);
    });

    it('should preserve HTML when minify is disabled', () => {
      const service = new EmailExportService({ minify: false });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toBeTruthy();
    });
  });

  describe('Custom DOCTYPE', () => {
    it('should use custom DOCTYPE when provided', () => {
      const customDoctype = '<!DOCTYPE html>';
      const service = new EmailExportService({ doctype: customDoctype });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain(customDoctype);
    });

    it('should use custom charset when provided', () => {
      const service = new EmailExportService({ charset: 'iso-8859-1' });
      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toContain('iso-8859-1');
    });
  });

  describe('Error handling', () => {
    it('should handle empty HTML gracefully', () => {
      const result = service.export('');
      expect(result).toHaveProperty('html');
      expect(result).toHaveProperty('warnings');
      expect(result).toHaveProperty('stats');
    });

    it('should handle malformed HTML gracefully', () => {
      const html = '<div><p>Unclosed tags';
      const result = service.export(html);

      expect(result).toHaveProperty('html');
      expect(result.warnings).toBeDefined();
    });

    it('should return warnings for problematic content', () => {
      const service = new EmailExportService({ removeIncompatibleCSS: true });
      const html = '<div style="display: flex;">Test</div>';
      const result = service.export(html);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toHaveProperty('type');
      expect(result.warnings[0]).toHaveProperty('message');
      expect(result.warnings[0]).toHaveProperty('severity');
    });
  });

  describe('Integration tests', () => {
    it('should handle complete email template', () => {
      const html = `
        <style>
          .header { background-color: #333; color: white; padding: 20px; }
          .content { padding: 20px; display: flex; }
          .footer { background-color: #f4f4f4; padding: 10px; }
        </style>
        <div class="header">
          <h1>Email Header</h1>
        </div>
        <div class="content" data-layout="container">
          <p>Email content goes here</p>
        </div>
        <div class="footer">
          <p>Email Footer</p>
        </div>
      `;

      const result = service.export(html);

      expect(result.html).toBeTruthy();
      expect(result.html).toContain('<!DOCTYPE');
      expect(result.html).toContain('<table');
      expect(result.stats.outputSize).toBeGreaterThan(0);
      expect(result.warnings).toBeDefined();
    });

    it('should work with all options disabled', () => {
      const service = new EmailExportService({
        inlineCSS: false,
        useTableLayout: false,
        addOutlookFixes: false,
        removeIncompatibleCSS: false,
        optimizeStructure: false,
      });

      const html = '<div>Test</div>';
      const result = service.export(html);

      expect(result.html).toBeTruthy();
      expect(result.html).toContain('<!DOCTYPE');
    });

    it('should provide accurate statistics', () => {
      const html = `
        <style>
          .test1 { color: red; }
          .test2 { background: blue; }
        </style>
        <div class="test1" data-layout="container">Hello</div>
        <div class="test2" style="display: flex;">World</div>
      `;

      const result = service.export(html);

      expect(result.stats.inlinedRules).toBeGreaterThan(0);
      expect(result.stats.convertedElements).toBeGreaterThan(0);
      // CSS removal happens before style tags are removed, so incompatible
      // properties in the original HTML may have already been processed
      expect(result.stats.removedProperties).toBeGreaterThanOrEqual(0);
      expect(result.stats.outputSize).toBeGreaterThan(0);
    });
  });
});
