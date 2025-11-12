# Email Builder

A reactive, framework-agnostic email/newsletter/webpage builder using microfrontend architecture.

## Features

- 🎨 **Drag and Drop Interface** - Intuitive visual editor
- 🧩 **Component-Based** - Reusable, customizable components
- 📱 **Responsive** - Works on desktop and mobile
- 📧 **Email Compatible** - Supports Outlook 2016-365
- 🎯 **Framework Agnostic** - Works with React, Next.js, Blazor, and more
- 🔧 **Highly Customizable** - Style presets, themes, and custom components
- 📝 **Rich Text Editor** - Based on Lexical
- 🎭 **Design Tokens** - W3C format for consistent theming

## Project Structure

This is a monorepo managed with pnpm workspaces:

```
email-builder/
├── packages/
│   ├── core/                    # Framework-agnostic core
│   ├── tokens/                  # Design tokens
│   ├── ui-components/           # Vanilla JS UI components
│   ├── ui-solid/                # Solid JS implementation
│   ├── adapters/                # Framework adapters
│   ├── email-components/        # Email-specific components
│   ├── web-components/          # Web-specific components
│   └── post-processing-services/# Headless services
│
├── apps/
│   ├── dev/                     # Development sandbox
│   ├── react-demo/              # React demo
│   ├── next-demo/               # Next.js demo
│   └── blazor-demo/             # Blazor demo
│
├── tools/                       # Build tools and configs
└── docs/                        # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server
pnpm dev
```

### Development

```bash
# Run dev server
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck
```

## Packages

### Core Packages

- **[@email-builder/core](./packages/core)** - Framework-agnostic core functionality
- **[@email-builder/tokens](./packages/tokens)** - Design tokens
- **[@email-builder/ui-components](./packages/ui-components)** - Vanilla JS UI components
- **[@email-builder/ui-solid](./packages/ui-solid)** - Solid JS implementation

### Adapters

- **[@email-builder/react](./packages/adapters/react)** - React adapter
- **[@email-builder/next](./packages/adapters/next)** - Next.js adapter
- **[@email-builder/blazor](./packages/adapters/blazor)** - Blazor adapter

### Components

- **[@email-builder/email-components](./packages/email-components)** - Email-specific components
- **[@email-builder/web-components](./packages/web-components)** - Web-specific components

### Services

- **[@email-builder/inline-style](./packages/post-processing-services/inline-style)** - HTML/CSS inlining
- **[@email-builder/data-processing](./packages/post-processing-services/data-processing)** - Data placeholders

## Documentation

### Essential Documents
- [Requirements](./REQUIREMENTS.md) - Complete requirements and specifications
- [Development Guidelines](./.claude/claude.md) - Coding standards and best practices
- [Solid.js Reactivity Guide](./SOLID_REACTIVITY_GUIDE.md) - **⚠️ REQUIRED READING** for anyone working with event handlers and signals
- [Project Notes](./NOTES.md) - Quick reference and decisions

### Organized Documentation
All additional documentation is organized in the [`docs/`](./docs/) directory:
- **[Architecture](./docs/architecture/)** - System design and API references
- **[Implementation](./docs/implementation/)** - Migration guides and setup instructions
- **[Testing](./docs/testing/)** - Testing strategies and QA documentation
- **[Planning](./docs/planning/)** - Current tasks and future ideas
- **[Reference](./docs/reference/)** - Quick command reference
- **[Sessions](./docs/sessions/)** - Development history and progress

See [docs/README.md](./docs/README.md) for complete documentation index.

## Contributing

This project follows:

- **Atomic Commits** - One logical change per commit
- **Conventional Commits** - Structured commit messages
- **SOLID Principles** - Clean, maintainable code
- **BEM + CSS Modules** - For component styles
- **Tailwind** - For layout/container components

See [Development Guidelines](./.claude/claude.md) for detailed conventions.

## License

MIT © Ricardo Madeira
