/**
 * Preview Modal Types
 */

import type { Template } from '@email-builder/core';

export type PreviewMode = 'web' | 'mobile' | 'email';

export interface PreviewModalProps {
  isOpen: boolean;
  template: Template | null;
  onClose: () => void;
}

export interface ViewportDimensions {
  width: number;
  height: number;
  label: string;
}

export const VIEWPORT_DIMENSIONS: Record<PreviewMode, ViewportDimensions> = {
  web: {
    width: 1200,
    height: 800,
    label: 'Desktop (1200px)',
  },
  mobile: {
    width: 375,
    height: 667,
    label: 'Mobile (375px)',
  },
  email: {
    width: 600,
    height: 800,
    label: 'Email Client (600px)',
  },
};
