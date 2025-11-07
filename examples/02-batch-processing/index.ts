/**
 * Example 2: Batch Template Processing
 *
 * This example demonstrates how to process multiple templates
 * at once with progress tracking and error handling.
 *
 * Use cases:
 * - Bulk export of templates
 * - Template optimization
 * - Mass template updates
 * - Template validation at scale
 */

import { Builder, TemplateExporter, EmailExportService } from '@email-builder/core';
import type { Template, TemplateListItem } from '@email-builder/core';

// In-memory storage adapter
class MemoryStorageAdapter {
  private storage: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async list(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

// Progress tracker
interface ProcessingProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
}

// Batch processor options
interface BatchProcessorOptions {
  concurrency?: number;  // Number of concurrent operations
  onProgress?: (progress: ProcessingProgress) => void;
  onError?: (templateId: string, error: Error) => void;
  validateBeforeExport?: boolean;
}

/**
 * Batch Template Processor
 */
class BatchTemplateProcessor {
  private builder: Builder;
  private exporter: TemplateExporter;
  private emailExporter: EmailExportService;

  constructor() {
    this.builder = new Builder({
      target: 'email',
      storage: {
        method: 'custom',
        adapter: new MemoryStorageAdapter()
      }
    });

    this.exporter = new TemplateExporter();
    this.emailExporter = new EmailExportService();
  }

  async initialize(): Promise<void> {
    await this.builder.initialize();
  }

  /**
   * Process templates in batches
   */
  async processBatch(
    operation: 'export' | 'validate' | 'optimize',
    options: BatchProcessorOptions = {}
  ): Promise<Map<string, any>> {
    const {
      concurrency = 5,
      onProgress,
      onError,
      validateBeforeExport = true
    } = options;

    const templateManager = this.builder.getTemplateManager();
    const templates = await templateManager.list();

    const results = new Map<string, any>();
    const progress: ProcessingProgress = {
      total: templates.length,
      completed: 0,
      failed: 0,
      inProgress: 0
    };

    console.log(`\n🔄 Processing ${templates.length} templates...`);
    console.log(`   Concurrency: ${concurrency}`);
    console.log(`   Operation: ${operation}\n`);

    // Process in batches with concurrency limit
    const batches = this.chunkArray(templates, concurrency);

    for (const batch of batches) {
      await Promise.all(
        batch.map(async (templateItem) => {
          progress.inProgress++;
          onProgress?.(progress);

          try {
            const template = await templateManager.load(templateItem.id);
            let result: any;

            switch (operation) {
              case 'export':
                result = await this.exportTemplate(template, validateBeforeExport);
                break;
              case 'validate':
                result = await this.validateTemplate(template);
                break;
              case 'optimize':
                result = await this.optimizeTemplate(template);
                break;
            }

            results.set(template.metadata.id, result);
            progress.completed++;
            progress.inProgress--;

            console.log(`  ✅ ${template.metadata.name}`);
          } catch (error) {
            progress.failed++;
            progress.inProgress--;
            results.set(templateItem.id, { error: error.message });

            console.log(`  ❌ ${templateItem.name}: ${error.message}`);
            onError?.(templateItem.id, error as Error);
          }

          onProgress?.(progress);
        })
      );
    }

    return results;
  }

  /**
   * Export template to email-safe HTML
   */
  private async exportTemplate(template: Template, validate: boolean): Promise<any> {
    if (validate) {
      const templateManager = this.builder.getTemplateManager();
      const validation = templateManager.validate(template);

      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors?.map(e => e.message).join(', ')}`);
      }
    }

    // Export to HTML
    const builderHTML = this.exporter.export(template, {
      format: 'html',
      inlineStyles: false,
      prettyPrint: false
    }).html!;

    // Convert to email-safe HTML
    const emailResult = this.emailExporter.export(builderHTML, {
      inlineCSS: true,
      useTableLayout: true,
      addOutlookFixes: true,
      removeIncompatibleCSS: true
    });

    return {
      html: emailResult.html,
      size: emailResult.html.length,
      warnings: emailResult.warnings.length,
      statistics: emailResult.statistics
    };
  }

  /**
   * Validate template
   */
  private async validateTemplate(template: Template): Promise<any> {
    const templateManager = this.builder.getTemplateManager();
    const validation = templateManager.validate(template);

    const compatReport = this.builder.checkCompatibility();

    return {
      valid: validation.valid,
      errors: validation.errors || [],
      compatibility: {
        score: compatReport.overallScore,
        safeToExport: compatReport.safeToExport,
        issueCount: compatReport.totalIssues
      }
    };
  }

  /**
   * Optimize template (update general styles, remove unused components)
   */
  private async optimizeTemplate(template: Template): Promise<any> {
    const templateManager = this.builder.getTemplateManager();
    let optimized = false;

    // Optimize general styles
    const originalStylesSize = JSON.stringify(template.generalStyles).length;

    // Remove empty components
    const originalComponentCount = template.components.length;
    const optimizedComponents = template.components.filter(c => {
      // Keep components with content
      return Object.keys(c.content).length > 0;
    });

    if (optimizedComponents.length < originalComponentCount) {
      await templateManager.update(template.metadata.id, {
        components: optimizedComponents
      });
      optimized = true;
    }

    return {
      optimized,
      removedComponents: originalComponentCount - optimizedComponents.length,
      componentCount: optimizedComponents.length
    };
  }

  /**
   * Helper to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  destroy(): void {
    this.builder.destroy();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('📦 Batch Template Processing Example\n');

  const processor = new BatchTemplateProcessor();
  await processor.initialize();

  // Create sample templates first
  console.log('Creating sample templates...\n');
  await createSampleTemplates(processor);

  // Example 1: Bulk export
  console.log('\n📤 Example 1: Bulk Export');
  console.log('─'.repeat(50));

  const exportResults = await processor.processBatch('export', {
    concurrency: 3,
    validateBeforeExport: true,
    onProgress: (progress) => {
      const percent = Math.round((progress.completed / progress.total) * 100);
      // Progress bar would go here
    },
    onError: (templateId, error) => {
      console.error(`   Error processing ${templateId}:`, error.message);
    }
  });

  console.log(`\n📊 Export Summary:`);
  console.log(`   Total: ${exportResults.size}`);
  console.log(`   Successful: ${Array.from(exportResults.values()).filter(r => !r.error).length}`);
  console.log(`   Failed: ${Array.from(exportResults.values()).filter(r => r.error).length}`);

  // Example 2: Bulk validation
  console.log('\n\n✓ Example 2: Bulk Validation');
  console.log('─'.repeat(50));

  const validationResults = await processor.processBatch('validate', {
    concurrency: 5
  });

  console.log(`\n📊 Validation Summary:`);
  const validCount = Array.from(validationResults.values()).filter(r => !r.error && r.valid).length;
  const invalidCount = Array.from(validationResults.values()).filter(r => !r.error && !r.valid).length;
  console.log(`   Valid: ${validCount}`);
  console.log(`   Invalid: ${invalidCount}`);

  // Example 3: Bulk optimization
  console.log('\n\n⚡ Example 3: Bulk Optimization');
  console.log('─'.repeat(50));

  const optimizationResults = await processor.processBatch('optimize', {
    concurrency: 3
  });

  console.log(`\n📊 Optimization Summary:`);
  const optimizedCount = Array.from(optimizationResults.values()).filter(r => !r.error && r.optimized).length;
  console.log(`   Optimized: ${optimizedCount}`);
  console.log(`   Total components removed: ${Array.from(optimizationResults.values()).reduce((sum, r) => sum + (r.removedComponents || 0), 0)}`);

  // Cleanup
  processor.destroy();

  console.log('\n✨ Batch processing complete!');
}

/**
 * Create sample templates for testing
 */
async function createSampleTemplates(processor: any): Promise<void> {
  const builder = processor.builder;
  const registry = builder.getComponentRegistry();

  const templateNames = [
    'Newsletter - January 2025',
    'Product Launch - Widget Pro',
    'Welcome Email - New Users',
    'Order Confirmation',
    'Password Reset',
    'Weekly Digest',
    'Event Invitation',
    'Survey Request'
  ];

  for (const name of templateNames) {
    const template = await builder.createTemplate({
      name,
      description: `Sample template: ${name}`,
      category: 'marketing',
      tags: ['sample', 'batch-test'],
      settings: {
        target: 'email',
        locale: 'en-US',
        canvasDimensions: { width: 600 }
      }
    });

    // Add a simple component
    const text = registry.create('text');
    text.content = { text: `Content for ${name}`, tag: 'p' };

    const templateManager = builder.getTemplateManager();
    await templateManager.update(template.metadata.id, {
      components: [text]
    });

    console.log(`  ✓ Created: ${name}`);
  }
}

// Run the example
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { BatchTemplateProcessor, MemoryStorageAdapter };
