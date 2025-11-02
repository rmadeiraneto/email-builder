import type { BaseComponent, ComponentPreset, ComponentType } from '@email-builder/core';

/**
 * Property Panel Props
 */
export interface PropertyPanelProps {
  /**
   * The currently selected component to edit
   */
  selectedComponent: BaseComponent | null;

  /**
   * Callback when a property value changes
   */
  onPropertyChange: (componentId: string, property: string, value: any) => void;

  /**
   * Callback when the delete button is clicked
   */
  onDelete?: (componentId: string) => void;

  /**
   * Optional CSS class names
   */
  class?: string;

  /**
   * Preset actions
   */
  presetActions?: {
    applyPreset: (componentId: string, presetId: string) => Promise<void>;
    createPreset: (componentId: string, name: string, description?: string) => Promise<ComponentPreset | undefined>;
    updatePreset: (componentType: ComponentType, presetId: string, updates: { name?: string; description?: string; styles?: any }) => Promise<void>;
    deletePreset: (componentType: ComponentType, presetId: string) => Promise<void>;
    duplicatePreset: (componentType: ComponentType, presetId: string, newName?: string) => Promise<ComponentPreset | undefined>;
    listPresets: (componentType?: ComponentType) => Promise<ComponentPreset[]>;
    exportPresets: () => Promise<void>;
    importPresets: (file: File) => Promise<void>;
  };
}

/**
 * Property editor types
 */
export type PropertyEditorType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'color'
  | 'select'
  | 'radio'
  | 'url';

/**
 * Property definition for rendering editors
 */
export interface PropertyDefinition {
  /**
   * Property key in the component
   */
  key: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Editor type to use
   */
  type: PropertyEditorType;

  /**
   * Section this property belongs to (content, styles, etc.)
   */
  section: 'content' | 'styles' | 'settings';

  /**
   * Options for select/radio editors
   */
  options?: Array<{ label: string; value: string | number }>;

  /**
   * Min value for number inputs
   */
  min?: number;

  /**
   * Max value for number inputs
   */
  max?: number;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Help text or description
   */
  description?: string;
}

/**
 * Component type to property definitions mapping
 */
export type ComponentPropertyMap = {
  [componentType: string]: PropertyDefinition[];
};
