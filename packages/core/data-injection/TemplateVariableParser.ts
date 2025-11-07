/**
 * Template Variable Parser
 *
 * Parses template strings and extracts variables, conditionals, and loops.
 * Supports Handlebars-like syntax: {{variable}}, {{#if}}, {{#each}}, etc.
 */

import {
  VariableType,
  VariableToken,
  VariableExtractionResult,
  TemplateProcessingOptions,
} from './data-injection.types';

/**
 * Parser for template variables
 */
export class TemplateVariableParser {
  private defaultDelimiters = {
    open: '{{',
    close: '}}',
  };

  /**
   * Parse a template string and extract all variables
   */
  public parse(
    template: string,
    options?: TemplateProcessingOptions
  ): VariableToken[] {
    const delimiters = options?.delimiters || this.defaultDelimiters;
    const tokens: VariableToken[] = [];

    let position = 0;

    while (position < template.length) {
      const openIndex = template.indexOf(delimiters.open, position);

      if (openIndex === -1) {
        // No more tokens
        break;
      }

      const closeIndex = template.indexOf(delimiters.close, openIndex + delimiters.open.length);

      if (closeIndex === -1) {
        // Unclosed delimiter - skip this one
        position = openIndex + delimiters.open.length;
        continue;
      }

      const raw = template.substring(openIndex, closeIndex + delimiters.close.length);
      const content = template.substring(
        openIndex + delimiters.open.length,
        closeIndex
      ).trim();

      const token = this.parseToken(raw, content, openIndex, closeIndex + delimiters.close.length);

      // Handle block statements (if, each, unless)
      if (token && this.isBlockStatement(token.type)) {
        const blockResult = this.parseBlockStatement(
          template,
          token,
          closeIndex + delimiters.close.length,
          delimiters
        );

        if (blockResult) {
          token.content = blockResult.content;
          token.elseContent = blockResult.elseContent;
          token.children = blockResult.children;
          position = blockResult.endPosition;
        } else {
          position = closeIndex + delimiters.close.length;
        }
      } else {
        position = closeIndex + delimiters.close.length;
      }

      if (token) {
        tokens.push(token);
      }
    }

    return tokens;
  }

  /**
   * Extract all variables from a template
   */
  public extractVariables(
    template: string,
    options?: TemplateProcessingOptions
  ): VariableExtractionResult {
    const tokens = this.parse(template, options);
    const variables = new Set<string>();
    const fields: string[] = [];
    const conditionals: string[] = [];
    const loops: string[] = [];
    const helpers: string[] = [];

    const processTokens = (tokenList: VariableToken[]): void => {
      for (const token of tokenList) {
        if (token.path) {
          variables.add(token.path);

          switch (token.type) {
            case VariableType.FIELD:
              fields.push(token.path);
              break;
            case VariableType.CONDITIONAL:
            case VariableType.UNLESS:
              conditionals.push(token.path);
              break;
            case VariableType.LOOP:
              loops.push(token.path);
              break;
            case VariableType.HELPER:
              helpers.push(token.path);
              break;
          }
        }

        if (token.children) {
          processTokens(token.children);
        }
      }
    };

    processTokens(tokens);

    return {
      variables: Array.from(variables),
      byType: {
        fields,
        conditionals,
        loops,
        helpers,
      },
      tree: tokens,
    };
  }

  /**
   * Check if a template contains any variables
   */
  public hasVariables(template: string, options?: TemplateProcessingOptions): boolean {
    const delimiters = options?.delimiters || this.defaultDelimiters;
    return template.includes(delimiters.open) && template.includes(delimiters.close);
  }

  /**
   * Get variable paths used in a template (unique list)
   */
  public getVariablePaths(template: string, options?: TemplateProcessingOptions): string[] {
    const result = this.extractVariables(template, options);
    return result.variables;
  }

  /**
   * Validate template syntax
   */
  public validate(template: string, options?: TemplateProcessingOptions): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const delimiters = options?.delimiters || this.defaultDelimiters;

    try {
      const tokens = this.parse(template, options);

      // Check for unclosed blocks
      const blockStack: VariableToken[] = [];

      const validateTokens = (tokenList: VariableToken[]): void => {
        for (const token of tokenList) {
          if (this.isBlockStatement(token.type)) {
            if (!token.content) {
              errors.push(`Unclosed block statement: ${token.raw}`);
            }
            blockStack.push(token);
          }

          if (token.children) {
            validateTokens(token.children);
          }

          if (this.isBlockStatement(token.type)) {
            blockStack.pop();
          }
        }
      };

      validateTokens(tokens);

      if (blockStack.length > 0) {
        errors.push(`${blockStack.length} unclosed block statement(s)`);
      }
    } catch (error) {
      errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Parse a single token
   */
  private parseToken(
    raw: string,
    content: string,
    start: number,
    end: number
  ): VariableToken | null {
    if (!content) {
      return null;
    }

    // Check for block helpers
    if (content.startsWith('#if ')) {
      return {
        type: VariableType.CONDITIONAL,
        raw,
        path: content.substring(4).trim(),
        start,
        end,
      };
    }

    if (content.startsWith('#unless ')) {
      return {
        type: VariableType.UNLESS,
        raw,
        path: content.substring(8).trim(),
        start,
        end,
      };
    }

    if (content.startsWith('#each ')) {
      return {
        type: VariableType.LOOP,
        raw,
        path: content.substring(6).trim(),
        start,
        end,
      };
    }

    // Check for closing tags
    if (content.startsWith('/')) {
      return null; // We handle these in parseBlockStatement
    }

    // Check for helpers (contains spaces or parentheses)
    if (content.includes(' ') || content.includes('(')) {
      const parts = content.split(/\s+/);
      return {
        type: VariableType.HELPER,
        raw,
        path: parts[0],
        args: parts.slice(1),
        start,
        end,
      };
    }

    // Simple field
    return {
      type: VariableType.FIELD,
      raw,
      path: content,
      start,
      end,
    };
  }

  /**
   * Check if a variable type is a block statement
   */
  private isBlockStatement(type: VariableType): boolean {
    return (
      type === VariableType.CONDITIONAL ||
      type === VariableType.UNLESS ||
      type === VariableType.LOOP
    );
  }

  /**
   * Parse a block statement and find its closing tag
   */
  private parseBlockStatement(
    template: string,
    openToken: VariableToken,
    startPosition: number,
    delimiters: { open: string; close: string }
  ): {
    content: string;
    elseContent?: string;
    children: VariableToken[];
    endPosition: number;
  } | null {
    const blockType = this.getBlockTypeName(openToken.type);
    const closeTag = `${delimiters.open}/${blockType}${delimiters.close}`;
    const elseTag = `${delimiters.open}else${delimiters.close}`;

    let depth = 1;
    let position = startPosition;
    let elsePosition = -1;

    // Find matching close tag (accounting for nested blocks)
    while (position < template.length && depth > 0) {
      const nextOpen = template.indexOf(`${delimiters.open}#${blockType}`, position);
      const nextElse = elsePosition === -1 ? template.indexOf(elseTag, position) : -1;
      const nextClose = template.indexOf(closeTag, position);

      if (nextClose === -1) {
        // No closing tag found
        return null;
      }

      // Check if we found a nested open before the close
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        position = nextOpen + delimiters.open.length + blockType.length + 1;
      }
      // Check if we found an else before the close (and we're at depth 1)
      else if (nextElse !== -1 && nextElse < nextClose && depth === 1 && elsePosition === -1) {
        elsePosition = nextElse;
        position = nextElse + elseTag.length;
      }
      // Found a close tag
      else {
        depth--;
        if (depth === 0) {
          // This is our matching close tag
          const content = template.substring(
            startPosition,
            elsePosition !== -1 ? elsePosition : nextClose
          );

          const elseContent = elsePosition !== -1
            ? template.substring(elsePosition + elseTag.length, nextClose)
            : undefined;

          // Parse children
          const children = this.parse(content, { delimiters });

          return {
            content,
            elseContent,
            children,
            endPosition: nextClose + closeTag.length,
          };
        } else {
          position = nextClose + closeTag.length;
        }
      }
    }

    return null;
  }

  /**
   * Get block type name from variable type
   */
  private getBlockTypeName(type: VariableType): string {
    switch (type) {
      case VariableType.CONDITIONAL:
        return 'if';
      case VariableType.UNLESS:
        return 'unless';
      case VariableType.LOOP:
        return 'each';
      default:
        return '';
    }
  }
}
