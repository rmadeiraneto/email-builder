/**
 * Rich Text Editor Types
 *
 * Type definitions for the Lexical-based rich text editor
 */

/**
 * Rich Text Editor Props
 */
export interface RichTextEditorProps {
  /**
   * Initial HTML content
   */
  initialHtml?: string;

  /**
   * Initial editor state (JSON string from Lexical)
   */
  initialEditorState?: string;

  /**
   * Callback when content changes
   * @param html - HTML representation
   * @param editorState - Lexical editor state (JSON string)
   * @param plainText - Plain text representation
   */
  onChange?: (html: string, editorState: string, plainText: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Additional CSS class
   */
  class?: string;

  /**
   * Disable the editor
   */
  disabled?: boolean;
}

/**
 * Toolbar button types
 */
export type ToolbarButtonType =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'subscript'
  | 'superscript'
  | 'textColor'
  | 'backgroundColor'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bulletList'
  | 'numberedList'
  | 'codeBlock'
  | 'link'
  | 'undo'
  | 'redo';

/**
 * Toolbar button state
 */
export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  textColor: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  blockType: 'paragraph' | 'h1' | 'h2' | 'h3' | 'bullet' | 'number' | 'code';
  canUndo: boolean;
  canRedo: boolean;
  isLink: boolean;
}

/**
 * Link data
 */
export interface LinkData {
  url: string;
  text: string;
  target?: '_blank' | '_self';
}
