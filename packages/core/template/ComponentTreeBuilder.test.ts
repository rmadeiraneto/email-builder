/**
 * Component Tree Builder Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentTreeBuilder } from './ComponentTreeBuilder';
import type { BaseComponent } from '../types/component.types';

describe('ComponentTreeBuilder', () => {
  let builder: ComponentTreeBuilder;

  beforeEach(() => {
    builder = new ComponentTreeBuilder();
  });

  const createComponent = (overrides: Partial<BaseComponent> = {}): BaseComponent => ({
    id: 'comp1',
    type: 'text',
    content: {},
    styles: {},
    metadata: {
      name: 'Test Component',
      category: 'text',
      locked: false,
    },
    createdAt: Date.now(),
    children: [],
    ...overrides,
  });

  describe('buildTree', () => {
    it('should build tree from flat component list', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'root',
          type: 'container',
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree).toBeDefined();
      expect(Array.isArray(tree)).toBe(true);
      expect(tree.length).toBe(1);
      expect(tree[0].component.id).toBe('root');
    });

    it('should handle nested components', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'parent',
          type: 'container',
        }),
        createComponent({
          id: 'child',
          parentId: 'parent',
          content: { text: 'Hello' },
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree.length).toBe(1);
      expect(tree[0].children.length).toBe(1);
      expect(tree[0].children[0].component.id).toBe('child');
    });

    it('should handle multiple root components', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'root1',
          type: 'container',
        }),
        createComponent({
          id: 'root2',
          type: 'container',
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree.length).toBe(2);
      expect(tree[0].component.id).toBe('root1');
      expect(tree[1].component.id).toBe('root2');
    });

    it('should handle deeply nested components', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'level1',
          type: 'container',
        }),
        createComponent({
          id: 'level2',
          type: 'container',
          parentId: 'level1',
        }),
        createComponent({
          id: 'level3',
          parentId: 'level2',
          content: { text: 'Deep' },
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree[0].children[0].children[0].component.id).toBe('level3');
    });

    it('should handle empty component list', () => {
      const tree = builder.buildTree([]);

      expect(tree).toEqual([]);
    });

    it('should preserve component properties', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'comp-1',
          type: 'button',
          content: { text: 'Click me' },
          styles: { color: 'blue' },
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree[0].component.content).toEqual({ text: 'Click me' });
      expect(tree[0].component.styles).toEqual({ color: 'blue' });
    });

    it('should set depth property correctly', () => {
      const components: BaseComponent[] = [
        createComponent({
          id: 'parent',
          type: 'container',
        }),
        createComponent({
          id: 'child',
          type: 'container',
          parentId: 'parent',
        }),
        createComponent({
          id: 'grandchild',
          parentId: 'child',
        }),
      ];

      const tree = builder.buildTree(components);

      expect(tree[0].depth).toBe(0);
      expect(tree[0].children[0].depth).toBe(1);
      expect(tree[0].children[0].children[0].depth).toBe(2);
    });
  });
});
