# Data Injection System - Complete Guide

**Version**: 1.0
**Status**: ✅ Complete - All Phases Implemented
**Last Updated**: November 2025

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Template Variable Syntax](#template-variable-syntax)
5. [Data Sources](#data-sources)
6. [Data Processing Service](#data-processing-service)
7. [Helper Functions](#helper-functions)
8. [UI Components](#ui-components)
9. [API Reference](#api-reference)
10. [Examples](#examples)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

---

## Overview

The Data Injection System enables dynamic content in email templates through variable substitution, conditionals, loops, and helper functions. It supports multiple data sources (JSON, API, custom) and provides both headless API and UI components for managing data.

### Features

✅ **Template Variable System**
- Field placeholders: `{{variable}}`
- Conditional rendering: `{{#if condition}}...{{/if}}`
- Loops/iterations: `{{#each items}}...{{/each}}`
- Helper functions: `{{formatDate date "YYYY-MM-DD"}}`
- Nested data access: `{{user.address.city}}`

✅ **Data Source Management**
- JSON data sources (static)
- API data sources (REST endpoints)
- Custom data providers
- Sample data for previews
- Data validation and type checking

✅ **Processing & Rendering**
- Template parsing and rendering
- Graceful handling of missing data
- HTML escaping for security
- Custom helper registration
- Error tracking and reporting

✅ **UI Components**
- Data source configuration modal
- Variable picker for autocomplete
- Sample data preview
- Connection testing

---

## Quick Start

### Basic Example

```typescript
import { Builder, DataSourceType } from '@email-builder/core';

// 1. Initialize builder
const builder = new Builder({ target: 'email' });
await builder.initialize();

// 2. Add a data source
const dataSourceManager = builder.getDataSourceManager();

dataSourceManager.addDataSource({
  id: 'user-data',
  name: 'User Data',
  type: DataSourceType.JSON,
  config: {
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      orderTotal: 125.99,
      items: [
        { name: 'Product A', price: 50.00 },
        { name: 'Product B', price: 75.99 }
      ]
    }
  },
  active: true
});

// 3. Create template with variables
const template = `
<h1>Hello {{name}}!</h1>
<p>Order Total: {{formatCurrency orderTotal "USD"}}</p>

<ul>
{{#each items}}
  <li>{{name}} - {{formatCurrency price "USD"}}</li>
{{/each}}
</ul>

{{#if orderTotal > 100}}
  <p>You qualify for free shipping!</p>
{{/if}}
`;

// 4. Process template with data
const dataProcessingService = builder.getDataProcessingService();
const data = await dataSourceManager.fetchActiveData();

const result = dataProcessingService.process(template, data);

console.log(result.output);
// Output:
// <h1>Hello John Doe!</h1>
// <p>Order Total: $125.99</p>
// <ul>
//   <li>Product A - $50.00</li>
//   <li>Product B - $75.99</li>
// </ul>
// <p>You qualify for free shipping!</p>
```

---

## Core Concepts

### 1. Template Variables

Template variables are placeholders in your template that get replaced with actual data during rendering.

**Syntax**: `{{variable}}`

Variables support:
- Simple fields: `{{name}}`
- Nested access: `{{user.address.city}}`
- Array access: `{{items.0.name}}`
- Loop context: `{{@index}}`, `{{@first}}`, `{{@last}}`

### 2. Data Sources

Data sources provide the data used to populate template variables. They can be:

- **JSON**: Static data stored in memory
- **API**: Dynamic data from REST endpoints
- **Custom**: Your own data provider function
- **Sample**: Mock data for previews

### 3. Template Processing

The `DataProcessingService` parses templates, resolves variables, evaluates conditionals and loops, and produces rendered output with error tracking.

### 4. Helper Functions

Helpers are utility functions that can transform data in templates:
- `{{formatDate date "YYYY-MM-DD"}}`
- `{{upper text}}`
- `{{truncate text 100}}`

---

## Template Variable Syntax

### Field Placeholders

Simple variable substitution:

```handlebars
Hello {{name}}!
Your email is {{email}}.
```

### Nested Data Access

Access nested object properties with dot notation:

```handlebars
{{user.profile.firstName}} {{user.profile.lastName}}
City: {{user.address.city}}, {{user.address.state}}
```

### Conditional Rendering

Show/hide content based on conditions:

```handlebars
{{#if isPremiumUser}}
  <p>Welcome, premium member!</p>
{{/if}}

{{#if orderTotal > 100}}
  <p>Free shipping applied!</p>
{{else}}
  <p>Add ${{subtract 100 orderTotal}} more for free shipping.</p>
{{/if}}
```

### Unless Blocks

Inverse conditionals:

```handlebars
{{#unless isLoggedIn}}
  <p>Please log in to continue.</p>
{{/unless}}
```

### Loops

Iterate over arrays:

```handlebars
<ul>
{{#each products}}
  <li>
    {{name}} - ${{price}}
    {{#if @first}}<span>FEATURED</span>{{/if}}
  </li>
{{/each}}
</ul>
```

**Loop Context Variables**:
- `{{@index}}` - Current index (0-based)
- `{{@first}}` - True for first item
- `{{@last}}` - True for last item
- `{{@key}}` - Current key (for objects)

### Helper Functions

Transform data with built-in helpers:

```handlebars
{{formatDate createdAt "YYYY-MM-DD"}}
{{upper userName}}
{{truncate description 100}}
{{formatCurrency price "USD"}}
```

---

## Data Sources

### JSON Data Source

Static data stored in memory:

```typescript
dataSourceManager.addDataSource({
  id: 'my-data',
  name: 'My Static Data',
  type: DataSourceType.JSON,
  config: {
    data: {
      name: 'John',
      email: 'john@example.com',
      age: 30
    }
  },
  active: true
});
```

### API Data Source

Fetch data from REST endpoints:

```typescript
dataSourceManager.addDataSource({
  id: 'api-data',
  name: 'API Data',
  type: DataSourceType.API,
  config: {
    url: 'https://api.example.com/users/123',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    dataPath: 'data.user', // Navigate to nested data
    cache: true,
    cacheDuration: 60000 // 1 minute
  },
  active: true
});
```

### Custom Data Source

Provide your own data fetching logic:

```typescript
dataSourceManager.addDataSource({
  id: 'custom-data',
  name: 'Custom Provider',
  type: DataSourceType.CUSTOM,
  config: {
    fetch: async () => {
      // Your custom logic
      const response = await myCustomFetch();
      return response.data;
    },
    validate: (data) => {
      // Optional validation
      return data && typeof data === 'object';
    }
  },
  active: true
});
```

### Managing Data Sources

```typescript
// Get all data sources
const sources = dataSourceManager.getAllDataSources();

// Set active data source
dataSourceManager.setActiveDataSource('api-data');

// Get active data source
const activeSource = dataSourceManager.getActiveDataSource();

// Fetch data from active source
const data = await dataSourceManager.fetchActiveData();

// Test connection
const result = await dataSourceManager.testConnection('api-data');
console.log(result.success, result.message);

// Remove data source
dataSourceManager.removeDataSource('old-data');

// Clear cache
dataSourceManager.clearCache();
```

---

## Data Processing Service

### Basic Processing

```typescript
const service = builder.getDataProcessingService();

const result = service.process(
  'Hello {{name}}!',
  { name: 'World' }
);

console.log(result.output); // "Hello World!"
console.log(result.usedVariables); // ['name']
console.log(result.missingVariables); // []
```

### Processing Options

```typescript
const result = service.process(template, data, {
  // Throw error on missing variables
  strict: false,

  // Default value for missing variables
  defaultValue: '',

  // Escape HTML entities
  escapeHtml: true,

  // Custom helper functions
  helpers: {
    myHelper: (value) => value.toUpperCase()
  },

  // Remove extra whitespace
  trim: true,

  // Custom delimiters
  delimiters: {
    open: '{{',
    close: '}}'
  }
});
```

### Result Object

```typescript
interface TemplateProcessingResult {
  // Rendered output
  output: string;

  // Variables that were used
  usedVariables: string[];

  // Variables that were missing
  missingVariables: string[];

  // Errors encountered
  errors: Array<{
    message: string;
    variable?: string;
  }>;

  // Warnings
  warnings?: string[];

  // Processing statistics
  stats?: {
    variablesReplaced: number;
    conditionalsEvaluated: number;
    loopsUnrolled: number;
    helpersInvoked: number;
  };
}
```

### Custom Helpers

Register custom helper functions:

```typescript
const service = builder.getDataProcessingService();

// Register single helper
service.registerHelper('bold', (text) => {
  return `<strong>${text}</strong>`;
});

// Register multiple helpers
service.registerHelpers({
  italic: (text) => `<em>${text}</em>`,
  link: (url, text) => `<a href="${url}">${text}</a>`
});

// Use in template
const template = '{{bold name}} - {{link website "Visit"}}';
```

---

## Helper Functions

### Built-in Helpers

#### String Manipulation

```handlebars
{{upper "hello"}}           → HELLO
{{lower "HELLO"}}           → hello
{{capitalize "hello"}}      → Hello
{{truncate text 50}}        → Truncates to 50 chars...
```

#### Date Formatting

```handlebars
{{formatDate date "YYYY-MM-DD"}}      → 2025-11-07
{{formatDate date "MM/DD/YYYY"}}      → 11/07/2025
{{formatDate date "YYYY-MM-DD HH:mm"}} → 2025-11-07 14:30
```

#### Currency Formatting

```handlebars
{{formatCurrency 99.99 "USD"}}  → $99.99
{{formatCurrency 99.99 "EUR"}}  → €99.99
{{formatCurrency 99.99 "GBP"}}  → £99.99
```

#### Math Operations

```handlebars
{{add 5 3}}              → 8
{{subtract 10 3}}        → 7
{{multiply 4 5}}         → 20
{{divide 20 4}}          → 5
```

#### Comparisons

```handlebars
{{eq a b}}               → true if a === b
{{ne a b}}               → true if a !== b
{{gt a b}}               → true if a > b
{{lt a b}}               → true if a < b
{{gte a b}}              → true if a >= b
{{lte a b}}              → true if a <= b
```

#### Logic

```handlebars
{{and a b c}}            → true if all are truthy
{{or a b c}}             → true if any is truthy
{{not a}}                → true if a is falsy
```

#### Array Operations

```handlebars
{{join items ", "}}      → Joins array with separator
{{length items}}         → Array or string length
```

#### Default Values

```handlebars
{{default value "fallback"}}  → Returns fallback if value is empty
```

---

## UI Components

### Data Source Config Modal

UI for managing data sources:

```typescript
import { DataSourceConfigModal } from '@email-builder/dev/components/modals';

<DataSourceConfigModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSave={(config) => {
    dataSourceManager.addDataSource(config);
    setShowModal(false);
  }}
  onDelete={(id) => {
    dataSourceManager.removeDataSource(id);
  }}
  initialConfig={editingSource}
  dataSources={dataSourceManager.getAllDataSources()}
/>
```

### Variable Picker

Browse and insert variables:

```typescript
import { VariablePicker } from '@email-builder/ui-solid/data-injection';

<VariablePicker
  schema={schema}
  onSelect={(variable) => {
    // Insert variable into text field
    insertVariable(variable);
  }}
  showSearch={true}
  placeholder="Search variables..."
/>
```

---

## API Reference

### DataSourceManager

```typescript
class DataSourceManager {
  // Add data source
  addDataSource(config: DataSourceConfig): void

  // Remove data source
  removeDataSource(id: string): boolean

  // Update data source
  updateDataSource(id: string, updates: Partial<DataSourceConfig>): boolean

  // Get data source
  getDataSource(id: string): DataSourceConfig | undefined

  // Get all data sources
  getAllDataSources(): DataSourceConfig[]

  // Set active data source
  setActiveDataSource(id: string): boolean

  // Get active data source
  getActiveDataSource(): DataSourceConfig | null

  // Fetch data from active source
  fetchActiveData(): Promise<Record<string, unknown>>

  // Fetch data from specific source
  fetchData(id: string): Promise<Record<string, unknown>>

  // Test connection
  testConnection(id: string): Promise<{
    success: boolean;
    message: string;
    data?: Record<string, unknown>;
  }>

  // Validate data
  validateData(data: Record<string, unknown>, schema: DataSchema): DataValidationResult

  // Generate schema from data
  generateSchema(data: Record<string, unknown>, description?: string): DataSchema

  // Clear cache
  clearCache(): void
  clearCacheForSource(id: string): void

  // Get sample data
  getSampleData(id?: string): Record<string, unknown>

  // Import/Export
  exportConfig(): DataSourceConfig[]
  importConfig(configs: DataSourceConfig[]): void
}
```

### DataProcessingService

```typescript
class DataProcessingService {
  // Register helper
  registerHelper(name: string, fn: HelperFunction): void

  // Register multiple helpers
  registerHelpers(helpers: Record<string, HelperFunction>): void

  // Process template
  process(
    template: string,
    data: Record<string, unknown>,
    options?: TemplateProcessingOptions
  ): TemplateProcessingResult
}
```

### TemplateVariableParser

```typescript
class TemplateVariableParser {
  // Parse template
  parse(template: string, options?: TemplateProcessingOptions): VariableToken[]

  // Extract variables
  extractVariables(template: string, options?: TemplateProcessingOptions): VariableExtractionResult

  // Check for variables
  hasVariables(template: string, options?: TemplateProcessingOptions): boolean

  // Get variable paths
  getVariablePaths(template: string, options?: TemplateProcessingOptions): string[]

  // Validate syntax
  validate(template: string, options?: TemplateProcessingOptions): {
    valid: boolean;
    errors: string[];
  }
}
```

---

## Examples

### Example 1: Newsletter with Dynamic Content

```typescript
// Data source
dataSourceManager.addDataSource({
  id: 'newsletter',
  name: 'Newsletter Data',
  type: DataSourceType.JSON,
  config: {
    data: {
      subscriber: {
        firstName: 'Jane',
        lastName: 'Smith'
      },
      articles: [
        { title: 'Article 1', url: 'https://example.com/1', excerpt: '...' },
        { title: 'Article 2', url: 'https://example.com/2', excerpt: '...' }
      ],
      unsubscribeUrl: 'https://example.com/unsubscribe?id=123'
    }
  },
  active: true
});

// Template
const template = `
<h1>Hello {{subscriber.firstName}}!</h1>

<h2>This Week's Articles</h2>
{{#each articles}}
  <div>
    <h3>{{title}}</h3>
    <p>{{excerpt}}</p>
    <a href="{{url}}">Read More</a>
  </div>
{{/each}}

<p><a href="{{unsubscribeUrl}}">Unsubscribe</a></p>
`;

// Process
const data = await dataSourceManager.fetchActiveData();
const result = service.process(template, data);
```

### Example 2: Order Confirmation Email

```typescript
// Data source (API)
dataSourceManager.addDataSource({
  id: 'order-api',
  name: 'Order API',
  type: DataSourceType.API,
  config: {
    url: 'https://api.example.com/orders/{{orderId}}',
    headers: { 'Authorization': 'Bearer TOKEN' },
    dataPath: 'data.order'
  },
  active: true
});

// Template
const template = `
<h1>Order Confirmation #{{orderNumber}}</h1>

<p>Thank you, {{customer.name}}!</p>

<h2>Order Details</h2>
<table>
  {{#each items}}
  <tr>
    <td>{{name}}</td>
    <td>{{quantity}}</td>
    <td>{{formatCurrency price "USD"}}</td>
  </tr>
  {{/each}}
  <tr>
    <td colspan="2">Total:</td>
    <td>{{formatCurrency total "USD"}}</td>
  </tr>
</table>

<p>Estimated delivery: {{formatDate deliveryDate "MMMM DD, YYYY"}}</p>
`;
```

### Example 3: Conditional Content Based on User Type

```typescript
const template = `
{{#if userType eq "premium"}}
  <div class="premium-banner">
    <h2>Premium Member Benefits</h2>
    <ul>
      <li>Free shipping on all orders</li>
      <li>Early access to new products</li>
      <li>Exclusive discounts</li>
    </ul>
  </div>
{{/if}}

{{#if userType eq "trial"}}
  <div class="trial-banner">
    <p>You have {{daysRemaining}} days left in your trial.</p>
    <a href="{{upgradeUrl}}">Upgrade Now</a>
  </div>
{{/if}}

{{#unless isPremium}}
  <p>Upgrade to premium for exclusive benefits!</p>
{{/unless}}
`;
```

---

## Best Practices

### 1. Always Provide Sample Data

Sample data enables previews and autocomplete:

```typescript
dataSourceManager.addDataSource({
  id: 'users',
  name: 'User Data',
  type: DataSourceType.API,
  config: { url: '...' },
  sampleData: {
    name: 'John Doe',
    email: 'john@example.com',
    // ... more sample data
  }
});
```

### 2. Use Schemas for Type Safety

Generate schemas from sample data:

```typescript
const schema = dataSourceManager.generateSchema(sampleData, 'User data schema');
const validation = dataSourceManager.validateData(actualData, schema);

if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

### 3. Handle Missing Data Gracefully

Use default values:

```typescript
const result = service.process(template, data, {
  strict: false,
  defaultValue: '',
  helpers: {
    default: (value, fallback) => value || fallback
  }
});

// In template:
// {{default userName "Guest"}}
```

### 4. Test Data Sources Before Use

```typescript
const test = await dataSourceManager.testConnection('my-api');

if (!test.success) {
  console.error('Connection failed:', test.message);
  // Use fallback data or show error
}
```

### 5. Cache API Data

Reduce API calls with caching:

```typescript
config: {
  url: '...',
  cache: true,
  cacheDuration: 300000 // 5 minutes
}
```

### 6. Escape HTML for Security

Always escape user-generated content:

```typescript
const result = service.process(template, data, {
  escapeHtml: true
});
```

### 7. Use Meaningful Variable Names

```handlebars
<!-- Good -->
{{user.profile.displayName}}
{{order.items.0.productName}}

<!-- Bad -->
{{u.p.dn}}
{{o.i.0.pn}}
```

---

## Troubleshooting

### Variables Not Replacing

**Problem**: Variables show as `{{name}}` in output

**Solutions**:
1. Check variable path is correct
2. Ensure data contains the variable
3. Check for typos in variable names
4. Verify delimiters match (default: `{{` `}}`)

```typescript
// Debug
const result = service.process(template, data);
console.log('Missing:', result.missingVariables);
console.log('Used:', result.usedVariables);
```

### API Data Source Not Working

**Problem**: API data source fails to fetch

**Solutions**:
1. Test connection: `testConnection('id')`
2. Check URL is accessible
3. Verify authentication headers
4. Check dataPath navigates correctly
5. Look at browser network tab

```typescript
const test = await dataSourceManager.testConnection('api-id');
console.log(test.message);
```

### Conditionals Not Working

**Problem**: `{{#if}}` blocks don't show/hide correctly

**Solutions**:
1. Check variable value is truthy/falsy
2. Verify conditional syntax
3. Use comparison helpers: `{{#if eq value "test"}}`

```typescript
// Truthy values: true, non-empty string, non-zero number, non-empty array
// Falsy values: false, null, undefined, "", 0, []
```

### Loops Not Rendering

**Problem**: `{{#each}}` doesn't render items

**Solutions**:
1. Verify variable is an array
2. Check array is not empty
3. Ensure closing `{{/each}}`

```typescript
// Debug
const result = service.process(template, data);
console.log('Errors:', result.errors);
```

### Performance Issues

**Problem**: Slow template processing

**Solutions**:
1. Reduce number of loops
2. Cache processed templates
3. Use smaller datasets for preview
4. Enable API caching

---

## Integration with Builder

### Access from Builder Instance

```typescript
const builder = new Builder({ target: 'email' });
await builder.initialize();

// Get managers
const dataSourceManager = builder.getDataSourceManager();
const dataProcessingService = builder.getDataProcessingService();

// Use in templates
const template = builder.getTemplateManager().getCurrentTemplate();
// Add variables to component content...
```

### Export Templates with Data

```typescript
// Process template with data before export
const template = builder.exportTemplate();
const data = await dataSourceManager.fetchActiveData();

// Process all text content
const processedTemplate = {
  ...template,
  components: template.components.map(component => ({
    ...component,
    content: processContent(component.content, data)
  }))
};

function processContent(content: any, data: any) {
  if (typeof content === 'string') {
    return service.process(content, data).output;
  }
  if (typeof content === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(content)) {
      result[key] = processContent(value, data);
    }
    return result;
  }
  return content;
}
```

---

## Conclusion

The Data Injection System provides a complete solution for dynamic content in email templates. With support for multiple data sources, powerful template syntax, and comprehensive error handling, you can create personalized, data-driven emails with ease.

**Key Takeaways**:
- ✅ Use `{{variable}}` syntax for dynamic content
- ✅ Support multiple data sources (JSON, API, custom)
- ✅ Leverage conditionals and loops for complex templates
- ✅ Use built-in helpers for common transformations
- ✅ Always provide sample data for best UX
- ✅ Handle missing data gracefully
- ✅ Escape HTML for security

For more information, see:
- [HEADLESS_API.md](./HEADLESS_API.md) - Headless API documentation
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Full requirements (§2.8)
- [examples/](./examples/) - Working code examples

---

**Questions or Issues?**
Open an issue on GitHub: https://github.com/rmadeiraneto/email-builder/issues
