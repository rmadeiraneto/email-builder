#!/usr/bin/env node
/**
 * Example 4: CLI Tool
 *
 * Command-line interface for email template building
 *
 * Usage:
 *   email-builder create <name>           Create a new template
 *   email-builder list                    List all templates
 *   email-builder export <id> [output]    Export template to HTML
 *   email-builder validate <id>           Validate a template
 *   email-builder delete <id>             Delete a template
 */

import { Command } from 'commander';
import { Builder, TemplateExporter, EmailExportService } from '@email-builder/core';
import * as fs from 'fs';
import * as path from 'path';

class MemoryStorageAdapter {
  private storage: Map<string, string> = new Map();
  async get(key: string): Promise<string | null> { return this.storage.get(key) || null; }
  async set(key: string, value: string): Promise<void> { this.storage.set(key, value); }
  async delete(key: string): Promise<void> { this.storage.delete(key); }
  async list(): Promise<string[]> { return Array.from(this.storage.keys()); }
  async clear(): Promise<void> { this.storage.clear(); }
}

const builder = new Builder({
  target: 'email',
  storage: { method: 'custom', adapter: new MemoryStorageAdapter() }
});

const program = new Command();

program
  .name('email-builder')
  .description('Email Builder CLI - Manage email templates from the command line')
  .version('1.0.0');

// Create command
program
  .command('create <name>')
  .description('Create a new email template')
  .option('-d, --description <desc>', 'Template description')
  .option('-c, --category <category>', 'Template category')
  .action(async (name, options) => {
    await builder.initialize();

    const template = await builder.createTemplate({
      name,
      description: options.description,
      category: options.category,
      settings: {
        target: 'email',
        locale: 'en-US',
        canvasDimensions: { width: 600 }
      }
    });

    console.log(`✅ Template created successfully!`);
    console.log(`   ID: ${template.metadata.id}`);
    console.log(`   Name: ${template.metadata.name}`);
  });

// List command
program
  .command('list')
  .description('List all templates')
  .option('--category <category>', 'Filter by category')
  .action(async (options) => {
    await builder.initialize();

    const templateManager = builder.getTemplateManager();
    let templates;

    if (options.category) {
      templates = await templateManager.search({ category: options.category });
    } else {
      templates = await templateManager.list();
    }

    console.log(`\n📋 Templates (${templates.length}):\n`);
    templates.forEach(t => {
      console.log(`   ${t.id}`);
      console.log(`   └─ ${t.name}`);
      console.log(`      Updated: ${new Date(t.updatedAt).toLocaleString()}\n`);
    });
  });

// Export command
program
  .command('export <id> [output]')
  .description('Export template to HTML')
  .option('--email-safe', 'Export as email-safe HTML')
  .action(async (id, output, options) => {
    await builder.initialize();

    const templateManager = builder.getTemplateManager();
    const template = await templateManager.load(id);

    const exporter = new TemplateExporter();
    const result = exporter.export(template, {
      format: 'html',
      inlineStyles: false,
      prettyPrint: true
    });

    let html = result.html!;

    if (options.emailSafe) {
      const emailExporter = new EmailExportService();
      const emailResult = emailExporter.export(html, {
        inlineCSS: true,
        useTableLayout: true,
        addOutlookFixes: true
      });
      html = emailResult.html;
    }

    const outputPath = output || `${template.metadata.name.replace(/\s+/g, '-')}.html`;
    fs.writeFileSync(outputPath, html);

    console.log(`✅ Template exported successfully!`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Size: ${html.length} bytes`);
  });

// Validate command
program
  .command('validate <id>')
  .description('Validate a template')
  .action(async (id) => {
    await builder.initialize();

    const templateManager = builder.getTemplateManager();
    const template = await templateManager.load(id);

    const validation = templateManager.validate(template);
    const compatReport = builder.checkCompatibility();

    console.log(`\n📋 Validation Results for: ${template.metadata.name}\n`);
    console.log(`   Valid: ${validation.valid ? '✅' : '❌'}`);

    if (!validation.valid) {
      console.log(`\n   Errors:`);
      validation.errors?.forEach(err => {
        console.log(`     - [${err.severity}] ${err.message}`);
      });
    }

    console.log(`\n   Compatibility Score: ${compatReport.overallScore}/100`);
    console.log(`   Safe to Export: ${compatReport.safeToExport ? '✅' : '❌'}`);
    console.log(`   Total Issues: ${compatReport.totalIssues}`);
  });

// Delete command
program
  .command('delete <id>')
  .description('Delete a template')
  .action(async (id) => {
    await builder.deleteTemplate(id);
    console.log(`✅ Template deleted successfully!`);
  });

program.parse();
