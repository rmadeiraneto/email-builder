/**
 * Canvas Settings Types
 */

import type { Template } from '@email-builder/core';

export interface CanvasSettingsProps {
  template: Template | null;
  onSettingChange: (path: string, value: any) => void;
  class?: string;
}

export interface CanvasSettingDefinition {
  key: string;
  label: string;
  type: 'number' | 'color' | 'text';
  section: 'dimensions' | 'appearance';
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
  unit?: string;
}
