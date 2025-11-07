/**
 * Minimal Headless Email Builder Example
 *
 * This example shows the absolute minimum code needed to create
 * and export an email template using the headless API.
 */

import { EmailBuilder } from '../builder/EmailBuilder';

async function quickEmail() {
  const builder = new EmailBuilder({ name: 'Quick Email' });
  await builder.initialize();

  await builder
    .addText({ content: '<h1>Hello World!</h1><p>This is a minimal email template.</p>' })
    .addButton({ text: 'Click Me', url: 'https://example.com' });

  return await builder.toHTML();
}

// One-liner usage (after initialization)
async function oneLinerEmail() {
  const builder = new EmailBuilder();
  await builder.initialize();

  await builder.addText({ content: '<p>Simple email content</p>' });

  return await builder.toHTML();
}

// With method chaining
async function chainedEmail() {
  const html = await new EmailBuilder({ name: 'Chained Email' })
    .initialize()
    .then(async (b) => {
      await b
        .addHeader({ logo: 'https://example.com/logo.png' })
        .addText({ content: '<p>Welcome!</p>' })
        .addButton({ text: 'Get Started', url: 'https://example.com/start' })
        .addFooter({ companyName: 'Acme Inc.' });

      return b.toHTML();
    });

  return html;
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
