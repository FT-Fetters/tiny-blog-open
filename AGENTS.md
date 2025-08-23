# Repository Guidelines

## Project Structure & Module Organization
- Source: `src/` with `app/` (Next.js 14 App Router), `components/`, `hooks/`, `lib/`, and `types/`.
  - Admin features: `src/app/admin/` (pages), `src/app/api/admin/` (API routes), admin-specific components.
- Content: Markdown posts/pages in `content/posts/` and `content/pages/`; images in `content/images/`.
- Config: `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, TypeScript in `tsconfig.json`.
- Site config: `config/site.config.json` with dynamic loading support.
- Public assets: `public/`. Docs and scripts: `docs/`, `scripts/`. Docker support under `docker/`.

## Build, Test, and Development Commands
- Run locally: `pnpm dev` (or `npm run dev`) — starts Next.js dev server.
- Build: `pnpm build` — compiles production build.
- Start: `pnpm start` — serves the built app.
- Lint: `pnpm lint` — runs ESLint (Next core-web-vitals config).
- Type check: `pnpm type-check` — strict TypeScript checks (`tsc --noEmit`).

## Coding Style & Naming Conventions
- Language: TypeScript with `strict: true`.
- Linting: extends `next/core-web-vitals`; enforced rule: `prefer-const`.
- Indentation: 2 spaces; keep lines readable (<100 chars when practical).
- Components: `PascalCase` (e.g., `PostCard.tsx`); hooks: `use*` in `src/hooks/` (e.g., `usePosts.ts`).
- Modules: use path alias `@/*` (e.g., `import { getPosts } from '@/lib/posts'`).
- Styling: Tailwind CSS; prefer utility classes and co-locate minimal CSS in `app/globals.css` when needed.

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest or Jest.
- Place tests next to sources as `*.test.ts(x)` (e.g., `src/lib/posts.test.ts`).
- Cover content parsing (`src/lib/*`) and critical hooks. Aim for clear, deterministic tests.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`). Use optional scope: `feat(components): ...`.
- PRs: include a clear summary, linked issues, and screenshots/GIFs for UI changes. Note any schema/content updates under `content/`.
- Keep PRs focused and small; ensure `pnpm lint` and `pnpm type-check` pass.

## Security & Configuration Tips
- Do not commit secrets. Use environment variables via `.env.local` (ignored by Git).
- Validate/limit user-provided paths in API routes (see `src/app/api/**`).
- For Docker, prefer the provided `docker/` setup; verify `NEXT_PUBLIC_*` envs at build time.

## Admin System Architecture
- **Authentication**: JWT-based with secure entrance codes (8-char random strings).
- **Access Control**: PC-only restriction via device detection (`useMobileDetection` hook).
- **API Security**: All admin routes require JWT validation; role-based permissions (admin role).
- **Components**: 
  - `AdminLayout`, `ProtectedAdminPage`, `AdminLogin` for authentication flow.
  - `MarkdownEditor`, `PostForm`, `ConfigManager` for content management.
  - `MobileRestricted` for device access control.
- **State Management**: `useAuth` hook manages JWT tokens with cookie persistence.

## Development & Testing for Admin Features
- Access admin panel: `/admin?key=YOUR_8_CHAR_CODE` (PC only).
- Test auth flow: POST to `/api/admin/auth` with `{"secureEntrance": "CODE"}`.
- Verify protected routes with Authorization header: `Bearer JWT_TOKEN`.
- Security considerations: Never expose secure entrance codes; validate all admin API inputs.

