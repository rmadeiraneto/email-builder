/**
 * Component Property Mappings
 *
 * Maps component properties to design tokens for the interactive property editor
 */

export type TokenType = 'color' | 'dimension' | 'fontWeight' | 'shadow';

export interface PropertyMapping {
  label: string;
  description: string;
  tokenPath: string[];
  tokenType: TokenType;
  availableTokens?: string[][]; // Optional: specific tokens to show, otherwise shows all of type
}

export interface ComponentPropertyMap {
  name: string;
  description: string;
  properties: PropertyMapping[];
}

export const componentPropertyMappings: Record<string, ComponentPropertyMap> = {
  button: {
    name: 'Button',
    description: 'Interactive button component',
    properties: [
      {
        label: 'Default Background',
        description: 'Background color for default button',
        tokenPath: ['component', 'button', 'background', 'default'],
        tokenType: 'color',
      },
      {
        label: 'Default Hover Background',
        description: 'Background color when hovering default button',
        tokenPath: ['component', 'button', 'background', 'default-hover'],
        tokenType: 'color',
      },
      {
        label: 'Default Active Background',
        description: 'Background color when pressing default button',
        tokenPath: ['component', 'button', 'background', 'default-active'],
        tokenType: 'color',
      },
      {
        label: 'Default Text Color',
        description: 'Text color for default button',
        tokenPath: ['component', 'button', 'text', 'default'],
        tokenType: 'color',
      },
      {
        label: 'Primary Background',
        description: 'Background color for primary button',
        tokenPath: ['component', 'button', 'background', 'primary'],
        tokenType: 'color',
      },
      {
        label: 'Primary Hover Background',
        description: 'Background color when hovering primary button',
        tokenPath: ['component', 'button', 'background', 'primary-hover'],
        tokenType: 'color',
      },
      {
        label: 'Primary Active Background',
        description: 'Background color when pressing primary button',
        tokenPath: ['component', 'button', 'background', 'primary-active'],
        tokenType: 'color',
      },
      {
        label: 'Primary Text Color',
        description: 'Text color for primary button',
        tokenPath: ['component', 'button', 'text', 'primary'],
        tokenType: 'color',
      },
      {
        label: 'Secondary Background',
        description: 'Background color for secondary button',
        tokenPath: ['component', 'button', 'background', 'secondary'],
        tokenType: 'color',
      },
      {
        label: 'Secondary Hover Background',
        description: 'Background color when hovering secondary button',
        tokenPath: ['component', 'button', 'background', 'secondary-hover'],
        tokenType: 'color',
      },
      {
        label: 'Secondary Active Background',
        description: 'Background color when pressing secondary button',
        tokenPath: ['component', 'button', 'background', 'secondary-active'],
        tokenType: 'color',
      },
      {
        label: 'Secondary Text Color',
        description: 'Text color for secondary button',
        tokenPath: ['component', 'button', 'text', 'secondary'],
        tokenType: 'color',
      },
      {
        label: 'Ghost Text Color',
        description: 'Text color for ghost button',
        tokenPath: ['component', 'button', 'text', 'ghost'],
        tokenType: 'color',
      },
      {
        label: 'Disabled Opacity',
        description: 'Opacity for disabled buttons',
        tokenPath: ['component', 'button', 'opacity', 'disabled'],
        tokenType: 'dimension',
      },
      {
        label: 'Focus Ring Color',
        description: 'Color of the focus ring around button',
        tokenPath: ['component', 'button', 'focus-ring', 'color'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius (Medium)',
        description: 'Border radius for medium-sized buttons',
        tokenPath: ['component', 'button', 'border-radius', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding X (Medium)',
        description: 'Horizontal padding for medium-sized buttons',
        tokenPath: ['component', 'button', 'padding', 'x', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding Y (Medium)',
        description: 'Vertical padding for medium-sized buttons',
        tokenPath: ['component', 'button', 'padding', 'y', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Font Weight',
        description: 'Font weight for button text',
        tokenPath: ['component', 'button', 'font-weight'],
        tokenType: 'fontWeight',
      },
    ],
  },
  input: {
    name: 'Input',
    description: 'Form input component',
    properties: [
      {
        label: 'Background Color',
        description: 'Background color for input field',
        tokenPath: ['component', 'input', 'background', 'default'],
        tokenType: 'color',
      },
      {
        label: 'Border Color',
        description: 'Border color for default state',
        tokenPath: ['component', 'input', 'border-color', 'default'],
        tokenType: 'color',
      },
      {
        label: 'Focus Border Color',
        description: 'Border color when input is focused',
        tokenPath: ['component', 'input', 'border-color', 'focus'],
        tokenType: 'color',
      },
      {
        label: 'Text Color',
        description: 'Text color for input value',
        tokenPath: ['component', 'input', 'text-color', 'default'],
        tokenType: 'color',
      },
      {
        label: 'Placeholder Color',
        description: 'Text color for placeholder text',
        tokenPath: ['component', 'input', 'text-color', 'placeholder'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius (Medium)',
        description: 'Border radius for medium-sized inputs',
        tokenPath: ['component', 'input', 'border-radius', 'md'],
        tokenType: 'dimension',
      },
    ],
  },
  modal: {
    name: 'Modal',
    description: 'Modal dialog component',
    properties: [
      {
        label: 'Backdrop Color',
        description: 'Overlay backdrop color',
        tokenPath: ['component', 'modal', 'backdrop'],
        tokenType: 'color',
      },
      {
        label: 'Background Color',
        description: 'Modal content background color',
        tokenPath: ['component', 'modal', 'background'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius',
        description: 'Modal corner rounding',
        tokenPath: ['component', 'modal', 'border-radius'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding',
        description: 'Internal padding for modal content',
        tokenPath: ['component', 'modal', 'padding'],
        tokenType: 'dimension',
      },
      {
        label: 'Header Font Size',
        description: 'Font size for modal header',
        tokenPath: ['component', 'modal', 'header', 'font-size'],
        tokenType: 'dimension',
      },
      {
        label: 'Header Font Weight',
        description: 'Font weight for modal header',
        tokenPath: ['component', 'modal', 'header', 'font-weight'],
        tokenType: 'fontWeight',
      },
    ],
  },
  card: {
    name: 'Card',
    description: 'Card container component',
    properties: [
      {
        label: 'Background Color',
        description: 'Card background color',
        tokenPath: ['component', 'card', 'background'],
        tokenType: 'color',
      },
      {
        label: 'Border Color',
        description: 'Card border color',
        tokenPath: ['component', 'card', 'border-color'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius (Medium)',
        description: 'Border radius for medium cards',
        tokenPath: ['component', 'card', 'border-radius', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding (Medium)',
        description: 'Internal padding for medium cards',
        tokenPath: ['component', 'card', 'padding', 'md'],
        tokenType: 'dimension',
      },
    ],
  },
  dropdown: {
    name: 'Dropdown',
    description: 'Dropdown menu component',
    properties: [
      {
        label: 'Background Color',
        description: 'Dropdown menu background',
        tokenPath: ['component', 'dropdown', 'background'],
        tokenType: 'color',
      },
      {
        label: 'Border Color',
        description: 'Dropdown menu border',
        tokenPath: ['component', 'dropdown', 'border-color'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius',
        description: 'Dropdown menu corner rounding',
        tokenPath: ['component', 'dropdown', 'border-radius'],
        tokenType: 'dimension',
      },
      {
        label: 'Item Hover Background',
        description: 'Background color when hovering over item',
        tokenPath: ['component', 'dropdown', 'item', 'background', 'hover'],
        tokenType: 'color',
      },
    ],
  },
  tooltip: {
    name: 'Tooltip',
    description: 'Tooltip overlay component',
    properties: [
      {
        label: 'Background Color',
        description: 'Tooltip background color',
        tokenPath: ['component', 'tooltip', 'background'],
        tokenType: 'color',
      },
      {
        label: 'Text Color',
        description: 'Tooltip text color',
        tokenPath: ['component', 'tooltip', 'text-color'],
        tokenType: 'color',
      },
      {
        label: 'Border Radius',
        description: 'Tooltip corner rounding',
        tokenPath: ['component', 'tooltip', 'border-radius'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding X',
        description: 'Horizontal padding',
        tokenPath: ['component', 'tooltip', 'padding', 'x'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding Y',
        description: 'Vertical padding',
        tokenPath: ['component', 'tooltip', 'padding', 'y'],
        tokenType: 'dimension',
      },
    ],
  },
  badge: {
    name: 'Badge',
    description: 'Badge label component',
    properties: [
      {
        label: 'Border Radius (Medium)',
        description: 'Border radius for medium badges',
        tokenPath: ['component', 'badge', 'border-radius', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Padding X (Medium)',
        description: 'Horizontal padding for medium badges',
        tokenPath: ['component', 'badge', 'padding', 'x', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Font Size (Medium)',
        description: 'Font size for medium badges',
        tokenPath: ['component', 'badge', 'font-size', 'md'],
        tokenType: 'dimension',
      },
      {
        label: 'Font Weight',
        description: 'Font weight for badge text',
        tokenPath: ['component', 'badge', 'font-weight'],
        tokenType: 'fontWeight',
      },
    ],
  },
};

/**
 * Get available tokens for a specific token type
 */
export function getAvailableTokensForType(tokenType: TokenType, allTokens: any): Array<{ label: string; path: string[]; value: string }> {
  const tokens: Array<{ label: string; path: string[]; value: string }> = [];

  function traverse(obj: any, path: string[] = []) {
    if (!obj || typeof obj !== 'object') return;

    for (const [key, value] of Object.entries(obj)) {
      if (key === '$type' || key === '$description') continue;

      const currentPath = [...path, key];

      if (value && typeof value === 'object' && '$value' in value) {
        // This is a token
        const tokenObj = value as { $value: any; $type?: string };
        const type = tokenObj.$type || inferType(tokenObj.$value);
        if (type === tokenType) {
          tokens.push({
            label: currentPath.join(' › '),
            path: currentPath,
            value: String(tokenObj.$value),
          });
        }
      } else if (value && typeof value === 'object') {
        traverse(value, currentPath);
      }
    }
  }

  traverse(allTokens);
  return tokens;
}

/**
 * Infer token type from value
 */
function inferType(value: any): TokenType {
  if (typeof value === 'string') {
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
      return 'color';
    }
    if (value.match(/^\d+(\.\d+)?(px|rem|em|%)$/)) {
      return 'dimension';
    }
  }
  if (typeof value === 'number') {
    // Could be font weight
    if (value >= 100 && value <= 900) {
      return 'fontWeight';
    }
  }
  if (typeof value === 'object' && 'offsetX' in value) {
    return 'shadow';
  }
  return 'dimension';
}
