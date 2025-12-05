This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database (PostgreSQL with vector extension)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
SHADOW_DATABASE_URL="postgresql://user:password@host:port/shadow_database?sslmode=require"

# Google Generative AI (Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key-here"

# Vercel Blob Storage (REQUIRED for file uploads)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

#### How to get each token:

- **DATABASE_URL**: From your PostgreSQL provider (Neon, Supabase, etc.)
- **GOOGLE_GENERATIVE_AI_API_KEY**: Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **BLOB_READ_WRITE_TOKEN**: 
  1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
  2. Navigate to your project → Settings → Environment Variables
  3. Or create a token at [Vercel Account Tokens](https://vercel.com/account/tokens)
  4. The token should start with `vercel_blob_rw_`
- **NEXTAUTH_SECRET**: Generate with: `openssl rand -base64 32` (or any random string)

### 2. Install Dependencies & Setup Database

```bash
npm install
npm run db:migrate
npm run db:generate
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
