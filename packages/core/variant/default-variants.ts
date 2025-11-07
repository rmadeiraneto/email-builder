/**
 * Default Component Variants
 * Pre-built variants for common components
 */

import type { ComponentVariant } from '../types/variant.types';
import { ComponentType } from '../types/component.types';

// ============================================================================
// BUTTON VARIANTS
// ============================================================================

export const buttonVariants: ComponentVariant[] = [
  {
    id: 'button-primary',
    name: 'Primary',
    description: 'Primary action button with solid background',
    category: 'style',
    styles: {
      backgroundColor: '#3b82f6',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: '#3b82f6',
        radius: { value: 0.375, unit: 'rem' },
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      },
    },
    metadata: { isDefault: true, group: 'style' },
  },
  {
    id: 'button-secondary',
    name: 'Secondary',
    description: 'Secondary action button with lighter background',
    category: 'style',
    styles: {
      backgroundColor: '#6b7280',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: '#6b7280',
        radius: { value: 0.375, unit: 'rem' },
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      },
    },
    metadata: { group: 'style' },
  },
  {
    id: 'button-outline',
    name: 'Outline',
    description: 'Outlined button with transparent background',
    category: 'style',
    styles: {
      backgroundColor: 'transparent',
      border: {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#3b82f6',
        radius: { value: 0.375, unit: 'rem' },
      },
      padding: {
        top: { value: 10, unit: 'px' },
        right: { value: 22, unit: 'px' },
        bottom: { value: 10, unit: 'px' },
        left: { value: 22, unit: 'px' },
      },
    },
    metadata: { group: 'style' },
  },
  {
    id: 'button-ghost',
    name: 'Ghost',
    description: 'Minimal button with hover effect',
    category: 'style',
    styles: {
      backgroundColor: 'transparent',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: 'transparent',
        radius: { value: 0.375, unit: 'rem' },
      },
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      },
    },
    metadata: { group: 'style' },
  },
  {
    id: 'button-gradient',
    name: 'Gradient',
    description: 'Eye-catching gradient button',
    category: 'style',
    styles: {
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: 'transparent',
        radius: { value: 0.5, unit: 'rem' },
      },
      padding: {
        top: { value: 14, unit: 'px' },
        right: { value: 28, unit: 'px' },
        bottom: { value: 14, unit: 'px' },
        left: { value: 28, unit: 'px' },
      },
    },
    metadata: { group: 'style' },
  },
  // Size variants
  {
    id: 'button-sm',
    name: 'Small',
    description: 'Compact button size',
    category: 'size',
    styles: {
      padding: {
        top: { value: 6, unit: 'px' },
        right: { value: 12, unit: 'px' },
        bottom: { value: 6, unit: 'px' },
        left: { value: 12, unit: 'px' },
      },
    },
    metadata: { group: 'size' },
  },
  {
    id: 'button-md',
    name: 'Medium',
    description: 'Standard button size',
    category: 'size',
    styles: {
      padding: {
        top: { value: 12, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 12, unit: 'px' },
        left: { value: 24, unit: 'px' },
      },
    },
    metadata: { isDefault: true, group: 'size' },
  },
  {
    id: 'button-lg',
    name: 'Large',
    description: 'Large, prominent button',
    category: 'size',
    styles: {
      padding: {
        top: { value: 16, unit: 'px' },
        right: { value: 32, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 32, unit: 'px' },
      },
    },
    metadata: { group: 'size' },
  },
  // Intent variants
  {
    id: 'button-success',
    name: 'Success',
    description: 'Success/confirmation action',
    category: 'intent',
    styles: {
      backgroundColor: '#10b981',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: '#10b981',
        radius: { value: 0.375, unit: 'rem' },
      },
    },
    metadata: { group: 'intent' },
  },
  {
    id: 'button-warning',
    name: 'Warning',
    description: 'Warning/caution action',
    category: 'intent',
    styles: {
      backgroundColor: '#f59e0b',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: '#f59e0b',
        radius: { value: 0.375, unit: 'rem' },
      },
    },
    metadata: { group: 'intent' },
  },
  {
    id: 'button-danger',
    name: 'Danger',
    description: 'Destructive/dangerous action',
    category: 'intent',
    styles: {
      backgroundColor: '#ef4444',
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: '#ef4444',
        radius: { value: 0.375, unit: 'rem' },
      },
    },
    metadata: { group: 'intent' },
  },
];

// ============================================================================
// TEXT VARIANTS
// ============================================================================

export const textVariants: ComponentVariant[] = [
  {
    id: 'text-heading1',
    name: 'Heading 1',
    description: 'Large page heading',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 48, unit: 'px' },
      fontWeight: 700,
      lineHeight: 1.2,
    },
    metadata: { group: 'typography' },
  },
  {
    id: 'text-heading2',
    name: 'Heading 2',
    description: 'Section heading',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 36, unit: 'px' },
      fontWeight: 600,
      lineHeight: 1.3,
    },
    metadata: { group: 'typography' },
  },
  {
    id: 'text-heading3',
    name: 'Heading 3',
    description: 'Subsection heading',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 30, unit: 'px' },
      fontWeight: 600,
      lineHeight: 1.4,
    },
    metadata: { group: 'typography' },
  },
  {
    id: 'text-body',
    name: 'Body',
    description: 'Standard body text',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 16, unit: 'px' },
      fontWeight: 400,
      lineHeight: 1.6,
    },
    metadata: { isDefault: true, group: 'typography' },
  },
  {
    id: 'text-body-large',
    name: 'Body Large',
    description: 'Larger body text for emphasis',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 18, unit: 'px' },
      fontWeight: 400,
      lineHeight: 1.6,
    },
    metadata: { group: 'typography' },
  },
  {
    id: 'text-caption',
    name: 'Caption',
    description: 'Small caption or helper text',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 14, unit: 'px' },
      fontWeight: 400,
      lineHeight: 1.5,
    },
    metadata: { group: 'typography' },
  },
  {
    id: 'text-label',
    name: 'Label',
    description: 'Label text for forms',
    category: 'style',
    styles: {},
    content: {
      fontSize: { value: 14, unit: 'px' },
      fontWeight: 500,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    metadata: { group: 'typography' },
  },
];

// ============================================================================
// IMAGE VARIANTS
// ============================================================================

export const imageVariants: ComponentVariant[] = [
  {
    id: 'image-default',
    name: 'Default',
    description: 'Standard image',
    category: 'style',
    styles: {
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: 'transparent',
        radius: { value: 0, unit: 'px' },
      },
    },
    metadata: { isDefault: true },
  },
  {
    id: 'image-rounded',
    name: 'Rounded',
    description: 'Image with rounded corners',
    category: 'style',
    styles: {
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: 'transparent',
        radius: { value: 0.5, unit: 'rem' },
      },
    },
    metadata: {},
  },
  {
    id: 'image-circle',
    name: 'Circle',
    description: 'Circular image',
    category: 'style',
    styles: {
      border: {
        width: { value: 0, unit: 'px' },
        style: 'solid',
        color: 'transparent',
        radius: { value: 9999, unit: 'px' },
      },
    },
    metadata: {},
  },
  {
    id: 'image-bordered',
    name: 'Bordered',
    description: 'Image with border',
    category: 'style',
    styles: {
      border: {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#e5e7eb',
        radius: { value: 0.25, unit: 'rem' },
      },
      padding: {
        top: { value: 4, unit: 'px' },
        right: { value: 4, unit: 'px' },
        bottom: { value: 4, unit: 'px' },
        left: { value: 4, unit: 'px' },
      },
    },
    metadata: {},
  },
];

// ============================================================================
// CONTAINER VARIANTS (for sections, divs, etc.)
// ============================================================================

export const containerVariants: ComponentVariant[] = [
  {
    id: 'container-default',
    name: 'Default',
    description: 'Standard container',
    category: 'style',
    styles: {
      padding: {
        top: { value: 16, unit: 'px' },
        right: { value: 16, unit: 'px' },
        bottom: { value: 16, unit: 'px' },
        left: { value: 16, unit: 'px' },
      },
    },
    metadata: { isDefault: true },
  },
  {
    id: 'container-card',
    name: 'Card',
    description: 'Card-style container with shadow',
    category: 'style',
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
    metadata: {},
  },
  {
    id: 'container-panel',
    name: 'Panel',
    description: 'Subtle panel container',
    category: 'style',
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
    metadata: {},
  },
  {
    id: 'container-highlight',
    name: 'Highlight',
    description: 'Highlighted container for important content',
    category: 'style',
    styles: {
      backgroundColor: '#eff6ff',
      border: {
        width: { value: 2, unit: 'px' },
        style: 'solid',
        color: '#3b82f6',
        radius: { value: 0.5, unit: 'rem' },
      },
      padding: {
        top: { value: 24, unit: 'px' },
        right: { value: 24, unit: 'px' },
        bottom: { value: 24, unit: 'px' },
        left: { value: 24, unit: 'px' },
      },
    },
    metadata: {},
  },
];

// ============================================================================
// SPACING VARIANTS
// ============================================================================

export const spacingVariants: ComponentVariant[] = [
  {
    id: 'spacing-compact',
    name: 'Compact',
    description: 'Minimal spacing',
    category: 'layout',
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
    metadata: {},
  },
  {
    id: 'spacing-comfortable',
    name: 'Comfortable',
    description: 'Balanced spacing',
    category: 'layout',
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
    metadata: { isDefault: true },
  },
  {
    id: 'spacing-spacious',
    name: 'Spacious',
    description: 'Generous spacing',
    category: 'layout',
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
    metadata: {},
  },
];

// ============================================================================
// VARIANT COLLECTIONS
// ============================================================================

export const defaultVariants: Record<string, ComponentVariant[]> = {
  [ComponentType.BUTTON]: buttonVariants,
  [ComponentType.TEXT]: textVariants,
  [ComponentType.IMAGE]: imageVariants,
  container: containerVariants,
  spacing: spacingVariants,
};

export function getAllDefaultVariants(): ComponentVariant[] {
  return Object.values(defaultVariants).flat();
}

export default defaultVariants;
