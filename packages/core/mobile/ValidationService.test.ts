/**
 * ValidationService Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ValidationService, ValidationEvent, DEFAULT_VALIDATION_RULES } from './ValidationService';
import { EventEmitter } from '../services/EventEmitter';
import { ModeManager } from './ModeManager';
import { DeviceMode } from './mobile.types';
import type { Template, ValidationRule } from '../../types';

describe('ValidationService', () => {
  let eventEmitter: EventEmitter;
  let validationService: ValidationService;
  let modeManager: ModeManager;
  let mockTemplate: Template;

  beforeEach(() => {
    eventEmitter = new EventEmitter();

    modeManager = {
      getCurrentMode: vi.fn().mockReturnValue(DeviceMode.MOBILE),
    } as any;

    mockTemplate = {
      id: 'template-1',
      name: 'Test Template',
      components: [
        {
          id: 'button-1',
          type: 'button',
          styles: {
            minHeight: '30px', // Below 44px minimum
            fontSize: '12px',   // Below 14px minimum
          },
        },
        {
          id: 'text-1',
          type: 'text',
          styles: {
            fontSize: '16px',
          },
        },
      ],
    } as Template;

    validationService = new ValidationService({
      eventEmitter,
      modeManager,
      config: {
        validation: {
          enabled: true,
          rules: DEFAULT_VALIDATION_RULES,
          showInlineWarnings: true,
          showValidationPanel: false,
        },
      } as any,
    });
  });

  describe('validate', () => {
    it('should validate template and find issues', () => {
      const result = validationService.validate(mockTemplate);

      expect(result.totalIssues).toBeGreaterThan(0);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    it('should categorize issues by severity', () => {
      const result = validationService.validate(mockTemplate);

      expect(result.issuesBySeverity).toHaveProperty('info');
      expect(result.issuesBySeverity).toHaveProperty('warning');
      expect(result.issuesBySeverity).toHaveProperty('critical');
    });

    it('should emit validation start event', () => {
      const listener = jest.fn();
      eventEmitter.on(ValidationEvent.VALIDATION_START, listener);

      validationService.validate(mockTemplate);

      expect(listener).toHaveBeenCalled();
    });

    it('should emit validation complete event', () => {
      const listener = jest.fn();
      eventEmitter.on(ValidationEvent.VALIDATION_COMPLETE, listener);

      validationService.validate(mockTemplate);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          result: expect.any(Object),
        })
      );
    });

    it('should emit issue found events', () => {
      const listener = jest.fn();
      eventEmitter.on(ValidationEvent.ISSUE_FOUND, listener);

      validationService.validate(mockTemplate);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('min-touch-target-size rule', () => {
    it('should warn about small touch targets', () => {
      const result = validationService.validate(mockTemplate);

      const touchTargetIssues = result.issues.filter(
        (issue) => issue.ruleId === 'min-touch-target-size'
      );

      expect(touchTargetIssues.length).toBeGreaterThan(0);
      expect(touchTargetIssues[0]).toMatchObject({
        severity: 'warning',
        componentId: 'button-1',
        fixable: true,
      });
    });
  });

  describe('min-font-size rule', () => {
    it('should warn about small font sizes', () => {
      const result = validationService.validate(mockTemplate);

      const fontSizeIssues = result.issues.filter(
        (issue) => issue.ruleId === 'min-font-size'
      );

      expect(fontSizeIssues.length).toBeGreaterThan(0);
      expect(fontSizeIssues[0]).toMatchObject({
        severity: 'warning',
        componentId: 'button-1',
        fixable: true,
      });
    });
  });

  describe('all-components-hidden rule', () => {
    it('should detect when all components are hidden', () => {
      const templateWithAllHidden: Template = {
        id: 'template-2',
        name: 'All Hidden',
        components: [
          {
            id: 'comp-1',
            type: 'text',
            styles: {},
            visibility: {
              desktop: true,
              mobile: false,
            },
          },
          {
            id: 'comp-2',
            type: 'text',
            styles: {},
            visibility: {
              desktop: true,
              mobile: false,
            },
          },
        ],
      } as Template;

      const result = validationService.validate(templateWithAllHidden);

      const hiddenIssues = result.issues.filter(
        (issue) => issue.ruleId === 'all-components-hidden'
      );

      expect(hiddenIssues.length).toBe(1);
      expect(hiddenIssues[0]).toMatchObject({
        severity: 'critical',
        fixable: false,
      });

      expect(result.isValid).toBe(false);
    });
  });

  describe('excessive-width rule', () => {
    it('should warn about excessive width', () => {
      const templateWithWideComponent: Template = {
        id: 'template-3',
        name: 'Wide Component',
        components: [
          {
            id: 'comp-1',
            type: 'text',
            styles: {
              width: '600px', // Exceeds mobile viewport
            },
          },
        ],
      } as Template;

      const result = validationService.validate(templateWithWideComponent);

      const widthIssues = result.issues.filter(
        (issue) => issue.ruleId === 'excessive-width'
      );

      expect(widthIssues.length).toBe(1);
      expect(widthIssues[0]).toMatchObject({
        severity: 'warning',
        fixable: true,
      });
    });
  });

  describe('overflow-hidden-content rule', () => {
    it('should warn about overflow hidden', () => {
      const templateWithOverflow: Template = {
        id: 'template-4',
        name: 'Overflow Hidden',
        components: [
          {
            id: 'comp-1',
            type: 'text',
            styles: {
              overflow: 'hidden',
            },
          },
        ],
      } as Template;

      const result = validationService.validate(templateWithOverflow);

      const overflowIssues = result.issues.filter(
        (issue) => issue.ruleId === 'overflow-hidden-content'
      );

      expect(overflowIssues.length).toBe(1);
      expect(overflowIssues[0]).toMatchObject({
        severity: 'info',
        fixable: false,
      });
    });
  });

  describe('fixed-positioning rule', () => {
    it('should warn about fixed positioning', () => {
      const templateWithFixed: Template = {
        id: 'template-5',
        name: 'Fixed Position',
        components: [
          {
            id: 'comp-1',
            type: 'text',
            styles: {
              position: 'fixed',
            },
          },
        ],
      } as Template;

      const result = validationService.validate(templateWithFixed);

      const positionIssues = result.issues.filter(
        (issue) => issue.ruleId === 'fixed-positioning'
      );

      expect(positionIssues.length).toBe(1);
      expect(positionIssues[0]).toMatchObject({
        severity: 'warning',
        fixable: false,
      });
    });
  });

  describe('validateComponent', () => {
    it('should validate a single component', () => {
      const component = mockTemplate.components[0];
      const issues = validationService.validateComponent(component, mockTemplate);

      expect(issues.length).toBeGreaterThan(0);
    });
  });

  describe('getComponentIssues', () => {
    it('should filter issues for specific component', () => {
      const result = validationService.validate(mockTemplate);

      const button1Issues = validationService.getComponentIssues('button-1', result.issues);

      expect(button1Issues.length).toBeGreaterThan(0);
      expect(button1Issues.every((issue) => issue.componentId === 'button-1')).toBe(true);
    });
  });

  describe('registerRule', () => {
    it('should register custom validation rule', () => {
      const customRule: ValidationRule = {
        id: 'custom-rule',
        name: 'Custom Rule',
        description: 'A custom validation rule',
        severity: 'warning',
        validate: () => [],
      };

      validationService.registerRule(customRule);

      const rule = validationService.getRule('custom-rule');
      expect(rule).toBe(customRule);
    });
  });

  describe('unregisterRule', () => {
    it('should unregister validation rule', () => {
      validationService.unregisterRule('min-touch-target-size');

      const rule = validationService.getRule('min-touch-target-size');
      expect(rule).toBeUndefined();
    });
  });

  describe('getRules', () => {
    it('should return all registered rules', () => {
      const rules = validationService.getRules();

      expect(rules.length).toBe(DEFAULT_VALIDATION_RULES.length);
    });
  });

  describe('isEnabled', () => {
    it('should return true if validation is enabled', () => {
      expect(validationService.isEnabled()).toBe(true);
    });
  });

  describe('validation result structure', () => {
    it('should include fixable issues count', () => {
      const result = validationService.validate(mockTemplate);

      expect(result.fixableIssues).toBeGreaterThanOrEqual(0);
    });

    it('should include components with issues', () => {
      const result = validationService.validate(mockTemplate);

      expect(result.componentsWithIssues).toBeInstanceOf(Array);
      expect(result.componentsWithIssues.length).toBeGreaterThan(0);
    });

    it('should mark as invalid if critical issues exist', () => {
      const templateWithCriticalIssue: Template = {
        id: 'template-critical',
        name: 'Critical Issues',
        components: [
          {
            id: 'comp-1',
            type: 'text',
            styles: {},
            visibility: {
              desktop: true,
              mobile: false,
            },
          },
        ],
      } as Template;

      const result = validationService.validate(templateWithCriticalIssue);

      if (result.issuesBySeverity.critical.length > 0) {
        expect(result.isValid).toBe(false);
      }
    });
  });
});
