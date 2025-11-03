/**
 * Rich Text Editor Component
 *
 * Lexical-based rich text editor integrated with SolidJS
 */

import { Component, onMount, onCleanup, createSignal } from 'solid-js';
import {
  createEditor,
  $getRoot,
  $getSelection,
  $createParagraphNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  type LexicalEditor,
  type ElementFormatType,
  $isRangeSelection,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { registerRichText } from '@lexical/rich-text';
import { HeadingNode, QuoteNode, $createHeadingNode } from '@lexical/rich-text';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListNode, ListItemNode } from '@lexical/list';
import { registerHistory, createEmptyHistoryState } from '@lexical/history';
import type { RichTextEditorProps, ToolbarState } from './RichTextEditor.types';
import styles from './RichTextEditor.module.scss';

/**
 * Rich Text Editor Component
 *
 * Features:
 * - Bold, Italic, Underline, Strikethrough
 * - Text alignment (left, center, right, justify)
 * - Heading styles (H1, H2, H3, Paragraph)
 * - Link insertion/editing
 * - Undo/Redo
 */
export const RichTextEditor: Component<RichTextEditorProps> = (props) => {
  let editorRef: HTMLDivElement | undefined;
  let editor: LexicalEditor | null = null;

  const [toolbarState, setToolbarState] = createSignal<ToolbarState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    textAlign: 'left',
    blockType: 'paragraph',
    canUndo: false,
    canRedo: false,
    isLink: false,
  });

  onMount(() => {
    if (!editorRef) return;

    // Create Lexical editor instance
    editor = createEditor({
      namespace: 'RichTextEditor',
      theme: {
        paragraph: styles.editorParagraph || '',
        heading: {
          h1: styles.editorH1 || '',
          h2: styles.editorH2 || '',
          h3: styles.editorH3 || '',
        },
        text: {
          bold: styles.editorBold || '',
          italic: styles.editorItalic || '',
          underline: styles.editorUnderline || '',
          strikethrough: styles.editorStrikethrough || '',
        },
        link: styles.editorLink || '',
      },
      nodes: [HeadingNode, QuoteNode, LinkNode, AutoLinkNode, ListNode, ListItemNode],
      onError: (error: Error) => {
        console.error('Lexical Editor Error:', error);
      },
    });

    // Set the editor's root element
    editor.setRootElement(editorRef);

    // Register rich text editing capabilities
    const removeRichText = registerRichText(editor);

    // Register history (undo/redo)
    const removeHistory = registerHistory(editor, createEmptyHistoryState(), 1000);

    // Initialize with content if provided
    if (props.initialEditorState) {
      try {
        const state = editor.parseEditorState(props.initialEditorState);
        editor.setEditorState(state);
      } catch (error) {
        console.error('Failed to parse initial editor state:', error);
      }
    } else if (props.initialHtml && editor) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(props.initialHtml || '', 'text/html');
        const nodes = $generateNodesFromDOM(editor!, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
    }

    // Register commands for undo/redo state
    const removeUndoListener = editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setToolbarState((prev) => ({ ...prev, canUndo: payload }));
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const removeRedoListener = editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setToolbarState((prev) => ({ ...prev, canRedo: payload }));
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    // Listen for content changes
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }: { editorState: any }) => {
        editorState.read(() => {
          // Generate HTML
          const html = $generateHtmlFromNodes(editor!);

          // Generate plain text
          const root = $getRoot();
          const plainText = root.getTextContent();

          // Get editor state as JSON string
          const editorStateJSON = JSON.stringify(editorState.toJSON());

          // Call onChange callback
          if (props.onChange) {
            props.onChange(html, editorStateJSON, plainText);
          }

          // Update toolbar state
          updateToolbarState();
        });
      }
    );

    onCleanup(() => {
      removeRichText();
      removeHistory();
      removeUndoListener();
      removeRedoListener();
      removeUpdateListener();
      if (editor) {
        editor.setRootElement(null);
      }
    });
  });

  // Update toolbar state based on current selection
  const updateToolbarState = () => {
    if (!editor) return;

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!selection || !$isRangeSelection(selection)) return;

      setToolbarState((prev) => ({
        ...prev,
        isBold: selection.hasFormat('bold'),
        isItalic: selection.hasFormat('italic'),
        isUnderline: selection.hasFormat('underline'),
        isStrikethrough: selection.hasFormat('strikethrough'),
      }));
    });
  };

  // Format commands
  const formatBold = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatStrikethrough = () => {
    editor?.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  };

  const undo = () => {
    editor?.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor?.dispatchCommand(REDO_COMMAND, undefined);
  };

  // Alignment commands
  const formatAlign = (alignment: ElementFormatType) => {
    editor?.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
  };

  // Block type commands
  const formatBlockType = (blockType: 'paragraph' | 'h1' | 'h2' | 'h3') => {
    if (!editor) return;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      if (blockType === 'paragraph') {
        const paragraphNode = $createParagraphNode();
        selection.insertNodes([paragraphNode]);
      } else {
        const headingNode = $createHeadingNode(blockType);
        selection.insertNodes([headingNode]);
      }
    });
  };

  return (
    <div class={`${styles.richTextEditor} ${props.class || ''}`}>
      {/* Toolbar */}
      <div class={styles.toolbar}>
        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().isBold ? styles.active : ''}`}
            onClick={formatBold}
            title="Bold (Ctrl+B)"
            disabled={props.disabled}
          >
            <i class="ri-bold" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().isItalic ? styles.active : ''}`}
            onClick={formatItalic}
            title="Italic (Ctrl+I)"
            disabled={props.disabled}
          >
            <i class="ri-italic" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().isUnderline ? styles.active : ''}`}
            onClick={formatUnderline}
            title="Underline (Ctrl+U)"
            disabled={props.disabled}
          >
            <i class="ri-underline" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().isStrikethrough ? styles.active : ''}`}
            onClick={formatStrikethrough}
            title="Strikethrough"
            disabled={props.disabled}
          >
            <i class="ri-strikethrough" />
          </button>
        </div>

        <div class={styles.toolbarDivider} />

        {/* Alignment */}
        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().textAlign === 'left' ? styles.active : ''}`}
            onClick={() => formatAlign('left')}
            title="Align Left"
            disabled={props.disabled}
          >
            <i class="ri-align-left" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().textAlign === 'center' ? styles.active : ''}`}
            onClick={() => formatAlign('center')}
            title="Align Center"
            disabled={props.disabled}
          >
            <i class="ri-align-center" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().textAlign === 'right' ? styles.active : ''}`}
            onClick={() => formatAlign('right')}
            title="Align Right"
            disabled={props.disabled}
          >
            <i class="ri-align-right" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().textAlign === 'justify' ? styles.active : ''}`}
            onClick={() => formatAlign('justify')}
            title="Align Justify"
            disabled={props.disabled}
          >
            <i class="ri-align-justify" />
          </button>
        </div>

        <div class={styles.toolbarDivider} />

        {/* Block Type */}
        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().blockType === 'paragraph' ? styles.active : ''}`}
            onClick={() => formatBlockType('paragraph')}
            title="Paragraph"
            disabled={props.disabled}
          >
            <i class="ri-paragraph" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().blockType === 'h1' ? styles.active : ''}`}
            onClick={() => formatBlockType('h1')}
            title="Heading 1"
            disabled={props.disabled}
          >
            <i class="ri-h-1" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().blockType === 'h2' ? styles.active : ''}`}
            onClick={() => formatBlockType('h2')}
            title="Heading 2"
            disabled={props.disabled}
          >
            <i class="ri-h-2" />
          </button>
          <button
            type="button"
            class={`${styles.toolbarButton} ${toolbarState().blockType === 'h3' ? styles.active : ''}`}
            onClick={() => formatBlockType('h3')}
            title="Heading 3"
            disabled={props.disabled}
          >
            <i class="ri-h-3" />
          </button>
        </div>

        <div class={styles.toolbarDivider} />

        {/* Undo/Redo */}
        <div class={styles.toolbarGroup}>
          <button
            type="button"
            class={styles.toolbarButton}
            onClick={undo}
            title="Undo (Ctrl+Z)"
            disabled={props.disabled || !toolbarState().canUndo}
          >
            <i class="ri-arrow-go-back-line" />
          </button>
          <button
            type="button"
            class={styles.toolbarButton}
            onClick={redo}
            title="Redo (Ctrl+Y)"
            disabled={props.disabled || !toolbarState().canRedo}
          >
            <i class="ri-arrow-go-forward-line" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        class={styles.editorContainer}
        contentEditable={!props.disabled}
        data-placeholder={props.placeholder || 'Enter text here...'}
      />
    </div>
  );
};
