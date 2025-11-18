# Guidee Documentation

Welcome to the Guidee project documentation. This directory contains all guides, setup instructions, and development references.

## Quick Navigation

### Getting Started
- **[Quick Start](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Installation Guide](./INSTALLATION.md)** - Detailed installation instructions
- **[Development Setup](./DEVELOPMENT_SETUP.md)** - Set up your development environment

### Project Documentation
- **[Project Summary](./DEVELOPMENT_SUMMARY.md)** - Overview of the project architecture
- **[Development Plan](./DEVELOPMENT_PLAN.md)** - Roadmap and planned features
- **[Database Schema](./database-schema.md)** - Database structure and relationships

### Feature Documentation
- **[Chat System](./CHAT_SYSTEM_README.md)** - Guide on the comprehensive chat system implementation
- **[Deployment Guide](./DEPLOYMENT.md)** - Instructions for deploying to production

## Project Structure

```
Guidee/
├── src/
│   ├── app/                  # Next.js app router
│   ├── components/           # React components
│   │   ├── reviews/         # Review system components
│   │   ├── chat/            # Chat system components
│   │   ├── layout/          # Layout components
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand state management
│   ├── types/               # TypeScript type definitions
│   └── lib/                 # Utility functions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── docs/                    # Documentation (this folder)
└── ...
```

## Key Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Prisma** - ORM and database
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **next-i18next** - Internationalization

## Common Commands

```bash
# Development
npm run dev              # Start development server

# Database
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Build & Deploy
npm run build           # Build for production
npm run start           # Start production server

# Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
npm run test            # Run tests
```

## Architecture Overview

### Three-User System
The platform supports three types of users:

1. **Travelers** - Browse services and book guides
2. **Guides** - Offer services and manage bookings
3. **Admins** - Manage users, content, and platform policies

### Core Features
- Service marketplace with search and filtering
- Real-time messaging and chat system
- Booking and payment management
- Review and rating system
- User KYC (Know Your Customer) verification
- Multi-language support (Traditional Chinese, English, Japanese, Korean)

## Development Standards

### Naming Conventions
- **Components**: PascalCase (`ReviewCard.tsx`)
- **Hooks**: camelCase starting with `use` (`useAuth.ts`)
- **Routes**: kebab-case (`/guide-services`)
- **Utilities**: camelCase (`validateEmail.ts`)

### Directory Organization
- Components are organized by feature in `/src/components/`
- Each major feature has its own directory with related components
- API routes mirror the page structure under `/src/app/api/`
- Types are centralized in `/src/types/`

## Support

For questions or issues:
1. Check the relevant documentation
2. Review the code comments and type definitions
3. Open an issue on GitHub
4. Contact the development team

---

Last Updated: November 18, 2024
