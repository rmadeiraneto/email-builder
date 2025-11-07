/**
 * Compatibility Checker Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CompatibilityChecker, IssueSeverity, IssueCategory } from './CompatibilityChecker';
import { CompatibilityService } from './CompatibilityService';
import type { BaseComponent } from '../types';

describe('CompatibilityChecker', () => {
  let checker: CompatibilityChecker;
  let service: CompatibilityService;

  beforeEach(() => {
    service = new CompatibilityService();
    checker = new CompatibilityChecker(service);
  });

  describe('checkTemplate', () => {
    it('should return report with zero issues for empty template', () => {
      const report = checker.checkTemplate([]);

      expect(report.totalIssues).toBe(0);
      expect(report.issues.critical).toHaveLength(0);
      expect(report.issues.warnings).toHaveLength(0);
      expect(report.issues.suggestions).toHaveLength(0);
      expect(report.overallScore).toBe(100);
      expect(report.safeToExport).toBe(true);
    });

    it('should check single component without styles', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'text',
          content: { text: 'Hello' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.componentsChecked).toBe(1);
      expect(report.timestamp).toBeInstanceOf(Date);
    });

    it('should detect problematic CSS properties', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: {
            display: 'flex',
            justifyContent: 'center',
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.totalIssues).toBeGreaterThan(0);
      expect(report.safeToExport).toBe(false);
    });

    it('should recursively check nested components', () => {
      const components: BaseComponent[] = [
        {
          id: 'parent',
          type: 'container',
          styles: { display: 'flex' },
          children: [
            {
              id: 'child',
              type: 'text',
              styles: { position: 'absolute' },
              children: [],
            },
          ],
        },
      ];

      const report = checker.checkTemplate(components);

      // Should find issues in both parent and child
      expect(report.totalIssues).toBeGreaterThan(1);
    });

    it('should group issues by severity', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: {
            display: 'flex', // Critical
            boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Warning/Critical depending on support
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.issues.critical.length).toBeGreaterThan(0);

      report.issues.critical.forEach((issue) => {
        expect(issue.severity).toBe(IssueSeverity.CRITICAL);
      });

      report.issues.warnings.forEach((issue) => {
        expect(issue.severity).toBe(IssueSeverity.WARNING);
      });

      report.issues.suggestions.forEach((issue) => {
        expect(issue.severity).toBe(IssueSeverity.SUGGESTION);
      });
    });

    it('should calculate overall score based on issues', () => {
      const componentsNoIssues: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'text',
          content: { text: 'Hello' },
          children: [],
        },
      ];

      const reportNoIssues = checker.checkTemplate(componentsNoIssues);
      expect(reportNoIssues.overallScore).toBe(100);

      const componentsWithIssues: BaseComponent[] = [
        {
          id: 'comp-2',
          type: 'container',
          styles: { display: 'flex' },
          children: [],
        },
      ];

      const reportWithIssues = checker.checkTemplate(componentsWithIssues);
      expect(reportWithIssues.overallScore).toBeLessThan(100);
    });

    it('should mark template as unsafe to export if critical issues exist', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { display: 'grid' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.issues.critical.length).toBeGreaterThan(0);
      expect(report.safeToExport).toBe(false);
    });

    it('should mark template as safe if only warnings and suggestions', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'text',
          content: { text: 'A'.repeat(1500) }, // Long text = suggestion
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      // Might have warnings or suggestions but no critical
      expect(report.issues.critical.length).toBe(0);
      expect(report.safeToExport).toBe(true);
    });
  });

  describe('image checking', () => {
    it('should detect missing alt text', () => {
      const components: BaseComponent[] = [
        {
          id: 'img-1',
          type: 'image',
          content: { src: 'https://example.com/image.jpg' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const altIssue = report.issues.warnings.find(
        (i) => i.property === 'alt'
      );
      expect(altIssue).toBeDefined();
      expect(altIssue?.category).toBe(IssueCategory.ACCESSIBILITY);
    });

    it('should detect empty alt text', () => {
      const components: BaseComponent[] = [
        {
          id: 'img-1',
          type: 'image',
          content: {
            src: 'https://example.com/image.jpg',
            alt: '  '
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const altIssue = report.issues.warnings.find(
        (i) => i.property === 'alt'
      );
      expect(altIssue).toBeDefined();
    });

    it('should detect missing width and height', () => {
      const components: BaseComponent[] = [
        {
          id: 'img-1',
          type: 'image',
          content: { src: 'https://example.com/image.jpg' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const widthIssue = report.issues.suggestions.find(
        (i) => i.property === 'width'
      );
      const heightIssue = report.issues.suggestions.find(
        (i) => i.property === 'height'
      );

      expect(widthIssue).toBeDefined();
      expect(heightIssue).toBeDefined();
    });

    it('should detect relative image URLs', () => {
      const components: BaseComponent[] = [
        {
          id: 'img-1',
          type: 'image',
          content: { src: '/images/logo.png' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const srcIssue = report.issues.critical.find(
        (i) => i.property === 'src' && i.componentId === 'img-1'
      );
      expect(srcIssue).toBeDefined();
      expect(srcIssue?.category).toBe(IssueCategory.IMAGES);
    });

    it('should accept absolute URLs for images', () => {
      const components: BaseComponent[] = [
        {
          id: 'img-1',
          type: 'image',
          content: {
            src: 'https://example.com/image.jpg',
            alt: 'Description',
            width: '600',
            height: '400',
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const imageIssues = report.totalIssues;
      expect(imageIssues).toBe(0);
    });
  });

  describe('accessibility checking', () => {
    it('should detect buttons without text', () => {
      const components: BaseComponent[] = [
        {
          id: 'btn-1',
          type: 'button',
          content: {},
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const textIssue = report.issues.warnings.find(
        (i) => i.componentType === 'button' && i.category === IssueCategory.ACCESSIBILITY
      );
      expect(textIssue).toBeDefined();
    });

    it('should detect links without text', () => {
      const components: BaseComponent[] = [
        {
          id: 'link-1',
          type: 'link',
          content: { href: 'https://example.com' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const textIssue = report.issues.warnings.find(
        (i) => i.componentType === 'link' && i.category === IssueCategory.ACCESSIBILITY
      );
      expect(textIssue).toBeDefined();
    });
  });

  describe('content checking', () => {
    it('should detect very long text content', () => {
      const components: BaseComponent[] = [
        {
          id: 'text-1',
          type: 'text',
          content: { content: 'A'.repeat(1500) },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const longTextIssue = report.issues.suggestions.find(
        (i) => i.category === IssueCategory.CONTENT
      );
      expect(longTextIssue).toBeDefined();
    });

    it('should not flag short text content', () => {
      const components: BaseComponent[] = [
        {
          id: 'text-1',
          type: 'text',
          content: { content: 'Short text' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const contentIssues = report.issues.suggestions.filter(
        (i) => i.category === IssueCategory.CONTENT
      );
      expect(contentIssues).toHaveLength(0);
    });
  });

  describe('issue details', () => {
    it('should include all required issue fields', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { display: 'flex' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.totalIssues).toBeGreaterThan(0);

      const issue = report.issues.critical[0];
      expect(issue).toHaveProperty('id');
      expect(issue).toHaveProperty('severity');
      expect(issue).toHaveProperty('category');
      expect(issue).toHaveProperty('componentId');
      expect(issue).toHaveProperty('componentType');
      expect(issue).toHaveProperty('message');
      expect(issue).toHaveProperty('autoFixAvailable');
    });

    it('should provide unique IDs for issues', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: {
            display: 'flex',
            position: 'absolute',
            transform: 'rotate(45deg)',
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const ids = [
        ...report.issues.critical,
        ...report.issues.warnings,
        ...report.issues.suggestions,
      ].map((i) => i.id);

      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });

    it('should provide suggested fixes when available', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { display: 'flex' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const flexIssue = report.issues.critical.find(
        (i) => i.property === 'display' && i.value === 'flex'
      );

      expect(flexIssue).toBeDefined();
      expect(flexIssue?.autoFixAvailable).toBe(true);
      expect(flexIssue?.suggestedFix).toBeDefined();
    });
  });

  describe('special CSS property checks', () => {
    it('should detect display: flex as critical', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { display: 'flex' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const flexIssue = report.issues.critical.find(
        (i) => i.property === 'display' && i.value === 'flex'
      );

      expect(flexIssue).toBeDefined();
      expect(flexIssue?.severity).toBe(IssueSeverity.CRITICAL);
    });

    it('should detect display: grid as critical', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { display: 'grid' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const gridIssue = report.issues.critical.find(
        (i) => i.property === 'display' && i.value === 'grid'
      );

      expect(gridIssue).toBeDefined();
    });

    it('should detect non-static position as warning', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { position: 'absolute' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const positionIssue = report.issues.warnings.find(
        (i) => i.property === 'position' && i.value === 'absolute'
      );

      expect(positionIssue).toBeDefined();
    });

    it('should not flag position: static', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: { position: 'static' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      const positionIssue = report.issues.warnings.find(
        (i) => i.property === 'position'
      );

      expect(positionIssue).toBeUndefined();
    });
  });

  describe('score calculation', () => {
    it('should score perfect template at 100', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'text',
          content: { text: 'Hello World' },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.overallScore).toBe(100);
    });

    it('should never return negative score', () => {
      const components: BaseComponent[] = [
        {
          id: 'comp-1',
          type: 'container',
          styles: {
            display: 'flex',
            position: 'absolute',
            transform: 'rotate(45deg)',
            animation: 'slide 1s',
            transition: 'all 0.3s',
            opacity: '0.5',
            boxShadow: '0 0 10px #000',
            textShadow: '1px 1px #fff',
          },
          children: [],
        },
      ];

      const report = checker.checkTemplate(components);

      expect(report.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should never exceed 100 score', () => {
      const components: BaseComponent[] = [];

      const report = checker.checkTemplate(components);

      expect(report.overallScore).toBeLessThanOrEqual(100);
    });
  });
});
