/**
 * Minimal Headless Email Builder Example
 *
 * This example shows the absolute minimum code needed to create
 * and export an email template using the headless API.
 */

import { EmailBuilder } from '../builder/EmailBuilder';
import type { StorageAdapter } from '../types';

/**
 * Simple in-memory storage adapter for Node.js environments
 */
class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, any>();

  async get<T = unknown>(key: string): Promise<T | null> {
    return this.storage.get(key) || null;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys());
  }
}

async function quickEmail() {
  const builder = new EmailBuilder({
    name: 'Quick Email',
    storage: { method: 'custom', adapter: new MemoryStorageAdapter() },
  });
  await builder.initialize();

  await builder.addText({
    content: '<h1>Hello World!</h1><p>This is a minimal email template.</p>',
  });
  await builder.addButton({ text: 'Click Me', url: 'https://example.com' });

  return await builder.toHTML();
}

// One-liner usage (after initialization)
async function oneLinerEmail() {
  const builder = new EmailBuilder({
    storage: { method: 'custom', adapter: new MemoryStorageAdapter() },
  });
  await builder.initialize();

  await builder.addText({ content: '<p>Simple email content</p>' });

  return await builder.toHTML();
}

// With method chaining
async function chainedEmail() {
  const builder = new EmailBuilder({
    name: 'Chained Email',
    storage: { method: 'custom', adapter: new MemoryStorageAdapter() },
  });

  await builder.initialize();
  await builder.addHeader({ logo: 'https://example.com/logo.png' });
  await builder.addText({ content: '<p>Welcome!</p>' });
  await builder.addButton({ text: 'Get Started', url: 'https://example.com/start' });
  await builder.addFooter({ companyName: 'Acme Inc.' });

  return await builder.toHTML();
}

// Run examples
console.log('Running minimal examples...\n');

quickEmail()
  .then((html) => {
    console.log('✅ Quick Email HTML (first 200 chars):');
    console.log(html.substring(0, 200) + '...\n');
  })
  .catch(console.error);

oneLinerEmail()
  .then((html) => {
    console.log('✅ One-liner Email HTML (first 200 chars):');
    console.log(html.substring(0, 200) + '...\n');
  })
  .catch(console.error);

chainedEmail()
  .then((html) => {
    console.log('✅ Chained Email HTML (first 200 chars):');
    console.log(html.substring(0, 200) + '...\n');
  })
  .catch(console.error);
