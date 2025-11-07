/**
 * Preview Modal Types
 */

import type { Template, DeviceType } from '@email-builder/core';

/**
 * Preview mode type
 * - 'responsive': Shows template with responsive device simulation
 * - 'email': Shows email client preview
 */
export type PreviewMode = 'responsive' | 'email';

/**
 * Preview modal props
 */
export interface PreviewModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;

  /**
   * Template to preview
   */
  template: Template | null;

  /**
   * Callback when modal closes
   */
  onClose: () => void;

  /**
   * Initial preview mode
   * @default 'responsive'
   */
  initialMode?: PreviewMode;

  /**
   * Initial device for responsive mode
   * @default DeviceType.DESKTOP
   */
  initialDevice?: DeviceType;
}

/**
 * Viewport dimensions for preview
 */
export interface ViewportDimensions {
  width: number;
  height: number;
  label: string;
}

/**
 * Email preview viewport (standard email client width)
 */
export const EMAIL_VIEWPORT: ViewportDimensions = {
  width: 600,
  height: 800,
  label: 'Email Client (600px)',
};
