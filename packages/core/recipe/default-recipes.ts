/**
 * Default Style Recipes
 * Pre-built recipes for common styling patterns
 */

import type { StyleRecipe } from '../types/recipe.types';

// ============================================================================
// SURFACE RECIPES
// ============================================================================

export const cardRecipe: StyleRecipe = {
  id: 'card',
  name: 'Card',
  description: 'Card-style surface with border and shadow',
  category: 'surface',
  styles: {
    backgroundColor: '#ffffff',
    border: {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: '#e5e7eb',
      radius: { value: 0.5, unit: 'rem' },
    },
    padding: {
      top: { value: 24, unit: 'px' },
      right: { value: 24, unit: 'px' },
      bottom: { value: 24, unit: 'px' },
      left: { value: 24, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['container', 'surface', 'card'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const panelRecipe: StyleRecipe = {
  id: 'panel',
  name: 'Panel',
  description: 'Subtle panel with background',
  category: 'surface',
  styles: {
    backgroundColor: '#f9fafb',
    border: {
      width: { value: 0, unit: 'px' },
      style: 'solid',
      color: 'transparent',
      radius: { value: 0.375, unit: 'rem' },
    },
    padding: {
      top: { value: 20, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 20, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['container', 'surface', 'panel'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const wellRecipe: StyleRecipe = {
  id: 'well',
  name: 'Well',
  description: 'Inset well container',
  category: 'surface',
  styles: {
    backgroundColor: '#f3f4f6',
    border: {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: '#e5e7eb',
      radius: { value: 0.25, unit: 'rem' },
    },
    padding: {
      top: { value: 16, unit: 'px' },
      right: { value: 16, unit: 'px' },
      bottom: { value: 16, unit: 'px' },
      left: { value: 16, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['container', 'surface', 'well'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const elevatedRecipe: StyleRecipe = {
  id: 'elevated',
  name: 'Elevated',
  description: 'Elevated surface with prominent shadow',
  category: 'surface',
  styles: {
    backgroundColor: '#ffffff',
    border: {
      width: { value: 0, unit: 'px' },
      style: 'solid',
      color: 'transparent',
      radius: { value: 0.75, unit: 'rem' },
    },
    padding: {
      top: { value: 32, unit: 'px' },
      right: { value: 32, unit: 'px' },
      bottom: { value: 32, unit: 'px' },
      left: { value: 32, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['container', 'surface', 'elevated'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// SPACING RECIPES
// ============================================================================

export const compactRecipe: StyleRecipe = {
  id: 'compact',
  name: 'Compact',
  description: 'Minimal spacing for dense layouts',
  category: 'spacing',
  styles: {
    padding: {
      top: { value: 8, unit: 'px' },
      right: { value: 8, unit: 'px' },
      bottom: { value: 8, unit: 'px' },
      left: { value: 8, unit: 'px' },
    },
    margin: {
      top: { value: 8, unit: 'px' },
      right: { value: 0, unit: 'px' },
      bottom: { value: 8, unit: 'px' },
      left: { value: 0, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['spacing', 'compact'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const comfortableRecipe: StyleRecipe = {
  id: 'comfortable',
  name: 'Comfortable',
  description: 'Balanced spacing for readable layouts',
  category: 'spacing',
  styles: {
    padding: {
      top: { value: 16, unit: 'px' },
      right: { value: 16, unit: 'px' },
      bottom: { value: 16, unit: 'px' },
      left: { value: 16, unit: 'px' },
    },
    margin: {
      top: { value: 16, unit: 'px' },
      right: { value: 0, unit: 'px' },
      bottom: { value: 16, unit: 'px' },
      left: { value: 0, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['spacing', 'comfortable'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const spaciousRecipe: StyleRecipe = {
  id: 'spacious',
  name: 'Spacious',
  description: 'Generous spacing for premium feel',
  category: 'spacing',
  styles: {
    padding: {
      top: { value: 32, unit: 'px' },
      right: { value: 32, unit: 'px' },
      bottom: { value: 32, unit: 'px' },
      left: { value: 32, unit: 'px' },
    },
    margin: {
      top: { value: 32, unit: 'px' },
      right: { value: 0, unit: 'px' },
      bottom: { value: 32, unit: 'px' },
      left: { value: 0, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['spacing', 'spacious'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// DECORATIVE RECIPES
// ============================================================================

export const roundedRecipe: StyleRecipe = {
  id: 'rounded',
  name: 'Rounded',
  description: 'Rounded corners',
  category: 'decorative',
  styles: {
    border: {
      width: { value: 0, unit: 'px' },
      style: 'solid',
      color: 'transparent',
      radius: { value: 0.5, unit: 'rem' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['border', 'rounded'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const roundedFullRecipe: StyleRecipe = {
  id: 'rounded-full',
  name: 'Rounded Full',
  description: 'Fully rounded (pill-shaped)',
  category: 'decorative',
  styles: {
    border: {
      width: { value: 0, unit: 'px' },
      style: 'solid',
      color: 'transparent',
      radius: { value: 9999, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['border', 'rounded', 'pill'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const borderedRecipe: StyleRecipe = {
  id: 'bordered',
  name: 'Bordered',
  description: 'Subtle border',
  category: 'decorative',
  styles: {
    border: {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: '#e5e7eb',
      radius: { value: 0, unit: 'px' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['border'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const outlinedRecipe: StyleRecipe = {
  id: 'outlined',
  name: 'Outlined',
  description: 'Prominent outline',
  category: 'decorative',
  styles: {
    border: {
      width: { value: 2, unit: 'px' },
      style: 'solid',
      color: '#3b82f6',
      radius: { value: 0.375, unit: 'rem' },
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['border', 'outline'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const shadowSmRecipe: StyleRecipe = {
  id: 'shadow-sm',
  name: 'Shadow Small',
  description: 'Subtle shadow',
  category: 'decorative',
  styles: {
    customStyles: {
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['shadow', 'elevation'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const shadowMdRecipe: StyleRecipe = {
  id: 'shadow-md',
  name: 'Shadow Medium',
  description: 'Medium shadow',
  category: 'decorative',
  styles: {
    customStyles: {
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['shadow', 'elevation'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const shadowLgRecipe: StyleRecipe = {
  id: 'shadow-lg',
  name: 'Shadow Large',
  description: 'Prominent shadow',
  category: 'decorative',
  styles: {
    customStyles: {
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['shadow', 'elevation'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// INTERACTIVE RECIPES
// ============================================================================

export const clickableRecipe: StyleRecipe = {
  id: 'clickable',
  name: 'Clickable',
  description: 'Interactive clickable element',
  category: 'interactive',
  styles: {
    customStyles: {
      cursor: 'pointer',
      userSelect: 'none',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['interactive', 'clickable'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const hoverableRecipe: StyleRecipe = {
  id: 'hoverable',
  name: 'Hoverable',
  description: 'Element with hover effect',
  category: 'interactive',
  styles: {
    customStyles: {
      transition: 'all 0.2s ease-in-out',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['interactive', 'hover'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// LAYOUT RECIPES
// ============================================================================

export const centeredRecipe: StyleRecipe = {
  id: 'centered',
  name: 'Centered',
  description: 'Center-aligned content',
  category: 'layout',
  styles: {
    horizontalAlign: 'center',
    verticalAlign: 'middle',
  },
  metadata: {
    isBuiltIn: true,
    tags: ['layout', 'alignment'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const stackRecipe: StyleRecipe = {
  id: 'stack',
  name: 'Stack',
  description: 'Vertical stack layout',
  category: 'layout',
  styles: {
    customStyles: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['layout', 'flex', 'stack'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// COLOR RECIPES
// ============================================================================

export const primaryRecipe: StyleRecipe = {
  id: 'primary',
  name: 'Primary',
  description: 'Primary brand color scheme',
  category: 'color',
  styles: {
    backgroundColor: '#3b82f6',
    customStyles: {
      color: '#ffffff',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['color', 'primary'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const secondaryRecipe: StyleRecipe = {
  id: 'secondary',
  name: 'Secondary',
  description: 'Secondary color scheme',
  category: 'color',
  styles: {
    backgroundColor: '#6b7280',
    customStyles: {
      color: '#ffffff',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['color', 'secondary'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const mutedRecipe: StyleRecipe = {
  id: 'muted',
  name: 'Muted',
  description: 'Muted, subtle color scheme',
  category: 'color',
  styles: {
    backgroundColor: '#f3f4f6',
    customStyles: {
      color: '#6b7280',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['color', 'muted'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export const subtleRecipe: StyleRecipe = {
  id: 'subtle',
  name: 'Subtle',
  description: 'Very subtle background',
  category: 'color',
  styles: {
    backgroundColor: '#fafafa',
    customStyles: {
      color: '#374151',
    },
  },
  metadata: {
    isBuiltIn: true,
    tags: ['color', 'subtle'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

// ============================================================================
// RECIPE COLLECTION
// ============================================================================

export const defaultRecipes: StyleRecipe[] = [
  // Surface
  cardRecipe,
  panelRecipe,
  wellRecipe,
  elevatedRecipe,
  // Spacing
  compactRecipe,
  comfortableRecipe,
  spaciousRecipe,
  // Decorative
  roundedRecipe,
  roundedFullRecipe,
  borderedRecipe,
  outlinedRecipe,
  shadowSmRecipe,
  shadowMdRecipe,
  shadowLgRecipe,
  // Interactive
  clickableRecipe,
  hoverableRecipe,
  // Layout
  centeredRecipe,
  stackRecipe,
  // Color
  primaryRecipe,
  secondaryRecipe,
  mutedRecipe,
  subtleRecipe,
];

export function getDefaultRecipe(id: string): StyleRecipe | undefined {
  return defaultRecipes.find((recipe) => recipe.id === id);
}

export default defaultRecipes;
