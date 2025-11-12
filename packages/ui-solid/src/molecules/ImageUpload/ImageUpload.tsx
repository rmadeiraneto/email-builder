/**
 * ImageUpload component (SolidJS)
 *
 * Dual-input image selector with:
 * - File upload (click to browse, drag & drop)
 * - URL input
 * - Image preview
 * - Alt text input (required for accessibility)
 * - Remove image button
 *
 * @example
 * ```tsx
 * <ImageUpload
 *   value={{
 *     url: 'https://example.com/image.jpg',
 *     alt: 'Example image'
 *   }}
 *   onChange={(imageData) => console.log(imageData)}
 * />
 * ```
 */

import { Component, Show, createSignal, mergeProps } from 'solid-js';
import { Tabs } from '../Tabs/Tabs';
import { InputLabel } from '../InputLabel/InputLabel';
import { classNames } from '../../utils';
import styles from './image-upload.module.scss';

/**
 * Image data structure
 */
export interface ImageData {
  /**
   * Image URL (uploaded or external)
   */
  url?: string;

  /**
   * Alt text for accessibility
   */
  alt?: string;

  /**
   * Original file object (if uploaded)
   */
  file?: File;
}

/**
 * ImageUpload props
 */
export interface ImageUploadProps {
  /**
   * Current image data
   */
  value?: ImageData;

  /**
   * Label for the image upload
   */
  label?: string;

  /**
   * Supported file formats
   * @default ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml']
   */
  acceptedFormats?: string[];

  /**
   * Maximum file size in bytes
   * @default 5242880 (5MB)
   */
  maxFileSize?: number;

  /**
   * Disable the inputs
   */
  disabled?: boolean;

  /**
   * Show alt text input
   * @default true
   */
  showAltText?: boolean;

  /**
   * Require alt text
   * @default true
   */
  requireAltText?: boolean;

  /**
   * Additional CSS classes
   */
  class?: string;

  /**
   * Callback fired when image changes
   */
  onChange?: (value: ImageData) => void;

  /**
   * Callback fired when file upload starts
   */
  onUploadStart?: (file: File) => void;

  /**
   * Callback fired when file upload completes
   */
  onUploadComplete?: (url: string, file: File) => void;

  /**
   * Callback fired when upload error occurs
   */
  onUploadError?: (error: Error) => void;
}

/**
 * Default props
 */
const defaultProps: Partial<ImageUploadProps> = {
  acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
  maxFileSize: 5242880, // 5MB
  disabled: false,
  showAltText: true,
  requireAltText: true,
};

/**
 * ImageUpload Component
 */
export const ImageUpload: Component<ImageUploadProps> = (props) => {
  const merged = mergeProps(defaultProps, props);

  // State
  const [isDragging, setIsDragging] = createSignal(false);
  const [uploadError, setUploadError] = createSignal<string | null>(null);
  const [isUploading, setIsUploading] = createSignal(false);

  /**
   * Get current image data
   */
  const getImageData = (): ImageData => {
    return merged.value || {};
  };

  /**
   * Validate file
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (merged.acceptedFormats && !merged.acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `File type not supported. Accepted formats: ${merged.acceptedFormats.join(', ')}`,
      };
    }

    // Check file size
    if (merged.maxFileSize && file.size > merged.maxFileSize) {
      const maxSizeMB = (merged.maxFileSize / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`,
      };
    }

    return { valid: true };
  };

  /**
   * Handle file selection
   */
  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error!);
      merged.onUploadError?.(new Error(validation.error!));
      return;
    }

    setIsUploading(true);
    merged.onUploadStart?.(file);

    try {
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);

      // Update image data
      merged.onChange?.({
        ...getImageData(),
        url: objectUrl,
        file,
      });

      merged.onUploadComplete?.(objectUrl, file);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      setUploadError(err.message);
      merged.onUploadError?.(err);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle drag events
   */
  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer?.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  /**
   * Handle URL input change
   */
  const handleUrlChange = (url: string) => {
    merged.onChange?.({
      ...getImageData(),
      url,
    });
  };

  /**
   * Handle alt text change
   */
  const handleAltChange = (alt: string) => {
    merged.onChange?.({
      ...getImageData(),
      alt,
    });
  };

  /**
   * Handle remove image
   */
  const handleRemove = () => {
    // Revoke object URL if it exists
    const currentUrl = getImageData().url;
    if (currentUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }

    merged.onChange?.({
      alt: getImageData().alt, // Preserve alt text
    });
  };

  /**
   * Get accept attribute for file input
   */
  const getAcceptAttribute = (): string => {
    return merged.acceptedFormats?.join(',') || '*';
  };

  return (
    <div class={classNames(styles['image-upload'], merged.class)}>
      {merged.label && <InputLabel>{merged.label}</InputLabel>}

      {/* Image Preview */}
      <Show when={getImageData().url}>
        <div class={styles['image-upload__preview']}>
          <img
            src={getImageData().url}
            alt={getImageData().alt || 'Preview'}
            class={styles['image-upload__preview-image']}
          />
          <button
            class={styles['image-upload__remove']}
            onClick={handleRemove}
            disabled={merged.disabled}
            title="Remove image"
          >
            <i class="ri-close-line" />
          </button>
        </div>
      </Show>

      {/* Upload/URL Tabs */}
      <Show when={!getImageData().url}>
        <Tabs
          tabs={[
            { id: 'upload', label: 'Upload' },
            { id: 'url', label: 'URL' },
          ]}
          activeTab="upload"
        >
          {(activeTab) => (
            <>
              {/* Upload Tab */}
              <Show when={activeTab() === 'upload'}>
                <div
                  class={classNames(
                    styles['image-upload__dropzone'],
                    isDragging() && styles['image-upload__dropzone--dragging'],
                    merged.disabled && styles['image-upload__dropzone--disabled']
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept={getAcceptAttribute()}
                    onChange={handleFileInputChange}
                    disabled={merged.disabled || isUploading()}
                    class={styles['image-upload__file-input']}
                    id="image-file-input"
                  />

                  <label
                    for="image-file-input"
                    class={styles['image-upload__dropzone-label']}
                  >
                    <i class="ri-upload-cloud-2-line" />
                    <span class={styles['image-upload__dropzone-text']}>
                      {isUploading()
                        ? 'Uploading...'
                        : 'Click to browse or drag & drop'}
                    </span>
                    <span class={styles['image-upload__dropzone-hint']}>
                      {merged.acceptedFormats?.map((f) => f.split('/')[1]).join(', ')} up
                      to {((merged.maxFileSize || 0) / (1024 * 1024)).toFixed(0)}MB
                    </span>
                  </label>
                </div>
              </Show>

              {/* URL Tab */}
              <Show when={activeTab() === 'url'}>
                <div class={styles['image-upload__url-input']}>
                  <input
                    type="url"
                    class={styles['image-upload__url-field']}
                    placeholder="https://example.com/image.jpg"
                    value={getImageData().url || ''}
                    onInput={(e) => handleUrlChange(e.currentTarget.value)}
                    disabled={merged.disabled}
                  />
                </div>
              </Show>
            </>
          )}
        </Tabs>
      </Show>

      {/* Error Message */}
      <Show when={uploadError()}>
        <div class={styles['image-upload__error']}>
          <i class="ri-error-warning-line" />
          <span>{uploadError()}</span>
        </div>
      </Show>

      {/* Alt Text Input */}
      <Show when={merged.showAltText}>
        <div class={styles['image-upload__alt-text']}>
          <InputLabel>
            Alt Text
            {merged.requireAltText && <span class={styles['image-upload__required']}>*</span>}
          </InputLabel>
          <input
            type="text"
            class={styles['image-upload__alt-field']}
            placeholder="Describe the image for accessibility"
            value={getImageData().alt || ''}
            onInput={(e) => handleAltChange(e.currentTarget.value)}
            disabled={merged.disabled}
            required={merged.requireAltText}
          />
        </div>
      </Show>
    </div>
  );
};
