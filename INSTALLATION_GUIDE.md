# Installation & Setup Guide

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))
- pnpm ([Install](https://pnpm.io/installation))
- Cloudflare Account ([Free](https://dash.cloudflare.com/sign-up))
- GitHub Account ([Sign up](https://github.com/signup))

## Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd english-teacher-portfolio
```

## Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required packages:
- `next` - React framework
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `shadcn/ui` - UI components
- `axios` - HTTP client
- `bcryptjs` - Password hashing
- `jose` - JWT handling

## Step 3: Environment Setup

### Create Environment File

```bash
cp .env.example .env.local
```

### Edit Environment Variables

Open `.env.local` and update with your values:

```env
# YouTube API (Already Provided)
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw

# Cloudflare D1 Database
D1_DATABASE_ID=your-database-id-here
DATABASE_NAME=english-portfolio

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=english-portfolio-assets
R2_PUBLIC_URL=https://cdn.yourdomain.com

# Site Configuration
SITE_URL=http://localhost:3000
SITE_TITLE=English Teacher Portfolio

# Authentication (Generate secure random strings)
JWT_SECRET=generate-a-random-key-min-32-chars-long
SESSION_SECRET=generate-another-random-key-min-32-chars-long
```

## Step 4: Local Development

### Start Dev Server

```bash
pnpm dev
```

Server runs at: **http://localhost:3000**

### Access Different Sections

- **Homepage**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Courses**: http://localhost:3000/courses
- **Blog**: http://localhost:3000/blog
- **Videos**: http://localhost:3000/videos
- **Gallery**: http://localhost:3000/gallery
- **Contact**: http://localhost:3000/contact

### Test Admin Login

Default test credentials (set in database):
- **Email**: admin@example.com
- **Password**: (set during database initialization)

### Build for Production

```bash
pnpm run build
```

Production files are in `.next/`

## Step 5: Cloudflare Setup (First Time)

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
wrangler d1 create english-teacher-db
```

Save the Database ID shown in output.

### 4. Initialize Database Schema

```bash
wrangler d1 execute english-teacher-db --file db/schema.sql
```

### 5. Create R2 Bucket

```bash
wrangler r2 bucket create english-portfolio-assets
```

### 6. Generate R2 API Credentials

1. Go to Cloudflare Dashboard
2. R2 > Settings > API tokens
3. Click "Create API token"
4. Configure permissions and save credentials

### 7. Update wrangler.toml

```toml
name = "english-teacher-portfolio"
account_id = "your-cloudflare-account-id"

[[d1_databases]]
binding = "DB"
database_name = "english-portfolio"
database_id = "your-database-id"

[[r2_buckets]]
binding = "ASSETS"
bucket_name = "english-portfolio-assets"
```

## Step 6: Deploy to Cloudflare Pages

### Option A: GitHub Integration (Recommended)

#### 1. Push to GitHub

```bash
git remote add origin https://github.com/yourusername/english-teacher-portfolio
git branch -M main
git push -u origin main
```

#### 2. Connect to Cloudflare Pages

1. Log in to Cloudflare Dashboard
2. Pages > Create a project
3. Select "Connect to Git"
4. Authorize GitHub
5. Select your repository
6. Configure:
   - **Project name**: `english-teacher-portfolio`
   - **Production branch**: `main`
   - **Build command**: `pnpm run build`
   - **Build output directory**: `.next`

#### 3. Add Environment Variables

In Pages settings, add:

```
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw
D1_DATABASE_ID=your-database-id
DATABASE_NAME=english-portfolio
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-key
R2_SECRET_ACCESS_KEY=your-secret
R2_BUCKET_NAME=english-portfolio-assets
R2_PUBLIC_URL=https://cdn.yourdomain.com
SITE_URL=https://yourdomain.com
SITE_TITLE=English Teacher Portfolio
JWT_SECRET=your-secret-key
SESSION_SECRET=your-secret-key
```

#### 4. Deploy

- Cloudflare automatically deploys on push to main
- Monitor progress in Pages > Deployments
- Access site at: `https://your-project.pages.dev`

### Option B: Manual Wrangler Deploy

```bash
pnpm run build
wrangler pages deploy .next
```

## Step 7: Initial Admin Setup

### 1. Create Admin User (via Database)

```bash
# Connect to D1 database
wrangler d1 execute english-teacher-db --interactive

# Run INSERT command:
INSERT INTO users (id, email, password_hash, full_name) 
VALUES ('admin-1', 'your-email@example.com', 'HASHED_PASSWORD', 'Your Name');
```

To generate password hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"
```

### 2. Login to Admin

1. Navigate to `/admin`
2. Enter email and password
3. You're now logged in!

### 3. Upload Teacher Image

1. Go to `/admin/profile`
2. Upload your profile image
3. Add bio information
4. Click "Save Changes"

### 4. Setup YouTube Playlists

1. Go to `/admin/youtube`
2. Enter YouTube Playlist IDs
3. Add section names (Grammar, Speaking, etc.)
4. Click "Add Playlist"
5. Click "Sync with YouTube"

## Step 8: Add Custom Domain

### If using Cloudflare for DNS:

1. Cloudflare Dashboard > Pages > Your Project
2. Settings > Domains & accounts
3. Add custom domain
4. SSL/TLS automatically enabled

### If using external registrar:

1. Point nameservers to Cloudflare
2. Or use CNAME to Cloudflare Pages
3. Add domain in Pages settings

## Step 9: Content Setup

### Add Blog Posts

1. Go to `/admin/blog`
2. Click "New Post"
3. Fill in title, content, featured image
4. Publish

### Create Courses

1. Go to `/admin/courses`
2. Click "New Course"
3. Add course details and sections
4. Set pricing (if applicable)
5. Publish

### Upload Gallery Images

1. Go to `/admin/gallery`
2. Click "Upload Images"
3. Add titles and descriptions
4. Publish

### Add Testimonials

1. Go to `/admin/testimonials`
2. Click "Add Testimonial"
3. Enter student name, role, feedback, rating
4. Save

## Verification Checklist

After setup, verify everything works:

- [ ] Dev server runs: `pnpm dev`
- [ ] Homepage loads with hero section
- [ ] Admin dashboard accessible at `/admin`
- [ ] Can login with admin credentials
- [ ] Can upload images to R2
- [ ] YouTube playlists display
- [ ] All pages render correctly
- [ ] Mobile responsive design works
- [ ] Animations play smoothly
- [ ] Contact form works

## Common Setup Issues

### Issue: `YOUTUBE_API_KEY is not set`
**Solution**: 
```bash
# Check .env.local has YouTube API key
cat .env.local | grep YOUTUBE_API_KEY

# If empty, add:
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw
```

### Issue: `Module not found: framer-motion`
**Solution**:
```bash
pnpm install framer-motion
pnpm dev
```

### Issue: `D1 Database not found`
**Solution**:
```bash
# Check database exists
wrangler d1 list

# Create if missing
wrangler d1 create english-teacher-db

# Update DATABASE_ID in .env.local
```

### Issue: `R2 Upload fails`
**Solution**:
1. Verify R2 bucket exists: `wrangler r2 bucket list`
2. Check API token permissions
3. Verify bucket name matches in code

### Issue: `Cloudflare build fails`
**Solution**:
```bash
# Build locally to test
pnpm run build

# Check build output
ls .next

# Push to GitHub to retry
git push origin main
```

## Next Steps

1. **Customize Content**
   - Add your courses and lessons
   - Upload gallery images
   - Add testimonials

2. **Optimize Performance**
   - Configure caching headers
   - Optimize images for web
   - Monitor Cloudflare Analytics

3. **Setup Monitoring**
   - Enable error tracking (Sentry)
   - Setup Google Analytics
   - Monitor Cloudflare metrics

4. **Domain Setup**
   - Point custom domain to Cloudflare
   - Setup SSL/TLS (automatic)
   - Configure email forwarding

5. **Maintenance**
   - Regular backups
   - Dependency updates
   - Security audits

## Help & Support

- **Documentation**: See `README.md` and `PROJECT_SUMMARY.md`
- **Deployment Guide**: See `CLOUDFLARE_PAGES_SETUP.md`
- **Troubleshooting**: See `LAUNCH_CHECKLIST.md`
- **Official Docs**:
  - Next.js: https://nextjs.org/docs
  - Cloudflare: https://developers.cloudflare.com
  - Tailwind CSS: https://tailwindcss.com

## Success!

Your English Teacher Portfolio is now installed and ready to use! 🎉

---

**Need Help?**
1. Check the documentation files
2. Review Cloudflare developer docs
3. Check Next.js documentation
4. Review error messages in console
