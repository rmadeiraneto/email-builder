/**
 * Command implementation tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AddComponentCommand,
  RemoveComponentCommand,
  UpdateComponentContentCommand,
  UpdateComponentStyleCommand,
} from './index';
import type { ComponentData } from './AddComponentCommand';

describe('Command Implementations', () => {
  let state: Map<string, ComponentData>;
  let setState: ReturnType<typeof vi.fn>;
  let getState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    state = new Map();
    setState = vi.fn((newState: Map<string, ComponentData>) => {
      state = newState;
    });
    getState = vi.fn(() => state);
  });

  describe('AddComponentCommand', () => {
    it('should add component to state', async () => {
      const command = new AddComponentCommand(
        {
          componentType: 'button',
          props: { label: 'Click me' },
        },
        getState,
        setState
      );

      await command.execute();

      expect(setState).toHaveBeenCalled();
      expect(state.size).toBe(1);

      const component = Array.from(state.values())[0];
      expect(component?.type).toBe('button');
      expect(component?.props.label).toBe('Click me');
    });

    it('should add component to parent', async () => {
      const parentId = 'parent-1';
      state.set(parentId, {
        id: parentId,
        type: 'container',
        props: {},
        children: [],
      });

      const command = new AddComponentCommand(
        {
          componentType: 'button',
          parentId,
        },
        getState,
        setState
      );

      await command.execute();

      const parent = state.get(parentId);
      expect(parent?.children).toHaveLength(1);
    });

    it('should add component at specific position', async () => {
      const parentId = 'parent-1';
      state.set(parentId, {
        id: parentId,
        type: 'container',
        props: {},
        children: ['child-1', 'child-2'],
      });

      const command = new AddComponentCommand(
        {
          componentType: 'button',
          parentId,
          position: 1,
        },
        getState,
        setState
      );

      await command.execute();

      const parent = state.get(parentId);
      expect(parent?.children).toHaveLength(3);
      expect(parent?.children[1]).toMatch(/^component-/);
    });

    it('should undo component addition', async () => {
      const command = new AddComponentCommand(
        { componentType: 'button' },
        getState,
        setState
      );

      await command.execute();
      const sizeAfterExecute = state.size;

      await command.undo();

      expect(state.size).toBe(0);
      expect(state.size).toBeLessThan(sizeAfterExecute);
    });

    it('should check if can undo', async () => {
      const command = new AddComponentCommand(
        { componentType: 'button' },
        getState,
        setState
      );

      expect(command.canUndo()).toBe(false);

      await command.execute();
      expect(command.canUndo()).toBe(true);
    });
  });

  describe('RemoveComponentCommand', () => {
    it('should remove component from state', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {},
        children: [],
      });

      const command = new RemoveComponentCommand(
        { componentId },
        getState,
        setState
      );

      await command.execute();

      expect(state.has(componentId)).toBe(false);
    });

    it('should remove component from parent children', async () => {
      const parentId = 'parent-1';
      const childId = 'child-1';

      state.set(parentId, {
        id: parentId,
        type: 'container',
        props: {},
        children: [childId],
      });

      state.set(childId, {
        id: childId,
        type: 'button',
        props: {},
        children: [],
      });

      const command = new RemoveComponentCommand({ componentId: childId }, getState, setState);

      await command.execute();

      const parent = state.get(parentId);
      expect(parent?.children).toHaveLength(0);
    });

    it('should throw error if component not found', async () => {
      const command = new RemoveComponentCommand(
        { componentId: 'nonexistent' },
        getState,
        setState
      );

      await expect(command.execute()).rejects.toThrow('Component nonexistent not found');
    });

    it('should undo component removal', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {},
        children: [],
      });

      const command = new RemoveComponentCommand({ componentId }, getState, setState);

      await command.execute();
      expect(state.has(componentId)).toBe(false);

      await command.undo();
      expect(state.has(componentId)).toBe(true);
    });
  });

  describe('UpdateComponentContentCommand', () => {
    it('should update component props', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: { label: 'Old Label' },
        children: [],
      });

      const command = new UpdateComponentContentCommand(
        {
          componentId,
          props: { label: 'New Label' },
        },
        getState,
        setState
      );

      await command.execute();

      const component = state.get(componentId);
      expect(component?.props.label).toBe('New Label');
    });

    it('should merge props with existing props', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: { label: 'Button', disabled: false },
        children: [],
      });

      const command = new UpdateComponentContentCommand(
        {
          componentId,
          props: { disabled: true },
        },
        getState,
        setState
      );

      await command.execute();

      const component = state.get(componentId);
      expect(component?.props.label).toBe('Button');
      expect(component?.props.disabled).toBe(true);
    });

    it('should throw error if component not found', async () => {
      const command = new UpdateComponentContentCommand(
        {
          componentId: 'nonexistent',
          props: { label: 'Test' },
        },
        getState,
        setState
      );

      await expect(command.execute()).rejects.toThrow('Component nonexistent not found');
    });

    it('should undo prop updates', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: { label: 'Original' },
        children: [],
      });

      const command = new UpdateComponentContentCommand(
        {
          componentId,
          props: { label: 'Updated' },
        },
        getState,
        setState
      );

      await command.execute();
      await command.undo();

      const component = state.get(componentId);
      expect(component?.props.label).toBe('Original');
    });
  });

  describe('UpdateComponentStyleCommand', () => {
    it('should update component styles', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {},
        children: [],
      });

      const command = new UpdateComponentStyleCommand(
        {
          componentId,
          styles: { backgroundColor: 'blue', color: 'white' },
        },
        getState,
        setState
      );

      await command.execute();

      const component = state.get(componentId);
      expect(component?.props.styles).toEqual({
        backgroundColor: 'blue',
        color: 'white',
      });
    });

    it('should merge styles with existing styles', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {
          styles: { fontSize: '16px' },
        },
        children: [],
      });

      const command = new UpdateComponentStyleCommand(
        {
          componentId,
          styles: { color: 'red' },
        },
        getState,
        setState
      );

      await command.execute();

      const component = state.get(componentId);
      expect(component?.props.styles).toEqual({
        fontSize: '16px',
        color: 'red',
      });
    });

    it('should throw error if component not found', async () => {
      const command = new UpdateComponentStyleCommand(
        {
          componentId: 'nonexistent',
          styles: { color: 'red' },
        },
        getState,
        setState
      );

      await expect(command.execute()).rejects.toThrow('Component nonexistent not found');
    });

    it('should undo style updates', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {
          styles: { backgroundColor: 'blue' },
        },
        children: [],
      });

      const command = new UpdateComponentStyleCommand(
        {
          componentId,
          styles: { backgroundColor: 'red' },
        },
        getState,
        setState
      );

      await command.execute();
      await command.undo();

      const component = state.get(componentId);
      expect(component?.props.styles).toEqual({ backgroundColor: 'blue' });
    });

    it('should handle empty initial styles', async () => {
      const componentId = 'component-1';
      state.set(componentId, {
        id: componentId,
        type: 'button',
        props: {},
        children: [],
      });

      const command = new UpdateComponentStyleCommand(
        {
          componentId,
          styles: { color: 'blue' },
        },
        getState,
        setState
      );

      await command.execute();

      const component = state.get(componentId);
      expect(component?.props.styles).toEqual({ color: 'blue' });
    });
  });
});
