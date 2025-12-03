# 🚀 OASIS-BI-PRO Complete Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Deploy Edge Functions](#deploy-edge-functions)
4. [Vercel Deployment](#vercel-deployment)
5. [Duitku Configuration](#duitku-configuration)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

- ✅ GitHub Account
- ✅ Supabase Account (https://supabase.com)
- ✅ Vercel Account (https://vercel.com)
- ✅ Duitku Merchant Account (https://duitku.com)
- ✅ Node.js >= 18.0.0
- ✅ Supabase CLI installed

---

## Supabase Setup

### 1. Create Supabase Project

```bash
# Login to Supabase
supabase login

# Initialize project (if not already)
cd /path/to/oasis-bi-pro
supabase init
```

### 2. Link to Existing Project

```bash
# Link to your Supabase project
supabase link --project-ref augohrpoogldvdvdaxxy
```

### 3. Run Database Migrations

```bash
# Apply schema to database
supabase db push

# Or manually via SQL Editor in Supabase Dashboard
# Copy contents of supabase/schema.sql and execute
```

### 4. Configure Authentication

**In Supabase Dashboard → Authentication:**

1. **Email Settings:**
   - Enable Email provider
   - Set Email confirmation required: Yes
   - Configure email templates

2. **URL Configuration:**
   ```
   Site URL: https://your-vercel-domain.vercel.app
   Redirect URLs:
     - https://your-vercel-domain.vercel.app
     - https://your-vercel-domain.vercel.app/auth/callback
     - https://your-vercel-domain.vercel.app/dashboard
   ```

3. **Security:**
   - Enable RLS (Row Level Security)
   - Configure JWT expiry: 3600 seconds

---

## Deploy Edge Functions

### 1. Deploy All Edge Functions

```bash
cd supabase/functions

# Deploy all functions
supabase functions deploy get-user-analytics
supabase functions deploy get-recent-activities
supabase functions deploy get-integrations
supabase functions deploy payment-webhook
supabase functions deploy ai-insights-generator
supabase functions deploy analytics-processor
supabase functions deploy report-generator
supabase functions deploy sync-data-source
supabase functions deploy attribution-calculator
```

### 2. Set Edge Function Secrets

```bash
# If using third-party APIs in Edge Functions
supabase secrets set DUITKU_API_KEY=your_api_key
supabase secrets set OPENAI_API_KEY=your_openai_key
```

### 3. Test Edge Functions

```bash
# Test locally
supabase functions serve get-user-analytics

# Test with curl
curl https://augohrpoogldvdvdaxxy.supabase.co/functions/v1/get-user-analytics \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

### 4. Edge Function URLs

After deployment, your Edge Functions will be available at:

```
https://augohrpoogldvdvdaxxy.supabase.co/functions/v1/[function-name]
```

**Example:**
```
https://augohrpoogldvdvdaxxy.supabase.co/functions/v1/get-user-analytics
https://augohrpoogldvdvdaxxy.supabase.co/functions/v1/payment-webhook
```

---

## Vercel Deployment

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Click "Import Project"

2. **Connect GitHub Repository**
   ```
   Repository: https://github.com/Estes786/v0-v0oasisbiproduitkuv21mainmain-02-main-3-1
   ```

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://augohrpoogldvdvdaxxy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NEXT_PUBLIC_DUITKU_MERCHANT_CODE=DS26335
   DUITKU_API_KEY=78cb96d8cb9ea9dc40d1c77068a659f6
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (5-10 minutes)

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /path/to/oasis-bi-pro
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_DUITKU_MERCHANT_CODE production
vercel env add DUITKU_API_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```

### Method 3: Auto-Deploy via Git Push

```bash
# After initial Vercel setup, every push triggers deployment
git add .
git commit -m "Deploy to production"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Run build
# 3. Deploy to production
```

---

## Duitku Configuration

### 1. Merchant Dashboard Setup

**Login to Duitku Dashboard:**
- Sandbox: https://sandbox.duitku.com/merchant
- Production: https://passport.duitku.com/merchant

### 2. Configure Callback URL

```
Project Settings → API Configuration

Callback URL: 
https://your-vercel-domain.vercel.app/api/duitku/callback

Return URL:
https://your-vercel-domain.vercel.app/payment/success
```

### 3. Get API Credentials

**For Sandbox:**
```
Merchant Code: DS26335 (already configured)
API Key: 78cb96d8cb9ea9dc40d1c77068a659f6 (already configured)
```

**For Production:**
1. Complete Duitku verification process
2. Submit required documents:
   - Business Registration (NIB)
   - NPWP
   - KTP Direktur
   - Company Profile
3. Wait for approval (1-3 business days)
4. Get production credentials
5. Update environment variables in Vercel

### 4. Test Payment Flow

**Sandbox Testing:**

```bash
# Use test card numbers provided by Duitku
# Example: BCA Virtual Account
Bank: BCA
VA Number: Will be generated by Duitku

# Test the flow:
1. Create payment via /api/duitku/checkout
2. Get payment URL
3. Access payment page
4. Use test credentials
5. Verify callback receives success
```

---

## Post-Deployment Checklist

### ✅ Frontend

- [ ] **Access Production URL**: https://your-project.vercel.app
- [ ] **Test all pages load correctly**
- [ ] **Verify responsive design** (mobile, tablet, desktop)
- [ ] **Check navigation works**
- [ ] **Test legal pages** (Terms, Privacy, etc)

### ✅ Authentication

- [ ] **Sign Up new user**
- [ ] **Verify email confirmation**
- [ ] **Sign In with credentials**
- [ ] **Test password reset**
- [ ] **Check session persistence**
- [ ] **Test logout**

### ✅ Dashboard & Features

- [ ] **Access dashboard after login**
- [ ] **Verify analytics data displays**
- [ ] **Test member area features**
- [ ] **Check integrations page**
- [ ] **Verify user profile**

### ✅ Payment Integration

- [ ] **Create test payment** (Starter plan)
- [ ] **Verify payment URL generated**
- [ ] **Complete payment flow**
- [ ] **Check callback received**
- [ ] **Verify transaction saved in database**
- [ ] **Check subscription activated**
- [ ] **Test all pricing plans** (Starter, Professional, Business)

### ✅ Edge Functions

- [ ] **Call get-user-analytics endpoint**
- [ ] **Test payment-webhook**
- [ ] **Verify analytics-processor**
- [ ] **Check all Edge Functions respond**

### ✅ Database

- [ ] **Verify data persists in Supabase**
- [ ] **Check RLS policies work**
- [ ] **Test transactions table**
- [ ] **Verify subscriptions table**

### ✅ Monitoring

- [ ] **Setup Vercel Analytics**
- [ ] **Configure error tracking**
- [ ] **Monitor Edge Function logs** (Supabase Dashboard)
- [ ] **Check database performance**

### ✅ SEO & Performance

- [ ] **Add meta tags**
- [ ] **Configure robots.txt**
- [ ] **Setup sitemap.xml**
- [ ] **Test Lighthouse score** (aim for 90+)
- [ ] **Optimize images**

### ✅ Security

- [ ] **Enable HTTPS** (automatic in Vercel)
- [ ] **Configure CORS properly**
- [ ] **Review RLS policies**
- [ ] **Test rate limiting**
- [ ] **Verify API key security**

---

## Troubleshooting

### Build Errors in Vercel

**Issue**: Build fails with TypeScript errors

**Solution**:
```bash
# Check build locally
npm run build

# Fix type errors
npm run type-check

# Commit and push
git add .
git commit -m "Fix: TypeScript errors"
git push origin main
```

### Supabase Connection Issues

**Issue**: Cannot connect to Supabase

**Solution**:
1. Verify environment variables in Vercel
2. Check Supabase URL format
3. Ensure ANON key is correct
4. Check RLS policies allow access

### Duitku Callback Not Received

**Issue**: Payment completes but status not updated

**Solution**:
1. Verify callback URL in Duitku dashboard
2. Check callback endpoint logs in Vercel
3. Ensure signature verification passes
4. Test webhook manually with Postman

### Edge Functions Not Working

**Issue**: Edge Functions return 404 or 500

**Solution**:
```bash
# Check deployment status
supabase functions list

# Redeploy function
supabase functions deploy function-name

# Check logs
supabase functions logs function-name
```

---

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs (Vercel Dashboard)
- Check payment transactions (Supabase Dashboard)
- Review user signups

**Weekly:**
- Database backup (automatic in Supabase)
- Review performance metrics
- Update dependencies if needed

**Monthly:**
- Security audit
- Performance optimization
- Feature planning

---

## Support

**Issues or Questions?**

1. **Check Logs:**
   - Vercel: https://vercel.com/your-project/logs
   - Supabase: https://app.supabase.com/project/augohrpoogldvdvdaxxy/logs

2. **Documentation:**
   - Next.js: https://nextjs.org/docs
   - Supabase: https://supabase.com/docs
   - Duitku: https://docs.duitku.com

3. **Contact:**
   - Email: elfaress2425@gmail.com
   - GitHub Issues: [Create Issue](https://github.com/Estes786/v0-v0oasisbiproduitkuv21mainmain-02-main-3-1/issues)

---

**Deployment Guide Version:** 1.0
**Last Updated:** 2025-12-03
**Status:** ✅ Ready for Production
