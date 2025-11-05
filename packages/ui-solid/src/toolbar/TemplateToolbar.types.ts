/**
 * Template Toolbar Types
 */

export interface TemplateToolbarProps {
  /**
   * Whether a template is currently loaded
   */
  hasTemplate?: boolean;

  /**
   * Whether undo is available
   */
  canUndo?: boolean;

  /**
   * Whether redo is available
   */
  canRedo?: boolean;

  /**
   * Current template name (displayed in toolbar)
   */
  templateName?: string;

  /**
   * Callback when New Template button is clicked
   */
  onNewTemplate?: () => void;

  /**
   * Callback when Save Template button is clicked
   */
  onSaveTemplate?: () => void;

  /**
   * Callback when Load Template button is clicked
   */
  onLoadTemplate?: () => void;

  /**
   * Callback when Undo button is clicked
   */
  onUndo?: () => void;

  /**
   * Callback when Redo button is clicked
   */
  onRedo?: () => void;

  /**
   * Callback when Export button is clicked
   */
  onExport?: () => void;

  /**
   * Callback when Preview button is clicked
   */
  onPreview?: () => void;

  /**
   * Callback when Test in Email Clients button is clicked
   */
  onTestEmailClients?: () => void;

  /**
   * Callback when Email Testing Settings button is clicked
   */
  onEmailTestingSettings?: () => void;

  /**
   * Callback when Check Compatibility button is clicked
   */
  onCheckCompatibility?: () => void;
}
