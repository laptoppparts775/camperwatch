# CamperWatch 🌲

A unified campground search and booking aggregator for Lake Tahoe.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment variables
Copy `.env.local.example` to `.env.local` and fill in:
```bash
cp .env.local.example .env.local
```

For MVP/demo, you can run without Supabase — the app uses local seed data.

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Leaflet + OpenStreetMap (free, no API key needed)
- **Deploy**: Vercel

## Pages
- `/` — Homepage with search
- `/search` — Results with filters and map view
- `/campground/[slug]` — Detailed campground page with booking redirect

## Adding Campgrounds
Edit `src/lib/data.ts` to add more campgrounds.
For production, connect Supabase using `supabase-schema.sql`.

## Deploy to Vercel
```bash
vercel deploy
```
