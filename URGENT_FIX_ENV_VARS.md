# 🚨 URGENT FIX NEEDED: Missing Environment Variables

## Current Issue

Your site is now accessible but showing **"TypeError: Invalid URL"** errors because critical frontend environment variables are missing.

## Required Environment Variables for Frontend

You need to add these **immediately** in Vercel for the site to work:

### Go to Environment Variables:
🔗 https://vercel.com/audience-activator-sales-pages-projects/tredfi-onboarding/settings/environment-variables

### Add These Variables (REQUIRED):

```bash
# OAuth/Authentication (CRITICAL - App cannot load without this)
VITE_OAUTH_PORTAL_URL=<your_oauth_portal_url>
VITE_APP_ID=<your_app_id>

# Frontend API Keys (CRITICAL for maps and other features)
VITE_FRONTEND_FORGE_API_KEY=<your_frontend_forge_api_key>
VITE_FRONTEND_FORGE_API_URL=<your_frontend_forge_api_url>
```

### Also Add Backend Variables:

```bash
# Database
DATABASE_URL=<your_mysql_connection_string>

# Backend Authentication
JWT_SECRET=<your_jwt_secret>
OAUTH_SERVER_URL=<your_oauth_server_url>
OWNER_OPEN_ID=<your_owner_open_id>
OWNER_NAME=<your_owner_name>

# Backend API
BUILT_IN_FORGE_API_URL=<your_forge_api_url>
BUILT_IN_FORGE_API_KEY=<your_forge_api_key>
```

### Optional (but removes warnings):

```bash
VITE_ANALYTICS_ENDPOINT=<your_analytics_endpoint>
VITE_ANALYTICS_WEBSITE_ID=<your_analytics_website_id>
VITE_APP_TITLE=Tredfi Dealership Onboarding
VITE_APP_LOGO=/images/logo.png
```

## How to Get These Values

You need to get these values from your **Manus deployment**. You can:

1. **Check Manus Environment Variables:**
   - Go to https://tredfi-onb-r6pyqfte.manus.space/
   - Open Manus Management UI
   - Look for environment variables section

2. **Or contact your team** who set up the Manus deployment originally

## After Adding Variables

1. **Redeploy** the site:
   ```bash
   cd "/Users/jameshamilton/Tredfi onboarding "
   vercel --prod
   ```

2. **Or wait** for automatic deployment (Vercel will auto-redeploy when you save env vars)

3. **Test** the site after deployment completes

## Why This Happened

The frontend code tries to construct URLs using these environment variables:

```typescript
// client/src/const.ts - Line 10
const url = new URL(`${oauthPortalUrl}/app-auth`);  // oauthPortalUrl is undefined!

// client/src/components/Map.tsx - Line 93  
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`; // FORGE_BASE_URL might be undefined!
```

When these variables are `undefined`, JavaScript's `new URL()` throws "Invalid URL" error.

---

**Need help finding these values?** Let me know and I can help you extract them from your Manus deployment.
