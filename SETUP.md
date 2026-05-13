# English Teacher Portfolio - Complete Setup Guide

## Local Development Setup (2-5 minutes)

### Prerequisites
- Node.js 18+ and pnpm installed
- Git (optional)

### Step 1: Install & Initialize
```bash
cd english-teacher-portfolio
pnpm install
```

The `pnpm dev` command automatically runs the seed script to create admin user and database.

### Step 2: Start Development Server
```bash
pnpm dev
```

Opens at: http://localhost:3000

### Step 3: Access Admin Dashboard
- URL: http://localhost:3000/admin
- Email: `admin@example.com`
- Password: `admin123`

### Step 4: Configure Settings
1. Click Settings → Configure your site title, description, hero text, and email
2. Upload your profile image in Profile section
3. Add YouTube playlists in YouTube section
4. Add content (courses, blog, testimonials, gallery)

## Cloudflare Pages Deployment (5-10 minutes)

### Prerequisites
- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`

### Step 1: Create Resources on Cloudflare Dashboard

**Create D1 Database:**
```bash
wrangler d1 create english-teacher-db
# Copy DATABASE_ID from output
```

**Create R2 Bucket:**
```bash
wrangler r2 bucket create english-teacher-assets
```

### Step 2: Update wrangler.toml
```toml
name = "english-teacher-portfolio"

[env.production]
d1_databases = [
  { binding = "DB", database_id = "YOUR_DATABASE_ID", preview_id = "YOUR_PREVIEW_ID" }
]

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "english-teacher-assets"
preview_bucket_name = "english-teacher-assets-preview"

[env.production.env]
YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"
YOUTUBE_CHANNEL_ID = "UC9WNQ1AUrjOle0QihbaSLdw"
```

### Step 3: Initialize Database on Cloudflare
```bash
wrangler d1 execute english-teacher-db --file db/schema.sql --env production

# Add admin user
wrangler d1 execute english-teacher-db --env production --command \
"INSERT INTO users (id, email, password_hash, full_name, role) 
VALUES ('admin_1', 'admin@example.com', '\$2a\$10\$hash...', 'Admin', 'admin')"
```

### Step 4: Deploy to Cloudflare Pages
```bash
# Build the project
pnpm build

# Connect to GitHub and deploy via Cloudflare Dashboard, OR:
wrangler pages deploy dist
```

Or via Cloudflare Dashboard:
1. Pages → Create project → Connect Git repo
2. Build command: `pnpm build`
3. Build output: `.next`
4. Environment variables:
   - `YOUTUBE_API_KEY`
   - `YOUTUBE_CHANNEL_ID`
   - `JWT_SECRET`
   - `SESSION_SECRET`

## Environment Variables

Create `.env.local` for local development:

```env
# YouTube API
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw

# Auth
JWT_SECRET=your-secret-key-min-32-chars
SESSION_SECRET=your-session-secret-min-32-chars

# Site
SITE_URL=http://localhost:3000
```

## Project Structure

```
/app/admin/        - Admin dashboard pages
/app/api/          - API routes
/components/       - React components
/lib/db/           - Database utilities
/scripts/          - Database seed scripts
/data/             - Local SQLite database (auto-created)
db/schema.sql      - Database schema
```

## Default Admin Credentials

**Local Development:**
- Email: `admin@example.com`
- Password: `admin123`

**Change Password:** Use profile settings after first login

## Key Features

- ✓ Professional neon design (cyan, pink, purple)
- ✓ Admin dashboard with content management
- ✓ YouTube playlist integration
- ✓ Image upload to R2
- ✓ Light/dark theme toggle
- ✓ Responsive mobile design
- ✓ SEO optimized
- ✓ TypeScript + React 19

## Troubleshooting

**Database not found:**
```bash
# Recreate database
rm -rf data/app.db
pnpm dev
```

**Port 3000 in use:**
```bash
pnpm dev -- -p 3001
```

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

## Support

- Docs: See README.md and PROJECT_SUMMARY.md
- Schema: Check db/schema.sql
- API: See app/api/ folder
- Components: See components/ folder

## Next Steps

1. Add your courses in Admin → Courses
2. Upload blog posts in Admin → Blog
3. Add gallery images in Admin → Gallery
4. Configure YouTube playlists in Admin → YouTube
5. Upload your profile photo in Admin → Profile
6. Deploy to Cloudflare Pages

---

**Happy Teaching!** Your portfolio is now ready to showcase your English teaching skills. ✨
