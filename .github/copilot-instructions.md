# Inmemso Architecture - AI Coding Instructions

## Project Overview
Inmemso Architecture is a modern React portfolio website for an architecture firm, built with TypeScript, Vite, React 19, Payload CMS v3, and Prisma. It features dynamic component-based architecture with graceful fallbacks to mock data when the CMS API is unavailable.

## Architecture & Data Flow

### Frontend-Backend Integration Pattern
- **Primary data source**: Payload CMS API 

**Key insight**: The system never blocks - if Payload CMS isn't running or times out, components automatically render mock data with zero UI disruption.

### Database (SQL-Only)
- **Development**: SQLite (file-based at `dev.db`)
- **Production**: PostgreSQL (configurable via `DATABASE_URL`)
- **ORM**: Prisma with schema at [prisma/schema.prisma](prisma/schema.prisma)
- **Migrations**: Auto-generated in `prisma/migrations/` - use `npx prisma migrate dev` or `npx prisma db push`
- **⚠️ MongoDB has been removed** - project is standardized on SQL databases only

### Collections in Payload CMS
- **users**: User authentication with roles (admin, editor, viewer)
- **projects**: Architecture projects with richText content, arrays for services/technologies
- **services**: Service offerings with descriptions and galleries
- **media**: Upload collection for images and files

## Build & Development Workflow

### Common Commands
```bash
npm run dev              # Start Vite dev server (frontend only, port 5173)
npm run dev:admin      # Start Payload CMS server (port 3000)
npm run dev:full       # Run both concurrently (backend + frontend)
npm run build          # TypeScript check + Vite production build
npm run lint           # ESLint with strict no-warnings policy
npm run db:seed        # Seed SQLite database with test data
```

### Development Flow
1. **Frontend-only mode** (recommended): `npm run dev` - components render mock data; no CMS setup required
2. **Full stack mode**: `npm run dev:full` - both services running; Payload at :3000, Vite at :5173
3. **CSS/styling**: Tailwind v4 with PostCSS, config at [tailwind.config.js](tailwind.config.js)

### Important Notes
- TypeScript target is **ES2022** with module `ESNext`
- Path alias `@/*` points to workspace root for imports: `import { Component } from '@/components'`
- Vite is configured with source maps in production builds (`sourcemap: true`)
- Environment variables in `env.local` (not committed) - see `env.example` for template

## Component Patterns & Conventions

### Page Templates
Component files ending in `Template.tsx` (e.g., [components/ProjectTemplate.tsx](components/ProjectTemplate.tsx)) are full-page layout composites:
- Accept `data`, `nextItem`, `onNavigate`, and `onBack` callbacks
- Manage scroll-to-top with `useEffect` when data changes
- Compose specialized sections (Hero, Specs, Gallery, CTA)

### Data-Driven Components
Service/Project components fetch data via custom hooks:
```tsx
const { services, loading, error } = useServices();
```
Then pass data objects to display components. This separation enables testing without API calls.

### Styling Approach
- **Tailwind CSS** for utilities; no inline styles
- **Framer Motion** for animations ([package.json](package.json) dependency)
- Component-scoped logic, globally available Tailwind classes
- Responsive design uses Tailwind breakpoints (mobile-first)

## Project Structure Conventions

- `components/`: Presentational React components (not page routes)
- `src/hooks/`: Custom React hooks for data fetching and state
- `src/services/`: Business logic (API calls, data transformation, mock data)
- `src/types/`: TypeScript interfaces and type definitions
- `src/data/`: Hard-coded static data if separate from services
- `prisma/`: Database schema, migrations, seed scripts
- `app/`: Next.js API routes (minimal use in this Vite-based project)

## Key Files & Their Roles

| File | Purpose |
|------|---------|
| [App.tsx](App.tsx) | Main entry point, routing logic, state management |
| [payload.config.ts](payload.config.ts) | Payload CMS schema and admin panel configuration |
| [prisma/schema.prisma](prisma/schema.prisma) | Database models for SQLite/PostgreSQL |
| [src/services/payloadAPI.ts](src/services/payloadAPI.ts) | Axios instance with token auth & error handling |
| [src/hooks/usePayloadData.ts](src/hooks/usePayloadData.ts) | Data fetching hooks with fallback logic |
| [tailwind.config.js](tailwind.config.js) | Tailwind CSS theme and variant configuration |
| [vite.config.ts](vite.config.ts) | Vite bundler settings, environment variable passing |

## Common Pitfalls & Solutions

1. **CMS API unavailable**: By design - don't add error UI. Check [src/services/payloadData.ts](src/services/payloadData.ts) for how mock data is used automatically.
2. **Database connection issues**: Ensure `DATABASE_URL` in `env.local` is correct. For SQLite: `file:./dev.db`; for PostgreSQL: connection string.
3. **Missing `GEMINI_API_KEY`**: Used only for environment variable passing in Vite config; may be unused. Check [env.example](env.example).
4. **TypeScript errors**: Ensure Prisma client is generated: `npx prisma generate`
5. **Tailwind not working**: Verify [postcss.config.js](postcss.config.js) includes tailwind preset; rebuild if needed.

## CMS Content Model Understanding

**Projects** contain:
- Basic fields: title, slug, description, year, status
- Rich text: `content` field (Lexical editor, stored as serialized JSON)
- Relations: `services[]` and `technologies[]` (array collections)
- Media: `featuredImage` upload field

**Services** contain:
- Basic fields: title, description, slug
- Gallery: array of images
- Parent projects (inverse relation)

Use [payload.config.ts](payload.config.ts) to understand the collection schema and update admin UI as needed.

## Extension Points

- **New data types**: Add model to [prisma/schema.prisma](prisma/schema.prisma) + collection to [payload.config.ts](payload.config.ts)
- **New pages**: Create template component in `components/` and add routing case in [App.tsx](App.tsx)
- **Animations**: Use Framer Motion's `motion` components; see existing components for patterns
- **New services**: Add fetch function to [src/services/payloadData.ts](src/services/payloadData.ts) and corresponding hook in [src/hooks/usePayloadData.ts](src/hooks/usePayloadData.ts)
