# Email Builder Headless API Examples

This directory contains practical, working examples demonstrating how to use the Email Builder Headless API in various scenarios.

## Overview

All examples demonstrate real-world use cases for the headless API:

1. **[Server-side Email Generation](./01-server-side-generation/)** - Generate personalized emails in Node.js
2. **[Batch Template Processing](./02-batch-processing/)** - Process multiple templates with progress tracking
3. **[REST API Endpoint](./03-rest-api/)** - Create a template management API with Express.js
4. **[CLI Tool](./04-cli-tool/)** - Command-line interface for template operations
5. **[Template Migration](./05-template-migration/)** - Migrate templates from legacy systems

## Prerequisites

```bash
# Install core package
npm install @email-builder/core

# For specific examples, see their individual README files
```

## Quick Start

Each example directory contains:
- **`index.ts`** - Main example code with detailed comments
- **`README.md`** - Specific documentation and usage instructions
- **`package.json`** - Dependencies (if applicable)

### Running an Example

```bash
# Navigate to an example directory
cd 01-server-side-generation

# Install dependencies (if needed)
npm install

# Run the example
npx tsx index.ts
```

## Example Highlights

### 1. Server-side Email Generation

Perfect for automated email workflows:

```typescript
import { Builder } from '@email-builder/core';

const builder = new Builder({
  target: 'email',
  storage: { method: 'custom', adapter: new MemoryStorageAdapter() }
});

await builder.initialize();

const template = await builder.createTemplate({
  name: 'Welcome Email',
  settings: { target: 'email', canvasDimensions: { width: 600 } }
});

// Add components programmatically
const registry = builder.getComponentRegistry();
const hero = registry.create('hero');
hero.content = {
  title: `Welcome, ${user.name}!`,
  buttonText: 'Get Started'
};

// Export to email-safe HTML
const exporter = new TemplateExporter();
const html = exporter.export(template, { format: 'html' }).html;
```

**Use cases:** Welcome emails, transactional emails, automated campaigns

---

### 2. Batch Template Processing

Process hundreds of templates efficiently:

```typescript
const processor = new BatchTemplateProcessor();
await processor.initialize();

const results = await processor.processBatch('export', {
  concurrency: 5,
  validateBeforeExport: true,
  onProgress: (progress) => {
    console.log(`${progress.completed}/${progress.total} completed`);
  }
});
```

**Use cases:** Bulk exports, template optimization, mass validation

---

### 3. REST API Endpoint

Build a template management service:

```typescript
app.post('/api/templates', async (req, res) => {
  const template = await builder.createTemplate(req.body);
  res.json({ success: true, data: template });
});

app.post('/api/templates/:id/export', async (req, res) => {
  const template = await templateManager.load(req.params.id);
  const html = exporter.export(template, { format: 'html' }).html;
  res.json({ success: true, data: { html } });
});
```

**Endpoints:**
- `GET /api/templates` - List templates
- `POST /api/templates` - Create template
- `POST /api/templates/:id/export` - Export to HTML
- `POST /api/templates/:id/validate` - Validate template

**Use cases:** SaaS platforms, multi-user systems, frontend integrations

---

### 4. CLI Tool

Manage templates from the command line:

```bash
# Create a new template
email-builder create "Monthly Newsletter" --category marketing

# List all templates
email-builder list

# Export to HTML
email-builder export tpl_123 output.html --email-safe

# Validate before sending
email-builder validate tpl_123
```

**Use cases:** CI/CD pipelines, automation scripts, developer workflows

---

### 5. Template Migration

Migrate from legacy email systems:

```typescript
const service = new TemplateMigrationService();
await service.initialize();

// Migrate single template
const migratedTemplate = await service.migrateTemplate(legacyTemplate);

// Batch migration
await service.migrateBatch('./legacy-templates', './migrated-templates');
```

**Use cases:** Platform migrations, data transformations, bulk imports

---

## Common Patterns

### Custom Storage Adapter

All examples use a `MemoryStorageAdapter` for simplicity. For production, implement a database adapter:

```typescript
import { StorageAdapter } from '@email-builder/core';

class DatabaseAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    const doc = await db.collection('templates').findOne({ key });
    return doc ? doc.value : null;
  }

  async set(key: string, value: string): Promise<void> {
    await db.collection('templates').updateOne(
      { key },
      { $set: { key, value } },
      { upsert: true }
    );
  }

  async delete(key: string): Promise<void> {
    await db.collection('templates').deleteOne({ key });
  }

  async list(): Promise<string[]> {
    const docs = await db.collection('templates').find({}).toArray();
    return docs.map(doc => doc.key);
  }

  async clear(): Promise<void> {
    await db.collection('templates').deleteMany({});
  }
}
```

### Error Handling

```typescript
try {
  const template = await builder.createTemplate(options);
  // Success
} catch (error) {
  if (error.message.includes('validation')) {
    // Handle validation error
  } else if (error.message.includes('storage')) {
    // Handle storage error
  } else {
    // Handle other errors
  }
}
```

### Event Subscription

```typescript
// Subscribe to template events
builder.on('template:created', (data) => {
  console.log('New template:', data.template.metadata.name);
  // Send notification, log to analytics, etc.
});

templateManager.on('template:updated', (data) => {
  console.log('Template updated:', data.template.metadata.name);
  // Invalidate cache, trigger rebuild, etc.
});

builder.on('builder:error', (error) => {
  console.error('Builder error:', error);
  // Log to error tracking service
});
```

## Best Practices

### 1. Initialize Once

```typescript
// ❌ Don't create multiple builders
const builder1 = new Builder(config);
const builder2 = new Builder(config);  // Wasteful

// ✅ Reuse a single builder instance
const builder = new Builder(config);
await builder.initialize();

// Use throughout your application
```

### 2. Validate Before Export

```typescript
const templateManager = builder.getTemplateManager();
const validation = templateManager.validate(template);

if (!validation.valid) {
  throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
}

// Safe to export
const html = exporter.export(template, { format: 'html' }).html;
```

### 3. Use Email-Safe Export

```typescript
// ❌ Don't send builder HTML directly
const html = exporter.export(template, { format: 'html' }).html;
await sendEmail(recipient, html);  // May break in email clients

// ✅ Use EmailExportService for email-safe HTML
const builderHTML = exporter.export(template, { format: 'html' }).html;
const emailResult = emailExporter.export(builderHTML, {
  inlineCSS: true,
  useTableLayout: true,
  addOutlookFixes: true
});
await sendEmail(recipient, emailResult.html);  // Email-safe!
```

### 4. Clean Up Resources

```typescript
// When done with the builder
builder.destroy();

// Unsubscribe from events
subscription.unsubscribe();

// Clear command history if needed
const commandManager = builder.getCommandManager();
commandManager.clearHistory();
```

## Troubleshooting

### Issue: "Builder not initialized"

```typescript
// ❌ Wrong
const builder = new Builder(config);
await builder.createTemplate(options);  // Error!

// ✅ Correct
const builder = new Builder(config);
await builder.initialize();  // Initialize first
await builder.createTemplate(options);
```

### Issue: "localStorage is not defined" (Node.js)

```typescript
// ❌ Don't use 'local' storage in Node.js
const builder = new Builder({
  storage: { method: 'local' }  // Only works in browser
});

// ✅ Use custom adapter for Node.js
const builder = new Builder({
  storage: {
    method: 'custom',
    adapter: new MemoryStorageAdapter()
  }
});
```

### Issue: Export not working in email clients

```typescript
// Make sure to use EmailExportService
const emailExporter = new EmailExportService();
const result = emailExporter.export(html, {
  inlineCSS: true,
  useTableLayout: true,
  addOutlookFixes: true,
  removeIncompatibleCSS: true
});

// Check for warnings
if (result.warnings.length > 0) {
  console.warn('Export warnings:', result.warnings);
}
```

## Additional Resources

- **[HEADLESS_API.md](../HEADLESS_API.md)** - Complete API reference
- **[TODO.md](../TODO.md)** - Roadmap and upcoming features
- **[PROGRESS.md](../PROGRESS.md)** - Project history and completed work

## Support

For questions or issues:

1. Check the [API documentation](../HEADLESS_API.md)
2. Review the example code in each directory
3. Open an issue on GitHub
4. Check the test files in `packages/core/**/*.test.ts` for more examples

---

*These examples are designed to be copy-paste friendly. Feel free to use them as starting points for your own projects!*
