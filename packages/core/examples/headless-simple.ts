/**
 * Simple Headless Email Builder Example
 *
 * This example demonstrates how to build a simple welcome email
 * programmatically using the headless EmailBuilder API.
 */

import { EmailBuilder } from '../builder/EmailBuilder';

async function buildWelcomeEmail() {
  // Create a new email builder instance
  const builder = new EmailBuilder({
    name: 'Welcome Email',
    subject: 'Welcome to our platform!',
    description: 'A simple welcome email for new users',
    author: 'Marketing Team',
    tags: ['welcome', 'onboarding'],
  });

  // Initialize the builder
  await builder.initialize();

  // Build the email template using a fluent API
  await builder
    .setBackgroundColor('#f5f5f5')
    .addHeader({
      logo: 'https://example.com/logo.png',
      logoAlt: 'Company Logo',
      links: [
        { text: 'Home', url: 'https://example.com' },
        { text: 'About', url: 'https://example.com/about' },
        { text: 'Contact', url: 'https://example.com/contact' },
      ],
      backgroundColor: '#ffffff',
    })
    .addSpacer({ height: 40 })
    .addHero({
      heading: 'Welcome to Our Platform!',
      description: 'We\'re excited to have you on board. Let\'s get started with your journey.',
      image: 'https://example.com/welcome-hero.jpg',
      imageAlt: 'Welcome Hero',
      buttonText: 'Get Started',
      buttonUrl: 'https://example.com/get-started',
      backgroundColor: '#ffffff',
      textAlign: 'center',
    })
    .addSpacer({ height: 40 })
    .addText({
      content: '<p>Here are a few things you can do to get the most out of your account:</p>',
      textAlign: 'left',
    })
    .addList({
      items: [
        {
          title: 'Complete your profile',
          description: 'Add your information to personalize your experience',
          icon: 'ri-user-line',
        },
        {
          title: 'Explore features',
          description: 'Discover all the powerful tools at your disposal',
          icon: 'ri-compass-line',
        },
        {
          title: 'Connect with others',
          description: 'Join our community and start networking',
          icon: 'ri-team-line',
        },
      ],
      backgroundColor: '#ffffff',
    })
    .addSpacer({ height: 40 })
    .addCTA({
      heading: 'Ready to get started?',
      description: 'Click the button below to begin your journey',
      buttonText: 'Start Now',
      buttonUrl: 'https://example.com/start',
      backgroundColor: '#007bff',
      textAlign: 'center',
    })
    .addSpacer({ height: 40 })
    .addFooter({
      companyName: 'Acme Inc.',
      address: '123 Main St, San Francisco, CA 94102',
      text: '<p>&copy; 2024 Acme Inc. All rights reserved.</p>',
      socialLinks: {
        facebook: 'https://facebook.com/acme',
        twitter: 'https://twitter.com/acme',
        linkedin: 'https://linkedin.com/company/acme',
      },
      backgroundColor: '#f8f9fa',
    });

  // Export to HTML
  const html = await builder.toHTML({
    inlineCSS: true,
    minify: false,
  });

  // Export to JSON
  const json = builder.toJSON();

  // Save to storage (optional)
  await builder.save();

  return { html, json };
}

// Run the example
buildWelcomeEmail()
  .then(({ html, json }) => {
    console.log('Email template built successfully!');
    console.log('\nHTML Output (first 500 chars):');
    console.log(html.substring(0, 500) + '...');
    console.log('\nJSON Template:');
    console.log(JSON.stringify(json, null, 2));
  })
  .catch((error) => {
    console.error('Error building email:', error);
  });
