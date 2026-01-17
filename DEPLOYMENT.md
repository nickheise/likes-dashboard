# Deployment Guide - Likes Dashboard on Vercel

This guide will help you deploy the Likes Dashboard application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (recommended: Vercel Postgres, Neon, or Supabase)
3. Twitter Developer Account with OAuth 2.0 app created

## Step 1: Set up Twitter OAuth App

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Create a new app or use an existing one
3. Under "User authentication settings":
   - Enable OAuth 2.0
   - Type of App: Web App
   - Callback URL: `https://your-app.vercel.app/api/auth/callback/twitter`
   - Website URL: `https://your-app.vercel.app`
   - Request permissions: `tweet.read`, `users.read`, `like.read`, `offline.access`
4. Save your Client ID and Client Secret

## Step 2: Set up PostgreSQL Database

### Option A: Vercel Postgres (Recommended)
1. In your Vercel project dashboard, go to Storage
2. Create a new Postgres database
3. Copy the `DATABASE_URL` from the connection string

### Option B: External Provider (Neon, Supabase, etc.)
1. Create a PostgreSQL database
2. Get the connection string (DATABASE_URL)

## Step 3: Deploy to Vercel

### Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts to link to a project

### Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `prisma generate && next build`
   - Install Command: `npm install`

## Step 4: Configure Environment Variables

In your Vercel project settings (Settings > Environment Variables), add:

```
DATABASE_URL=your-postgresql-connection-string
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key (generate with: openssl rand -base64 32)
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
```

## Step 5: Run Database Migrations

After deployment, you need to run Prisma migrations:

1. Using Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

2. Or manually run migrations in your database using the SQL from `prisma/migrations`

## Step 6: Update Twitter Callback URL

1. Go back to your Twitter Developer Portal
2. Update the callback URL to: `https://your-actual-vercel-url.vercel.app/api/auth/callback/twitter`

## Verify Deployment

1. Visit your deployed application
2. Try signing in with Twitter
3. Check that likes are syncing properly

## Troubleshooting

### Build Failures
- Check Vercel build logs for errors
- Ensure all environment variables are set
- Verify `DATABASE_URL` is accessible from Vercel

### Authentication Issues
- Verify Twitter callback URL matches exactly
- Check `NEXTAUTH_URL` matches your deployment URL
- Ensure `NEXTAUTH_SECRET` is set

### Database Issues
- Run `npx prisma migrate deploy` to ensure schema is up to date
- Check database connection from Vercel logs
- Verify `DATABASE_URL` format is correct

## Post-Deployment

### Monitoring
- Check Vercel Analytics for performance
- Monitor database usage
- Review function logs for errors

### Updates
Push to your Git repository, and Vercel will automatically redeploy.

## Support

For issues:
- Check Vercel logs: https://vercel.com/docs/concepts/deployments/logs
- Review Next.js documentation: https://nextjs.org/docs
- Prisma documentation: https://www.prisma.io/docs
