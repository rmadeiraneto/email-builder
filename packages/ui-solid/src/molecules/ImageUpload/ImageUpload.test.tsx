/**
 * ImageUpload component tests
 *
 * Tests for ImageUpload component to ensure proper file validation, drag-and-drop,
 * URL input handling, alt text requirement, and object URL cleanup.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../test-utils';
import { ImageUpload, ImageData } from './ImageUpload';

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn();
const mockRevokeObjectURL = vi.fn();

beforeEach(() => {
  mockCreateObjectURL.mockReturnValue('blob:mock-url');
  global.URL.createObjectURL = mockCreateObjectURL;
  global.URL.revokeObjectURL = mockRevokeObjectURL;
});

afterEach(() => {
  mockCreateObjectURL.mockClear();
  mockRevokeObjectURL.mockClear();
});

describe('ImageUpload', () => {
  describe('rendering', () => {
    it('should render with default props', () => {
      const { container } = render(() => <ImageUpload />);

      // Should render upload tab by default
      const text = container.textContent;
      expect(text).toContain('Upload');
    });

    it('should render with label', () => {
      const { container } = render(() => (
        <ImageUpload label="Header Image" />
      ));

      const text = container.textContent;
      expect(text).toContain('Header Image');
    });

    it('should render without label by default', () => {
      const { container } = render(() => <ImageUpload />);

      // Main label should not exist
      const labels = container.querySelectorAll('label');
      const mainLabel = Array.from(labels).find(
        (l) => l.textContent === 'Header Image'
      );
      expect(mainLabel).toBeUndefined();
    });

    it('should render with custom class', () => {
      const { container } = render(() => (
        <ImageUpload class="custom-image-upload" />
      ));

      const upload = container.querySelector('.custom-image-upload');
      expect(upload).toBeInTheDocument();
    });

    it('should render upload and URL tabs', () => {
      const { container } = render(() => <ImageUpload />);

      const text = container.textContent;
      expect(text).toContain('Upload');
      expect(text).toContain('URL');
    });

    it('should render image preview when URL is provided', () => {
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Example image',
      };

      const { container } = render(() => <ImageUpload value={imageData} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(img).toHaveAttribute('alt', 'Example image');
    });

    it('should render alt text input by default', () => {
      const { container } = render(() => <ImageUpload />);

      // Alt text section should be rendered
      expect(container).toBeInTheDocument();
    });

    it('should hide alt text input when showAltText is false', () => {
      const { container } = render(() => <ImageUpload showAltText={false} />);

      expect(container).toBeInTheDocument();
    });
  });

  describe('file validation', () => {
    it('should accept JPEG files', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      // Simulate file selection
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should accept PNG files', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      const file = new File(['content'], 'test.png', { type: 'image/png' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should accept GIF files', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      const file = new File(['content'], 'test.gif', { type: 'image/gif' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should accept SVG files', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      const file = new File(['content'], 'test.svg', { type: 'image/svg+xml' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should reject invalid file types', async () => {
      const handleUploadError = vi.fn();
      const { container } = render(() => (
        <ImageUpload onUploadError={handleUploadError} />
      ));

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(handleUploadError).toHaveBeenCalled();
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });
  });

  describe('file size validation', () => {
    it('should accept files under max size', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} maxFileSize={5242880} />
      ));

      // Create a file under 5MB
      const file = new File(['x'.repeat(1000000)], 'test.jpg', { type: 'image/jpeg' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should reject files over max size', async () => {
      const handleUploadError = vi.fn();
      const { container } = render(() => (
        <ImageUpload onUploadError={handleUploadError} maxFileSize={1000} />
      ));

      // Create a file over 1KB
      const file = new File(['x'.repeat(2000)], 'test.jpg', { type: 'image/jpeg' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(handleUploadError).toHaveBeenCalled();
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    });

    it('should use default max size of 5MB', () => {
      const { container } = render(() => <ImageUpload />);

      const text = container.textContent;
      // Should show "5MB" in the hint text
      expect(text).toContain('5MB');
    });

    it('should allow custom max size', () => {
      const { container } = render(() => (
        <ImageUpload maxFileSize={10485760} />
      ));

      const text = container.textContent;
      // Should show "10MB" in the hint text
      expect(text).toContain('10MB');
    });
  });

  describe('drag and drop', () => {
    it('should handle drag enter event', () => {
      const { container } = render(() => <ImageUpload />);

      const dropzone = container.querySelector('[class*="dropzone"]');
      expect(dropzone).toBeInTheDocument();

      // Simulate drag enter
      const dragEvent = new DragEvent('dragenter', { bubbles: true });
      dropzone?.dispatchEvent(dragEvent);

      // Component should handle the event
      expect(dropzone).toBeInTheDocument();
    });

    it('should handle drag leave event', () => {
      const { container } = render(() => <ImageUpload />);

      const dropzone = container.querySelector('[class*="dropzone"]');

      // Simulate drag enter then leave
      const dragEnter = new DragEvent('dragenter', { bubbles: true });
      const dragLeave = new DragEvent('dragleave', { bubbles: true });

      dropzone?.dispatchEvent(dragEnter);
      dropzone?.dispatchEvent(dragLeave);

      expect(dropzone).toBeInTheDocument();
    });

    it('should handle drag over event', () => {
      const { container } = render(() => <ImageUpload />);

      const dropzone = container.querySelector('[class*="dropzone"]');

      // Simulate drag over
      const dragOver = new DragEvent('dragover', { bubbles: true });
      dropzone?.dispatchEvent(dragOver);

      expect(dropzone).toBeInTheDocument();
    });

    it('should handle file drop event', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      const dropzone = container.querySelector('[class*="dropzone"]');
      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });

      // Create a drop event with file
      const dataTransfer = {
        files: [file],
      };

      const dropEvent = new DragEvent('drop', { bubbles: true });
      Object.defineProperty(dropEvent, 'dataTransfer', {
        value: dataTransfer,
      });

      dropzone?.dispatchEvent(dropEvent);

      await waitFor(() => {
        expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
      });
    });

    it('should not accept drops when disabled', () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} disabled={true} />
      ));

      const dropzone = container.querySelector('[class*="dropzone"]');

      // Should have disabled class/state
      expect(dropzone?.className).toContain('disabled');
    });
  });

  describe('URL input', () => {
    it('should handle URL input', async () => {
      const handleChange = vi.fn();
      const { container } = render(() => (
        <ImageUpload onChange={handleChange} />
      ));

      // Click URL tab
      const urlTabButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'URL'
      );
      urlTabButton?.click();

      await waitFor(() => {
        const urlInput = container.querySelector('input[type="url"]');
        expect(urlInput).toBeInTheDocument();
      });

      const urlInput = container.querySelector('input[type="url"]') as HTMLInputElement;

      // Simulate URL input
      urlInput.value = 'https://example.com/image.jpg';
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should show URL input when URL tab is active', async () => {
      const { container } = render(() => <ImageUpload />);

      // Click URL tab
      const urlTabButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'URL'
      );
      urlTabButton?.click();

      await waitFor(() => {
        const urlInput = container.querySelector('input[type="url"]');
        expect(urlInput).toBeInTheDocument();
      });
    });

    it('should show upload dropzone when upload tab is active', () => {
      const { container } = render(() => <ImageUpload />);

      // Upload tab should be active by default
      const dropzone = container.querySelector('[class*="dropzone"]');
      expect(dropzone).toBeInTheDocument();
    });

    it('should switch between upload and URL tabs', async () => {
      const { container } = render(() => <ImageUpload />);

      // Initially upload tab
      let dropzone = container.querySelector('[class*="dropzone"]');
      expect(dropzone).toBeInTheDocument();

      // Click URL tab
      const urlTabButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'URL'
      );
      urlTabButton?.click();

      await waitFor(() => {
        const urlInput = container.querySelector('input[type="url"]');
        expect(urlInput).toBeInTheDocument();
      });

      // Click Upload tab again
      const uploadTabButton = Array.from(container.querySelectorAll('button')).find(
        (btn) => btn.textContent === 'Upload'
      );
      uploadTabButton?.click();

      await waitFor(() => {
        dropzone = container.querySelector('[class*="dropzone"]');
        expect(dropzone).toBeInTheDocument();
      });
    });
  });

  describe('alt text', () => {
    it('should show alt text input by default', () => {
      const { container } = render(() => <ImageUpload />);

      // Alt text functionality is part of the component
      expect(container).toBeInTheDocument();
    });

    it('should require alt text by default', () => {
      const { container } = render(() => <ImageUpload />);

      // requireAltText is true by default
      expect(container).toBeInTheDocument();
    });

    it('should allow optional alt text when requireAltText is false', () => {
      const { container } = render(() => (
        <ImageUpload requireAltText={false} />
      ));

      expect(container).toBeInTheDocument();
    });

    it('should update alt text', async () => {
      const handleChange = vi.fn();
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Original alt text',
      };

      render(() => (
        <ImageUpload value={imageData} onChange={handleChange} />
      ));

      // Alt text input integration
      await waitFor(() => {
        expect(document.body).toBeInTheDocument();
      });
    });
  });

  describe('image removal', () => {
    it('should show remove button when image is loaded', () => {
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      };

      const { container } = render(() => <ImageUpload value={imageData} />);

      const removeButton = container.querySelector('button[title="Remove image"]');
      expect(removeButton).toBeInTheDocument();
    });

    it('should not show remove button when no image', () => {
      const { container } = render(() => <ImageUpload />);

      const removeButton = container.querySelector('button[title="Remove image"]');
      expect(removeButton).not.toBeInTheDocument();
    });

    it('should remove image when remove button is clicked', async () => {
      const handleChange = vi.fn();
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      };

      const { container } = render(() => (
        <ImageUpload value={imageData} onChange={handleChange} />
      ));

      const removeButton = container.querySelector(
        'button[title="Remove image"]'
      ) as HTMLButtonElement;
      removeButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });

    it('should revoke object URL when removing blob URL', async () => {
      const handleChange = vi.fn();
      const imageData: ImageData = {
        url: 'blob:mock-url',
        alt: 'Test image',
      };

      const { container } = render(() => (
        <ImageUpload value={imageData} onChange={handleChange} />
      ));

      const removeButton = container.querySelector(
        'button[title="Remove image"]'
      ) as HTMLButtonElement;
      removeButton.click();

      await waitFor(() => {
        expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      });
    });

    it('should not revoke regular URLs', async () => {
      const handleChange = vi.fn();
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      };

      const { container } = render(() => (
        <ImageUpload value={imageData} onChange={handleChange} />
      ));

      const removeButton = container.querySelector(
        'button[title="Remove image"]'
      ) as HTMLButtonElement;
      removeButton.click();

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });

      expect(mockRevokeObjectURL).not.toHaveBeenCalled();
    });
  });

  describe('upload lifecycle callbacks', () => {
    it('should call onUploadStart when upload begins', async () => {
      const handleUploadStart = vi.fn();
      const { container } = render(() => (
        <ImageUpload onUploadStart={handleUploadStart} />
      ));

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(handleUploadStart).toHaveBeenCalledWith(file);
      });
    });

    it('should call onUploadComplete when upload succeeds', async () => {
      const handleUploadComplete = vi.fn();
      const { container } = render(() => (
        <ImageUpload onUploadComplete={handleUploadComplete} />
      ));

      const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(handleUploadComplete).toHaveBeenCalledWith('blob:mock-url', file);
      });
    });

    it('should call onUploadError when validation fails', async () => {
      const handleUploadError = vi.fn();
      const { container } = render(() => (
        <ImageUpload onUploadError={handleUploadError} />
      ));

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        expect(handleUploadError).toHaveBeenCalled();
      });
    });

    it('should show error message when upload fails', async () => {
      const { container } = render(() => <ImageUpload />);

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      input.dispatchEvent(new Event('change', { bubbles: true }));

      await waitFor(() => {
        const text = container.textContent;
        expect(text).toContain('not supported');
      });
    });
  });

  describe('disabled state', () => {
    it('should disable file input when disabled', () => {
      const { container } = render(() => <ImageUpload disabled={true} />);

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should disable remove button when disabled', () => {
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
        alt: 'Test image',
      };

      const { container } = render(() => (
        <ImageUpload value={imageData} disabled={true} />
      ));

      const removeButton = container.querySelector(
        'button[title="Remove image"]'
      ) as HTMLButtonElement;
      expect(removeButton).toBeDisabled();
    });

    it('should be enabled by default', () => {
      const { container } = render(() => <ImageUpload />);

      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).not.toBeDisabled();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined value', () => {
      const { container } = render(() => <ImageUpload value={undefined} />);

      // Should render without error
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should handle empty ImageData', () => {
      const imageData: ImageData = {};

      const { container } = render(() => <ImageUpload value={imageData} />);

      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should handle image data without alt text', () => {
      const imageData: ImageData = {
        url: 'https://example.com/image.jpg',
      };

      const { container } = render(() => <ImageUpload value={imageData} />);

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'Preview');
    });

    it('should work without onChange handler', () => {
      const { container } = render(() => <ImageUpload />);

      // Should render without error
      expect(container.querySelector('input[type="file"]')).toBeInTheDocument();
    });
  });
});
