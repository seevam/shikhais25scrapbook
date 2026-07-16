# Shikha's Magic Scrapbook - Setup Guide

## Stack
- **Next.js 14** (App Router)
- **Neon** (Postgres database)
- **Prisma** (ORM)
- **Vercel Blob** (photo uploads)
- **Vercel** (hosting)

---

## Step 1 - Neon Database

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project called `shikha-scrapbook`
3. Copy the **Connection string** (looks like `postgresql://user:pass@host/dbname?sslmode=require`)
4. Paste it as `DATABASE_URL` in your `.env.local`

Then run:
```bash
npx prisma generate
npx prisma db push
```

This creates the `Submission` table in your Neon database.

---

## Step 2 - Vercel Blob

1. Go to [vercel.com](https://vercel.com) and open your project
2. Navigate to **Storage** → **Create Database** → **Blob**
3. Follow the prompts — Vercel will automatically set `BLOB_READ_WRITE_TOKEN` in your project environment variables

For local development, copy the token from your Vercel project's environment settings.

---

## Step 3 - Environment Variables

Create a `.env.local` file in the root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## Step 4 - Run Locally

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 5 - Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy!

---

## Step 6 - Add Your Sample Image

Replace the placeholder on the intro screen:

In `app/page.tsx`, find the `sampleImage` div and replace it with:

```tsx
<div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20 }}>
  <img src="/sample-page.jpg" alt="Sample scrapbook page" style={{ width: '100%' }} />
</div>
```

Then put your image at `public/sample-page.jpg`.

---

## Viewing Submissions

To see all responses, you can either:

**Option A - Prisma Studio (local)**
```bash
npx prisma studio
```
Opens a visual dashboard at localhost:5555

**Option B - Neon Console**
Go to neon.tech → your project → SQL Editor and run:
```sql
SELECT * FROM "Submission" ORDER BY "createdAt" DESC;
```
