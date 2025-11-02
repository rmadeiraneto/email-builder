/**
 * Preset type definitions
 *
 * Defines the structure for component style presets and their persistence
 */

import type { ComponentPreset, ComponentType } from './component.types';

/**
 * Preset save data (serialized)
 */
export interface PresetSaveData {
  /**
   * Component type this preset belongs to
   */
  componentType: ComponentType;

  /**
   * Preset data
   */
  preset: ComponentPreset;

  /**
   * Save timestamp
   */
  savedAt: number;

  /**
   * Checksum for integrity
   */
  checksum?: string;
}

/**
 * Preset list item (for preset library)
 */
export interface PresetListItem {
  /**
   * Preset ID
   */
  id: string;

  /**
   * Component type this preset belongs to
   */
  componentType: ComponentType;

  /**
   * Preset name
   */
  name: string;

  /**
   * Description
   */
  description?: string | undefined;

  /**
   * Thumbnail
   */
  thumbnail?: string | undefined;

  /**
   * Last modified
   */
  updatedAt: number;

  /**
   * Is custom preset
   */
  isCustom?: boolean | undefined;
}
