/**
 * Utility for loading all design tokens from the token package
 */

// Import all token files
import brandColors from '@email-builder/tokens/colors/brand';
import semanticColors from '@email-builder/tokens/colors/semantic';
import uiColors from '@email-builder/tokens/colors/ui';
import syntaxColors from '@email-builder/tokens/colors/syntax';

import fonts from '@email-builder/tokens/typography/fonts';
import sizes from '@email-builder/tokens/typography/sizes';
import weights from '@email-builder/tokens/typography/weights';
import lineHeights from '@email-builder/tokens/typography/line-heights';
import letterSpacing from '@email-builder/tokens/typography/letter-spacing';

import spacingScale from '@email-builder/tokens/spacing/scale';
import sizingScale from '@email-builder/tokens/sizing/scale';

import borderRadius from '@email-builder/tokens/border/radius';
import borderWidth from '@email-builder/tokens/border/width';

import elevation from '@email-builder/tokens/shadow/elevation';

import animationDuration from '@email-builder/tokens/animation/duration';
import animationEasing from '@email-builder/tokens/animation/easing';

import breakpoints from '@email-builder/tokens/breakpoints/devices';

export interface TokenCategory {
  name: string;
  displayName: string;
  tokens: any;
  subcategories?: string[];
}

/**
 * Get all default token values organized by category
 */
export function getDefaultTokens(): TokenCategory[] {
  return [
    {
      name: 'colors',
      displayName: 'Colors',
      tokens: {
        color: {
          brand: brandColors.color.brand,
          semantic: semanticColors.color.semantic,
          ui: uiColors.color.ui,
          syntax: syntaxColors.color.syntax,
        },
      },
      subcategories: ['brand', 'semantic', 'ui', 'syntax'],
    },
    {
      name: 'typography',
      displayName: 'Typography',
      tokens: {
        typography: {
          'font-family': fonts.typography['font-family'],
          'font-size': sizes.typography['font-size'],
          'font-weight': weights.typography['font-weight'],
          'line-height': lineHeights.typography['line-height'],
          'letter-spacing': letterSpacing.typography['letter-spacing'],
        },
      },
      subcategories: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing'],
    },
    {
      name: 'spacing',
      displayName: 'Spacing',
      tokens: {
        spacing: spacingScale.spacing,
      },
    },
    {
      name: 'sizing',
      displayName: 'Sizing',
      tokens: {
        sizing: sizingScale.sizing,
      },
    },
    {
      name: 'border',
      displayName: 'Border',
      tokens: {
        border: {
          radius: borderRadius.border.radius,
          width: borderWidth.border.width,
        },
      },
      subcategories: ['radius', 'width'],
    },
    {
      name: 'shadow',
      displayName: 'Shadow',
      tokens: {
        shadow: elevation.shadow,
      },
    },
    {
      name: 'animation',
      displayName: 'Animation',
      tokens: {
        animation: {
          duration: animationDuration.animation.duration,
          easing: animationEasing.animation.easing,
        },
      },
      subcategories: ['duration', 'easing'],
    },
    {
      name: 'breakpoints',
      displayName: 'Breakpoints',
      tokens: {
        breakpoint: breakpoints.breakpoint,
      },
    },
  ];
}

/**
 * Merge default tokens with custom overrides
 */
export function mergeTokens(defaultTokens: any, customTokens: any): any {
  if (!customTokens) {
    return defaultTokens;
  }

  const merged = JSON.parse(JSON.stringify(defaultTokens)); // Deep clone

  function merge(target: any, source: any): void {
    if (!source || typeof source !== 'object') {
      return;
    }

    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object') {
        if ('$value' in value) {
          // This is a token value, replace it
          target[key] = value;
        } else {
          // This is a nested object, recurse
          if (!target[key]) {
            target[key] = {};
          }
          merge(target[key], value);
        }
      }
    }
  }

  merge(merged, customTokens);
  return merged;
}

/**
 * Get all tokens as a flat object (for export)
 */
export function getAllTokensFlat(): any {
  const categories = getDefaultTokens();
  const allTokens: any = {};

  for (const category of categories) {
    Object.assign(allTokens, category.tokens);
  }

  return allTokens;
}
