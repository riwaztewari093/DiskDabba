# DiskDabba Architecture

Full architecture documentation is available in the project's Antigravity artifact.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Website | Next.js 16 (App Router, TypeScript, Tailwind CSS) |
| Mobile App | Flutter 3.x (Dart, Riverpod, GoRouter) |
| Auth & Database | Supabase (PostgreSQL with RLS) |
| File Storage | Cloudflare R2 (S3-compatible, zero egress) |
| State (Web) | Zustand |
| State (Mobile) | Riverpod |

## Key Design Decisions

1. **Direct-to-R2 uploads** — File bytes go directly from the client to Cloudflare R2 via presigned URLs. Our backend only issues the permission slip and records metadata.

2. **Row-Level Security** — Every table has RLS policies so users can only access their own data, enforced at the database level.

3. **Presigned URLs expire in 15 minutes** — Limits abuse window if a URL is leaked.

4. **Per-user storage quota** — Enforced in the `profiles` table and checked before issuing an upload URL.
