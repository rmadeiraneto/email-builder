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

  describe('buildTree', () => {
    it('should build tree from flat component list', () => {
      const components: BaseComponent[] = [
        {
          id: 'root',
          type: 'container',
          children: [],
        },
      ];

      const tree = builder.buildTree(components);

      expect(tree).toBeDefined();
      expect(Array.isArray(tree)).toBe(true);
      expect(tree.length).toBe(1);
      expect(tree[0].component.id).toBe('root');
    });

    it('should handle nested components', () => {
      const components: BaseComponent[] = [
        {
          id: 'parent',
          type: 'container',
          children: [
            {
              id: 'child',
              type: 'text',
              content: { text: 'Hello' },
              children: [],
            },
          ],
        },
      ];

      const tree = builder.buildTree(components);

      expect(tree.length).toBe(1);
      expect(tree[0].children.length).toBe(1);
      expect(tree[0].children[0].component.id).toBe('child');
    });

    it('should handle multiple root components', () => {
      const components: BaseComponent[] = [
        {
          id: 'root1',
          type: 'container',
          children: [],
        },
        {
          id: 'root2',
          type: 'container',
          children: [],
        },
      ];

      const tree = builder.buildTree(components);

      expect(tree.length).toBe(2);
      expect(tree[0].component.id).toBe('root1');
      expect(tree[1].component.id).toBe('root2');
    });

    it('should handle deeply nested components', () => {
      const components: BaseComponent[] = [
        {
          id: 'level1',
          type: 'container',
          children: [
            {
              id: 'level2',
              type: 'container',
              children: [
                {
                  id: 'level3',
                  type: 'text',
                  content: { text: 'Deep' },
                  children: [],
                },
              ],
            },
          ],
        },
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
        {
          id: 'comp-1',
          type: 'button',
          content: { text: 'Click me' },
          styles: { color: 'blue' },
          children: [],
        },
      ];

      const tree = builder.buildTree(components);

      expect(tree[0].component.content).toEqual({ text: 'Click me' });
      expect(tree[0].component.styles).toEqual({ color: 'blue' });
    });

    it('should set depth property correctly', () => {
      const components: BaseComponent[] = [
        {
          id: 'parent',
          type: 'container',
          children: [
            {
              id: 'child',
              type: 'container',
              children: [
                {
                  id: 'grandchild',
                  type: 'text',
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      const tree = builder.buildTree(components);

      expect(tree[0].depth).toBe(0);
      expect(tree[0].children[0].depth).toBe(1);
      expect(tree[0].children[0].children[0].depth).toBe(2);
    });
  });
});
