import { Component, Show, For, createMemo } from 'solid-js';
import type {
  PropertyPanelProps,
  PropertyDefinition,
  ComponentPropertyMap,
} from './PropertyPanel.types';
import styles from './PropertyPanel.module.scss';

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
      key: 'styles.borderRadius',
      label: 'Border Radius',
      type: 'number',
      section: 'styles',
      min: 0,
      max: 50,
    },
    {
      key: 'styles.padding',
      label: 'Padding',
      type: 'text',
      section: 'styles',
      placeholder: '12px 24px',
    },
  ],
  text: [
    {
      key: 'content.text',
      label: 'Text Content',
      type: 'textarea',
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
      key: 'content.src',
      label: 'Image URL',
      type: 'url',
      section: 'content',
      placeholder: 'https://example.com/image.jpg',
    },
    {
      key: 'content.alt',
      label: 'Alt Text',
      type: 'text',
      section: 'content',
      placeholder: 'Describe the image',
      description: 'Important for accessibility',
    },
    {
      key: 'styles.width',
      label: 'Width',
      type: 'number',
      section: 'styles',
      min: 0,
      max: 1000,
    },
    {
      key: 'styles.height',
      label: 'Height',
      type: 'number',
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
  ],
  separator: [
    {
      key: 'styles.height',
      label: 'Height',
      type: 'number',
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
      type: 'number',
      section: 'styles',
      min: 0,
      max: 200,
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
 * PropertyPanel component
 * Displays and manages properties of the selected component
 */
export const PropertyPanel: Component<PropertyPanelProps> = (props) => {
  const properties = createMemo(() => {
    if (!props.selectedComponent) return [];
    const componentType = props.selectedComponent.type.toLowerCase();
    return PROPERTY_DEFINITIONS[componentType] || [];
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

  const handlePropertyChange = (property: PropertyDefinition, value: any) => {
    if (!props.selectedComponent) return;

    // Create a copy of the component with updated property
    const updatedComponent = { ...props.selectedComponent };
    setNestedValue(updatedComponent, property.key, value);

    // Call the onChange callback
    props.onPropertyChange(
      props.selectedComponent.id,
      property.key,
      value
    );
  };

  const renderPropertyEditor = (property: PropertyDefinition) => {
    if (!props.selectedComponent) return null;

    const currentValue = getNestedValue(props.selectedComponent, property.key);
    const inputId = `prop-${property.key.replace(/\./g, '-')}`;

    switch (property.type) {
      case 'text':
      case 'url':
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
            </label>
            <input
              id={inputId}
              type="text"
              class={styles.propertyInput}
              value={currentValue || ''}
              placeholder={property.placeholder}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
            />
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
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'number':
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
            </label>
            <input
              id={inputId}
              type="number"
              class={styles.propertyInput}
              value={currentValue || property.min || 0}
              min={property.min}
              max={property.max}
              onInput={(e) =>
                handlePropertyChange(property, parseInt(e.currentTarget.value, 10))
              }
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'color':
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
            </label>
            <input
              id={inputId}
              type="color"
              class={styles.propertyColorInput}
              value={currentValue || '#000000'}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
            />
            <input
              type="text"
              class={styles.propertyInput}
              value={currentValue || '#000000'}
              onInput={(e) => handlePropertyChange(property, e.currentTarget.value)}
            />
            <Show when={property.description}>
              <span class={styles.propertyDescription}>{property.description}</span>
            </Show>
          </div>
        );

      case 'select':
        return (
          <div class={styles.propertyField}>
            <label for={inputId} class={styles.propertyLabel}>
              {property.label}
            </label>
            <select
              id={inputId}
              class={styles.propertySelect}
              value={currentValue}
              onChange={(e) => handlePropertyChange(property, e.currentTarget.value)}
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

      case 'radio':
        return (
          <div class={styles.propertyField}>
            <label class={styles.propertyLabel}>{property.label}</label>
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
                      />
                      {option.label}
                    </label>
                  );
                }}
              </For>
            </div>
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
    <div class={`${styles.propertyPanel} ${props.class || ''}`}>
      <Show
        when={props.selectedComponent}
        fallback={
          <div class={styles.emptyState}>
            <div class={styles.emptyStateIcon}>🎨</div>
            <h3 class={styles.emptyStateTitle}>No Component Selected</h3>
            <p class={styles.emptyStateText}>
              Select a component on the canvas to edit its properties
            </p>
          </div>
        }
      >
        <div class={styles.propertyPanelHeader}>
          <div class={styles.propertyPanelHeaderTop}>
            <h3 class={styles.propertyPanelTitle}>
              {props.selectedComponent?.type} Properties
            </h3>
            <Show when={props.onDelete}>
              <button
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

        <div class={styles.propertyPanelContent}>
          {/* Content Section */}
          <Show when={groupedProperties().content.length > 0}>
            <div class={styles.propertySection}>
              <h4 class={styles.propertySectionTitle}>Content</h4>
              <For each={groupedProperties().content}>
                {(property) => renderPropertyEditor(property)}
              </For>
            </div>
          </Show>

          {/* Styles Section */}
          <Show when={groupedProperties().styles.length > 0}>
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
      </Show>
    </div>
  );
};

export default PropertyPanel;
