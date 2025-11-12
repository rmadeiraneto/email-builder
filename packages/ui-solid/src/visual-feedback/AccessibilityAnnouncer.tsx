/**
 * Accessibility Announcer Component
 *
 * Provides ARIA live region for announcing property changes to screen readers.
 * Hidden visually but accessible to assistive technologies.
 *
 * @module visual-feedback
 */

import { Component, createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { visualFeedbackEventBus, type VisualFeedbackEvent } from '@email-builder/core';
import styles from './AccessibilityAnnouncer.module.scss';

export interface AccessibilityAnnouncerProps {
  /** Announcement politeness level */
  politeness?: 'polite' | 'assertive';
}

/**
 * Accessibility Announcer Component
 *
 * Announces property changes to screen readers using ARIA live regions.
 * Automatically debounces rapid changes to avoid overwhelming users.
 * Subscribes to visual feedback events internally to avoid causing parent re-renders.
 */
export const AccessibilityAnnouncer: Component<AccessibilityAnnouncerProps> = (props) => {
  const [announcement, setAnnouncement] = createSignal('');
  const [debounceTimer, setDebounceTimer] = createSignal<NodeJS.Timeout | null>(null);
  const [currentProperty, setCurrentProperty] = createSignal<string | undefined>(undefined);
  const [currentValue, setCurrentValue] = createSignal<any>(undefined);
  const [isEditing, setIsEditing] = createSignal(false);

  // Subscribe to visual feedback events
  onMount(() => {
    const unsubscribeEditStart = visualFeedbackEventBus.on('property:edit:start', (event: VisualFeedbackEvent) => {
      setCurrentProperty(event.propertyPath);
      setCurrentValue(event.currentValue);
      setIsEditing(true);
    });

    const unsubscribeEditEnd = visualFeedbackEventBus.on('property:edit:end', () => {
      setIsEditing(false);
      setCurrentProperty(undefined);
      setCurrentValue(undefined);
    });

    onCleanup(() => {
      unsubscribeEditStart();
      unsubscribeEditEnd();

      // Clear timer on unmount
      const timer = debounceTimer();
      if (timer) {
        clearTimeout(timer);
      }
    });
  });

  // Debounce announcements to avoid overwhelming screen readers
  createEffect(() => {
    if (!isEditing() || !currentProperty()) {
      setAnnouncement('');
      return;
    }

    // Clear existing timer
    const timer = debounceTimer();
    if (timer) {
      clearTimeout(timer);
    }

    // Set new debounced announcement
    const newTimer = setTimeout(() => {
      const formattedProperty = formatPropertyName(currentProperty()!);
      const formattedValue = formatValue(currentValue());
      setAnnouncement(`Editing ${formattedProperty}: ${formattedValue}`);
    }, 500); // 500ms debounce

    setDebounceTimer(newTimer);
  });

  const politeness = () => props.politeness || 'polite';

  return (
    <div
      role="status"
      aria-live={politeness()}
      aria-atomic="true"
      class={styles.announcer}
    >
      {announcement()}
    </div>
  );
};

/**
 * Format property name for screen readers
 */
function formatPropertyName(propertyPath: string): string {
  // Convert camelCase or dot notation to readable format
  // e.g., "styles.padding" -> "padding"
  // e.g., "backgroundColor" -> "background color"

  const parts = propertyPath.split('.');
  const lastPart = parts[parts.length - 1] || propertyPath;

  // Add spaces before capital letters
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();
}

/**
 * Format value for screen readers
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return 'empty';
  }

  if (typeof value === 'boolean') {
    return value ? 'yes' : 'no';
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    // Truncate long strings
    if (value.length > 50) {
      return value.substring(0, 47) + '...';
    }
    return value;
  }

  if (typeof value === 'object') {
    return 'custom value';
  }

  return String(value);
}
