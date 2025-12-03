# OASIS-BI-PRO-1-1-1.1 🚀

## 📊 Overview

**OASIS BI PRO** adalah platform Business Intelligence SaaS berbasis Next.js 16 yang terintegrasi penuh dengan **Supabase Edge Functions** (bukan Cloudflare/Hono) untuk backend processing, database management, dan payment gateway integration.

### 🎯 Status Proyek

- ✅ **Development Server**: Running (http://localhost:3000)
- ✅ **Public URL**: https://3000-ikly5h4p416rkfua60fn4-18e660f9.sandbox.novita.ai
- ✅ **GitHub Repository**: https://github.com/Estes786/v0-v0oasisbiproduitkuv21mainmain-02-main-3-1
- ⏳ **Vercel Deployment**: Pending
- ✅ **Supabase Integration**: Configured and Ready
- ✅ **Payment Gateway**: Duitku Integration Ready

---

## 🏗️ Architecture Stack

### Frontend
- **Framework**: Next.js 16.0.6 (with Turbopack)
- **UI Library**: React 19.2.0 + Radix UI + shadcn/ui
- **Styling**: TailwindCSS 3.4 + Framer Motion
- **Type Safety**: TypeScript 5
- **Forms**: React Hook Form + Zod validation

### Backend & Services
- **Backend Runtime**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Payment & Compliance
- **Payment Gateway**: Duitku (Sandbox + Production Ready)
- **Payment Methods**: 
  - Virtual Account (BCA, Mandiri, BNI, BRI, Permata, CIMB, Danamon)
  - E-Wallet (OVO, DANA, ShopeePay, LinkAja)
  - QRIS, Credit Card, Convenience Store
- **Compliance**: Enterprise-grade legal pages (Terms, Privacy, DPA, Refund, Cookies)

---

## 📁 Project Structure

```
oasis-bi-pro/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── duitku/              # Duitku payment integration
│   ├── auth/                     # Authentication pages
│   ├── dashboard/               # User dashboard
│   ├── member/                  # Member area
│   ├── legal/                   # Legal pages (Terms, Privacy, etc)
│   └── ...                      # Other routes
├── components/                   # Reusable React components
│   ├── ui/                      # shadcn/ui components
│   └── navigation.tsx           # Main navigation
├── lib/                          # Utility libraries
│   ├── supabase/                # Supabase client & server utils
│   ├── duitku.ts                # Duitku SDK & helpers
│   ├── pricing.ts               # Pricing plans configuration
│   └── utils.ts                 # General utilities
├── supabase/                     # Supabase configuration
│   ├── functions/               # Edge Functions (Backend Logic)
│   │   ├── get-user-analytics/  # Analytics data processor
│   │   ├── payment-webhook/     # Payment callback handler
│   │   ├── ai-insights-generator/ # AI-powered insights
│   │   └── ...                  # Other edge functions
│   ├── migrations/              # Database migrations
│   └── schema.sql               # Database schema
├── public/                       # Static assets
├── .env.local                    # Environment variables (local)
├── ecosystem.config.cjs          # PM2 configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 2. Installation

```bash
# Clone repository
git clone https://github.com/Estes786/v0-v0oasisbiproduitkuv21mainmain-02-main-3-1.git
cd oasis-bi-pro

# Install dependencies
npm install
```

### 3. Environment Configuration

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://augohrpoogldvdvdaxxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1Z29ocnBvb2dsZHZkdmRheHh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNTAyMjMsImV4cCI6MjA3OTYyNjIyM30.VFjKTODufJLlAMar38oQnt83yECTeglLGmx017CyRhY

# Duitku Configuration
NEXT_PUBLIC_DUITKU_MERCHANT_CODE=DS26335
DUITKU_API_KEY=78cb96d8cb9ea9dc40d1c77068a659f6

# Site URL (adjust for production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Development

```bash
# Start development server
npm run dev

# Or using PM2 (recommended for sandbox)
pm2 start ecosystem.config.cjs
```

### 5. Build for Production

```bash
# Build application
npm run build

# Start production server
npm start
```

---

## 🗄️ Supabase Edge Functions

### Available Edge Functions

| Function Name | Purpose | Endpoint |
|--------------|---------|----------|
| `get-user-analytics` | Fetch user analytics data | `/functions/v1/get-user-analytics` |
| `get-recent-activities` | Get recent user activities | `/functions/v1/get-recent-activities` |
| `get-integrations` | List available integrations | `/functions/v1/get-integrations` |
| `payment-webhook` | Handle payment callbacks | `/functions/v1/payment-webhook` |
| `ai-insights-generator` | Generate AI insights | `/functions/v1/ai-insights-generator` |
| `analytics-processor` | Process analytics events | `/functions/v1/analytics-processor` |
| `report-generator` | Generate custom reports | `/functions/v1/report-generator` |
| `sync-data-source` | Sync external data sources | `/functions/v1/sync-data-source` |
| `attribution-calculator` | Calculate attribution models | `/functions/v1/attribution-calculator` |

### Deploying Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy specific function
supabase functions deploy get-user-analytics

# Deploy all functions
supabase functions deploy
```

### Edge Function Example

```typescript
// supabase/functions/get-user-analytics/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! }}}
  )

  const { data: { user } } = await supabaseClient.auth.getUser()
  
  // Your logic here...
  
  return new Response(JSON.stringify({ success: true }))
})
```

---

## 💳 Payment Integration (Duitku)

### Configuration

Proyek ini menggunakan **Duitku Payment Gateway** untuk subscription billing.

**Pricing Plans:**

| Plan | Price (IDR) | Description |
|------|------------|-------------|
| **Starter** | 99,000/bulan | Perfect untuk startup dan SMEs |
| **Professional** | 299,000/bulan | Paling populer untuk growing businesses |
| **Business** | 499,000/bulan | For large teams & enterprises |

### Payment Flow

```mermaid
User → Frontend → API Route (/api/duitku/checkout) 
                → Duitku API → Payment URL
                → User pays → Duitku Callback 
                → API Route (/api/duitku/callback)
                → Supabase Update → Success Page
```

### API Endpoints

```bash
POST /api/duitku/checkout       # Create payment
POST /api/duitku/callback       # Duitku callback (webhook)
GET  /api/duitku/status         # Check payment status
GET  /api/duitku/payment-methods # Get available methods
```

---

## 🗃️ Database Schema

### Core Tables

```sql
-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan_type VARCHAR(20) CHECK (plan_type IN ('starter', 'professional', 'business')),
  amount DECIMAL(12, 2),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  merchant_order_id VARCHAR(100) UNIQUE,
  reference VARCHAR(100),
  amount DECIMAL(12, 2),
  payment_method VARCHAR(10),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan_type VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication Flow

```typescript
// Sign Up
import { supabase } from '@/lib/supabase/client'

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Get User
const { data: { user } } = await supabase.auth.getUser()
```

---

## 🌐 Deployment

### Deploy to Vercel

1. **Push to GitHub** (already done ✅)
2. **Import to Vercel**:
   ```bash
   # Via Vercel CLI
   npm install -g vercel
   vercel login
   vercel --prod
   
   # Or connect GitHub repo via Vercel dashboard
   ```

3. **Set Environment Variables in Vercel**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DUITKU_MERCHANT_CODE`
   - `DUITKU_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` (use your Vercel URL)

4. **Update Duitku Callback URL**:
   - Go to Duitku Dashboard
   - Set callback URL: `https://your-domain.vercel.app/api/duitku/callback`

---

## 🧪 Testing

### Test Payment Flow (Sandbox)

```bash
# Test credentials (Duitku Sandbox)
Merchant Code: DS26335
API Key: 78cb96d8cb9ea9dc40d1c77068a659f6

# Test payment
curl -X POST http://localhost:3000/api/duitku/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "professional",
    "email": "test@example.com",
    "phoneNumber": "081234567890",
    "customerName": "Test User"
  }'
```

### Test Edge Functions Locally

```bash
# Start Supabase locally
supabase start

# Test function
supabase functions serve get-user-analytics
curl http://localhost:54321/functions/v1/get-user-analytics \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 📋 Features Completed

### ✅ Current Features
- [x] User Authentication (Sign Up/Sign In with Supabase)
- [x] Dashboard dengan real-time analytics
- [x] Payment integration dengan Duitku
- [x] Subscription management
- [x] Legal pages (Terms, Privacy, DPA, Refund, Cookies, FAQ, Contact)
- [x] Enterprise-grade UI/UX
- [x] Responsive design (Mobile, Tablet, Desktop)
- [x] Member area dengan analytics
- [x] Integration dengan Supabase Edge Functions
- [x] Database schema dengan RLS policies
- [x] Payment webhook handling

### 🚧 Next Steps
- [ ] Deploy Edge Functions ke Supabase Production
- [ ] Complete Duitku production approval process
- [ ] Implement AI-powered insights (Edge Function)
- [ ] Add data source integrations
- [ ] Create onboarding tutorial for new users
- [ ] Setup automated email notifications
- [ ] Add multi-language support (ID/EN)
- [ ] Performance optimization & caching
- [ ] Advanced analytics dashboards
- [ ] API rate limiting & monitoring

---

## 🔧 Development Tools

### PM2 Commands

```bash
pm2 start ecosystem.config.cjs   # Start server
pm2 list                         # List processes
pm2 logs oasis-bi-pro --nostream # View logs
pm2 restart oasis-bi-pro         # Restart
pm2 stop oasis-bi-pro            # Stop
pm2 delete oasis-bi-pro          # Delete
```

### Git Workflow

```bash
git add .
git commit -m "Your message"
git push origin main
```

---

## 📞 Support & Contact

- **Email**: elfaress2425@gmail.com
- **GitHub**: https://github.com/Estes786
- **Repository Issues**: [Report Bug](https://github.com/Estes786/v0-v0oasisbiproduitkuv21mainmain-02-main-3-1/issues)

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Supabase Team** for the powerful backend platform
- **Vercel** for deployment and hosting
- **Duitku** for payment gateway integration
- **shadcn/ui** for beautiful UI components

---

**Built with ❤️ by OASIS Team**

Last Updated: 2025-12-03
Version: 1.1.1.1
