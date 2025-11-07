/**
 * Example 1: Server-side Email Generation
 *
 * This example demonstrates how to generate emails programmatically
 * in a Node.js environment without a UI.
 *
 * Use cases:
 * - Automated email generation for users
 * - Welcome emails, transactional emails
 * - Server-side template rendering
 */

import { Builder, TemplateExporter, EmailExportService } from '@email-builder/core';

// Custom storage adapter for Node.js (in-memory)
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

// User data interface
interface User {
  id: string;
  email: string;
  name: string;
  signupDate: Date;
}

/**
 * Generate a welcome email for a new user
 */
async function generateWelcomeEmail(user: User): Promise<string> {
  // 1. Initialize the builder
  const builder = new Builder({
    target: 'email',
    storage: {
      method: 'custom',
      adapter: new MemoryStorageAdapter()
    },
    debug: true
  });

  await builder.initialize();

  // 2. Create a welcome email template
  const template = await builder.createTemplate({
    name: `Welcome Email - ${user.name}`,
    description: 'Automated welcome email for new users',
    author: 'system',
    category: 'transactional',
    tags: ['welcome', 'automated'],
    settings: {
      target: 'email',
      locale: 'en-US',
      canvasDimensions: { width: 600, maxWidth: 600 }
    },
    generalStyles: {
      canvasBackgroundColor: '#f5f5f5',
      typography: {
        bodyText: {
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          color: '#333333'
        },
        heading1: {
          fontSize: '32px',
          color: '#2c3e50',
          fontWeight: 'bold'
        }
      }
    }
  });

  // 3. Get the component registry
  const registry = builder.getComponentRegistry();

  // 4. Create components
  const components = [];

  // Header
  const header = registry.create('header');
  header.content = {
    imageUrl: 'https://example.com/logo.png',
    imageAlt: 'Company Logo',
    imageWidth: '200',
    imageHeight: '60',
    links: []
  };
  header.styles = {
    backgroundColor: '#ffffff',
    padding: {
      top: { value: 20, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(header);

  // Hero section
  const hero = registry.create('hero');
  hero.content = {
    title: `Welcome, ${user.name}!`,
    subtitle: 'We\'re excited to have you on board',
    imageUrl: 'https://example.com/welcome-banner.jpg',
    imageAlt: 'Welcome Banner',
    buttonText: 'Get Started',
    buttonUrl: 'https://example.com/get-started'
  };
  hero.styles = {
    backgroundColor: '#3498db',
    color: '#ffffff',
    padding: {
      top: { value: 40, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 40, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(hero);

  // Text content
  const text = registry.create('text');
  text.content = {
    text: `Hi ${user.name},\n\nThank you for joining our platform! Your account was created on ${user.signupDate.toLocaleDateString()}.\n\nHere are some things you can do to get started:`,
    tag: 'p'
  };
  text.styles = {
    backgroundColor: '#ffffff',
    padding: {
      top: { value: 30, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 10, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(text);

  // List of features
  const list = registry.create('list');
  list.content = {
    items: [
      {
        title: 'Complete Your Profile',
        description: 'Add your photo and bio',
        imageUrl: 'https://example.com/profile-icon.png'
      },
      {
        title: 'Explore Features',
        description: 'Check out all the amazing features',
        imageUrl: 'https://example.com/features-icon.png'
      },
      {
        title: 'Connect with Others',
        description: 'Find and connect with people',
        imageUrl: 'https://example.com/connect-icon.png'
      }
    ],
    layout: 'vertical'
  };
  list.styles = {
    backgroundColor: '#ffffff',
    padding: {
      top: { value: 20, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(list);

  // CTA
  const cta = registry.create('cta');
  cta.content = {
    title: 'Ready to Get Started?',
    description: 'Click below to explore your dashboard',
    buttonText: 'Go to Dashboard',
    buttonUrl: `https://example.com/dashboard?userId=${user.id}`
  };
  cta.styles = {
    backgroundColor: '#ecf0f1',
    padding: {
      top: { value: 30, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 30, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(cta);

  // Footer
  const footer = registry.create('footer');
  footer.content = {
    text: '© 2025 Your Company. All rights reserved.',
    links: [
      { text: 'Privacy Policy', url: 'https://example.com/privacy' },
      { text: 'Terms of Service', url: 'https://example.com/terms' },
      { text: 'Contact Us', url: 'https://example.com/contact' }
    ],
    socialLinks: [
      { platform: 'twitter', url: 'https://twitter.com/yourcompany' },
      { platform: 'facebook', url: 'https://facebook.com/yourcompany' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' }
    ]
  };
  footer.styles = {
    backgroundColor: '#2c3e50',
    color: '#ffffff',
    padding: {
      top: { value: 20, unit: 'px' },
      right: { value: 20, unit: 'px' },
      bottom: { value: 20, unit: 'px' },
      left: { value: 20, unit: 'px' }
    }
  };
  components.push(footer);

  // 5. Update the template with components
  const templateManager = builder.getTemplateManager();
  await templateManager.update(template.metadata.id, {
    components
  });

  // 6. Export the template to HTML
  const exporter = new TemplateExporter();
  const builderHTML = exporter.export(template, {
    format: 'html',
    inlineStyles: false,
    prettyPrint: true
  }).html;

  // 7. Convert to email-safe HTML
  const emailExporter = new EmailExportService();
  const emailResult = emailExporter.export(builderHTML!, {
    inlineCSS: true,
    useTableLayout: true,
    addOutlookFixes: true,
    removeIncompatibleCSS: true,
    clientOptimizations: {
      gmail: true,
      outlook: true,
      ios: true
    },
    maxWidth: 600
  });

  // 8. Log statistics
  console.log('\n📊 Export Statistics:');
  console.log(`  - Inlined CSS rules: ${emailResult.statistics.inlinedRules}`);
  console.log(`  - Converted elements: ${emailResult.statistics.convertedElements}`);
  console.log(`  - Removed properties: ${emailResult.statistics.removedProperties}`);

  if (emailResult.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    emailResult.warnings.forEach(w => {
      console.log(`  - [${w.severity}] ${w.message}`);
    });
  }

  // 9. Cleanup
  builder.destroy();

  return emailResult.html;
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Server-side Email Generation Example\n');

  // Sample users
  const users: User[] = [
    {
      id: 'user_001',
      email: 'john.doe@example.com',
      name: 'John Doe',
      signupDate: new Date('2025-11-01')
    },
    {
      id: 'user_002',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      signupDate: new Date('2025-11-05')
    }
  ];

  // Generate emails for each user
  for (const user of users) {
    console.log(`\n📧 Generating welcome email for ${user.name} (${user.email})...`);

    const emailHTML = await generateWelcomeEmail(user);

    console.log(`✅ Email generated successfully!`);
    console.log(`   Length: ${emailHTML.length} characters`);

    // In a real application, you would send this email using your email service
    // await emailService.send({
    //   to: user.email,
    //   subject: 'Welcome to Our Platform!',
    //   html: emailHTML
    // });

    // For this example, we'll just save it to a file
    const fs = require('fs');
    const outputPath = `./output/welcome-${user.id}.html`;
    require('fs').mkdirSync('./output', { recursive: true });
    fs.writeFileSync(outputPath, emailHTML);
    console.log(`   Saved to: ${outputPath}`);
  }

  console.log('\n✨ All emails generated successfully!');
}

// Run the example
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
}

export { generateWelcomeEmail, MemoryStorageAdapter };
