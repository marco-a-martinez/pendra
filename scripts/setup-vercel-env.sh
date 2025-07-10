#!/bin/bash

# Vercel Environment Variables Setup Script
# Run this script after installing Vercel CLI: npm i -g vercel

echo "🚀 Setting up Vercel environment variables for Pendra"
echo "================================================"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

echo "📋 This script will add the required Supabase environment variables to Vercel"
echo ""
echo "Variables to be added:"
echo "- NEXT_PUBLIC_SUPABASE_URL"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""

read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

# Link project if not already linked
echo "🔗 Linking Vercel project..."
vercel link --yes

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project. Please run 'vercel link' manually first."
    exit 1
fi

# Add environment variables
echo "🔧 Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://mwiqrrqaxntpvjdkadhfd.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

echo "🔧 Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aXFycWF4bnRwdmpka2FkaGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU0MTYsImV4cCI6MjA2NzY4MTQxNn0.oyDPn3nbg3YssjMbL2gbcQ6mbb8ZOW_KZZMf3ySA-iM" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

echo ""
echo "✅ Environment variables configured!"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy to production: vercel --prod"
echo "2. Or push a commit to trigger auto-deployment"
echo "3. Check deployment status in Vercel dashboard"
echo ""
echo "📖 For manual setup, see VERCEL_DEPLOYMENT.md"
