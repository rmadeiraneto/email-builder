/**
 * Best practices tips database
 *
 * Collection of helpful tips for email design
 *
 * @module tips
 */

import type { Tip } from './tips.types';
import { TipCategory, TipSeverity, TipTrigger } from './tips.types';

/**
 * All available tips
 */
export const TIPS_DATABASE: Tip[] = [
  // Layout Tips
  {
    id: 'layout-use-tables',
    title: 'Use Tables for Layout',
    message:
      'In email mode, use table-based layouts instead of divs with flexbox or grid. Most email clients have limited CSS support and rely on tables for structure.',
    category: TipCategory.LAYOUT,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.STARTUP],
    learnMoreUrl: 'https://www.caniemail.com/search/?s=display',
    dismissible: true,
    showOnce: false,
  },
  {
    id: 'layout-max-width',
    title: 'Keep Email Width 600px or Less',
    message:
      'Most email clients preview panes are narrow. Keep your email width at 600px or less to ensure proper display without horizontal scrolling.',
    category: TipCategory.LAYOUT,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.EXPORT],
    dismissible: true,
    showOnce: false,
  },
  {
    id: 'layout-single-column-mobile',
    title: 'Use Single Column on Mobile',
    message:
      'For mobile devices, use a single-column layout. Multi-column layouts can be difficult to read on small screens.',
    category: TipCategory.LAYOUT,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.litmus.com/blog/mobile-email-design-best-practices',
    dismissible: true,
  },
  {
    id: 'layout-avoid-positioning',
    title: 'Avoid CSS Positioning',
    message:
      'Do not use position: absolute, position: relative, or position: fixed. These properties are not supported in most email clients.',
    category: TipCategory.LAYOUT,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.POOR_COMPATIBILITY],
    learnMoreUrl: 'https://www.caniemail.com/search/?s=position',
    dismissible: true,
  },

  // Typography Tips
  {
    id: 'typography-web-safe-fonts',
    title: 'Use Web-Safe Fonts',
    message:
      'Stick to web-safe fonts like Arial, Helvetica, Times New Roman, Georgia, and Courier. Custom web fonts have limited support in email clients.',
    category: TipCategory.TYPOGRAPHY,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.caniemail.com/search/?s=font-family',
    dismissible: true,
  },
  {
    id: 'typography-font-size',
    title: 'Minimum Font Size 14px',
    message:
      'Use a minimum font size of 14px for body text to ensure readability, especially on mobile devices. 16px is even better.',
    category: TipCategory.TYPOGRAPHY,
    severity: TipSeverity.INFO,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
  {
    id: 'typography-line-height',
    title: 'Adequate Line Height',
    message:
      'Use a line-height of 1.5 or higher for body text to improve readability and create comfortable spacing between lines.',
    category: TipCategory.TYPOGRAPHY,
    severity: TipSeverity.INFO,
    trigger: [TipTrigger.RANDOM],
    dismissible: true,
  },

  // Images Tips
  {
    id: 'images-alt-text',
    title: 'Always Add Alt Text',
    message:
      'Always provide descriptive alt text for images. Many email clients block images by default, and alt text ensures your message is still understandable.',
    category: TipCategory.IMAGES,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.EXPORT],
    learnMoreUrl: 'https://www.litmus.com/blog/the-ultimate-guide-to-email-image-blocking',
    dismissible: false,
  },
  {
    id: 'images-dimensions',
    title: 'Specify Image Dimensions',
    message:
      'Always specify width and height attributes on images to prevent layout shifting when images load or are blocked.',
    category: TipCategory.IMAGES,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
  {
    id: 'images-optimize-size',
    title: 'Optimize Image File Sizes',
    message:
      'Keep image file sizes small (ideally under 1MB total). Large emails may be clipped by Gmail and other providers.',
    category: TipCategory.IMAGES,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EXPORT],
    learnMoreUrl: 'https://www.litmus.com/blog/gmail-clipping',
    dismissible: true,
  },
  {
    id: 'images-background-images',
    title: 'Avoid Background Images',
    message:
      'Background images are not supported in Outlook (Windows). Use solid background colors or consider using VML for Outlook compatibility.',
    category: TipCategory.IMAGES,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.POOR_COMPATIBILITY],
    learnMoreUrl: 'https://www.caniemail.com/search/?s=background-image',
    dismissible: true,
  },

  // Colors Tips
  {
    id: 'colors-hex-codes',
    title: 'Use Full Hex Color Codes',
    message:
      'Always use full 6-digit hex codes (#RRGGBB) instead of shorthand (#RGB). Some email clients do not support shorthand notation.',
    category: TipCategory.COLORS,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
  {
    id: 'colors-contrast',
    title: 'Ensure Good Color Contrast',
    message:
      'Maintain a contrast ratio of at least 4.5:1 between text and background colors for accessibility and readability.',
    category: TipCategory.COLORS,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
    dismissible: true,
  },

  // Links Tips
  {
    id: 'links-descriptive-text',
    title: 'Use Descriptive Link Text',
    message:
      'Avoid generic "click here" links. Use descriptive text that tells users where the link will take them.',
    category: TipCategory.LINKS,
    severity: TipSeverity.INFO,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
  {
    id: 'links-button-size',
    title: 'Make Buttons Touch-Friendly',
    message:
      'Make buttons at least 44x44 pixels for mobile devices to ensure they are easy to tap without errors.',
    category: TipCategory.LINKS,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.litmus.com/blog/mobile-email-design-best-practices',
    dismissible: true,
  },

  // Compatibility Tips
  {
    id: 'compatibility-test-outlook',
    title: 'Always Test in Outlook 2016',
    message:
      'Outlook 2016-2021 (Windows) has the most restrictive CSS support. Testing in Outlook will catch most email client issues.',
    category: TipCategory.COMPATIBILITY,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE, TipTrigger.EXPORT],
    learnMoreUrl: 'https://www.litmus.com/blog/understanding-outlook-2016',
    dismissible: true,
  },
  {
    id: 'compatibility-inline-styles',
    title: 'Use Inline Styles',
    message:
      'Inline styles are more reliable than CSS classes or style tags. Many email clients strip <style> tags from emails.',
    category: TipCategory.COMPATIBILITY,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
  {
    id: 'compatibility-no-javascript',
    title: 'No JavaScript in Emails',
    message:
      'Never use JavaScript in emails. All major email clients block JavaScript for security reasons.',
    category: TipCategory.COMPATIBILITY,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: false,
  },
  {
    id: 'compatibility-no-video',
    title: 'Avoid Embedded Videos',
    message:
      'Most email clients do not support embedded video. Use a thumbnail image that links to a video hosted elsewhere.',
    category: TipCategory.COMPATIBILITY,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.litmus.com/blog/how-to-code-html5-video-background-in-email',
    dismissible: true,
  },

  // Accessibility Tips
  {
    id: 'accessibility-semantic-html',
    title: 'Use Semantic HTML',
    message:
      'Use proper HTML tags like <h1>, <p>, <strong> instead of styling divs to look like headings. This helps screen readers.',
    category: TipCategory.ACCESSIBILITY,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EMAIL_MODE],
    learnMoreUrl: 'https://www.litmus.com/blog/ultimate-guide-to-email-accessibility',
    dismissible: true,
  },
  {
    id: 'accessibility-lang-attribute',
    title: 'Include Language Attribute',
    message:
      'Add a lang attribute to your <html> tag (e.g., lang="en") to help screen readers pronounce content correctly.',
    category: TipCategory.ACCESSIBILITY,
    severity: TipSeverity.INFO,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },

  // Testing Tips
  {
    id: 'testing-multiple-clients',
    title: 'Test Across Email Clients',
    message:
      'Always test your emails in multiple email clients before sending. Use the Test in Email Clients button to check compatibility.',
    category: TipCategory.TESTING,
    severity: TipSeverity.CRITICAL,
    trigger: [TipTrigger.EXPORT],
    dismissible: true,
  },
  {
    id: 'testing-mobile-devices',
    title: 'Test on Real Mobile Devices',
    message:
      'Over 50% of emails are opened on mobile devices. Test on real phones and tablets, not just desktop previews.',
    category: TipCategory.TESTING,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EXPORT],
    learnMoreUrl: 'https://www.litmus.com/blog/mobile-email-design-best-practices',
    dismissible: true,
  },

  // Optimization Tips
  {
    id: 'optimization-total-size',
    title: 'Keep Total Email Size Under 102KB',
    message:
      'Gmail clips emails larger than 102KB. Keep your HTML and CSS under this limit to avoid clipping.',
    category: TipCategory.OPTIMIZATION,
    severity: TipSeverity.WARNING,
    trigger: [TipTrigger.EXPORT],
    learnMoreUrl: 'https://www.litmus.com/blog/gmail-clipping',
    dismissible: true,
  },
  {
    id: 'optimization-preheader-text',
    title: 'Add Preheader Text',
    message:
      'Include preheader text (the text that appears after the subject line in inbox previews) to provide context and improve open rates.',
    category: TipCategory.OPTIMIZATION,
    severity: TipSeverity.INFO,
    trigger: [TipTrigger.EMAIL_MODE],
    dismissible: true,
  },
];

/**
 * Get tip by ID
 */
export function getTipById(id: string): Tip | undefined {
  return TIPS_DATABASE.find((tip) => tip.id === id);
}

/**
 * Get tips by category
 */
export function getTipsByCategory(category: TipCategory): Tip[] {
  return TIPS_DATABASE.filter((tip) => tip.category === category);
}

/**
 * Get tips by trigger
 */
export function getTipsByTrigger(trigger: TipTrigger): Tip[] {
  return TIPS_DATABASE.filter((tip) => tip.trigger.includes(trigger));
}

/**
 * Get tips by severity
 */
export function getTipsBySeverity(severity: TipSeverity): Tip[] {
  return TIPS_DATABASE.filter((tip) => tip.severity === severity);
}

/**
 * Get random tip
 */
export function getRandomTip(excludeIds: string[] = []): Tip | undefined {
  const availableTips = TIPS_DATABASE.filter(
    (tip) => !excludeIds.includes(tip.id) && tip.trigger.includes(TipTrigger.RANDOM)
  );

  if (availableTips.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * availableTips.length);
  return availableTips[randomIndex];
}

/**
 * Search tips by keyword
 */
export function searchTips(keyword: string): Tip[] {
  const lowerKeyword = keyword.toLowerCase();
  return TIPS_DATABASE.filter(
    (tip) =>
      tip.title.toLowerCase().includes(lowerKeyword) ||
      tip.message.toLowerCase().includes(lowerKeyword)
  );
}
