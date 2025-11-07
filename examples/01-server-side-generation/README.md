# Example 1: Server-side Email Generation

This example demonstrates how to generate personalized emails programmatically in a Node.js environment without requiring a UI.

## Use Cases

- **Automated welcome emails** for new users
- **Transactional emails** (order confirmations, password resets)
- **Newsletter generation** from templates
- **Personalized email campaigns**

## Features Demonstrated

✅ Headless Builder initialization with custom storage
✅ Programmatic template creation
✅ Dynamic component generation with user data
✅ Email-safe HTML export
✅ Batch processing multiple recipients

## Running the Example

```bash
# Install dependencies
npm install

# Run the example
npx tsx index.ts
```

## Output

The script will generate HTML files in the `./output` directory for each user.

## Integration with Email Services

To send the generated emails, integrate with your email service:

### SendGrid

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: user.email,
  from: 'noreply@example.com',
  subject: 'Welcome to Our Platform!',
  html: emailHTML
});
```

### Nodemailer

```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: 'your-email@example.com',
    pass: 'your-password'
  }
});

await transporter.sendMail({
  from: 'noreply@example.com',
  to: user.email,
  subject: 'Welcome to Our Platform!',
  html: emailHTML
});
```

### AWS SES

```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const ses = new SESClient({ region: 'us-east-1' });

await ses.send(new SendEmailCommand({
  Source: 'noreply@example.com',
  Destination: { ToAddresses: [user.email] },
  Message: {
    Subject: { Data: 'Welcome to Our Platform!' },
    Body: { Html: { Data: emailHTML } }
  }
}));
```

## Customization

### Adding More Components

```typescript
// Add a separator
const separator = registry.create('separator');
separator.styles = {
  backgroundColor: '#e0e0e0',
  height: { value: 1, unit: 'px' }
};
components.push(separator);

// Add an image
const image = registry.create('image');
image.content = {
  src: 'https://example.com/image.jpg',
  alt: 'Product Image',
  width: '600',
  height: '400'
};
components.push(image);
```

### Custom Styling

```typescript
template.generalStyles = {
  canvasBackgroundColor: '#f0f0f0',
  typography: {
    bodyText: {
      fontFamily: 'Georgia, serif',
      fontSize: '18px',
      color: '#444444'
    },
    heading1: {
      fontSize: '36px',
      color: '#1a1a1a',
      fontWeight: 'bold'
    }
  },
  linkStyles: {
    color: '#3498db',
    hoverColor: '#2980b9'
  }
};
```

## Performance Tips

- **Reuse the Builder instance** for multiple emails in a batch
- **Cache templates** that don't change between users
- **Use template variables** instead of creating new templates for each user
- **Implement connection pooling** for email services

## Error Handling

```typescript
try {
  const emailHTML = await generateWelcomeEmail(user);
  await sendEmail(user.email, emailHTML);
  console.log(`✅ Email sent to ${user.email}`);
} catch (error) {
  console.error(`❌ Failed to send email to ${user.email}:`, error);
  // Log to error tracking service
  // Retry with exponential backoff
  // Store in dead letter queue
}
```

## Next Steps

- See [Example 2](../02-batch-processing/) for efficient batch processing
- See [Example 3](../03-rest-api/) for REST API integration
- See the [HEADLESS_API.md](/HEADLESS_API.md) for complete API documentation
