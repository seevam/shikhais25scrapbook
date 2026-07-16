# Shikha's Magic Scrapbook - Setup Guide

## Stack
- **Next.js 14** (App Router)
- **Neon** (Postgres database)
- **Prisma** (ORM)
- **Cloudinary** (photo uploads)
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

## Step 2 - Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. From your dashboard, copy:
   - **Cloud name**
   - **API Key**
   - **API Secret**
3. Go to **Settings → Upload → Upload Presets**
4. Click **Add upload preset**
   - Name it: `shikha_scrapbook`
   - Set Signing Mode to: **Unsigned**
   - Save
5. Add all values to `.env.local`

---

## Step 3 - Environment Variables

Create a `.env.local` file in the root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="shikha_scrapbook"
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
