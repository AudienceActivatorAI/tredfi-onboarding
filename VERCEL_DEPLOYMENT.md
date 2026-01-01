# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository (already created: https://github.com/AudienceActivatorAI/tredfi-onboarding)

## Deployment Steps

### 1. Import Project to Vercel
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose the `AudienceActivatorAI/tredfi-onboarding` repository
4. Click "Import"

### 2. Configure Build Settings
Vercel should auto-detect the settings, but verify:
- **Framework Preset**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 3. Configure Environment Variables
Add the following environment variables in Vercel project settings:

#### Required Database Variables
```
DATABASE_URL=your_mysql_or_tidb_connection_string
```

#### Required Authentication Variables
```
JWT_SECRET=your_jwt_secret_key
OAUTH_SERVER_URL=your_oauth_server_url
VITE_OAUTH_PORTAL_URL=your_oauth_portal_url
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=your_owner_name
```

#### Required API Variables
```
BUILT_IN_FORGE_API_URL=your_forge_api_url
BUILT_IN_FORGE_API_KEY=your_forge_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_forge_api_key
VITE_FRONTEND_FORGE_API_URL=your_frontend_forge_api_url
```

#### Optional Analytics Variables
```
VITE_ANALYTICS_ENDPOINT=your_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=your_analytics_website_id
```

#### Optional Branding Variables
```
VITE_APP_TITLE=Tredfi Dealership Onboarding
VITE_APP_LOGO=/images/logo.png
```

#### Optional Google Sheets Integration
```
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account","project_id":"..."}
GOOGLE_SHEET_ID=your_google_sheet_id
```

### 4. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Post-Deployment

### Database Setup
After deployment, you need to push your database schema:
```bash
pnpm db:push
```

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain (e.g., onboarding.tredfi.com)
4. Follow DNS configuration instructions

## Important Notes

⚠️ **Compatibility Warning**: This project was originally configured for Manus hosting. Some features may require adjustments for Vercel:

1. **Database**: Ensure your DATABASE_URL points to an accessible MySQL/TiDB instance
2. **File Storage**: S3 storage configuration may need adjustment
3. **OAuth**: Authentication flow may need reconfiguration
4. **API Routes**: Verify all API endpoints work correctly

## Troubleshooting

### Build Failures
- Check that all environment variables are set correctly
- Verify Node.js version compatibility (v22.13.0)
- Review build logs in Vercel dashboard

### Runtime Errors
- Check Vercel function logs
- Verify database connectivity
- Ensure all API keys are valid

### Database Connection Issues
- Confirm DATABASE_URL format is correct
- Check firewall rules allow Vercel IP ranges
- Verify SSL/TLS settings if required

## Alternative: Manus Built-in Hosting

For easier deployment with zero configuration, consider using Manus built-in hosting:
1. Open the Management UI
2. Click "Publish" button
3. Your app is live instantly with custom domain support

This avoids compatibility issues and provides:
- Automatic environment variable injection
- Built-in database hosting
- Integrated authentication
- Zero-config deployment
