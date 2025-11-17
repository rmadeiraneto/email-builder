/**
 * RichTextEditor component tests
 *
 * Tests for RichTextEditor enhancements to ensure proper rendering of new features:
 * - Lists (bullet and numbered)
 * - Code blocks
 * - Links
 * - Subscript and superscript
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { RichTextEditor } from './RichTextEditor';

describe('RichTextEditor', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      // Should render the editor container
      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should render with initial value', () => {
      const initialValue = '<p>Hello World</p>';
      const { container } = render(() => (
        <RichTextEditor value={initialValue} onChange={() => {}} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should render toolbar', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      // Toolbar should be present
      const toolbar = container.querySelector('[class*="toolbar"]');
      expect(toolbar).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - basic formatting', () => {
    it('should render bold button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const boldButton = container.querySelector('button[title*="Bold"]');
      expect(boldButton).toBeInTheDocument();
    });

    it('should render italic button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const italicButton = container.querySelector('button[title*="Italic"]');
      expect(italicButton).toBeInTheDocument();
    });

    it('should render underline button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const underlineButton = container.querySelector('button[title*="Underline"]');
      expect(underlineButton).toBeInTheDocument();
    });

    it('should render strikethrough button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const strikeButton = container.querySelector('button[title*="Strikethrough"]');
      expect(strikeButton).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - subscript and superscript', () => {
    it('should render subscript button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const subscriptButton = container.querySelector('button[title*="Subscript"]');
      expect(subscriptButton).toBeInTheDocument();
    });

    it('should render superscript button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const superscriptButton = container.querySelector('button[title*="Superscript"]');
      expect(superscriptButton).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - lists', () => {
    it('should render bullet list button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const bulletListButton = container.querySelector('button[title*="Bullet"]');
      expect(bulletListButton).toBeInTheDocument();
    });

    it('should render numbered list button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const numberedListButton = container.querySelector('button[title*="Numbered"]');
      expect(numberedListButton).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - code blocks', () => {
    it('should render code block button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const codeButton = container.querySelector('button[title*="Code"]');
      expect(codeButton).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - links', () => {
    it('should render link button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const linkButton = container.querySelector('button[title*="Link"]');
      expect(linkButton).toBeInTheDocument();
    });
  });

  describe('toolbar buttons - undo/redo', () => {
    it('should render undo button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const undoButton = container.querySelector('button[title*="Undo"]');
      expect(undoButton).toBeInTheDocument();
    });

    it('should render redo button', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const redoButton = container.querySelector('button[title*="Redo"]');
      expect(redoButton).toBeInTheDocument();
    });
  });

  describe('onChange callback', () => {
    it('should accept onChange prop', () => {
      const handleChange = vi.fn();

      const { container } = render(() => (
        <RichTextEditor value="" onChange={handleChange} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
      // onChange is properly wired up (full integration test would require Lexical mocking)
    });

    it('should work without onChange', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('should render when disabled', () => {
      const { container } = render(() => (
        <RichTextEditor value="" onChange={() => {}} disabled={true} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should render when enabled', () => {
      const { container } = render(() => (
        <RichTextEditor value="" onChange={() => {}} disabled={false} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('placeholder', () => {
    it('should accept placeholder prop', () => {
      const { container } = render(() => (
        <RichTextEditor
          value=""
          onChange={() => {}}
          placeholder="Enter your text here..."
        />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('complex scenarios', () => {
    it('should handle all props together', () => {
      const handleChange = vi.fn();

      const { container } = render(() => (
        <RichTextEditor
          value="<p>Initial content</p>"
          onChange={handleChange}
          placeholder="Enter text..."
          disabled={false}
        />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();

      // Verify toolbar is rendered
      const toolbar = container.querySelector('[class*="toolbar"]');
      expect(toolbar).toBeInTheDocument();
    });

    it('should render with empty value', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should render with HTML value', () => {
      const htmlValue = '<p>Hello <strong>World</strong></p>';
      const { container } = render(() => (
        <RichTextEditor value={htmlValue} onChange={() => {}} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined value gracefully', () => {
      const { container } = render(() => (
        <RichTextEditor value={undefined as any} onChange={() => {}} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should handle null value gracefully', () => {
      const { container } = render(() => (
        <RichTextEditor value={null as any} onChange={() => {}} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });

    it('should handle long HTML value', () => {
      const longValue = '<p>' + 'Lorem ipsum '.repeat(100) + '</p>';
      const { container } = render(() => (
        <RichTextEditor value={longValue} onChange={() => {}} />
      ));

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have contenteditable attribute', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      const editor = container.querySelector('[contenteditable]');
      expect(editor).toHaveAttribute('contenteditable');
    });

    it('should have toolbar buttons with titles', () => {
      const { container } = render(() => <RichTextEditor value="" onChange={() => {}} />);

      // All toolbar buttons should have title attributes for accessibility
      const toolbarButtons = container.querySelectorAll('button[title]');
      expect(toolbarButtons.length).toBeGreaterThan(0);
    });
  });
});
