# Cloudflare Pages Deployment Guide

This guide will walk you through deploying your English Teacher Portfolio to Cloudflare Pages with D1 database and R2 storage.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Cloudflare Account Setup](#cloudflare-account-setup)
3. [Database Setup (D1)](#database-setup-d1)
4. [Storage Setup (R2)](#storage-setup-r2)
5. [Local Development](#local-development)
6. [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Cloudflare account (free tier works)
- Git installed
- Node.js 18+ installed
- GitHub account (for GitHub integration)
- Wrangler CLI installed: `npm install -g wrangler`

## Cloudflare Account Setup

### 1. Create Cloudflare Account
- Go to [cloudflare.com](https://cloudflare.com) and sign up
- Verify your email
- Add your domain or use a free subdomain

### 2. Get Your Account IDs
```bash
# Login to Cloudflare
wrangler login

# View your account info
wrangler whoami
```

Note down:
- Account ID
- Zone ID (from your domain settings)

## Database Setup (D1)

### 1. Create D1 Database

```bash
# Create a new D1 database
wrangler d1 create english-teacher-db

# Save the Database ID shown in the output
```

### 2. Initialize Database Schema

```bash
# Run the schema file
wrangler d1 execute english-teacher-db --file db/schema.sql
```

### 3. Verify Database Created

```bash
# List all databases
wrangler d1 list
```

## Storage Setup (R2)

### 1. Create R2 Bucket

```bash
# Create an R2 bucket
wrangler r2 bucket create english-portfolio-assets

# Create a second bucket for backups (optional)
wrangler r2 bucket create english-portfolio-backups
```

### 2. Generate R2 API Tokens

1. Go to Cloudflare Dashboard
2. Navigate to R2 > Settings > API tokens
3. Click "Create API token"
4. Configure with:
   - **Token name**: `english-portfolio-api`
   - **Permission**: Read and write access
   - **Bucket**: `english-portfolio-assets`
5. Save:
   - Access Key ID
   - Secret Access Key

### 3. Create Public URL for R2 Bucket

1. Go to R2 > Settings
2. Enable "Public access" for the bucket
3. Note the public URL (e.g., `https://cd.example.com`)

## Local Development

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd english-teacher-portfolio
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Update with:
```env
# YouTube API (already provided)
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw

# Cloudflare
D1_DATABASE_ID=your-database-id
DATABASE_NAME=english-portfolio
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=english-portfolio-assets
R2_PUBLIC_URL=https://your-r2-domain.com

# Site
SITE_URL=https://yourdomain.com
SITE_TITLE=English Teacher Portfolio

# Auth
JWT_SECRET=generate-a-random-key-min-32-chars
SESSION_SECRET=generate-a-random-key-min-32-chars
```

### 4. Update wrangler.toml

```toml
name = "english-teacher-portfolio"
type = "javascript"
account_id = "your-account-id"
workers_dev = true
main = "src/index.ts"
compatibility_date = "2024-01-01"

# D1 Database Binding
[[d1_databases]]
binding = "DB"
database_name = "english-portfolio"
database_id = "your-database-id"

# R2 Bucket Binding
[[r2_buckets]]
binding = "ASSETS"
bucket_name = "english-portfolio-assets"
account_id = "your-account-id"

# Environment Variables
[env.production]
vars = { ENVIRONMENT = "production" }

[env.development]
vars = { ENVIRONMENT = "development" }
```

### 5. Local Testing

```bash
# Test with Wrangler
wrangler dev

# Your app runs at http://localhost:8787
```

## Deploy to Cloudflare Pages

### Option 1: GitHub Integration (Recommended)

#### 1. Push to GitHub

```bash
git remote add origin <your-github-repo>
git branch -M main
git push -u origin main
```

#### 2. Connect to Cloudflare Pages

1. Log in to Cloudflare Dashboard
2. Go to Pages > Create a project
3. Select "Connect to Git"
4. Authorize GitHub and select your repository
5. Configure:
   - **Project name**: `english-teacher-portfolio`
   - **Production branch**: `main`
   - **Build command**: `pnpm run build`
   - **Build output directory**: `.next`

#### 3. Add Environment Variables

In Cloudflare Pages settings:

1. Go to Settings > Environment variables
2. Add production variables:

```env
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw
D1_DATABASE_ID=your-database-id
DATABASE_NAME=english-portfolio
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key-id
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=english-portfolio-assets
R2_PUBLIC_URL=https://your-r2-domain.com
SITE_URL=https://yourdomain.com
SITE_TITLE=English Teacher Portfolio
JWT_SECRET=your-secret-key
SESSION_SECRET=your-secret-key
```

#### 4. Deploy

1. Cloudflare automatically deploys on push to main
2. Monitor progress in Pages > Deployments
3. View live site at `https://your-project.pages.dev`

### Option 2: Manual Deployment with Wrangler

```bash
# Build the project
pnpm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next

# Or with environment
wrangler deploy --env production
```

## Environment Variables

### Required Variables

| Variable | Value | Notes |
|----------|-------|-------|
| `YOUTUBE_API_KEY` | `AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY` | YouTube Data API v3 |
| `YOUTUBE_CHANNEL_ID` | `UC9WNQ1AUrjOle0QihbaSLdw` | Your YouTube channel ID |
| `D1_DATABASE_ID` | From D1 setup | Database identifier |
| `R2_ACCOUNT_ID` | Your account ID | Cloudflare account |
| `R2_ACCESS_KEY_ID` | From R2 API token | R2 access key |
| `R2_SECRET_ACCESS_KEY` | From R2 API token | R2 secret key |
| `R2_BUCKET_NAME` | `english-portfolio-assets` | R2 bucket name |
| `JWT_SECRET` | Generate secure key | Min 32 characters |
| `SESSION_SECRET` | Generate secure key | Min 32 characters |

### Optional Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `SITE_URL` | `localhost:3000` | Your domain URL |
| `SITE_TITLE` | `English Teacher Portfolio` | Site name |
| `NODE_ENV` | `production` | Environment |
| `SMTP_HOST` | N/A | Email notifications |
| `GOOGLE_ANALYTICS_ID` | N/A | Analytics tracking |

## Database Initialization

### First Time Setup

1. Create database schema:
```bash
wrangler d1 execute english-teacher-db --file db/schema.sql
```

2. Create default admin user:
```bash
wrangler d1 execute english-teacher-db --command "INSERT INTO users (id, email, password_hash, full_name) VALUES ('admin-1', 'admin@yourdomain.com', 'HASHED_PASSWORD_HERE', 'Admin User')"
```

### Migrations

For future schema changes:

```bash
# Create a new migration
# Write SQL in db/migrations/YYYYMMDD_description.sql

# Run migration
wrangler d1 execute english-teacher-db --file db/migrations/20240101_example.sql
```

## Custom Domain Setup

### 1. Point Domain to Cloudflare Pages

In your domain registrar:
- Update nameservers to Cloudflare's:
  - `cathy.ns.cloudflare.com`
  - `deon.ns.cloudflare.com`

### 2. Add Domain to Pages

1. Cloudflare Dashboard > Pages > Your Project
2. Settings > Domains & accounts
3. Add custom domain: `yourdomain.com`
4. Wait for verification (usually instant)

### 3. Setup SSL/TLS

Cloudflare automatically provides:
- Free SSL certificate
- Full SSL/TLS encryption
- Automatic HTTPS redirect

## Performance Optimization

### Cache Settings

```toml
# In wrangler.toml
[env.production]
routes = [
  { pattern = "example.com/api/*", zone_name = "example.com" }
]
```

### Images Optimization

The project uses Next.js Image Optimization with R2 loader. Images are:
- Automatically optimized
- Cached at edge locations
- Responsive and lazy-loaded

### Analytics Engine

Monitor performance:
1. Cloudflare Dashboard > Analytics
2. Pages > Your Project > Analytics
3. View request metrics, status codes, cache ratios

## Troubleshooting

### Database Connection Error

**Error**: "Database not found"

**Solution**:
```bash
# Verify database ID in wrangler.toml matches actual database
wrangler d1 list
wrangler d1 info english-teacher-db
```

### R2 Upload Failed

**Error**: "Access denied" or "Invalid credentials"

**Solution**:
1. Verify R2 API token hasn't expired
2. Check bucket name matches in code
3. Ensure token has read/write permissions

### Environment Variables Not Loading

**Error**: Variables undefined in production

**Solution**:
1. Verify variables added to Cloudflare Pages settings
2. Check for typos in variable names
3. Redeploy after adding variables: `git push`

### Build Failing

**Error**: "Build failed"

**Solution**:
```bash
# Check build locally
pnpm run build

# View detailed build logs in Pages > Deployments
# Common issues: missing dependencies, syntax errors, env vars
```

### YouTube API Not Working

**Error**: "Invalid API key" or "quota exceeded"

**Solution**:
1. Verify API key is correct
2. Check YouTube API is enabled in Google Cloud Console
3. Monitor quota usage in Google Cloud Console
4. YouTube API rate limit: 10,000 requests/day (free tier)

## Monitoring and Maintenance

### Regular Tasks

- **Weekly**: Check error logs in Pages Analytics
- **Monthly**: Review database size, backup if needed
- **Monthly**: Check R2 storage usage and costs
- **Quarterly**: Update dependencies: `pnpm update`

### Backup Strategy

```bash
# Backup D1 database
wrangler d1 backup list english-teacher-db
wrangler d1 backup create english-teacher-db

# Download R2 bucket contents
wrangler r2 object list english-portfolio-assets
```

### Monitoring

Set up alerts in Cloudflare:
1. Dashboard > Notifications
2. Create rule for: Failed requests, high latency
3. Notify via email or webhook

## Support Resources

- **Cloudflare Docs**: https://developers.cloudflare.com
- **D1 Documentation**: https://developers.cloudflare.com/d1
- **R2 Documentation**: https://developers.cloudflare.com/r2
- **Pages Documentation**: https://developers.cloudflare.com/pages
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler
- **YouTube API Docs**: https://developers.google.com/youtube/v3

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review Cloudflare documentation for your service
3. Check the GitHub repository for known issues
4. Contact Cloudflare support for account/infrastructure issues

---

**Last Updated**: 2024
**Maintained By**: English Teacher Portfolio Team
