# PremiumStore

PremiumStore is a full-stack Next.js TypeScript SaaS marketplace starter for subscriptions, software licenses, templates, courses and digital downloads.

## Main Project

- `client/` - Next.js App Router app with pages and API routes
- `server/` - legacy Express API kept for reference, not needed for the Next-only submission

## Quick Start

1. Run `npm install --prefix client`
2. Copy `client/.env.example` to `client/.env.local`
3. Seed demo data with `npm run seed --prefix client`
4. Start the app with `npm run dev`

App and API: `http://localhost:3000`

Use `npm run dev:server` only when you specifically want to run the separate API-only server repo on port `5000`.
