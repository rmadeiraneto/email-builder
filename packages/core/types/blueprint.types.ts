/**
 * Template Blueprint System Types
 * Pre-built, customizable layout structures
 */

import type { BaseComponent } from './component.types';
import type { Template } from './template.types';

// ============================================================================
// TEMPLATE BLUEPRINT
// ============================================================================

/**
 * A blueprint is a reusable template structure with customizable slots
 */
export interface TemplateBlueprint {
  id: string;
  name: string;
  description?: string;
  category: BlueprintCategory;
  thumbnail?: string;

  /** Blueprint structure */
  structure: BlueprintSection[];

  /** Customizable slots */
  slots: BlueprintSlot[];

  /** Default configuration */
  defaults: BlueprintDefaults;

  /** Metadata */
  metadata: BlueprintMetadata;
}

export type BlueprintCategory =
  | 'welcome' // Welcome emails
  | 'promotional' // Promotional campaigns
  | 'transactional' // Order confirmations, receipts
  | 'newsletter' // Regular newsletters
  | 'announcement' // Product/feature announcements
  | 'event' // Event invitations
  | 'survey' // Feedback requests
  | 'drip' // Drip campaign emails
  | 'abandoned-cart' // E-commerce cart recovery
  | 'onboarding' // User onboarding sequences
  | 'digest' // Content digests
  | 'notification' // System notifications
  | 'custom';

export interface BlueprintMetadata {
  tags?: string[];
  industry?: string[];
  useCase?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  isPremium?: boolean;
  author?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// BLUEPRINT STRUCTURE
// ============================================================================

/**
 * A section within a blueprint
 */
export interface BlueprintSection {
  id: string;
  name: string;
  description?: string;
  type: SectionType;

  /** Section layout */
  layout: SectionLayout;

  /** Components in this section */
  components: BlueprintComponent[];

  /** Whether this section is required */
  required: boolean;

  /** Whether this section can be duplicated */
  repeatable: boolean;

  /** Slot assignments */
  slots?: string[];

  /** Order in the template */
  order: number;
}

export type SectionType =
  | 'header'
  | 'hero'
  | 'content'
  | 'features'
  | 'testimonial'
  | 'pricing'
  | 'cta'
  | 'footer'
  | 'custom';

export interface SectionLayout {
  type: 'single' | 'columns' | 'grid' | 'custom';
  columns?: number;
  gap?: string;
  alignment?: 'left' | 'center' | 'right';
}

// ============================================================================
// BLUEPRINT COMPONENTS
// ============================================================================

/**
 * A component definition within a blueprint
 */
export interface BlueprintComponent {
  id: string;
  type: string; // Component type
  slotId?: string; // Associated slot
  componentData: Partial<BaseComponent>;
  locked?: boolean; // Cannot be deleted
  editable?: boolean; // Can be edited
  order: number;
}

// ============================================================================
// BLUEPRINT SLOTS
// ============================================================================

/**
 * A customizable slot in the blueprint
 */
export interface BlueprintSlot {
  id: string;
  name: string;
  description?: string;
  type: SlotType;

  /** Allowed component types */
  allowedComponents?: string[];

  /** Default component */
  defaultComponent?: string;

  /** Minimum components required */
  minComponents?: number;

  /** Maximum components allowed */
  maxComponents?: number;

  /** Placeholder content */
  placeholder?: string;
}

export type SlotType =
  | 'logo' // Logo image
  | 'navigation' // Navigation links
  | 'hero-image' // Hero section image
  | 'headline' // Main headline
  | 'subheadline' // Subheadline text
  | 'body-content' // Main body content
  | 'cta-button' // Call to action button
  | 'image' // Generic image
  | 'text' // Generic text
  | 'product-grid' // Product showcase
  | 'feature-list' // Feature list
  | 'testimonial' // Testimonial content
  | 'social-links' // Social media links
  | 'contact-info' // Contact information
  | 'legal-text' // Legal disclaimers
  | 'custom';

// ============================================================================
// BLUEPRINT DEFAULTS
// ============================================================================

export interface BlueprintDefaults {
  /** Default theme to apply */
  themeId?: string;

  /** Default color scheme */
  colorScheme?: 'light' | 'dark' | 'brand';

  /** Default canvas width */
  canvasWidth?: number;

  /** Default spacing */
  spacing?: 'compact' | 'normal' | 'spacious';

  /** Default typography scale */
  typographyScale?: 'small' | 'medium' | 'large';
}

// ============================================================================
// BLUEPRINT INSTANTIATION
// ============================================================================

/**
 * Options for creating a template from a blueprint
 */
export interface BlueprintInstantiationOptions {
  blueprintId: string;
  name: string;

  /** Slot content overrides */
  slotContent?: Record<string, SlotContent>;

  /** Theme override */
  themeId?: string;

  /** Additional customizations */
  customizations?: BlueprintCustomization;
}

export interface SlotContent {
  componentType?: string;
  content?: Record<string, unknown>;
  styles?: Record<string, unknown>;
}

export interface BlueprintCustomization {
  /** Color overrides */
  colors?: Record<string, string>;

  /** Typography overrides */
  typography?: Record<string, unknown>;

  /** Spacing overrides */
  spacing?: Record<string, unknown>;

  /** Custom data */
  custom?: Record<string, unknown>;
}

/**
 * Result of blueprint instantiation
 */
export interface BlueprintInstantiationResult {
  success: boolean;
  template?: Template;
  errors?: BlueprintError[];
}

export interface BlueprintError {
  type: 'missing-slot' | 'invalid-component' | 'validation-failed';
  message: string;
  slotId?: string;
  componentId?: string;
}

// ============================================================================
// BUILT-IN BLUEPRINTS
// ============================================================================

export type BuiltInBlueprint =
  // Welcome & Onboarding
  | 'welcome-simple'
  | 'welcome-featured'
  | 'onboarding-step'
  | 'activation-email'
  // Promotional
  | 'promo-hero'
  | 'promo-grid'
  | 'seasonal-sale'
  | 'product-launch'
  // Transactional
  | 'order-confirmation'
  | 'shipping-notification'
  | 'receipt'
  | 'password-reset'
  // Newsletter
  | 'newsletter-simple'
  | 'newsletter-featured'
  | 'newsletter-digest'
  | 'blog-update'
  // Event
  | 'event-invitation'
  | 'webinar-registration'
  | 'event-reminder'
  // E-commerce
  | 'abandoned-cart'
  | 'product-recommendation'
  | 'back-in-stock'
  | 'review-request'
  // Engagement
  | 'survey-feedback'
  | 'milestone-celebration'
  | 'referral-program'
  | 're-engagement';

export default TemplateBlueprint;
