/**
 * EditableField component (SolidJS)
 *
 * A field that can switch between view and edit modes.
 *
 * @example
 * ```tsx
 * <EditableField
 *   value="My Title"
 *   onSave={(value) => console.log('Saved:', value)}
 *   onDiscard={() => console.log('Discarded')}
 * />
 * ```
 */

import { Component, Show, createSignal, mergeProps, splitProps } from 'solid-js';
import { classNames } from '../../utils';
import styles from '@email-builder/ui-components/src/molecules/EditableField/editable-field.module.scss';

/**
 * SolidJS EditableField props
 */
export interface EditableFieldProps {
  /**
   * Initial value
   */
  value?: string;

  /**
   * Whether to start in edit mode
   */
  startEditing?: boolean;

  /**
   * Whether to show an edit button in view mode
   */
  showEditButton?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback when save button is clicked
   */
  onSave?: (value: string) => void;

  /**
   * Callback when discard button is clicked
   */
  onDiscard?: () => void;

  /**
   * Callback when edit mode is entered
   */
  onEdit?: () => void;

  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<EditableFieldProps> = {
  value: '',
  startEditing: false,
  showEditButton: false,
};

/**
 * SolidJS EditableField Component
 */
export const EditableField: Component<EditableFieldProps> = (props) => {
  const merged = mergeProps(defaultProps, props);
  const [local] = splitProps(merged, [
    'value',
    'startEditing',
    'showEditButton',
    'class',
    'onSave',
    'onDiscard',
    'onEdit',
    'onInputChange',
  ]);

  const [editMode, setEditMode] = createSignal(local.startEditing!);
  const [currentValue, setCurrentValue] = createSignal(local.value!);
  const [editValue, setEditValue] = createSignal(local.value!);

  /**
   * Enter edit mode
   */
  const handleEdit = () => {
    setEditValue(currentValue());
    setEditMode(true);
    local.onEdit?.();
  };

  /**
   * Save changes
   */
  const handleSave = () => {
    setCurrentValue(editValue());
    setEditMode(false);
    local.onSave?.(editValue());
  };

  /**
   * Discard changes
   */
  const handleDiscard = () => {
    setEditValue(currentValue());
    setEditMode(false);
    local.onDiscard?.();
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setEditValue(value);
    local.onInputChange?.(value);
  };

  /**
   * Get root classes
   */
  const getRootClasses = () => {
    return classNames(
      styles['editable-field'],
      editMode() && styles['editable-field--editing'],
      local.class
    );
  };

  return (
    <div class={getRootClasses()}>
      <Show
        when={editMode()}
        fallback={
          <div class={styles['editable-field__view']}>
            <span
              class={styles['editable-field__label']}
              onClick={!local.showEditButton ? handleEdit : undefined}
            >
              {currentValue()}
            </span>

            <Show when={local.showEditButton}>
              <button
                type="button"
                class={styles['editable-field__button']}
                onClick={handleEdit}
                aria-label="Edit"
              >
                <i class="ri-edit-line" />
              </button>
            </Show>
          </div>
        }
      >
        <div class={styles['editable-field__edit']}>
          <input
            type="text"
            class={styles['editable-field__input']}
            value={editValue()}
            onInput={handleInputChange}
          />

          <div class={styles['editable-field__actions']}>
            <button
              type="button"
              class={classNames(
                styles['editable-field__button'],
                styles['editable-field__button--save']
              )}
              onClick={handleSave}
              aria-label="Save"
            >
              <i class="ri-check-line" />
            </button>

            <button
              type="button"
              class={classNames(
                styles['editable-field__button'],
                styles['editable-field__button--discard']
              )}
              onClick={handleDiscard}
              aria-label="Discard"
            >
              <i class="ri-close-line" />
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
};
