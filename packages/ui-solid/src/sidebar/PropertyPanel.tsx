import { Component, Show, For, createMemo, createSignal, createEffect, untrack } from 'solid-js';
import type {
  PropertyPanelProps,
  PropertyDefinition,
  ComponentPropertyMap,
} from './PropertyPanel.types';
import type { ComponentPreset, VisualFeedbackEvent } from '@email-builder/core';
import { getTestId, getTestAction, getTestState } from '@email-builder/core/utils';
import { visualFeedbackEventBus, DeviceMode } from '@email-builder/core';
import { PresetPreview, PresetManager } from '../modals';
import { RichTextEditor } from '../editors';
import { CompatibilityIcon, CompatibilityModal } from '../compatibility';
import { CSSValueInput, BorderEditor, SpacingEditor, DisplayToggle, ImageUpload } from '../molecules';
import type { ImageData } from '../molecules/ImageUpload/ImageUpload';
import type { CSSValue, Border, BorderRadius, Spacing } from '@email-builder/core';
import styles from './PropertyPanel.module.scss';

/**
 * ⚠️ IMPORTANT FOR DEVELOPERS/AGENTS WORKING ON THIS FILE:
 *
 * When adding event handlers that update Solid.js signals, ALWAYS wrap
 * signal updates with untrack() to prevent infinite reactive loops and
 * stack overflow errors.
 *
 * Example:
 *   visualFeedbackEventBus.on('event', (data) => {
 *     untrack(() => {
 *       setSignal(data);  // Wrap ALL signal updates
 *     });
 *   });
 *
 * See SOLID_REACTIVITY_GUIDE.md in the root directory for full details.
 * This is critical to prevent "Maximum call stack size exceeded" errors.
 */

/**
 * General styles property definitions
 * These control canvas-wide and default component styles
 */
const GENERAL_STYLES_DEFINITIONS: PropertyDefinition[] = [
  // Canvas Dimensions
  {
    key: 'settings.canvasDimensions.width',
    label: 'Canvas Width',
    type: 'number',
    section: 'settings',
    min: 200,
    max: 1600,
    description: 'Canvas width in pixels (email: typically 600px)',
  },
  {
    key: 'settings.canvasDimensions.maxWidth',
    label: 'Max Width',
    type: 'number',
    section: 'settings',
    min: 200,
    max: 1600,
    description: 'Maximum width for responsive layouts',
  },
  // Canvas Appearance
  {
    key: 'generalStyles.canvasBackgroundColor',
    label: 'Canvas Background',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.canvasBorder',
    label: 'Canvas Border',
    type: 'text',
    section: 'styles',
    placeholder: '1px solid #ddd',
    description: 'CSS border shorthand (e.g., "1px solid #ddd")',
  },
  // Default Component Styles
  {
    key: 'generalStyles.defaultComponentBackgroundColor',
    label: 'Default Component Background',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.defaultComponentBorder',
    label: 'Default Component Border',
    type: 'text',
    section: 'styles',
    placeholder: '1px solid #eee',
    description: 'CSS border shorthand',
  },
  // Typography - Body
  {
    key: 'generalStyles.typography.body.styles.fontFamily',
    label: 'Body Font Family',
    type: 'select',
    section: 'styles',
    options: [
      { label: 'Arial', value: 'Arial, sans-serif' },
      { label: 'Georgia', value: 'Georgia, serif' },
      { label: 'Helvetica', value: 'Helvetica, sans-serif' },
      { label: 'Times New Roman', value: 'Times New Roman, serif' },
      { label: 'Verdana', value: 'Verdana, sans-serif' },
    ],
  },
  {
    key: 'generalStyles.typography.body.styles.fontSize',
    label: 'Body Font Size',
    type: 'text',
    section: 'styles',
    placeholder: '16px',
  },
  {
    key: 'generalStyles.typography.body.styles.color',
    label: 'Body Text Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.typography.body.styles.lineHeight',
    label: 'Body Line Height',
    type: 'text',
    section: 'styles',
    placeholder: '1.5',
  },
  // Typography - Paragraph
  {
    key: 'generalStyles.typography.paragraph.styles.fontSize',
    label: 'Paragraph Font Size',
    type: 'text',
    section: 'styles',
    placeholder: '16px',
  },
  {
    key: 'generalStyles.typography.paragraph.styles.color',
    label: 'Paragraph Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.typography.paragraph.styles.lineHeight',
    label: 'Paragraph Line Height',
    type: 'text',
    section: 'styles',
    placeholder: '1.6',
  },
  // Typography - H1
  {
    key: 'generalStyles.typography.heading1.styles.fontSize',
    label: 'H1 Font Size',
    type: 'text',
    section: 'styles',
    placeholder: '32px',
  },
  {
    key: 'generalStyles.typography.heading1.styles.color',
    label: 'H1 Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.typography.heading1.styles.fontWeight',
    label: 'H1 Weight',
    type: 'select',
    section: 'styles',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Bold', value: 'bold' },
      { label: '600', value: '600' },
      { label: '700', value: '700' },
    ],
  },
  // Typography - H2
  {
    key: 'generalStyles.typography.heading2.styles.fontSize',
    label: 'H2 Font Size',
    type: 'text',
    section: 'styles',
    placeholder: '24px',
  },
  {
    key: 'generalStyles.typography.heading2.styles.color',
    label: 'H2 Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.typography.heading2.styles.fontWeight',
    label: 'H2 Weight',
    type: 'select',
    section: 'styles',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Bold', value: 'bold' },
      { label: '600', value: '600' },
      { label: '700', value: '700' },
    ],
  },
  // Typography - H3
  {
    key: 'generalStyles.typography.heading3.styles.fontSize',
    label: 'H3 Font Size',
    type: 'text',
    section: 'styles',
    placeholder: '20px',
  },
  {
    key: 'generalStyles.typography.heading3.styles.color',
    label: 'H3 Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.typography.heading3.styles.fontWeight',
    label: 'H3 Weight',
    type: 'select',
    section: 'styles',
    options: [
      { label: 'Normal', value: 'normal' },
      { label: 'Bold', value: 'bold' },
      { label: '600', value: '600' },
      { label: '700', value: '700' },
    ],
  },
  // Link Styles
  {
    key: 'generalStyles.linkStyles.color',
    label: 'Link Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.linkStyles.hoverColor',
    label: 'Link Hover Color',
    type: 'color',
    section: 'styles',
  },
  // Button Styles
  {
    key: 'generalStyles.buttonStyles.backgroundColor',
    label: 'Button Background',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.buttonStyles.color',
    label: 'Button Text Color',
    type: 'color',
    section: 'styles',
  },
  {
    key: 'generalStyles.buttonStyles.borderRadius',
    label: 'Button Border Radius',
    type: 'text',
    section: 'styles',
    placeholder: '4px',
  },
  {
    key: 'generalStyles.buttonStyles.padding',
    label: 'Button Padding',
    type: 'text',
    section: 'styles',
    placeholder: '12px 24px',
  },
];

/**
 * Property definitions for each component type
 */
const PROPERTY_DEFINITIONS: ComponentPropertyMap = {
  button: [
    {
      key: 'content.text',
      label: 'Button Text',
      type: 'text',
      section: 'content',
      placeholder: 'Enter button text',
    },
    {
      key: 'content.link',
      label: 'Link URL',
      type: 'url',
      section: 'content',
      placeholder: 'https://example.com',
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.textColor',
      label: 'Text Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
  ],
  text: [
    {
      key: 'content.html',
      label: 'Text Content',
      type: 'richtext',
      section: 'content',
      placeholder: 'Enter text content',
    },
    {
      key: 'styles.fontFamily',
      label: 'Font Family',
      type: 'select',
      section: 'styles',
      options: [
        { label: 'Arial', value: 'Arial, sans-serif' },
        { label: 'Georgia', value: 'Georgia, serif' },
        { label: 'Helvetica', value: 'Helvetica, sans-serif' },
        { label: 'Times New Roman', value: 'Times New Roman, serif' },
        { label: 'Verdana', value: 'Verdana, sans-serif' },
      ],
    },
    {
      key: 'styles.fontSize',
      label: 'Font Size',
      type: 'number',
      section: 'styles',
      min: 8,
      max: 72,
    },
    {
      key: 'styles.fontWeight',
      label: 'Font Weight',
      type: 'select',
      section: 'styles',
      options: [
        { label: 'Normal', value: 'normal' },
        { label: 'Bold', value: 'bold' },
        { label: '300', value: '300' },
        { label: '400', value: '400' },
        { label: '500', value: '500' },
        { label: '600', value: '600' },
        { label: '700', value: '700' },
      ],
    },
    {
      key: 'styles.color',
      label: 'Text Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.textAlign',
      label: 'Text Align',
      type: 'radio',
      section: 'styles',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  image: [
    {
      key: 'content',
      label: 'Image',
      type: 'imageupload',
      section: 'content',
      description: 'Upload an image or provide a URL',
    },
    {
      key: 'styles.width',
      label: 'Width',
      type: 'cssvalue',
      section: 'styles',
      min: 0,
      max: 1000,
    },
    {
      key: 'styles.height',
      label: 'Height',
      type: 'cssvalue',
      section: 'styles',
      min: 0,
      max: 1000,
    },
    {
      key: 'styles.alignment',
      label: 'Alignment',
      type: 'radio',
      section: 'styles',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
  separator: [
    {
      key: 'styles.height',
      label: 'Height',
      type: 'cssvalue',
      section: 'styles',
      min: 1,
      max: 20,
    },
    {
      key: 'styles.color',
      label: 'Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.style',
      label: 'Style',
      type: 'select',
      section: 'styles',
      options: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
      ],
    },
  ],
  spacer: [
    {
      key: 'styles.height',
      label: 'Height',
      type: 'cssvalue',
      section: 'styles',
      min: 0,
      max: 200,
    },
  ],
  header: [
    {
      key: 'content.layout',
      label: 'Layout',
      type: 'select',
      section: 'content',
      options: [
        { label: 'Logo Top', value: 'image-top' },
        { label: 'Logo Left', value: 'image-left' },
        { label: 'Logo Right', value: 'image-right' },
        { label: 'Logo Center', value: 'logo-center' },
      ],
    },
    {
      key: 'content.showLogo',
      label: 'Show Logo',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'content.image',
      label: 'Logo Image',
      type: 'imageupload',
      section: 'content',
      description: 'Upload logo or provide URL',
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.linkStyles.color',
      label: 'Link Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.linkHoverColor',
      label: 'Link Hover Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
  footer: [
    {
      key: 'content.copyrightText',
      label: 'Copyright Text',
      type: 'text',
      section: 'content',
      placeholder: '© 2025 Your Company. All rights reserved.',
    },
    {
      key: 'content.showSocialIcons',
      label: 'Show Social Icons',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.textStyles.color',
      label: 'Text Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.textStyles.fontSize',
      label: 'Font Size',
      type: 'cssvalue',
      section: 'styles',
      min: 10,
      max: 24,
    },
    {
      key: 'styles.socialIconColor',
      label: 'Social Icon Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
  hero: [
    {
      key: 'content.layout',
      label: 'Layout',
      type: 'select',
      section: 'content',
      options: [
        { label: 'Image Background', value: 'image-background' },
        { label: 'Image Left', value: 'image-left' },
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Top', value: 'image-top' },
      ],
    },
    {
      key: 'content.showImage',
      label: 'Show Image',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'content.image',
      label: 'Hero Image',
      type: 'imageupload',
      section: 'content',
      description: 'Upload hero image or provide URL',
    },
    {
      key: 'content.heading.plainText',
      label: 'Heading',
      type: 'text',
      section: 'content',
      placeholder: 'Your Amazing Headline',
    },
    {
      key: 'content.description.plainText',
      label: 'Description',
      type: 'textarea',
      section: 'content',
      placeholder: 'Supporting text for your hero section',
    },
    {
      key: 'content.showButton',
      label: 'Show Button',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'content.button.text',
      label: 'Button Text',
      type: 'text',
      section: 'content',
      placeholder: 'Learn More',
    },
    {
      key: 'content.button.link.href',
      label: 'Button URL',
      type: 'url',
      section: 'content',
      placeholder: 'https://example.com',
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.headingStyles.color',
      label: 'Heading Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.headingStyles.fontSize',
      label: 'Heading Size',
      type: 'cssvalue',
      section: 'styles',
      min: 24,
      max: 72,
    },
    {
      key: 'styles.contentAlign',
      label: 'Content Alignment',
      type: 'radio',
      section: 'styles',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
  list: [
    {
      key: 'content.orientation',
      label: 'Orientation',
      type: 'radio',
      section: 'content',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
    },
    {
      key: 'content.itemLayout',
      label: 'Item Layout',
      type: 'select',
      section: 'content',
      options: [
        { label: 'Image Top', value: 'image-top' },
        { label: 'Image Left', value: 'image-left' },
        { label: 'Image Right', value: 'image-right' },
        { label: 'Image Background', value: 'image-background' },
      ],
    },
    {
      key: 'content.columns',
      label: 'Columns (Horizontal)',
      type: 'number',
      section: 'content',
      min: 1,
      max: 6,
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.itemBackgroundColor',
      label: 'Item Background',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.titleStyles.color',
      label: 'Title Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.titleStyles.fontSize',
      label: 'Title Size',
      type: 'cssvalue',
      section: 'styles',
      min: 14,
      max: 36,
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.itemPadding',
      label: 'Item Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
  call_to_action: [
    {
      key: 'content.layout',
      label: 'Layout',
      type: 'select',
      section: 'content',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Left Aligned', value: 'left-aligned' },
        { label: 'Right Aligned', value: 'right-aligned' },
        { label: 'Two Column', value: 'two-column' },
      ],
    },
    {
      key: 'content.heading.plainText',
      label: 'Heading',
      type: 'text',
      section: 'content',
      placeholder: 'Ready to get started?',
    },
    {
      key: 'content.description.plainText',
      label: 'Description',
      type: 'textarea',
      section: 'content',
      placeholder: 'Join thousands of satisfied customers',
    },
    {
      key: 'content.showPrimaryButton',
      label: 'Show Primary Button',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'content.primaryButton.text',
      label: 'Primary Button Text',
      type: 'text',
      section: 'content',
      placeholder: 'Get Started',
    },
    {
      key: 'content.primaryButton.link.href',
      label: 'Primary Button URL',
      type: 'url',
      section: 'content',
      placeholder: 'https://example.com',
    },
    {
      key: 'content.showSecondaryButton',
      label: 'Show Secondary Button',
      type: 'displaytoggle',
      section: 'content',
    },
    {
      key: 'content.secondaryButton.text',
      label: 'Secondary Button Text',
      type: 'text',
      section: 'content',
      placeholder: 'Learn More',
    },
    {
      key: 'content.secondaryButton.link.href',
      label: 'Secondary Button URL',
      type: 'url',
      section: 'content',
      placeholder: 'https://example.com/learn',
    },
    {
      key: 'styles.backgroundColor',
      label: 'Background Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.headingStyles.color',
      label: 'Heading Color',
      type: 'color',
      section: 'styles',
    },
    {
      key: 'styles.headingStyles.fontSize',
      label: 'Heading Size',
      type: 'cssvalue',
      section: 'styles',
      min: 20,
      max: 48,
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'spacing',
      section: 'styles',
    },
    {
      key: 'styles.border',
      label: 'Border',
      type: 'border',
      section: 'styles',
    },
  ],
};

/**
 * Get nested property value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Set nested property value in object using dot notation
 */
function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Map property key to CSS property name for compatibility checking
 */
function getCssPropertyName(propertyKey: string): string | null {
  // Extract the last part of the key after 'styles.'
  const parts = propertyKey.split('.');
  const lastPart = parts[parts.length - 1];

  // Map common property names to CSS properties
  const propertyMap: Record<string, string> = {
    backgroundColor: 'background-color',
    textColor: 'color',
    borderRadius: 'border-radius',
    padding: 'padding',
    margin: 'margin',
    fontFamily: 'font-family',
    fontSize: 'font-size',
    fontWeight: 'font-weight',
    lineHeight: 'line-height',
    color: 'color',
    textAlign: 'text-align',
    width: 'width',
    height: 'height',
    maxWidth: 'max-width',
    border: 'border',
    borderWidth: 'border-width',
    borderStyle: 'border-style',
    borderColor: 'border-color',
    boxShadow: 'box-shadow',
    textShadow: 'text-shadow',
    opacity: 'opacity',
    display: 'display',
    position: 'position',
    transform: 'transform',
    animation: 'animation',
    transition: 'transition',
    socialIconColor: 'color', // Social icons use color
    linkColor: 'color', // Links use color
    hoverColor: 'color', // Hover states use color
    canvasBackgroundColor: 'background-color',
    canvasBorder: 'border',
    defaultComponentBackgroundColor: 'background-color',
    defaultComponentBorder: 'border',
  };

  return lastPart ? propertyMap[lastPart] || null : null;
}

/**
 * PropertyPanel component
 * Displays and manages properties of the selected component
 */
// Stable default values to avoid creating new objects on every render
// This prevents infinite loops when components call onChange on value prop changes
const DEFAULT_CSS_VALUE: CSSValue = { value: 0, unit: 'px' };
const DEFAULT_BORDER: Border & { radius?: BorderRadius } = {
  width: { value: 1, unit: 'px' },
  style: 'solid',
  color: '#000000',
  radius: {
    topLeft: { value: 0, unit: 'px' },
    topRight: { value: 0, unit: 'px' },
    bottomLeft: { value: 0, unit: 'px' },
    bottomRight: { value: 0, unit: 'px' }
  }
};
const DEFAULT_SPACING: Spacing = {
  top: { value: 0, unit: 'px' },
  right: { value: 0, unit: 'px' },
  bottom: { value: 0, unit: 'px' },
  left: { value: 0, unit: 'px' }
};

export const PropertyPanel: Component<PropertyPanelProps> = (props) => {
  // Tab state for component selected
  type ComponentTabType = 'content' | 'style';
  const [activeComponentTab, setActiveComponentTab] = createSignal<ComponentTabType>('content');

  // Tab state for no component selected
  type GeneralTabType = 'components' | 'general-styles';
  const [activeGeneralTab, setActiveGeneralTab] = createSignal<GeneralTabType>('general-styles');

  // Preset state
  const [presets, setPresets] = createSignal<ComponentPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = createSignal<string>('');
  const [showCreatePresetModal, setShowCreatePresetModal] = createSignal(false);
  const [showPreviewModal, setShowPreviewModal] = createSignal(false);
  const [showPresetManagerModal, setShowPresetManagerModal] = createSignal(false);
  const [newPresetName, setNewPresetName] = createSignal('');
  const [newPresetDescription, setNewPresetDescription] = createSignal('');

  // Compatibility modal state
  const [compatibilityModalOpen, setCompatibilityModalOpen] = createSignal(false);
  const [selectedProperty, setSelectedProperty] = createSignal<string>('');

  // Only track component TYPE, not the entire object
  // This prevents infinite re-runs when component properties change
  const componentType = createMemo(() => props.selectedComponent?.type.toLowerCase());

  const properties = createMemo(() => {
    const type = componentType();
    if (!type) return [];
    const definitions = PROPERTY_DEFINITIONS[type];
    return definitions || [];
  });

  const groupedProperties = createMemo(() => {
    const grouped: Record<'content' | 'styles' | 'settings', PropertyDefinition[]> = {
      content: [],
      styles: [],
      settings: [],
    };

    properties().forEach((prop) => {
      grouped[prop.section].push(prop);
    });

    return grouped;
  });

  // Group general styles by category
  const groupedGeneralStyles = createMemo(() => {
    const grouped: {
      dimensions: PropertyDefinition[];
      canvasAppearance: PropertyDefinition[];
      defaultComponents: PropertyDefinition[];
      typography: PropertyDefinition[];
      links: PropertyDefinition[];
      buttons: PropertyDefinition[];
    } = {
      dimensions: [],
      canvasAppearance: [],
      defaultComponents: [],
      typography: [],
      links: [],
      buttons: [],
    };

    GENERAL_STYLES_DEFINITIONS.forEach((prop) => {
      if (prop.key.includes('canvasDimensions')) {
        grouped.dimensions.push(prop);
      } else if (prop.key.includes('canvasBackground') || prop.key.includes('canvasBorder')) {
        grouped.canvasAppearance.push(prop);
      } else if (prop.key.includes('defaultComponent')) {
        grouped.defaultComponents.push(prop);
      } else if (prop.key.includes('typography')) {
        grouped.typography.push(prop);
      } else if (prop.key.includes('linkStyles')) {
        grouped.links.push(prop);
      } else if (prop.key.includes('buttonStyles')) {
        grouped.buttons.push(prop);
      }
    });

    return grouped;
  });

  // Mobile Development Mode helpers
  const isMobileMode = createMemo(() => props.deviceMode === DeviceMode.MOBILE);

  /**
   * Check if a property has a mobile override
   */
  const hasMobileOverride = (component: any | null, propertyKey: string): boolean => {
    if (!component || !component.mobileStyles) return false;

    // Extract the style property key (e.g., 'styles.backgroundColor' -> 'backgroundColor')
    const styleProp = propertyKey.startsWith('styles.')
      ? propertyKey.replace('styles.', '')
      : propertyKey;

    return component.mobileStyles && styleProp in component.mobileStyles;
  };

  /**
   * Get the desktop (base) value for a property
   */
  const getDesktopValue = (component: any | null, propertyKey: string): any => {
    if (!component) return undefined;
    return getNestedValue(component, propertyKey);
  };

  /**
   * Get the mobile override value for a property
   */
  const getMobileValue = (component: any | null, propertyKey: string): any => {
    if (!component || !component.mobileStyles) return undefined;

    // Extract the style property key
    const styleProp = propertyKey.startsWith('styles.')
      ? propertyKey.replace('styles.', '')
      : propertyKey;

    return component.mobileStyles?.[styleProp];
  };

  // Load presets when component type changes
  // Only track the component type, not the entire component object
  // to prevent infinite re-runs when component properties change
  createEffect(() => {
    const type = componentType();
    if (type) {
      // Use untrack to avoid tracking presetActions changes
      untrack(() => {
        if (props.presetActions) {
          props.presetActions.listPresets(type as any).then(setPresets);
        }
      });
    } else {
      setPresets([]);
      setSelectedPresetId('');
    }
  });

  // Get selected preset
  const selectedPreset = createMemo(() => {
    const id = selectedPresetId();
    return id ? presets().find(p => p.id === id) : null;
  });

  // Preset handlers
  const handleApplyPreset = async () => {
    if (!props.selectedComponent || !selectedPresetId() || !props.presetActions) return;

    await props.presetActions.applyPreset(props.selectedComponent.id, selectedPresetId());
  };

  const handlePreviewPreset = () => {
    if (selectedPresetId()) {
      setShowPreviewModal(true);
    }
  };

  const handleApplyFromPreview = async (presetId: string) => {
    if (!props.selectedComponent || !props.presetActions) return;

    await props.presetActions.applyPreset(props.selectedComponent.id, presetId);
  };

  const handleCreatePreset = async () => {
    if (!props.selectedComponent || !newPresetName().trim() || !props.presetActions) return;

    const preset = await props.presetActions.createPreset(
      props.selectedComponent.id,
      newPresetName().trim(),
      newPresetDescription().trim() || undefined
    );

    if (preset) {
      // Reload presets to include the new one
      const updatedPresets = await props.presetActions.listPresets(props.selectedComponent.type as any);
      setPresets(updatedPresets);

      // Clear modal state
      setShowCreatePresetModal(false);
      setNewPresetName('');
      setNewPresetDescription('');
    }
  };

  const handleCancelCreatePreset = () => {
    setShowCreatePresetModal(false);
    setNewPresetName('');
    setNewPresetDescription('');
  };

  // PresetManager handlers
  const handleUpdatePreset = async (componentType: string, presetId: string, updates: { name?: string; description?: string }) => {
    if (!props.presetActions) return;
    await props.presetActions.updatePreset(componentType as any, presetId, updates);
    // Reload presets to show updated data
    const updatedPresets = await props.presetActions.listPresets();
    setPresets(updatedPresets);
  };

  const handleDeletePreset = async (componentType: string, presetId: string) => {
    if (!props.presetActions) return;
    await props.presetActions.deletePreset(componentType as any, presetId);
    // Reload presets to show updated list
    const updatedPresets = await props.presetActions.listPresets();
    setPresets(updatedPresets);
  };

  const handleDuplicatePreset = async (preset: ComponentPreset) => {
    if (!props.presetActions) return;

    // Extract component type from preset ID (e.g., "button-primary" -> "button")
    const componentType = preset.id.split('-')[0];

    // Duplicate the preset using the PresetManager's duplicate method
    const duplicatedPreset = await props.presetActions.duplicatePreset(
      componentType as any,
      preset.id,
      `${preset.name} (Copy)`
    );

    if (duplicatedPreset) {
      // Reload presets to include the duplicated one
      const updatedPresets = await props.presetActions.listPresets();
      setPresets(updatedPresets);
    }

    return duplicatedPreset;
  };

  const handleExportPresets = async () => {
    if (!props.presetActions) return;
    await props.presetActions.exportPresets();
  };

  const handleImportPresets = async (file: File) => {
    if (!props.presetActions) return;
    await props.presetActions.importPresets(file);
    // Reload presets to show imported presets
    const updatedPresets = await props.presetActions.listPresets();
    setPresets(updatedPresets);
  };

  // Get all unique component types from presets
  const componentTypes = createMemo(() => {
    const types = new Set<string>();
    presets().forEach(preset => {
      // Extract component type from preset ID (e.g., "button-primary" -> "button")
      const type = preset.id.split('-')[0];
      if (type) {
        types.add(type);
      }
    });
    return Array.from(types);
  });

  /**
   * Validate property value before updating
   */
  const validatePropertyValue = (property: PropertyDefinition, value: any): { valid: boolean; error?: string } => {
    // CSSValue validation
    if (property.type === 'cssvalue' && value) {
      const cssValue = value as CSSValue;
      if (typeof cssValue.value !== 'number') {
        return { valid: false, error: 'CSS value must be a number' };
      }
      if (property.min !== undefined && cssValue.value < property.min) {
        return { valid: false, error: `Value cannot be less than ${property.min}` };
      }
      if (property.max !== undefined && cssValue.value > property.max) {
        return { valid: false, error: `Value cannot be greater than ${property.max}` };
      }
      const validUnits = ['px', 'rem', 'em', '%', 'vh', 'vw', 'pt', 'auto'];
      if (!validUnits.includes(cssValue.unit)) {
        return { valid: false, error: `Invalid unit: ${cssValue.unit}` };
      }
    }

    // Border validation
    if (property.type === 'border' && value) {
      const border = value as Border & { radius?: BorderRadius };
      if (!border.width || typeof border.width.value !== 'number') {
        return { valid: false, error: 'Border width must be a valid CSS value' };
      }
      const validStyles = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
      if (!validStyles.includes(border.style)) {
        return { valid: false, error: `Invalid border style: ${border.style}` };
      }
      // Simple color validation (hex or named color)
      if (border.color && !(/^#[0-9A-F]{6}$/i.test(border.color) || /^[a-z]+$/i.test(border.color))) {
        return { valid: false, error: 'Border color must be a valid hex color or color name' };
      }
    }

    // Spacing validation
    if (property.type === 'spacing' && value) {
      const spacing = value as Spacing;
      const sides = ['top', 'right', 'bottom', 'left'] as const;
      for (const side of sides) {
        if (spacing[side]) {
          const cssValue = spacing[side];
          if (typeof cssValue.value !== 'number') {
            return { valid: false, error: `Spacing ${side} must be a valid CSS value` };
          }
          if (cssValue.value < 0) {
            return { valid: false, error: `Spacing cannot be negative` };
          }
        }
      }
    }

    // ImageData validation
    if (property.type === 'imageupload' && value) {
      const imageData = value as ImageData;
      // URL validation (basic)
      if (imageData.url && imageData.url.trim()) {
        try {
          new URL(imageData.url);
        } catch {
          // If it's not a valid URL, check if it's a data URL or relative path
          if (!imageData.url.startsWith('data:') && !imageData.url.startsWith('/') && !imageData.url.startsWith('./')) {
            return { valid: false, error: 'Image URL must be a valid URL, data URL, or relative path' };
          }
        }
      }
      // Alt text validation
      if (imageData.url && (!imageData.alt || imageData.alt.trim() === '')) {
        console.warn('Image missing alt text - important for accessibility');
      }
    }

    return { valid: true };
  };

  const handlePropertyChange = (property: PropertyDefinition, value: any) => {
    if (!props.selectedComponent) return;

    // Get current value to check if it's actually changing
    const currentValue = getNestedValue(props.selectedComponent, property.key);

    // Deep equality check to prevent unnecessary updates that cause infinite loops
    // This is critical for object-based properties (border, spacing, cssvalue)
    if (JSON.stringify(currentValue) === JSON.stringify(value)) {
      // Value hasn't changed, don't trigger update
      return;
    }

    // Validate the value
    const validation = validatePropertyValue(property, value);
    if (!validation.valid) {
      console.error(`Validation error for ${property.key}: ${validation.error}`);
      // In a real app, you might want to show this error to the user
      return;
    }

    // Call the onChange callback only if value has actually changed
    props.onPropertyChange(
      props.selectedComponent.id,
      property.key,
      value
    );
  };

  const handleGeneralStyleChange = (property: PropertyDefinition, value: any) => {
    if (!props.template || !props.onGeneralStyleChange) return;

    // Call the onChange callback for general styles
    props.onGeneralStyleChange(property.key, value);
  };

  // Visual feedback event handlers using global event bus
  const handlePropertyHover = (property: PropertyDefinition) => {
    if (!props.selectedComponent) return;

    visualFeedbackEventBus.emit({
      type: 'property:hover',
      propertyPath: property.key,
      componentId: props.selectedComponent.id,
      currentValue: getNestedValue(props.selectedComponent, property.key),
    });
  };

  const handlePropertyUnhover = (property: PropertyDefinition) => {
    visualFeedbackEventBus.emit({
      type: 'property:unhover',
      propertyPath: property.key,
    });
  };

  const handlePropertyEditStart = (property: PropertyDefinition) => {
    if (!props.selectedComponent) return;

    visualFeedbackEventBus.emit({
      type: 'property:edit:start',
      propertyPath: property.key,
      componentId: props.selectedComponent.id,
      currentValue: getNestedValue(props.selectedComponent, property.key),
      isEditing: true,
    });
  };

  const handlePropertyEditEnd = (property: PropertyDefinition) => {
    visualFeedbackEventBus.emit({
      type: 'property:edit:end',
      propertyPath: property.key,
      isEditing: false,
    });
  };

  /**
   * Render property label with mobile indicators
   * Shows:
   * - 📱 badge when property has mobile override (desktop mode only)
   * - Reset button when in mobile mode with override
   * - Inherited desktop value when in mobile mode
   */
  const renderPropertyLabel = (property: PropertyDefinition, inputId: string, cssProp?: string) => {
    const hasOverride = hasMobileOverride(props.selectedComponent, property.key);
    const showMobileIndicator = hasOverride && !isMobileMode();
    const showResetButton = hasOverride && isMobileMode() && props.onClearMobileOverride;
    const desktopValue = getDesktopValue(props.selectedComponent, property.key);

    return (
      <div class={styles.propertyLabelWithMobile}>
        <label for={inputId} class={styles.propertyLabelText}>
          {property.label}
          <Show when={showMobileIndicator}>
            <span class={styles.mobileIndicator} title="Has mobile override">
              📱
            </span>
          </Show>
          <Show when={cssProp}>
            <CompatibilityIcon
              property={cssProp!}
              size={16}
              onClick={() => {
                setSelectedProperty(cssProp!);
                setCompatibilityModalOpen(true);
              }}
            />
          </Show>
        </label>
        <Show when={showResetButton}>
          <button
            type="button"
            class={styles.resetMobileButton}
            onClick={() => props.onClearMobileOverride!(props.selectedComponent!.id, property.key)}
            title="Reset to desktop value"
          >
            Reset
          </button>
        </Show>
      </div>
    );
  };

  /**
   * Render inherited value hint (shown in mobile mode when there's an override)
   */
  const renderInheritedValue = (property: PropertyDefinition) => {
    if (!isMobileMode() || !hasMobileOverride(props.selectedComponent, property.key)) {
      return null;
    }

    const desktopValue = getDesktopValue(props.selectedComponent, property.key);
    const displayValue = typeof desktopValue === 'object'
      ? JSON.stringify(desktopValue)
      : String(desktopValue ?? 'undefined');

    return (
      <span class={styles.inheritedValue}>
        Desktop: {displayValue}
      </span>
    );
  };

  const renderPropertyEditor = (property: PropertyDefinition) => {
    if (!props.selectedComponent) return null;

    const currentValue = getNestedValue(props.selectedComponent, property.key);
    const inputId = `prop-${property.key.replace(/\./g, '-')}`;

    switch (property.type) {
      case 'text':
      case 'url':
        const textCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            {renderPropertyLabel(property, inputId, textCssProp || undefined)}
            <input
              id={inputId}
              type="text"
              class={styles.propertyInput}
              value={currentValue || ''}
              placeholder={property.placeholder}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            {renderInheritedValue(property)}
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'textarea':
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
            </label>
            <textarea
              id={inputId}
              class={styles.propertyTextarea}
              value={currentValue || ''}
              placeholder={property.placeholder}
              rows={4}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'richtext':
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
            </label>
            <RichTextEditor
              initialHtml={currentValue || ''}
              initialEditorState={getNestedValue(props.selectedComponent, 'content.editorState')}
              onChange={(html, editorState, plainText) => {
                // Update all three content properties
                props.onPropertyChange(props.selectedComponent!.id, 'content.html', html);
                props.onPropertyChange(props.selectedComponent!.id, 'content.editorState', editorState);
                props.onPropertyChange(props.selectedComponent!.id, 'content.plainText', plainText);
              }}
              placeholder={property.placeholder || 'Enter text content...'}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'number':
        const numberCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            {renderPropertyLabel(property, inputId, numberCssProp || undefined)}
            <input
              id={inputId}
              type="number"
              class={styles.propertyInput}
              value={currentValue || property.min || 0}
              min={property.min}
              max={property.max}
              onInput={(e) => {
                const numValue = Number(e.currentTarget.value);
                handlePropertyChange(property, isNaN(numValue) ? 0 : numValue);
              }}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            {renderInheritedValue(property)}
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'color':
        const colorCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            {renderPropertyLabel(property, inputId, colorCssProp || undefined)}
            <input
              id={inputId}
              type="color"
              class={styles.propertyColorInput}
              value={currentValue || '#000000'}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <input
              type="text"
              class={styles.propertyInput}
              value={currentValue || '#000000'}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            {renderInheritedValue(property)}
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'select':
        const selectCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            {renderPropertyLabel(property, inputId, selectCssProp || undefined)}
            <select
              id={inputId}
              class={styles.propertySelect}
              value={currentValue}
              onChange={(e) => handlePropertyChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            >
              <For each={property.options}>
                {(option) => (
                  <option value={option.value}>{option.label}</option>
                )}
              </For>
            </select>
            {renderInheritedValue(property)}
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'radio':
        return (
          <div class={styles.propertyField}>
            {renderPropertyLabel(property, inputId)}
            <div class={styles.propertyRadioGroup}>
              <For each={property.options}>
                {(option) => {
                  const radioId = `${inputId}-${option.value}`;
                  return (
                    <label class={styles.propertyRadioLabel}>
                      <input
                        type="radio"
                        id={radioId}
                        name={inputId}
                        value={option.value}
                        checked={currentValue === option.value}
                        onChange={(e) =>
                          handlePropertyChange(property, e.currentTarget.value)
                        }
                        onMouseEnter={() => handlePropertyHover(property)}
                        onMouseLeave={() => handlePropertyUnhover(property)}
                        onFocus={() => handlePropertyEditStart(property)}
                        onBlur={() => handlePropertyEditEnd(property)}
                      />
                      {option.label}
                    </label>
                  );
                }}
              </For>
            </div>
            {renderInheritedValue(property)}
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'cssvalue':
        const cssvalueCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
              <Show when={cssvalueCssProp}>
                <CompatibilityIcon
                  property={cssvalueCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(cssvalueCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <CSSValueInput
              value={(currentValue as CSSValue) || DEFAULT_CSS_VALUE}
              onChange={(value) => handlePropertyChange(property, value)}
              min={property.min ?? null}
              max={property.max ?? null}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'border':
        const borderCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
              <Show when={borderCssProp}>
                <CompatibilityIcon
                  property={borderCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(borderCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <BorderEditor
              value={(currentValue as Border & { radius?: BorderRadius }) || DEFAULT_BORDER}
              onChange={(value: Border & { radius?: BorderRadius }) => handlePropertyChange(property, value)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'spacing':
        const spacingCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
              <Show when={spacingCssProp}>
                <CompatibilityIcon
                  property={spacingCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(spacingCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <SpacingEditor
              value={(currentValue as Spacing) || DEFAULT_SPACING}
              onChange={(value: Spacing) => handlePropertyChange(property, value)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'displaytoggle':
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
            </label>
            <DisplayToggle
              value={currentValue !== undefined ? currentValue : true}
              onChange={(value: boolean) => handlePropertyChange(property, value)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'imageupload':
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>
              {property.label}
            </label>
            <ImageUpload
              value={{
                url: getNestedValue(props.selectedComponent, property.key + '.src') || getNestedValue(props.selectedComponent, property.key + '.url') || '',
                alt: getNestedValue(props.selectedComponent, property.key + '.alt') || ''
              }}
              onChange={(value: ImageData) => {
                if (getNestedValue(props.selectedComponent, property.key + '.src') !== undefined) {
                  props.onPropertyChange(props.selectedComponent!.id, property.key + '.src', value.url || '');
                  props.onPropertyChange(props.selectedComponent!.id, property.key + '.alt', value.alt || '');
                } else {
                  props.onPropertyChange(props.selectedComponent!.id, property.key, value);
                }
              }}
              onUploadStart={() => handlePropertyEditStart(property)}
              onUploadComplete={() => handlePropertyEditEnd(property)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      default:
        return null;
    }
  };

  const renderGeneralStyleEditor = (property: PropertyDefinition) => {
    if (!props.template) return null;

    const currentValue = getNestedValue(props.template, property.key);
    const inputId = `general-${property.key.replace(/\./g, '-')}`;

    switch (property.type) {
      case 'text':
      case 'url':
        const generalTextCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
              <Show when={generalTextCssProp}>
                <CompatibilityIcon
                  property={generalTextCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(generalTextCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <input
              id={inputId}
              type="text"
              class={styles.propertyInput}
              value={currentValue || ''}
              placeholder={property.placeholder}
              onInput={(e) => handleGeneralStyleChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'number':
        const generalNumberCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
              <Show when={generalNumberCssProp}>
                <CompatibilityIcon
                  property={generalNumberCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(generalNumberCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <input
              id={inputId}
              type="number"
              class={styles.propertyInput}
              value={currentValue || property.min || 0}
              min={property.min}
              max={property.max}
              onInput={(e) => {
                const numValue = Number(e.currentTarget.value);
                handleGeneralStyleChange(property, isNaN(numValue) ? 0 : numValue);
              }}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'color':
        const generalColorCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
              <Show when={generalColorCssProp}>
                <CompatibilityIcon
                  property={generalColorCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(generalColorCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <input
              id={inputId}
              type="color"
              class={styles.propertyColorInput}
              value={currentValue || '#000000'}
              onInput={(e) => handleGeneralStyleChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <input
              type="text"
              class={styles.propertyInput}
              value={currentValue || '#000000'}
              onInput={(e) => handleGeneralStyleChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'select':
        const generalSelectCssProp = getCssPropertyName(property.key);
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
              <Show when={generalSelectCssProp}>
                <CompatibilityIcon
                  property={generalSelectCssProp!}
                  size={16}
                  onClick={() => {
                    setSelectedProperty(generalSelectCssProp!);
                    setCompatibilityModalOpen(true);
                  }}
                />
              </Show>
            </label>
            <select
              id={inputId}
              class={styles.propertySelect}
              value={currentValue}
              onChange={(e) => handleGeneralStyleChange(property, e.currentTarget.value)}
              onMouseEnter={() => handlePropertyHover(property)}
              onMouseLeave={() => handlePropertyUnhover(property)}
              onFocus={() => handlePropertyEditStart(property)}
              onBlur={() => handlePropertyEditEnd(property)}
            >
              <For each={property.options}>
                {(option) => (
                  <option value={option.value}>{option.label}</option>
                )}
              </For>
            </select>
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      {...getTestId('panel-properties')}
      {...getTestState({
        hasSelection: !!props.selectedComponent,
        componentType: props.selectedComponent?.type || 'none',
        activeTab: props.selectedComponent ? activeComponentTab() : activeGeneralTab()
      })}
      class={`${styles.propertyPanel} ${props.class || ''}`}
    >
      <Show
        when={props.selectedComponent}
        fallback={
          <>
            <div class={styles.propertyPanelHeader}>
              <h3 class={styles.propertyPanelTitle}>General Settings</h3>
            </div>

            {/* Tab Navigation for General Settings */}
            <div
              {...getTestId('tabs-general')}
              class={styles.tabNavigation}
            >
              <button
                {...getTestId('tab-components')}
                {...getTestAction('switch-tab')}
                class={`${styles.tabButton} ${activeGeneralTab() === 'components' ? styles.tabButtonActive : ''}`}
                onClick={() => setActiveGeneralTab('components')}
                aria-label="Components tab"
                aria-selected={activeGeneralTab() === 'components'}
              >
                Components
              </button>
              <button
                {...getTestId('tab-general-styles')}
                {...getTestAction('switch-tab')}
                class={`${styles.tabButton} ${activeGeneralTab() === 'general-styles' ? styles.tabButtonActive : ''}`}
                onClick={() => setActiveGeneralTab('general-styles')}
                aria-label="General Styles tab"
                aria-selected={activeGeneralTab() === 'general-styles'}
              >
                General Styles
              </button>
            </div>

            <div class={styles.propertyPanelContent}>
              {/* Components Tab */}
              <Show when={activeGeneralTab() === 'components'}>
                <div class={styles.emptyState}>
                  <div class={styles.emptyStateIcon}>📦</div>
                  <h3 class={styles.emptyStateTitle}>Component Palette</h3>
                  <p class={styles.emptyStateText}>
                    Use the left sidebar to drag and drop components onto the canvas
                  </p>
                </div>
              </Show>

              {/* General Styles Tab */}
              <Show when={activeGeneralTab() === 'general-styles'}>
                <Show
                  when={props.template}
                  fallback={
                    <div class={styles.emptyState}>
                      <div class={styles.emptyStateIcon}>⚙️</div>
                      <h3 class={styles.emptyStateTitle}>No Template</h3>
                      <p class={styles.emptyStateText}>
                        Create or load a template to configure general styles
                      </p>
                    </div>
                  }
                >
                  {/* Canvas Dimensions */}
                  <Show when={groupedGeneralStyles().dimensions?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Canvas Dimensions</h4>
                      <For each={groupedGeneralStyles().dimensions || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>

                  {/* Canvas Appearance */}
                  <Show when={groupedGeneralStyles().canvasAppearance?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Canvas Appearance</h4>
                      <For each={groupedGeneralStyles().canvasAppearance || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>

                  {/* Default Components */}
                  <Show when={groupedGeneralStyles().defaultComponents?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Default Component Styles</h4>
                      <For each={groupedGeneralStyles().defaultComponents || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>

                  {/* Typography */}
                  <Show when={groupedGeneralStyles().typography?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Typography</h4>
                      <For each={groupedGeneralStyles().typography || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>

                  {/* Links */}
                  <Show when={groupedGeneralStyles().links?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Default Link Styles</h4>
                      <For each={groupedGeneralStyles().links || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>

                  {/* Buttons */}
                  <Show when={groupedGeneralStyles().buttons?.length > 0}>
                    <div class={styles.propertySection}>
                      <h4 class={styles.propertySectionTitle}>Default Button Styles</h4>
                      <For each={groupedGeneralStyles().buttons || []}>
                        {(property) => renderGeneralStyleEditor(property)}
                      </For>
                    </div>
                  </Show>
                </Show>
              </Show>
            </div>
          </>
        }
      >
        <div class={styles.propertyPanelHeader}>
          <div class={styles.propertyPanelHeaderTop}>
            <h3 class={styles.propertyPanelTitle}>
              {props.selectedComponent?.type} Properties
            </h3>
            <Show when={props.onDelete}>
              <button
                {...getTestId('button-delete-component')}
                {...getTestAction('delete-component')}
                class={styles.deleteButton}
                onClick={() => props.onDelete?.(props.selectedComponent!.id)}
                title="Delete component"
                aria-label="Delete component"
              >
                🗑️
              </button>
            </Show>
          </div>
          <span class={styles.componentId}>ID: {props.selectedComponent?.id}</span>
        </div>

        {/* Tab Navigation */}
        <div
          {...getTestId('tabs-component')}
          class={styles.tabNavigation}
        >
          <button
            {...getTestId('tab-content')}
            {...getTestAction('switch-tab')}
            class={`${styles.tabButton} ${activeComponentTab() === 'content' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveComponentTab('content')}
            aria-label="Content tab"
            aria-selected={activeComponentTab() === 'content'}
          >
            Content
          </button>
          <button
            {...getTestId('tab-style')}
            {...getTestAction('switch-tab')}
            class={`${styles.tabButton} ${activeComponentTab() === 'style' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveComponentTab('style')}
            aria-label="Style tab"
            aria-selected={activeComponentTab() === 'style'}
          >
            Style
          </button>
        </div>

        <div class={styles.propertyPanelContent}>
          {/* Presets Section - Only show in Style tab */}
          <Show when={activeComponentTab() === 'style' && props.presetActions && presets().length > 0}>
            <div
              {...getTestId('section-presets')}
              class={styles.propertySection}
            >
              <h4 class={styles.propertySectionTitle}>Style Presets</h4>

              <div class={styles.presetControls}>
                <div class={styles.presetSelectGroup}>
                  <select
                    {...getTestId('select-preset')}
                    class={styles.propertySelect}
                    value={selectedPresetId()}
                    onChange={(e) => setSelectedPresetId(e.currentTarget.value)}
                    aria-label="Select style preset"
                  >
                    <option value="">Select a preset...</option>
                    <For each={presets()}>
                      {(preset) => (
                        <option value={preset.id}>
                          {preset.name} {preset.isCustom ? '(Custom)' : ''}
                        </option>
                      )}
                    </For>
                  </select>

                  <button
                    {...getTestId('button-apply-preset')}
                    {...getTestAction('apply-preset')}
                    class={styles.presetApplyButton}
                    onClick={handleApplyPreset}
                    disabled={!selectedPresetId()}
                    title="Apply selected preset"
                    aria-label="Apply selected preset"
                  >
                    Apply
                  </button>

                  <button
                    {...getTestId('button-preview-preset')}
                    {...getTestAction('preview-preset')}
                    class={styles.presetPreviewButton}
                    onClick={handlePreviewPreset}
                    disabled={!selectedPresetId()}
                    title="Preview selected preset"
                    aria-label="Preview selected preset"
                  >
                    👁 Preview
                  </button>
                </div>

                <button
                  {...getTestId('button-save-preset')}
                  {...getTestAction('open-save-preset-modal')}
                  class={styles.presetCreateButton}
                  onClick={() => setShowCreatePresetModal(true)}
                  title="Save current styles as preset"
                  aria-label="Save current styles as preset"
                >
                  + Save Preset
                </button>

                <Show when={props.presetActions}>
                  <button
                    {...getTestId('button-manage-presets')}
                    {...getTestAction('open-preset-manager')}
                    class={styles.presetManageButton}
                    onClick={() => setShowPresetManagerModal(true)}
                    title="Manage all presets"
                    aria-label="Manage all presets"
                  >
                    ⚙️ Manage
                  </button>
                </Show>
              </div>

              <Show when={selectedPresetId()}>
                {(() => {
                  const preset = presets().find(p => p.id === selectedPresetId());
                  return preset?.description ? (
                    <p class={styles.presetDescription}>{preset.description}</p>
                  ) : null;
                })()}
              </Show>
            </div>
          </Show>

          {/* Create Preset Modal */}
          <Show when={showCreatePresetModal()}>
            <div class={styles.modalOverlay} onClick={handleCancelCreatePreset}>
              <div class={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div class={styles.modalHeader}>
                  <h3 class={styles.modalTitle}>Save Style Preset</h3>
                  <button
                    class={styles.modalCloseButton}
                    onClick={handleCancelCreatePreset}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                <div class={styles.modalBody}>
                  <div class={styles.propertyField}>
                    <label for="preset-name" class={styles.propertyLabel}>
                      Preset Name *
                    </label>
                    <input
                      id="preset-name"
                      type="text"
                      class={styles.propertyInput}
                      value={newPresetName()}
                      onInput={(e) => setNewPresetName(e.currentTarget.value)}
                      placeholder="e.g., Professional Blue"
                      autofocus
                    />
                  </div>

                  <div class={styles.propertyField}>
                    <label for="preset-description" class={styles.propertyLabel}>
                      Description (Optional)
                    </label>
                    <textarea
                      id="preset-description"
                      class={styles.propertyTextarea}
                      value={newPresetDescription()}
                      onInput={(e) => setNewPresetDescription(e.currentTarget.value)}
                      placeholder="Describe this preset..."
                      rows={3}
                    />
                  </div>
                </div>

                <div class={styles.modalFooter}>
                  <button
                    class={styles.modalCancelButton}
                    onClick={handleCancelCreatePreset}
                  >
                    Cancel
                  </button>
                  <button
                    class={styles.modalSaveButton}
                    onClick={handleCreatePreset}
                    disabled={!newPresetName().trim()}
                  >
                    Save Preset
                  </button>
                </div>
              </div>
            </div>
          </Show>

          {/* Content Section - Only show in Content tab */}
          <Show when={activeComponentTab() === 'content' && groupedProperties().content.length > 0}>
            <div class={styles.propertySection}>
              <h4 class={styles.propertySectionTitle}>Content</h4>
              <For each={groupedProperties().content}>
                {(property) => renderPropertyEditor(property)}
              </For>
            </div>
          </Show>

          {/* Styles Section - Only show in Style tab */}
          <Show when={activeComponentTab() === 'style' && groupedProperties().styles.length > 0}>
            <div class={styles.propertySection}>
              <h4 class={styles.propertySectionTitle}>Styles</h4>
              <For each={groupedProperties().styles}>
                {(property) => renderPropertyEditor(property)}
              </For>
            </div>
          </Show>

          {/* Settings Section */}
          <Show when={groupedProperties().settings.length > 0}>
            <div class={styles.propertySection}>
              <h4 class={styles.propertySectionTitle}>Settings</h4>
              <For each={groupedProperties().settings}>
                {(property) => renderPropertyEditor(property)}
              </For>
            </div>
          </Show>
        </div>

        {/* Mobile Behavior Section - Always visible at bottom */}
        <Show when={props.deviceMode !== undefined && props.onSetVisibility}>
          <div class={styles.mobileBehaviorSection}>
            <h4 class={styles.mobileBehaviorTitle}>
              Mobile Behavior
              <Show when={isMobileMode()}>
                <span class={styles.mobileIndicator} title="Currently editing mobile styles">
                  📱
                </span>
              </Show>
            </h4>

            <div class={styles.visibilityControls}>
              <div class={styles.visibilityRow}>
                <span class={styles.visibilityLabel}>Visible on Desktop</span>
                <label class={styles.visibilityToggle}>
                  <input
                    type="checkbox"
                    checked={props.selectedComponent?.visibility?.desktop ?? true}
                    onChange={(e) => {
                      const desktop = e.currentTarget.checked;
                      const mobile = props.selectedComponent?.visibility?.mobile ?? desktop;
                      props.onSetVisibility!(props.selectedComponent!.id, desktop, mobile);
                    }}
                  />
                  <span class={styles.visibilitySlider} />
                </label>
              </div>

              <div class={styles.visibilityRow}>
                <span class={styles.visibilityLabel}>Visible on Mobile</span>
                <label class={styles.visibilityToggle}>
                  <input
                    type="checkbox"
                    checked={props.selectedComponent?.visibility?.mobile ?? (props.selectedComponent?.visibility?.desktop ?? true)}
                    onChange={(e) => {
                      const mobile = e.currentTarget.checked;
                      const desktop = props.selectedComponent?.visibility?.desktop ?? true;
                      props.onSetVisibility!(props.selectedComponent!.id, desktop, mobile);
                    }}
                  />
                  <span class={styles.visibilitySlider} />
                </label>
              </div>
            </div>

            <Show when={props.selectedComponent?.mobileStyles}>
              <div class={styles.propertyDescription} style={{ "margin-top": "12px" }}>
                This component has mobile style overrides. Properties with 📱 have custom mobile values.
              </div>
            </Show>
          </div>
        </Show>
      </Show>

      {/* Preset Preview Modal */}
      <PresetPreview
        preset={selectedPreset() || null}
        componentType={props.selectedComponent?.type || ''}
        isOpen={showPreviewModal()}
        onClose={() => setShowPreviewModal(false)}
        onApply={handleApplyFromPreview}
      />

      {/* Preset Manager Modal */}
      <Show when={props.presetActions}>
        <PresetManager
          isOpen={showPresetManagerModal()}
          onClose={() => setShowPresetManagerModal(false)}
          presets={presets()}
          componentTypes={componentTypes()}
          onCreatePreset={async (_name: string, _description: string, _componentType: string) => {
            // For now, we can't create a preset from scratch without a component
            // This would need to be implemented differently
            console.warn('Creating preset from scratch not yet implemented');
          }}
          onUpdatePreset={handleUpdatePreset}
          onDeletePreset={handleDeletePreset}
          onDuplicatePreset={handleDuplicatePreset}
          onExportPresets={handleExportPresets}
          onImportPresets={handleImportPresets}
        />
      </Show>

      {/* Compatibility Modal */}
      <CompatibilityModal
        isOpen={compatibilityModalOpen()}
        property={selectedProperty() || ''}
        onClose={() => setCompatibilityModalOpen(false)}
      />
    </div>
  );
};

export default PropertyPanel;
