/**
 * @fileoverview Disallow synchronous event emission in event handlers
 * @author Email Builder Team
 *
 * This rule prevents synchronous event bus emissions from within DOM event handlers,
 * reactive effects, or signal updates, which can cause infinite recursion in
 * reactive frameworks like Solid.js.
 */

'use strict';

const REACT_EVENT_HANDLER_REGEX = /^on[A-Z]/; // onClick, onFocus, etc.
const SOLID_EVENT_HANDLER_REGEX = /^on[A-Z]/; // Same for Solid.js

const EVENT_EMITTER_METHODS = [
  'emit',
  'dispatch',
  'trigger',
  'fire',
  'publish',
  'notify',
];

const REACTIVE_FUNCTION_NAMES = [
  'createEffect',
  'useEffect',
  'watchEffect',
  'computed',
  'watch',
];

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow synchronous event emission in event handlers and reactive contexts',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/email-builder/docs/architecture/async-event-bus-pattern.md',
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          eventEmitterMethods: {
            type: 'array',
            items: { type: 'string' },
            default: EVENT_EMITTER_METHODS,
          },
          allowAsyncWrappers: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noSyncEmitInHandler:
        'Avoid synchronous event emission in event handlers. Wrap in queueMicrotask(), setTimeout(), or Promise.resolve().then() to prevent infinite recursion.',
      noSyncEmitInEffect:
        'Avoid synchronous event emission in reactive effects. This can cause infinite loops. Wrap in queueMicrotask() or use proper reactive dependencies.',
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const emitterMethods = options.eventEmitterMethods || EVENT_EMITTER_METHODS;
    const allowAsyncWrappers = options.allowAsyncWrappers !== false;

    // Track whether we're inside an event handler or reactive effect
    let insideEventHandler = false;
    let insideReactiveEffect = false;
    let insideAsyncWrapper = false;

    /**
     * Check if a node is an event emitter method call
     */
    function isEventEmitterCall(node) {
      if (node.type !== 'CallExpression') return false;

      const callee = node.callee;

      // Check for method calls like eventBus.emit()
      if (callee.type === 'MemberExpression') {
        const methodName = callee.property.name;
        return emitterMethods.includes(methodName);
      }

      return false;
    }

    /**
     * Check if we're inside an async wrapper
     */
    function isAsyncWrapper(node) {
      if (node.type !== 'CallExpression') return false;

      const callee = node.callee;

      // Check for queueMicrotask()
      if (callee.type === 'Identifier' && callee.name === 'queueMicrotask') {
        return true;
      }

      // Check for setTimeout()
      if (callee.type === 'Identifier' && callee.name === 'setTimeout') {
        return true;
      }

      // Check for Promise.resolve().then()
      if (callee.type === 'MemberExpression') {
        const object = callee.object;
        const property = callee.property;

        // Promise.resolve().then()
        if (
          object.type === 'CallExpression' &&
          object.callee.type === 'MemberExpression' &&
          object.callee.object.name === 'Promise' &&
          object.callee.property.name === 'resolve' &&
          property.name === 'then'
        ) {
          return true;
        }
      }

      return false;
    }

    /**
     * Check if a property is an event handler
     */
    function isEventHandlerProp(node) {
      if (node.type !== 'JSXAttribute') return false;

      const name = node.name.name;
      return (
        REACT_EVENT_HANDLER_REGEX.test(name) ||
        SOLID_EVENT_HANDLER_REGEX.test(name)
      );
    }

    /**
     * Check if we're inside a reactive effect
     */
    function isReactiveEffectCall(node) {
      if (node.type !== 'CallExpression') return false;

      const callee = node.callee;

      if (callee.type === 'Identifier') {
        return REACTIVE_FUNCTION_NAMES.includes(callee.name);
      }

      return false;
    }

    return {
      // Track when entering/exiting event handler functions
      JSXAttribute(node) {
        if (isEventHandlerProp(node) && node.value) {
          // Mark that we're entering an event handler
          insideEventHandler = true;
        }
      },

      'JSXAttribute:exit'(node) {
        if (isEventHandlerProp(node)) {
          insideEventHandler = false;
        }
      },

      // Track when entering/exiting arrow functions in event handlers
      ArrowFunctionExpression(node) {
        const parent = node.parent;

        // Check if this arrow function is directly in a JSX attribute
        if (parent.type === 'JSXExpressionContainer') {
          const grandparent = parent.parent;
          if (isEventHandlerProp(grandparent)) {
            insideEventHandler = true;
          }
        }

        // Check if this is inside createEffect or similar
        if (parent.type === 'CallExpression' && isReactiveEffectCall(parent)) {
          insideReactiveEffect = true;
        }
      },

      'ArrowFunctionExpression:exit'(node) {
        const parent = node.parent;

        if (parent.type === 'JSXExpressionContainer') {
          const grandparent = parent.parent;
          if (isEventHandlerProp(grandparent)) {
            insideEventHandler = false;
          }
        }

        if (parent.type === 'CallExpression' && isReactiveEffectCall(parent)) {
          insideReactiveEffect = false;
        }
      },

      // Track when entering/exiting function expressions
      FunctionExpression(node) {
        const parent = node.parent;

        if (parent.type === 'JSXExpressionContainer') {
          const grandparent = parent.parent;
          if (isEventHandlerProp(grandparent)) {
            insideEventHandler = true;
          }
        }

        if (parent.type === 'CallExpression' && isReactiveEffectCall(parent)) {
          insideReactiveEffect = true;
        }
      },

      'FunctionExpression:exit'(node) {
        const parent = node.parent;

        if (parent.type === 'JSXExpressionContainer') {
          const grandparent = parent.parent;
          if (isEventHandlerProp(grandparent)) {
            insideEventHandler = false;
          }
        }

        if (parent.type === 'CallExpression' && isReactiveEffectCall(parent)) {
          insideReactiveEffect = false;
        }
      },

      // Track async wrappers
      CallExpression(node) {
        if (isAsyncWrapper(node)) {
          insideAsyncWrapper = true;
        }

        // Check for event emitter calls
        if (isEventEmitterCall(node)) {
          // Report error if inside event handler and not wrapped
          if (insideEventHandler && !insideAsyncWrapper) {
            context.report({
              node,
              messageId: 'noSyncEmitInHandler',
            });
          }

          // Report error if inside reactive effect and not wrapped
          if (insideReactiveEffect && !insideAsyncWrapper) {
            context.report({
              node,
              messageId: 'noSyncEmitInEffect',
            });
          }
        }
      },

      'CallExpression:exit'(node) {
        if (isAsyncWrapper(node)) {
          insideAsyncWrapper = false;
        }
      },
    };
  },
};
