# DiskDabba 📦

A free, cloud storage platform for individual consumers — upload, organise, share, and back up your files.

## Architecture

- **Website**: Next.js (React, TypeScript, Tailwind CSS)
- **Mobile App**: Flutter (Android, with iOS support planned)
- **Backend**: Supabase (Auth, Postgres database, Edge Functions)
- **File Storage**: Cloudflare R2 (S3-compatible object storage)

## Project Structure

```
DiskDabba/
├── web/          # Next.js website
├── mobile/       # Flutter mobile app
├── docs/         # Project documentation
└── .github/      # CI/CD workflows
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Flutter SDK ≥ 3.x
- Supabase CLI
- Git

### Website (Next.js)

```bash
cd web
cp .env.example .env.local
# Fill in your Supabase and R2 credentials
npm install
npm run dev
```

### Mobile App (Flutter)

```bash
cd mobile
cp .env.example .env
# Fill in your Supabase credentials
flutter pub get
flutter run
```

## Environment Variables

Copy the `.env.example` files in `web/` and `mobile/` and fill in your credentials. **Never commit `.env.local` or `.env` files.**

## License

MIT License — see [LICENSE](./LICENSE) for details.
