/**
 * Example 3: REST API Endpoint
 *
 * This example demonstrates how to create a REST API for template management
 * using Express.js and the Email Builder headless API.
 *
 * Use cases:
 * - Template management via HTTP
 * - Integration with frontend applications
 * - Multi-user template systems
 * - Template as a Service (TaaS)
 */

import express, { Request, Response } from 'express';
import { Builder, TemplateExporter, EmailExportService } from '@email-builder/core';
import type { Template, CreateTemplateOptions } from '@email-builder/core';

// In-memory storage (replace with database in production)
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

// Initialize builder
const builder = new Builder({
  target: 'email',
  storage: {
    method: 'custom',
    adapter: new MemoryStorageAdapter()
  }
});

const exporter = new TemplateExporter();
const emailExporter = new EmailExportService();

// Initialize Express app
const app = express();
app.use(express.json());

/**
 * Middleware: Initialize builder
 */
app.use(async (req, res, next) => {
  if (!builder.isInitialized()) {
    await builder.initialize();
  }
  next();
});

/**
 * GET /api/templates
 * List all templates
 */
app.get('/api/templates', async (req: Request, res: Response) => {
  try {
    const { category, tags, search } = req.query;

    const templateManager = builder.getTemplateManager();
    let templates;

    if (category || tags || search) {
      templates = await templateManager.search({
        category: category as string,
        tags: tags ? (tags as string).split(',') : undefined,
        searchTerm: search as string
      });
    } else {
      templates = await templateManager.list();
    }

    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/templates/:id
 * Get a specific template
 */
app.get('/api/templates/:id', async (req: Request, res: Response) => {
  try {
    const templateManager = builder.getTemplateManager();
    const template = await templateManager.load(req.params.id);

    res.json({
      success: true,
      data: template
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/templates
 * Create a new template
 */
app.post('/api/templates', async (req: Request, res: Response) => {
  try {
    const options: CreateTemplateOptions = req.body;

    const template = await builder.createTemplate(options);

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template created successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/templates/:id
 * Update a template
 */
app.put('/api/templates/:id', async (req: Request, res: Response) => {
  try {
    const templateManager = builder.getTemplateManager();
    const template = await templateManager.update(req.params.id, req.body);

    res.json({
      success: true,
      data: template,
      message: 'Template updated successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/templates/:id
 * Delete a template
 */
app.delete('/api/templates/:id', async (req: Request, res: Response) => {
  try {
    await builder.deleteTemplate(req.params.id);

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/templates/:id/duplicate
 * Duplicate a template
 */
app.post('/api/templates/:id/duplicate', async (req: Request, res: Response) => {
  try {
    const { newName } = req.body;
    const templateManager = builder.getTemplateManager();
    const template = await templateManager.duplicate(req.params.id, newName);

    res.status(201).json({
      success: true,
      data: template,
      message: 'Template duplicated successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/templates/:id/validate
 * Validate a template
 */
app.post('/api/templates/:id/validate', async (req: Request, res: Response) => {
  try {
    const templateManager = builder.getTemplateManager();
    const template = await templateManager.load(req.params.id);

    const validation = templateManager.validate(template);
    const compatReport = builder.checkCompatibility();

    res.json({
      success: true,
      data: {
        valid: validation.valid,
        errors: validation.errors || [],
        compatibility: {
          score: compatReport.overallScore,
          safeToExport: compatReport.safeToExport,
          issues: compatReport.issues
        }
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/templates/:id/export
 * Export a template to HTML
 */
app.post('/api/templates/:id/export', async (req: Request, res: Response) => {
  try {
    const { format = 'html', emailSafe = true } = req.body;

    const templateManager = builder.getTemplateManager();
    const template = await templateManager.load(req.params.id);

    // Export to HTML
    const result = exporter.export(template, {
      format: format as 'html' | 'json' | 'both',
      inlineStyles: false,
      prettyPrint: true
    });

    let html = result.html;

    // Convert to email-safe HTML if requested
    if (emailSafe && html) {
      const emailResult = emailExporter.export(html, {
        inlineCSS: true,
        useTableLayout: true,
        addOutlookFixes: true,
        removeIncompatibleCSS: true
      });
      html = emailResult.html;
    }

    res.json({
      success: true,
      data: {
        html,
        json: result.json
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/components
 * List all available components
 */
app.get('/api/components', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const registry = builder.getComponentRegistry();
    let components;

    if (category) {
      components = registry.getByCategory(category as any);
    } else {
      components = registry.getAll();
    }

    res.json({
      success: true,
      data: components.map(c => ({
        type: c.type,
        metadata: c.metadata
      })),
      count: components.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/presets/:componentType
 * Get presets for a component type
 */
app.get('/api/presets/:componentType', async (req: Request, res: Response) => {
  try {
    const presetManager = builder.getPresetManager();
    const presets = presetManager.listPresets(req.params.componentType);

    res.json({
      success: true,
      data: presets,
      count: presets.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

/**
 * Start server
 */
const PORT = process.env.PORT || 3000;

async function startServer() {
  await builder.initialize();

  app.listen(PORT, () => {
    console.log(`\n🚀 Email Builder API Server`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Endpoints:`);
    console.log(`     GET    /api/templates`);
    console.log(`     POST   /api/templates`);
    console.log(`     GET    /api/templates/:id`);
    console.log(`     PUT    /api/templates/:id`);
    console.log(`     DELETE /api/templates/:id`);
    console.log(`     POST   /api/templates/:id/duplicate`);
    console.log(`     POST   /api/templates/:id/validate`);
    console.log(`     POST   /api/templates/:id/export`);
    console.log(`     GET    /api/components`);
    console.log(`     GET    /api/presets/:componentType`);
    console.log(`\n✅ Server is running!\n`);
  });
}

if (require.main === module) {
  startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });
}

export { app, builder };
