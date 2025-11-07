/**
 * Example 5: Template Migration Script
 *
 * This example demonstrates how to migrate templates from an old format
 * to the new Email Builder format with validation and transformation.
 *
 * Use cases:
 * - Migrating from legacy email systems
 * - Bulk import from other platforms
 * - Data format transformation
 * - Template normalization
 */

import { Builder, TemplateExporter } from '@email-builder/core';
import type { Template, BaseComponent } from '@email-builder/core';
import * as fs from 'fs';
import * as path from 'path';

// Legacy template format (from old system)
interface LegacyTemplate {
  id: string;
  title: string;
  description?: string;
  created: string;
  modified: string;
  blocks: LegacyBlock[];
}

interface LegacyBlock {
  type: 'header' | 'text' | 'image' | 'button' | 'footer';
  content: Record<string, any>;
  style: Record<string, any>;
}

class MemoryStorageAdapter {
  private storage: Map<string, string> = new Map();
  async get(key: string): Promise<string | null> { return this.storage.get(key) || null; }
  async set(key: string, value: string): Promise<void> { this.storage.set(key, value); }
  async delete(key: string): Promise<void> { this.storage.delete(key); }
  async list(): Promise<string[]> { return Array.from(this.storage.keys()); }
  async clear(): Promise<void> { this.storage.clear(); }
}

/**
 * Template Migration Service
 */
class TemplateMigrationService {
  private builder: Builder;
  private migratedCount = 0;
  private failedCount = 0;
  private errors: Array<{ templateId: string; error: string }> = [];

  constructor() {
    this.builder = new Builder({
      target: 'email',
      storage: {
        method: 'custom',
        adapter: new MemoryStorageAdapter()
      }
    });
  }

  async initialize(): Promise<void> {
    await this.builder.initialize();
  }

  /**
   * Migrate a single legacy template
   */
  async migrateTemplate(legacyTemplate: LegacyTemplate): Promise<Template | null> {
    try {
      console.log(`\n📄 Migrating: ${legacyTemplate.title}`);

      // 1. Convert metadata
      const template = await this.builder.createTemplate({
        name: legacyTemplate.title,
        description: legacyTemplate.description || `Migrated from legacy system`,
        category: 'migrated',
        tags: ['legacy', 'migrated'],
        settings: {
          target: 'email',
          locale: 'en-US',
          canvasDimensions: { width: 600 }
        }
      });

      // 2. Convert components
      const components: BaseComponent[] = [];
      const registry = this.builder.getComponentRegistry();

      for (const block of legacyTemplate.blocks) {
        const component = this.convertBlock(block, registry);
        if (component) {
          components.push(component);
        }
      }

      // 3. Update template with components
      const templateManager = this.builder.getTemplateManager();
      await templateManager.update(template.metadata.id, {
        components,
        metadata: {
          name: legacyTemplate.title,
          description: legacyTemplate.description
        }
      });

      // 4. Validate migrated template
      const validation = templateManager.validate(template);
      if (!validation.valid) {
        console.log(`   ⚠️  Validation warnings:`);
        validation.errors?.forEach(err => {
          console.log(`      - ${err.message}`);
        });
      }

      console.log(`   ✅ Migrated successfully (${components.length} components)`);
      this.migratedCount++;

      return template;
    } catch (error: any) {
      console.log(`   ❌ Migration failed: ${error.message}`);
      this.failedCount++;
      this.errors.push({
        templateId: legacyTemplate.id,
        error: error.message
      });
      return null;
    }
  }

  /**
   * Convert legacy block to new component format
   */
  private convertBlock(block: LegacyBlock, registry: any): BaseComponent | null {
    try {
      let component: BaseComponent;

      switch (block.type) {
        case 'header':
          component = registry.create('header');
          component.content = {
            imageUrl: block.content.logo || '',
            imageAlt: block.content.logoAlt || 'Logo',
            imageWidth: '200',
            imageHeight: '60',
            links: block.content.navigation || []
          };
          break;

        case 'text':
          component = registry.create('text');
          component.content = {
            text: block.content.body || '',
            tag: block.content.heading ? 'h2' : 'p'
          };
          break;

        case 'image':
          component = registry.create('image');
          component.content = {
            src: block.content.url || '',
            alt: block.content.alt || '',
            width: block.content.width || 'auto',
            height: block.content.height || 'auto'
          };
          break;

        case 'button':
          component = registry.create('button');
          component.content = {
            text: block.content.label || 'Click Here',
            href: block.content.link || '#'
          };
          break;

        case 'footer':
          component = registry.create('footer');
          component.content = {
            text: block.content.copyright || '',
            links: block.content.links || [],
            socialLinks: block.content.social || []
          };
          break;

        default:
          console.log(`      ⚠️  Unknown block type: ${block.type}`);
          return null;
      }

      // Convert styles
      if (block.style) {
        component.styles = this.convertStyles(block.style);
      }

      return component;
    } catch (error: any) {
      console.log(`      ⚠️  Failed to convert block: ${error.message}`);
      return null;
    }
  }

  /**
   * Convert legacy styles to new format
   */
  private convertStyles(legacyStyle: Record<string, any>): any {
    const styles: any = {};

    if (legacyStyle.backgroundColor) {
      styles.backgroundColor = legacyStyle.backgroundColor;
    }

    if (legacyStyle.color) {
      styles.color = legacyStyle.color;
    }

    if (legacyStyle.padding) {
      const p = legacyStyle.padding;
      styles.padding = {
        top: { value: p, unit: 'px' },
        right: { value: p, unit: 'px' },
        bottom: { value: p, unit: 'px' },
        left: { value: p, unit: 'px' }
      };
    }

    return styles;
  }

  /**
   * Migrate multiple templates from directory
   */
  async migrateBatch(inputDir: string, outputDir: string): Promise<void> {
    console.log(`\n📦 Batch Migration`);
    console.log(`   Input: ${inputDir}`);
    console.log(`   Output: ${outputDir}\n`);

    // Create output directory
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read all JSON files from input directory
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

    console.log(`Found ${files.length} legacy templates\n`);

    for (const file of files) {
      const filePath = path.join(inputDir, file);
      const legacyData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const migratedTemplate = await this.migrateTemplate(legacyData);

      if (migratedTemplate) {
        // Export migrated template
        const exporter = new TemplateExporter();
        const result = exporter.export(migratedTemplate, {
          format: 'json',
          prettyPrint: true
        });

        const outputPath = path.join(outputDir, `${migratedTemplate.metadata.id}.json`);
        fs.writeFileSync(outputPath, result.json!);
      }
    }

    // Print summary
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`\n📊 Migration Summary:`);
    console.log(`   Total: ${files.length}`);
    console.log(`   Migrated: ${this.migratedCount}`);
    console.log(`   Failed: ${this.failedCount}`);

    if (this.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      this.errors.forEach(err => {
        console.log(`   - ${err.templateId}: ${err.error}`);
      });
    }
  }

  destroy(): void {
    this.builder.destroy();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Template Migration Tool\n');

  const service = new TemplateMigrationService();
  await service.initialize();

  // Example: Migrate a single template
  const sampleLegacyTemplate: LegacyTemplate = {
    id: 'legacy_001',
    title: 'Welcome Email (Legacy)',
    description: 'Original welcome email from old system',
    created: '2020-01-15',
    modified: '2024-06-20',
    blocks: [
      {
        type: 'header',
        content: {
          logo: 'https://example.com/logo.png',
          logoAlt: 'Company Logo'
        },
        style: {
          backgroundColor: '#ffffff',
          padding: 20
        }
      },
      {
        type: 'text',
        content: {
          body: 'Welcome to our platform!',
          heading: true
        },
        style: {
          padding: 30
        }
      },
      {
        type: 'button',
        content: {
          label: 'Get Started',
          link: 'https://example.com/start'
        },
        style: {
          backgroundColor: '#007bff',
          color: '#ffffff'
        }
      }
    ]
  };

  await service.migrateTemplate(sampleLegacyTemplate);

  // Example: Batch migration
  // await service.migrateBatch('./legacy-templates', './migrated-templates');

  service.destroy();

  console.log('\n✨ Migration complete!');
}

// Run
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { TemplateMigrationService, LegacyTemplate };
