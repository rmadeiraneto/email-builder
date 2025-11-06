import { describe, it, expect, beforeEach } from 'vitest';
import { TestMode } from '../config/TestModeManager';
import { getTestId, getTestAction, getTestState, getTestAttributes } from './testAttributes';

describe('testAttributes', () => {
  beforeEach(() => {
    TestMode.disable();
  });

  describe('getTestId', () => {
    it('should return empty object when test mode is disabled', () => {
      expect(getTestId('button-save')).toEqual({});
    });

    it('should return data-testid when test mode is enabled', () => {
      TestMode.enable();
      expect(getTestId('button-save')).toEqual({ 'data-testid': 'button-save' });
    });

    it('should return empty object for empty string', () => {
      TestMode.enable();
      expect(getTestId('')).toEqual({});
    });
  });

  describe('getTestAction', () => {
    it('should return empty object when test mode is disabled', () => {
      expect(getTestAction('save-template')).toEqual({});
    });

    it('should return data-action when test mode is enabled', () => {
      TestMode.enable();
      expect(getTestAction('save-template')).toEqual({ 'data-action': 'save-template' });
    });
  });

  describe('getTestState', () => {
    it('should return empty object when test mode is disabled', () => {
      expect(getTestState({ loading: true })).toEqual({});
    });

    it('should convert state to data-state-* attributes', () => {
      TestMode.enable();
      const result = getTestState({ loading: true, modified: false, count: 5 });

      expect(result).toEqual({
        'data-state-loading': 'true',
        'data-state-modified': 'false',
        'data-state-count': '5'
      });
    });
  });

  describe('getTestAttributes', () => {
    it('should return empty object when test mode is disabled', () => {
      const result = getTestAttributes({
        testId: 'button-save',
        action: 'save-template',
        state: { loading: true }
      });

      expect(result).toEqual({});
    });

    it('should combine all attributes when test mode is enabled', () => {
      TestMode.enable();
      const result = getTestAttributes({
        testId: 'button-save',
        action: 'save-template',
        state: { loading: true, modified: false }
      });

      expect(result).toEqual({
        'data-testid': 'button-save',
        'data-action': 'save-template',
        'data-state-loading': 'true',
        'data-state-modified': 'false'
      });
    });
  });
});
