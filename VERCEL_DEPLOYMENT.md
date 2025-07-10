# Vercel Deployment Configuration

## Critical: Environment Variables Setup

The Pendra app requires Supabase environment variables to build and deploy successfully. **This is the main blocker preventing deployment.**

### Required Environment Variables

Add these environment variables in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://mwiqrrqaxntpvjdkadhfd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM
```

### How to Configure in Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your `pendra` project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: `https://mwiqrrqaxntpvjdkadhfd.supabase.co`
   - **Environments**: Production, Preview, Development (select all)
   
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM`
   - **Environments**: Production, Preview, Development (select all)

5. Click **Save** for each variable

### Trigger New Deployment

After adding the environment variables:

1. Go to **Deployments** tab in your Vercel project
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

### Alternative: Using Vercel CLI

If you have Vercel CLI installed:

```bash
# Link project (if not already linked)
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: https://mwiqrrqaxntpvjdkadhfd.supabase.co
# Select: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM
# Select: Production, Preview, Development

# Deploy
vercel --prod
```

## Recent Fixes Applied

✅ **Layout Issues Fixed** (Commit: 325bc5c)
- Fixed header text overlap and responsive design
- Improved TaskModal z-index to prevent sidebar overlap
- Enhanced mobile layout and spacing
- Added proper CSS classes for consistent styling

✅ **Environment Files Created**
- `.env.example` - Template for required variables
- `.env.local` - Local development configuration

## Verification Steps

After configuring environment variables:

1. Check that deployment builds successfully
2. Verify the app loads without errors
3. Test authentication flow
4. Confirm task creation functionality works
5. Check responsive layout on different screen sizes

## Troubleshooting

### Build Fails
- Ensure environment variables are set correctly
- Check variable names match exactly (case-sensitive)
- Verify all environments are selected (Production, Preview, Development)

### App Loads but Features Don't Work
- Check browser console for Supabase connection errors
- Verify Supabase project is active and accessible
- Confirm anon key has correct permissions

### Layout Issues
- Clear browser cache
- Check if latest commit (325bc5c) is deployed
- Test on different devices/browsers

## Current Status

- ✅ Local build works with environment variables
- ✅ Layout fixes committed and pushed
- ⏳ **NEXT STEP**: Configure Vercel environment variables
- ⏳ Verify deployment after env vars are set
