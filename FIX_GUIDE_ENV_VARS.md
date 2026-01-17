# 🔧 Complete Fix Guide - Environment Variables Required

## ⚠️ Current Issue

Your site shows **"TypeError: Invalid URL"** because the app was built for Manus (which auto-injects environment variables) but Vercel requires manual configuration.

## 🎯 Quick Solution

You have **TWO OPTIONS**:

### Option 1: Get Values from Manus (RECOMMENDED)
### Option 2: Create Default/Test Values

---

## 📋 Option 1: Extract from Manus Deployment

### Step 1: Access Your Manus Site
Go to: **https://tredfi-onb-r6pyqfte.manus.space/**

### Step 2: Open Browser Developer Console
- Press `F12` (Windows/Linux) or `Cmd+Option+I` (Mac)
- Go to the **Console** tab

### Step 3: Run This Command
Paste this into the console and press Enter:

```javascript
// Extract all VITE_ environment variables
Object.keys(import.meta.env).filter(k => k.startsWith('VITE_')).forEach(k => {
  console.log(`${k}=${import.meta.env[k]}`);
});
```

### Step 4: Copy the Output
You should see something like:
```
VITE_OAUTH_PORTAL_URL=https://...
VITE_APP_ID=...
VITE_FRONTEND_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_ANALYTICS_ENDPOINT=...
VITE_ANALYTICS_WEBSITE_ID=...
```

### Step 5: Add to Vercel
1. Go to: https://vercel.com/audience-activator-sales-pages-projects/tredfi-onboarding/settings/environment-variables
2. Add each variable
3. Redeploy

---

## 📋 Option 2: Temporary Test Configuration

If you can't access Manus right now, here's how to set up test values:

### Add These to Vercel Environment Variables:

```bash
# OAuth/Authentication - Use placeholder for testing
VITE_OAUTH_PORTAL_URL=https://oauth.example.com
VITE_APP_ID=test-app-id

# Frontend API Keys - Use placeholder
VITE_FRONTEND_FORGE_API_KEY=test-key
VITE_FRONTEND_FORGE_API_URL=https://forge.butterfly-effect.dev

# Optional - Analytics (can be left empty)
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=

# Branding
VITE_APP_TITLE=Tredfi Dealership Onboarding
VITE_APP_LOGO=/images/logo.png

# Backend Variables (also needed)
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=your-secret-key-min-32-chars
OAUTH_SERVER_URL=https://oauth-server.example.com
OWNER_OPEN_ID=owner-id
OWNER_NAME=Owner Name
BUILT_IN_FORGE_API_URL=https://forge.butterfly-effect.dev
BUILT_IN_FORGE_API_KEY=test-backend-key
```

⚠️ **Note**: With test values, authentication won't work, but at least the page will load without errors.

---

## 🚀 After Adding Environment Variables

### Method 1: Automatic Redeploy
Vercel will automatically redeploy when you save environment variables in the dashboard.

### Method 2: Manual Redeploy
```bash
cd "/Users/jameshamilton/Tredfi onboarding "
vercel --prod
```

### Method 3: Via Vercel Dashboard
Go to deployments and click "Redeploy"

---

## 🔍 Verify It's Fixed

After redeployment completes:

1. Visit: https://tredfi-onboarding-7o8b25fs3.vercel.app
2. Open browser console (F12)
3. Check for errors - should be none!
4. The page should load (even if authentication doesn't work with test values)

---

## 📝 Understanding the Problem

### What Manus Does Automatically:
```typescript
// Manus auto-injects via vite-plugin-manus-runtime
import.meta.env.VITE_OAUTH_PORTAL_URL // ✅ Auto-injected
```

### What Vercel Needs:
```typescript
// Vercel requires manual configuration
// Must add in Vercel dashboard → Environment Variables
```

### The Error Chain:
```javascript
// 1. Variable is undefined
const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL; // undefined

// 2. Creates invalid URL
const url = new URL(`${oauthPortalUrl}/app-auth`); // new URL("undefined/app-auth")

// 3. JavaScript throws error
// ❌ TypeError: Invalid URL
```

---

## 🆘 Still Stuck?

If you can't get the Manus values, let me know and I can:

1. Help you contact the team who set up the Manus deployment
2. Create a minimal configuration that at least allows the page to load
3. Set up environment detection to show a friendly error message

---

## ✅ Checklist

- [ ] Extract environment variables from Manus (Option 1) OR use test values (Option 2)
- [ ] Add all VITE_* variables to Vercel dashboard
- [ ] Add all backend variables (DATABASE_URL, JWT_SECRET, etc.)
- [ ] Redeploy (automatic or manual)
- [ ] Test the site - should load without errors
- [ ] Replace test values with real ones for full functionality

---

**Created**: Jan 16, 2026  
**Priority**: 🔴 URGENT - Site is currently broken without these variables
