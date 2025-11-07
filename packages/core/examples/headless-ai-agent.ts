/**
 * AI Agent Email Builder Example
 *
 * This example demonstrates how an AI agent could use the EmailBuilder
 * to dynamically generate email templates based on user data or requirements.
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

/**
 * Interface for user data
 */
interface UserData {
  name: string;
  email: string;
  signupDate: string;
  interests: string[];
}

/**
 * Interface for email requirements
 */
interface EmailRequirements {
  type: 'welcome' | 'newsletter' | 'promotional' | 'transactional';
  tone: 'formal' | 'casual' | 'friendly';
  includeHero: boolean;
  includeCTA: boolean;
  includeFooter: boolean;
}

/**
 * AI Agent Email Generator
 *
 * This class simulates an AI agent that generates email templates
 * based on user data and requirements.
 */
class AIEmailGenerator {
  private builder: EmailBuilder;

  constructor() {
    this.builder = new EmailBuilder({
      debug: false,
      storage: { method: 'custom', adapter: new MemoryStorageAdapter() },
    });
  }

  /**
   * Generates a personalized email template
   */
  async generateEmail(
    userData: UserData,
    requirements: EmailRequirements
  ): Promise<{ html: string; json: any }> {
    // Initialize the builder
    await this.builder.initialize();

    // Set template metadata based on requirements
    this.builder
      .setName(`${requirements.type} Email for ${userData.name}`)
      .setSubject(this.generateSubject(requirements.type, userData))
      .setDescription(`Auto-generated ${requirements.type} email`)
      .setAuthor('AI Email Generator')
      .setTags([requirements.type, requirements.tone, 'auto-generated'])
      .setBackgroundColor('#f5f5f5');

    // Add header
    await this.builder.addHeader({
      logo: 'https://example.com/logo.png',
      logoAlt: 'Company Logo',
      links: [
        { text: 'Home', url: 'https://example.com' },
        { text: 'Products', url: 'https://example.com/products' },
        { text: 'Support', url: 'https://example.com/support' },
      ],
      backgroundColor: '#ffffff',
    });

    await this.builder.addSpacer({ height: 40 });

    // Add hero section if required
    if (requirements.includeHero) {
      await this.addHeroSection(userData, requirements);
      await this.builder.addSpacer({ height: 40 });
    }

    // Add main content based on email type
    await this.addMainContent(userData, requirements);

    await this.builder.addSpacer({ height: 40 });

    // Add CTA if required
    if (requirements.includeCTA) {
      await this.addCTASection(requirements);
      await this.builder.addSpacer({ height: 40 });
    }

    // Add footer if required
    if (requirements.includeFooter) {
      await this.builder.addFooter({
        companyName: 'Acme Inc.',
        address: '123 Main St, San Francisco, CA 94102',
        text: '<p>You received this email because you signed up on our platform.</p>',
        socialLinks: {
          facebook: 'https://facebook.com/acme',
          twitter: 'https://twitter.com/acme',
          linkedin: 'https://linkedin.com/company/acme',
          instagram: 'https://instagram.com/acme',
        },
        backgroundColor: '#f8f9fa',
      });
    }

    // Export to HTML and JSON
    const html = await this.builder.toHTML({
      inlineCSS: true,
      minify: false,
    });
    const json = this.builder.toJSON();

    return { html, json };
  }

  /**
   * Generates an appropriate subject line
   */
  private generateSubject(type: string, userData: UserData): string {
    switch (type) {
      case 'welcome':
        return `Welcome ${userData.name}! Let's get started`;
      case 'newsletter':
        return `Your weekly newsletter, ${userData.name}`;
      case 'promotional':
        return `Special offer just for you, ${userData.name}!`;
      case 'transactional':
        return `Your account update`;
      default:
        return 'Important message';
    }
  }

  /**
   * Adds a hero section based on email type
   */
  private async addHeroSection(
    userData: UserData,
    requirements: EmailRequirements
  ): Promise<void> {
    const heroContent = this.getHeroContent(requirements.type, userData);

    await this.builder.addHero({
      heading: heroContent.heading,
      description: heroContent.description,
      image: heroContent.image,
      buttonText: heroContent.buttonText,
      buttonUrl: heroContent.buttonUrl,
      backgroundColor: '#ffffff',
      textAlign: 'center',
    });
  }

  /**
   * Gets hero content based on email type
   */
  private getHeroContent(
    type: string,
    userData: UserData
  ): {
    heading: string;
    description: string;
    image: string;
    buttonText: string;
    buttonUrl: string;
  } {
    switch (type) {
      case 'welcome':
        return {
          heading: `Welcome, ${userData.name}!`,
          description: 'We\'re thrilled to have you join our community.',
          image: 'https://example.com/welcome-hero.jpg',
          buttonText: 'Get Started',
          buttonUrl: 'https://example.com/onboarding',
        };
      case 'newsletter':
        return {
          heading: 'Your Weekly Newsletter',
          description: 'Here are the latest updates and insights just for you.',
          image: 'https://example.com/newsletter-hero.jpg',
          buttonText: 'Read More',
          buttonUrl: 'https://example.com/newsletter',
        };
      case 'promotional':
        return {
          heading: 'Exclusive Offer Inside!',
          description: `${userData.name}, we have a special deal waiting for you.`,
          image: 'https://example.com/promo-hero.jpg',
          buttonText: 'Claim Offer',
          buttonUrl: 'https://example.com/offers',
        };
      default:
        return {
          heading: 'Important Update',
          description: 'We have some important information to share with you.',
          image: 'https://example.com/default-hero.jpg',
          buttonText: 'Learn More',
          buttonUrl: 'https://example.com',
        };
    }
  }

  /**
   * Adds main content based on email type and user data
   */
  private async addMainContent(
    userData: UserData,
    requirements: EmailRequirements
  ): Promise<void> {
    switch (requirements.type) {
      case 'welcome':
        await this.addWelcomeContent(userData);
        break;
      case 'newsletter':
        await this.addNewsletterContent(userData);
        break;
      case 'promotional':
        await this.addPromotionalContent(userData);
        break;
      case 'transactional':
        await this.addTransactionalContent(userData);
        break;
    }
  }

  /**
   * Adds welcome email content
   */
  private async addWelcomeContent(userData: UserData): Promise<void> {
    await this.builder.addText({
      content: `<p>Hi ${userData.name},</p><p>Thank you for joining us on ${new Date(userData.signupDate).toLocaleDateString()}. We're excited to help you achieve your goals.</p>`,
      textAlign: 'left',
    });

    // Personalized recommendations based on interests
    if (userData.interests.length > 0) {
      await this.builder.addList({
        items: userData.interests.map((interest) => ({
          title: `Explore ${interest}`,
          description: `Discover content and features related to ${interest}`,
          icon: 'ri-star-line',
        })),
        backgroundColor: '#ffffff',
      });
    }
  }

  /**
   * Adds newsletter content
   */
  private async addNewsletterContent(userData: UserData): Promise<void> {
    await this.builder.addText({
      content: `<p>Hi ${userData.name},</p><p>Here's what's new this week:</p>`,
      textAlign: 'left',
    });

    await this.builder.addList({
      items: [
        {
          title: 'Feature Update',
          description: 'We\'ve added new capabilities to improve your experience',
          icon: 'ri-rocket-line',
        },
        {
          title: 'Community Spotlight',
          description: 'Check out what other users are creating',
          icon: 'ri-community-line',
        },
        {
          title: 'Tips & Tricks',
          description: 'Learn how to get the most out of our platform',
          icon: 'ri-lightbulb-line',
        },
      ],
      backgroundColor: '#ffffff',
    });
  }

  /**
   * Adds promotional content
   */
  private async addPromotionalContent(userData: UserData): Promise<void> {
    await this.builder.addText({
      content: `<p>Hi ${userData.name},</p><p>We have an exclusive offer just for you! For a limited time, enjoy special pricing on our premium features.</p>`,
      textAlign: 'left',
    });

    await this.builder.addSpacer({ height: 20 });

    await this.builder.addButton({
      text: 'View Offer',
      url: 'https://example.com/offers',
      backgroundColor: '#28a745',
      color: '#ffffff',
      align: 'center',
    });
  }

  /**
   * Adds transactional content
   */
  private async addTransactionalContent(userData: UserData): Promise<void> {
    await this.builder.addText({
      content: `<p>Hi ${userData.name},</p><p>Your account has been updated. Here are the details:</p>`,
      textAlign: 'left',
    });

    await this.builder.addSeparator({
      color: '#e0e0e0',
      height: 1,
      width: 100,
    });

    await this.builder.addText({
      content: `<ul>
        <li>Email: ${userData.email}</li>
        <li>Member since: ${new Date(userData.signupDate).toLocaleDateString()}</li>
        <li>Interests: ${userData.interests.join(', ')}</li>
      </ul>`,
      textAlign: 'left',
    });
  }

  /**
   * Adds CTA section
   */
  private async addCTASection(requirements: EmailRequirements): Promise<void> {
    const ctaContent = this.getCTAContent(requirements.type);

    await this.builder.addCTA({
      heading: ctaContent.heading,
      description: ctaContent.description,
      buttonText: ctaContent.buttonText,
      buttonUrl: ctaContent.buttonUrl,
      backgroundColor: '#007bff',
      textAlign: 'center',
    });
  }

  /**
   * Gets CTA content based on email type
   */
  private getCTAContent(type: string): {
    heading: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  } {
    switch (type) {
      case 'welcome':
        return {
          heading: 'Ready to dive in?',
          description: 'Start exploring all the features we have to offer',
          buttonText: 'Explore Now',
          buttonUrl: 'https://example.com/explore',
        };
      case 'newsletter':
        return {
          heading: 'Want more insights?',
          description: 'Visit our blog for in-depth articles and guides',
          buttonText: 'Visit Blog',
          buttonUrl: 'https://example.com/blog',
        };
      case 'promotional':
        return {
          heading: 'Don\'t miss out!',
          description: 'This offer expires soon',
          buttonText: 'Claim Now',
          buttonUrl: 'https://example.com/claim',
        };
      default:
        return {
          heading: 'Need help?',
          description: 'Our support team is here for you',
          buttonText: 'Contact Support',
          buttonUrl: 'https://example.com/support',
        };
    }
  }
}

// Example usage
async function main() {
  const generator = new AIEmailGenerator();

  // Simulate user data
  const userData: UserData = {
    name: 'John Doe',
    email: 'john@example.com',
    signupDate: '2024-01-15',
    interests: ['Web Development', 'Email Marketing', 'Design'],
  };

  // Define email requirements
  const requirements: EmailRequirements = {
    type: 'welcome',
    tone: 'friendly',
    includeHero: true,
    includeCTA: true,
    includeFooter: true,
  };

  console.log('Generating email with AI agent...');
  console.log('User:', userData);
  console.log('Requirements:', requirements);

  const { html, json } = await generator.generateEmail(userData, requirements);

  console.log('\n✅ Email generated successfully!');
  console.log('\nHTML Output (first 500 chars):');
  console.log(html.substring(0, 500) + '...');
  console.log('\nTemplate Metadata:');
  console.log(JSON.stringify(json?.metadata, null, 2));
}

// Run the example
main().catch(console.error);
