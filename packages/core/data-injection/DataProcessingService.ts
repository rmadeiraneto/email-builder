/**
 * Data Processing Service
 *
 * Processes templates with data, handling variable substitution,
 * conditionals, loops, and helper functions.
 */

import { TemplateVariableParser } from './TemplateVariableParser';
import { builtInHelpers } from './helpers';
import {
  TemplateProcessingOptions,
  TemplateProcessingResult,
  RenderContext,
  VariableToken,
  VariableType,
  HelperFunction,
} from './data-injection.types';

/**
 * Service for processing templates with data
 */
export class DataProcessingService {
  private parser: TemplateVariableParser;
  private helpers: Record<string, HelperFunction>;

  constructor() {
    this.parser = new TemplateVariableParser();
    this.helpers = { ...builtInHelpers };
  }

  /**
   * Register a custom helper function
   */
  public registerHelper(name: string, fn: HelperFunction): void {
    this.helpers[name] = fn;
  }

  /**
   * Register multiple helper functions
   */
  public registerHelpers(helpers: Record<string, HelperFunction>): void {
    this.helpers = { ...this.helpers, ...helpers };
  }

  /**
   * Process a template with data
   */
  public process(
    template: string,
    data: Record<string, unknown>,
    options?: TemplateProcessingOptions
  ): TemplateProcessingResult {
    const usedVariables = new Set<string>();
    const missingVariables = new Set<string>();
    const errors: Array<{ message: string; variable?: string }> = [];
    const warnings: string[] = [];

    let variablesReplaced = 0;
    let conditionalsEvaluated = 0;
    let loopsUnrolled = 0;
    let helpersInvoked = 0;

    // Merge custom helpers from options
    const allHelpers = options?.helpers
      ? { ...this.helpers, ...options.helpers }
      : this.helpers;

    // Parse the template
    const tokens = this.parser.parse(template, options);

    // Create initial render context
    const context: RenderContext = {
      data: { ...data },
    };

    try {
      const output = this.processTokens(
        template,
        tokens,
        context,
        allHelpers,
        options || {},
        {
          usedVariables,
          missingVariables,
          errors,
          warnings,
          stats: {
            variablesReplaced,
            conditionalsEvaluated,
            loopsUnrolled,
            helpersInvoked,
          },
        }
      );

      return {
        output: options?.trim ? output.trim() : output,
        usedVariables: Array.from(usedVariables),
        missingVariables: Array.from(missingVariables),
        errors,
        warnings,
        stats: {
          variablesReplaced,
          conditionalsEvaluated,
          loopsUnrolled,
          helpersInvoked,
        },
      };
    } catch (error) {
      errors.push({
        message: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      return {
        output: template,
        usedVariables: Array.from(usedVariables),
        missingVariables: Array.from(missingVariables),
        errors,
        warnings,
        stats: {
          variablesReplaced,
          conditionalsEvaluated,
          loopsUnrolled,
          helpersInvoked,
        },
      };
    }
  }

  /**
   * Process template tokens and return rendered output
   */
  private processTokens(
    template: string,
    tokens: VariableToken[],
    context: RenderContext,
    helpers: Record<string, HelperFunction>,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
      errors: Array<{ message: string; variable?: string }>;
      warnings: string[];
      stats: {
        variablesReplaced: number;
        conditionalsEvaluated: number;
        loopsUnrolled: number;
        helpersInvoked: number;
      };
    }
  ): string {
    let output = template;
    let offset = 0;

    for (const token of tokens) {
      const actualStart = token.start + offset;
      const actualEnd = token.end + offset;

      let replacement = '';

      try {
        switch (token.type) {
          case VariableType.FIELD:
            replacement = this.processField(token, context, options, tracking);
            tracking.stats.variablesReplaced++;
            break;

          case VariableType.CONDITIONAL:
            replacement = this.processConditional(token, context, helpers, options, tracking);
            tracking.stats.conditionalsEvaluated++;
            break;

          case VariableType.UNLESS:
            replacement = this.processUnless(token, context, helpers, options, tracking);
            tracking.stats.conditionalsEvaluated++;
            break;

          case VariableType.LOOP:
            replacement = this.processLoop(token, context, helpers, options, tracking);
            tracking.stats.loopsUnrolled++;
            break;

          case VariableType.HELPER:
            replacement = this.processHelper(token, context, helpers, options, tracking);
            tracking.stats.helpersInvoked++;
            break;
        }

        // Replace in output
        output = output.substring(0, actualStart) + replacement + output.substring(actualEnd);
        offset += replacement.length - (token.end - token.start);
      } catch (error) {
        tracking.errors.push({
          message: `Error processing ${token.type}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variable: token.path,
        });

        if (options.strict) {
          throw error;
        }
      }
    }

    return output;
  }

  /**
   * Process a field variable
   */
  private processField(
    token: VariableToken,
    context: RenderContext,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
    }
  ): string {
    const value = this.resolveValue(token.path, context);

    tracking.usedVariables.add(token.path);

    if (value === undefined || value === null) {
      tracking.missingVariables.add(token.path);

      if (options.strict) {
        throw new Error(`Missing variable: ${token.path}`);
      }

      return options.defaultValue || '';
    }

    const stringValue = String(value);

    if (options.escapeHtml) {
      return this.escapeHtml(stringValue);
    }

    return stringValue;
  }

  /**
   * Process a conditional block
   */
  private processConditional(
    token: VariableToken,
    context: RenderContext,
    helpers: Record<string, HelperFunction>,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
      errors: Array<{ message: string; variable?: string }>;
      warnings: string[];
      stats: {
        variablesReplaced: number;
        conditionalsEvaluated: number;
        loopsUnrolled: number;
        helpersInvoked: number;
      };
    }
  ): string {
    const condition = this.resolveValue(token.path, context);
    tracking.usedVariables.add(token.path);

    const isTrue = this.isTruthy(condition);

    const content = isTrue ? token.content : token.elseContent;

    if (!content) {
      return '';
    }

    // Process nested tokens in the content
    const nestedTokens = this.parser.parse(content, options);
    return this.processTokens(content, nestedTokens, context, helpers, options, tracking);
  }

  /**
   * Process an unless block (inverse conditional)
   */
  private processUnless(
    token: VariableToken,
    context: RenderContext,
    helpers: Record<string, HelperFunction>,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
      errors: Array<{ message: string; variable?: string }>;
      warnings: string[];
      stats: {
        variablesReplaced: number;
        conditionalsEvaluated: number;
        loopsUnrolled: number;
        helpersInvoked: number;
      };
    }
  ): string {
    const condition = this.resolveValue(token.path, context);
    tracking.usedVariables.add(token.path);

    const isFalse = !this.isTruthy(condition);

    const content = isFalse ? token.content : token.elseContent;

    if (!content) {
      return '';
    }

    // Process nested tokens in the content
    const nestedTokens = this.parser.parse(content, options);
    return this.processTokens(content, nestedTokens, context, helpers, options, tracking);
  }

  /**
   * Process a loop block
   */
  private processLoop(
    token: VariableToken,
    context: RenderContext,
    helpers: Record<string, HelperFunction>,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
      errors: Array<{ message: string; variable?: string }>;
      warnings: string[];
      stats: {
        variablesReplaced: number;
        conditionalsEvaluated: number;
        loopsUnrolled: number;
        helpersInvoked: number;
      };
    }
  ): string {
    const items = this.resolveValue(token.path, context);
    tracking.usedVariables.add(token.path);

    if (!Array.isArray(items)) {
      if (options.strict) {
        throw new Error(`Loop variable must be an array: ${token.path}`);
      }
      tracking.warnings.push(`Expected array for loop, got ${typeof items}: ${token.path}`);
      return '';
    }

    if (!token.content) {
      return '';
    }

    const results: string[] = [];

    items.forEach((item, index) => {
      // Create child context
      const childContext: RenderContext = {
        data: typeof item === 'object' && item !== null ? { ...item } : { this: item },
        parent: context,
        index,
        first: index === 0,
        last: index === items.length - 1,
      };

      // Process nested tokens with child context
      const nestedTokens = this.parser.parse(token.content!, options);
      const result = this.processTokens(
        token.content!,
        nestedTokens,
        childContext,
        helpers,
        options,
        tracking
      );

      results.push(result);
    });

    return results.join('');
  }

  /**
   * Process a helper function
   */
  private processHelper(
    token: VariableToken,
    context: RenderContext,
    helpers: Record<string, HelperFunction>,
    options: TemplateProcessingOptions,
    tracking: {
      usedVariables: Set<string>;
      missingVariables: Set<string>;
    }
  ): string {
    const helperFn = helpers[token.path];

    if (!helperFn) {
      if (options.strict) {
        throw new Error(`Unknown helper: ${token.path}`);
      }
      tracking.missingVariables.add(token.path);
      return '';
    }

    // Resolve arguments
    const args = (token.args || []).map(arg => {
      // Try to resolve as variable first
      const value = this.resolveValue(arg, context);
      if (value !== undefined) {
        tracking.usedVariables.add(arg);
        return value;
      }

      // Otherwise treat as literal
      // Remove quotes if present
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        return arg.slice(1, -1);
      }

      // Try to parse as number
      const num = Number(arg);
      if (!isNaN(num)) {
        return num;
      }

      return arg;
    });

    const result = helperFn(...args);
    return String(result);
  }

  /**
   * Resolve a value from context by path (supports dot notation)
   */
  private resolveValue(path: string, context: RenderContext): unknown {
    const parts = path.split('.');
    let current: any = context.data;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }

      // Special context variables
      if (part === '@index' && context.index !== undefined) {
        return context.index;
      }
      if (part === '@first' && context.first !== undefined) {
        return context.first;
      }
      if (part === '@last' && context.last !== undefined) {
        return context.last;
      }
      if (part === '@key' && context.key !== undefined) {
        return context.key;
      }

      current = current[part];
    }

    // If not found in current context, try parent
    if (current === undefined && context.parent) {
      return this.resolveValue(path, context.parent);
    }

    return current;
  }

  /**
   * Check if a value is truthy (for conditionals)
   */
  private isTruthy(value: unknown): boolean {
    if (value === null || value === undefined) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  /**
   * Escape HTML entities
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, char => map[char] ?? char);
  }
}
