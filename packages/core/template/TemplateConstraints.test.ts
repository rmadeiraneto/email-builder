/**
 * Tests for TemplateConstraints
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TemplateConstraintsManager,
  createDefaultConstraintsManager,
  maxComponentsConstraint,
  maxNestingDepthConstraint,
  imageAltTextConstraint,
  linkTextConstraint,
  emailWidthConstraint,
  ConstraintSeverity,
  type TemplateConstraint,
  type TemplatePolicy,
} from './TemplateConstraints';
import { createEmptyEmailTemplate, TemplateComposer } from './TemplateComposer';
import { createButton, createImage } from '../components/factories/base-components.factories';
import type { Template } from '../types/template.types';

describe('TemplateConstraintsManager', () => {
  let manager: TemplateConstraintsManager;

  beforeEach(() => {
    manager = new TemplateConstraintsManager();
  });

  describe('registerConstraint', () => {
    it('should register a constraint', () => {
      const constraint: TemplateConstraint = {
        id: 'test-constraint',
        name: 'Test',
        description: 'A test constraint',
        severity: ConstraintSeverity.ERROR,
        enabled: true,
        validate: () => [],
      };

      manager.registerConstraint(constraint);

      const retrieved = manager.getConstraint('test-constraint');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test');
    });

    it('should register multiple constraints', () => {
      const constraints: TemplateConstraint[] = [
        {
          id: 'constraint-1',
          name: 'Constraint 1',
          description: 'First',
          severity: ConstraintSeverity.ERROR,
          enabled: true,
          validate: () => [],
        },
        {
          id: 'constraint-2',
          name: 'Constraint 2',
          description: 'Second',
          severity: ConstraintSeverity.WARNING,
          enabled: true,
          validate: () => [],
        },
      ];

      manager.registerConstraints(constraints);

      expect(manager.getAllConstraints()).toHaveLength(2);
    });
  });

  describe('registerPolicy', () => {
    it('should register a policy', () => {
      const policy: TemplatePolicy = {
        id: 'test-policy',
        name: 'Test Policy',
        description: 'A test policy',
        constraints: [],
      };

      manager.registerPolicy(policy);

      const retrieved = manager.getPolicy('test-policy');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Policy');
    });
  });

  describe('validateConstraints', () => {
    beforeEach(() => {
      manager.registerConstraints([
        {
          id: 'always-pass',
          name: 'Always Pass',
          description: 'Always passes',
          severity: ConstraintSeverity.ERROR,
          enabled: true,
          validate: () => [],
        },
        {
          id: 'always-fail',
          name: 'Always Fail',
          description: 'Always fails',
          severity: ConstraintSeverity.ERROR,
          enabled: true,
          validate: (template) => [
            {
              constraintId: 'always-fail',
              severity: ConstraintSeverity.ERROR,
              message: 'This always fails',
            },
          ],
        },
      ]);
    });

    it('should validate enabled constraints', () => {
      const template = createEmptyEmailTemplate('Test');
      const result = manager.validateConstraints(template, ['always-pass']);

      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });

    it('should detect violations', () => {
      const template = createEmptyEmailTemplate('Test');
      const result = manager.validateConstraints(template, ['always-fail']);

      expect(result.valid).toBe(false);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].message).toBe('This always fails');
    });

    it('should skip disabled constraints', () => {
      const constraint = manager.getConstraint('always-fail');
      if (constraint) {
        constraint.enabled = false;
      }

      const template = createEmptyEmailTemplate('Test');
      const result = manager.validateConstraints(template, ['always-fail']);

      expect(result.valid).toBe(true);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('validatePolicy', () => {
    beforeEach(() => {
      const constraint1: TemplateConstraint = {
        id: 'constraint-1',
        name: 'Constraint 1',
        description: 'First',
        severity: ConstraintSeverity.ERROR,
        enabled: true,
        validate: () => [],
      };

      const constraint2: TemplateConstraint = {
        id: 'constraint-2',
        name: 'Constraint 2',
        description: 'Second',
        severity: ConstraintSeverity.WARNING,
        enabled: true,
        validate: (template) => [
          {
            constraintId: 'constraint-2',
            severity: ConstraintSeverity.WARNING,
            message: 'Warning message',
          },
        ],
      };

      manager.registerConstraints([constraint1, constraint2]);

      const policy: TemplatePolicy = {
        id: 'test-policy',
        name: 'Test Policy',
        description: 'Test',
        constraints: [constraint1, constraint2],
      };

      manager.registerPolicy(policy);
    });

    it('should validate all constraints in policy', () => {
      const template = createEmptyEmailTemplate('Test');
      const result = manager.validatePolicy(template, 'test-policy');

      expect(result.valid).toBe(true); // Valid because no errors (only warnings)
      expect(result.violations).toHaveLength(1); // One warning
      expect(result.violations[0].severity).toBe(ConstraintSeverity.WARNING);
    });

    it('should throw error for unknown policy', () => {
      const template = createEmptyEmailTemplate('Test');
      expect(() => manager.validatePolicy(template, 'unknown-policy')).toThrow();
    });
  });

  describe('setConstraintEnabled', () => {
    it('should enable/disable constraint', () => {
      const constraint: TemplateConstraint = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        severity: ConstraintSeverity.ERROR,
        enabled: true,
        validate: () => [],
      };

      manager.registerConstraint(constraint);

      manager.setConstraintEnabled('test', false);
      const retrieved = manager.getConstraint('test');
      expect(retrieved?.enabled).toBe(false);

      manager.setConstraintEnabled('test', true);
      const retrieved2 = manager.getConstraint('test');
      expect(retrieved2?.enabled).toBe(true);
    });
  });
});

describe('Built-in Constraints', () => {
  describe('maxComponentsConstraint', () => {
    it('should pass for templates within limit', () => {
      const template = createEmptyEmailTemplate('Test');
      const button = createButton({
        text: 'Click',
        link: { href: '#' },
      });
      template.components = [button];

      const violations = maxComponentsConstraint.validate(template);
      expect(violations).toHaveLength(0);
    });

    it('should fail for templates exceeding limit', () => {
      const template = createEmptyEmailTemplate('Test');
      const button = createButton({
        text: 'Click',
        link: { href: '#' },
      });

      // Add 101 components
      template.components = Array(101).fill(button);

      const violations = maxComponentsConstraint.validate(template);
      expect(violations).toHaveLength(1);
      expect(violations[0].severity).toBe(ConstraintSeverity.ERROR);
    });
  });

  describe('imageAltTextConstraint', () => {
    it('should pass for images with alt text', () => {
      const template = createEmptyEmailTemplate('Test');
      const image = createImage({
        content: {
          src: 'https://example.com/image.jpg',
          alt: 'Descriptive alt text',
        },
      });
      template.components = [image];

      const violations = imageAltTextConstraint.validate(template);
      expect(violations).toHaveLength(0);
    });

    it('should warn for images without alt text', () => {
      const template = createEmptyEmailTemplate('Test');
      const image = createImage({
        content: {
          src: 'https://example.com/image.jpg',
          alt: '',
        },
      });
      template.components = [image];

      const violations = imageAltTextConstraint.validate(template);
      expect(violations).toHaveLength(1);
      expect(violations[0].severity).toBe(ConstraintSeverity.WARNING);
    });
  });

  describe('linkTextConstraint', () => {
    it('should pass for descriptive link text', () => {
      const template = createEmptyEmailTemplate('Test');
      const button = createButton({
        content: {
          text: 'View Product Details',
          link: { href: '#' },
        },
      });
      template.components = [button];

      const violations = linkTextConstraint.validate(template);
      expect(violations).toHaveLength(0);
    });

    it('should warn for generic link text', () => {
      const template = createEmptyEmailTemplate('Test');
      const button = createButton({
        content: {
          text: 'Click Here',
          link: { href: '#' },
        },
      });
      template.components = [button];

      const violations = linkTextConstraint.validate(template);
      expect(violations).toHaveLength(1);
      expect(violations[0].severity).toBe(ConstraintSeverity.WARNING);
    });
  });

  describe('emailWidthConstraint', () => {
    it('should pass for email templates within width limit', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
        width: 600,
      }).build();

      const violations = emailWidthConstraint.validate(template);
      expect(violations).toHaveLength(0);
    });

    it('should fail for email templates exceeding width limit', () => {
      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
        width: 800,
      }).build();

      const violations = emailWidthConstraint.validate(template);
      expect(violations).toHaveLength(1);
      expect(violations[0].severity).toBe(ConstraintSeverity.ERROR);
    });

    it('should not apply to web templates', () => {
      const template = new TemplateComposer({
        target: 'web',
        name: 'Test',
        width: 1920,
      }).build();

      const violations = emailWidthConstraint.validate(template);
      expect(violations).toHaveLength(0);
    });
  });
});

describe('Built-in Policies', () => {
  describe('createDefaultConstraintsManager', () => {
    it('should create manager with all built-in constraints', () => {
      const manager = createDefaultConstraintsManager();

      const constraints = manager.getAllConstraints();
      expect(constraints.length).toBeGreaterThan(0);

      // Check that key constraints are present
      expect(manager.getConstraint('max-components')).toBeDefined();
      expect(manager.getConstraint('image-alt-text')).toBeDefined();
      expect(manager.getConstraint('email-width')).toBeDefined();
    });

    it('should create manager with all built-in policies', () => {
      const manager = createDefaultConstraintsManager();

      const policies = manager.getAllPolicies();
      expect(policies.length).toBeGreaterThan(0);

      // Check that key policies are present
      expect(manager.getPolicy('email-best-practices')).toBeDefined();
      expect(manager.getPolicy('accessibility-a')).toBeDefined();
      expect(manager.getPolicy('performance')).toBeDefined();
      expect(manager.getPolicy('strict')).toBeDefined();
    });
  });

  describe('emailBestPracticesPolicy', () => {
    it('should validate email best practices', () => {
      const manager = createDefaultConstraintsManager();

      // Good template
      const goodTemplate = new TemplateComposer({
        target: 'email',
        name: 'Good',
        width: 600,
      })
        .addComponent(
          createImage({
            content: {
              src: 'test.jpg',
              alt: 'Descriptive alt',
            },
          })
        )
        .addComponent(
          createButton({
            content: {
              text: 'View Details',
              link: { href: '#' },
            },
          })
        )
        .build();

      const result = manager.validatePolicy(goodTemplate, 'email-best-practices');
      expect(result.valid).toBe(true);
    });
  });

  describe('accessibilityPolicyA', () => {
    it('should validate accessibility requirements', () => {
      const manager = createDefaultConstraintsManager();

      const template = createEmptyEmailTemplate('Test');
      const image = createImage({
        content: {
          src: 'test.jpg',
          alt: '', // Missing alt text
        },
      });
      template.components = [image];

      const result = manager.validatePolicy(template, 'accessibility-a');

      // Should have warnings but still be valid (warnings don't fail validation)
      expect(result.valid).toBe(true);
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations.some((v) => v.constraintId === 'image-alt-text')).toBe(true);
    });
  });

  describe('performancePolicy', () => {
    it('should validate performance constraints', () => {
      const manager = createDefaultConstraintsManager();

      const template = createEmptyEmailTemplate('Test');
      const button = createButton({
        text: 'Click',
        link: { href: '#' },
      });

      // Add too many components
      template.components = Array(101).fill(button);

      const result = manager.validatePolicy(template, 'performance');

      expect(result.valid).toBe(false);
      expect(result.violations.some((v) => v.constraintId === 'max-components')).toBe(true);
    });
  });

  describe('strictPolicy', () => {
    it('should apply all constraints', () => {
      const manager = createDefaultConstraintsManager();

      const template = new TemplateComposer({
        target: 'email',
        name: 'Test',
        width: 800, // Too wide
      })
        .addComponent(
          createImage({
            content: {
              src: 'test.jpg',
              alt: '', // Missing alt
            },
          })
        )
        .build();

      const result = manager.validatePolicy(template, 'strict');

      expect(result.violations.length).toBeGreaterThan(0);
      // Should have both email-width and image-alt-text violations
      expect(result.violations.some((v) => v.constraintId === 'email-width')).toBe(true);
      expect(result.violations.some((v) => v.constraintId === 'image-alt-text')).toBe(true);
    });
  });
});
