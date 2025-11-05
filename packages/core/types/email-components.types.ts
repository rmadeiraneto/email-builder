/**
 * Email component type definitions
 *
 * Specific types for email components (Header, Footer, Hero, List, CTA)
 */

import type { BaseComponent, ComponentType, CSSValue, BaseStyles } from './component.types';
import type { LinkConfig, TextStyles, ImageContent, ButtonContent } from './base-components.types';

// ============================================================================
// HEADER COMPONENT
// ============================================================================

/**
 * Header layout type
 */
export type HeaderLayout = 'image-top' | 'image-left' | 'image-right' | 'logo-center';

/**
 * Navigation link item
 */
export interface NavigationLink {
  /**
   * Link ID
   */
  id: string;

  /**
   * Link text
   */
  text: string;

  /**
   * Link configuration
   */
  link: LinkConfig;

  /**
   * Link icon (optional)
   */
  icon?: string;

  /**
   * Order/position
   */
  order: number;
}

/**
 * Header content
 */
export interface HeaderContent {
  /**
   * Header layout
   */
  layout: HeaderLayout;

  /**
   * Logo/image configuration
   */
  image: ImageContent;

  /**
   * Navigation links
   */
  navigationLinks: NavigationLink[];

  /**
   * Show navigation
   */
  showNavigation: boolean;

  /**
   * Allow additional properties for extensibility
   */
  [key: string]: unknown;
}

/**
 * Header styles
 */
export interface HeaderStyles {
  /**
   * Link styles
   */
  linkStyles?: TextStyles;

  /**
   * Link hover color
   */
  linkHoverColor?: string;

  /**
   * Navigation gap (spacing between links)
   */
  navigationGap?: CSSValue;

  /**
   * Image max width
   */
  imageMaxWidth?: CSSValue;

  /**
   * Image max height
   */
  imageMaxHeight?: CSSValue;
}

/**
 * Header component
 */
export interface HeaderComponent extends BaseComponent<HeaderContent, HeaderStyles & BaseStyles> {
  type: ComponentType.HEADER;
}

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

/**
 * Social media platform
 */
export type SocialPlatform = 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest' | 'custom';

/**
 * Social media link
 */
export interface SocialLink {
  /**
   * Link ID
   */
  id: string;

  /**
   * Platform
   */
  platform: SocialPlatform;

  /**
   * URL
   */
  url: string;

  /**
   * Icon (Remix Icon or custom URL)
   */
  icon: string;

  /**
   * Label (accessibility)
   */
  label: string;

  /**
   * Order/position
   */
  order: number;
}

/**
 * Footer text section
 */
export interface FooterTextSection {
  /**
   * Section ID
   */
  id: string;

  /**
   * HTML content
   */
  html: string;

  /**
   * Plain text fallback
   */
  plainText?: string;

  /**
   * Order/position
   */
  order: number;
}

/**
 * Footer content
 */
export interface FooterContent {
  /**
   * Text sections
   */
  textSections: FooterTextSection[];

  /**
   * Social media links
   */
  socialLinks: SocialLink[];

  /**
   * Show social links
   */
  showSocialLinks: boolean;

  /**
   * Copyright text
   */
  copyrightText?: string;

  /**
   * Allow additional properties for extensibility
   */
  [key: string]: unknown;
}

/**
 * Footer styles
 */
export interface FooterStyles {
  /**
   * Text styles
   */
  textStyles?: TextStyles;

  /**
   * Social icon size
   */
  socialIconSize?: CSSValue;

  /**
   * Social icon gap
   */
  socialIconGap?: CSSValue;

  /**
   * Social icon color
   */
  socialIconColor?: string;

  /**
   * Social icon hover color
   */
  socialIconHoverColor?: string;

  /**
   * Section gap
   */
  sectionGap?: CSSValue;
}

/**
 * Footer component
 */
export interface FooterComponent extends BaseComponent<FooterContent, FooterStyles & BaseStyles> {
  type: ComponentType.FOOTER;
}

// ============================================================================
// HERO COMPONENT
// ============================================================================

/**
 * Hero layout type
 */
export type HeroLayout = 'image-background' | 'image-left' | 'image-right' | 'image-top';

/**
 * Hero content
 */
export interface HeroContent {
  /**
   * Layout
   */
  layout: HeroLayout;

  /**
   * Hero image
   */
  image: ImageContent;

  /**
   * Heading text
   */
  heading: {
    html: string;
    plainText?: string;
  };

  /**
   * Subheading/description text
   */
  description?: {
    html: string;
    plainText?: string;
  };

  /**
   * Call-to-action button
   */
  button?: ButtonContent;

  /**
   * Show button
   */
  showButton: boolean;

  /**
   * Allow additional properties for extensibility
   */
  [key: string]: unknown;
}

/**
 * Hero styles
 */
export interface HeroStyles {
  /**
   * Heading styles
   */
  headingStyles?: TextStyles;

  /**
   * Description styles
   */
  descriptionStyles?: TextStyles;

  /**
   * Content max width
   */
  contentMaxWidth?: CSSValue;

  /**
   * Content alignment
   */
  contentAlign?: 'left' | 'center' | 'right';

  /**
   * Overlay color (for image background)
   */
  overlayColor?: string;

  /**
   * Overlay opacity
   */
  overlayOpacity?: number;
}

/**
 * Hero component
 */
export interface HeroComponent extends BaseComponent<HeroContent, HeroStyles & BaseStyles> {
  type: ComponentType.HERO;
}

// ============================================================================
// LIST COMPONENT
// ============================================================================

/**
 * List orientation
 */
export type ListOrientation = 'vertical' | 'horizontal';

/**
 * List item layout
 */
export type ListItemLayout = 'image-top' | 'image-left' | 'image-right' | 'image-background';

/**
 * List item
 */
export interface ListItem {
  /**
   * Item ID
   */
  id: string;

  /**
   * Item image
   */
  image?: ImageContent;

  /**
   * Item title
   */
  title: {
    html: string;
    plainText?: string;
  };

  /**
   * Item description
   */
  description?: {
    html: string;
    plainText?: string;
  };

  /**
   * Item button
   */
  button?: ButtonContent;

  /**
   * Show image
   */
  showImage: boolean;

  /**
   * Show button
   */
  showButton: boolean;

  /**
   * Order/position
   */
  order: number;
}

/**
 * List content
 */
export interface ListContent {
  /**
   * List orientation
   */
  orientation: ListOrientation;

  /**
   * List item layout
   */
  itemLayout: ListItemLayout;

  /**
   * List items
   */
  items: ListItem[];

  /**
   * Columns (for horizontal layout)
   */
  columns?: number;

  /**
   * Allow additional properties for extensibility
   */
  [key: string]: unknown;
}

/**
 * List styles
 */
export interface ListStyles {
  /**
   * Item gap
   */
  itemGap?: CSSValue;

  /**
   * Title styles
   */
  titleStyles?: TextStyles;

  /**
   * Description styles
   */
  descriptionStyles?: TextStyles;

  /**
   * Item background color
   */
  itemBackgroundColor?: string;

  /**
   * Item border
   */
  itemBorder?: string;

  /**
   * Item padding
   */
  itemPadding?: CSSValue;

  /**
   * Image max width
   */
  imageMaxWidth?: CSSValue;

  /**
   * Image max height
   */
  imageMaxHeight?: CSSValue;
}

/**
 * List component
 */
export interface ListComponent extends BaseComponent<ListContent, ListStyles & BaseStyles> {
  type: ComponentType.LIST;
}

// ============================================================================
// CALL TO ACTION COMPONENT
// ============================================================================

/**
 * CTA layout type
 */
export type CTALayout = 'centered' | 'left-aligned' | 'right-aligned' | 'two-column';

/**
 * CTA content
 */
export interface CTAContent {
  /**
   * Layout
   */
  layout: CTALayout;

  /**
   * Heading text
   */
  heading: {
    html: string;
    plainText?: string;
  };

  /**
   * Description text
   */
  description?: {
    html: string;
    plainText?: string;
  };

  /**
   * Primary button
   */
  primaryButton: ButtonContent;

  /**
   * Secondary button (optional)
   */
  secondaryButton?: ButtonContent;

  /**
   * Show secondary button
   */
  showSecondaryButton: boolean;

  /**
   * Show description
   */
  showDescription: boolean;

  /**
   * Allow additional properties for extensibility
   */
  [key: string]: unknown;
}

/**
 * CTA styles
 */
export interface CTAStyles {
  /**
   * Heading styles
   */
  headingStyles?: TextStyles;

  /**
   * Description styles
   */
  descriptionStyles?: TextStyles;

  /**
   * Button gap
   */
  buttonGap?: CSSValue;

  /**
   * Content max width
   */
  contentMaxWidth?: CSSValue;
}

/**
 * CTA component
 */
export interface CTAComponent extends BaseComponent<CTAContent, CTAStyles & BaseStyles> {
  type: ComponentType.CALL_TO_ACTION;
}

// ============================================================================
// UNION TYPE
// ============================================================================

/**
 * Union of all email component types
 */
export type AnyEmailComponent =
  | HeaderComponent
  | FooterComponent
  | HeroComponent
  | ListComponent
  | CTAComponent;
