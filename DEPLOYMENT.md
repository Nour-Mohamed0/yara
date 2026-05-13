# Deployment Guide - English Teacher Portfolio

This guide covers deploying your English Teacher Portfolio to Cloudflare Pages with D1 Database and R2 Storage.

## Prerequisites

- Cloudflare account with paid plan (for D1 & R2)
- GitHub repository (or other Git provider)
- Local machine with Node.js and pnpm installed
- Wrangler CLI installed globally

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: English Teacher Portfolio"

# Push to GitHub
git remote add origin https://github.com/yourusername/english-portfolio.git
git branch -M main
git push -u origin main
```

### 2. Create Cloudflare D1 Database

```bash
# Login to Cloudflare
npx wrangler login

# Create new D1 database
npx wrangler d1 create english-portfolio

# Note the database_id from the output
```

### 3. Update wrangler.toml

Replace the `database_id` in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "english-portfolio"
database_id = "YOUR-DATABASE-ID"  # Replace with output from step 2
```

### 4. Initialize Database Schema

```bash
# Execute schema.sql on your D1 database
npx wrangler d1 execute english-portfolio --file db/schema.sql --remote
```

This creates all necessary tables for the portfolio.

### 5. Create R2 Bucket

```bash
# Create R2 bucket
npx wrangler r2 bucket create english-portfolio-assets
```

### 6. Set Up Environment Variables

In Cloudflare Dashboard:

1. Go to **Pages** → Your Project → **Settings** → **Environment variables**

2. Add all required variables:

```
ADMIN_EMAIL=admin@yourdomain.com
SITE_URL=https://yourdomain.com
JWT_SECRET=your-super-secret-key-min-32-chars
YOUTUBE_API_KEY=your-youtube-key (optional)
```

**Important:** Never commit `.env.local` to git. Use Cloudflare's environment variables instead.

### 7. Connect GitHub Repository to Cloudflare Pages

1. Go to Cloudflare Dashboard → **Pages**
2. Click **Create a project** → **Connect to Git**
3. Authorize GitHub and select your repository
4. Configure build settings:
   - **Framework**: Next.js
   - **Build command**: `pnpm install && pnpm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (or your project directory)

5. **Save and Deploy**

Cloudflare will automatically:
- Clone your repository
- Install dependencies
- Build the project
- Deploy to Cloudflare Pages

### 8. Configure Custom Domain

1. Go to your Cloudflare Pages project
2. Click **Custom domains**
3. Add your domain (yourdomain.com)
4. Update DNS records if needed

### 9. Create Admin Account

Once deployed, you need to create your admin account:

```bash
# SSH into Cloudflare Worker or use D1 Console
npx wrangler d1 execute english-portfolio --interactive

# Run this SQL:
INSERT INTO users (id, email, password_hash, full_name, created_at, updated_at)
VALUES (
  'admin-001',
  'admin@yourdomain.com',
  '$2b$12$your-bcrypt-hashed-password-here',
  'Your Name',
  datetime('now'),
  datetime('now')
);
```

For the password hash, you can use:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your-password', 12).then(console.log);
```

### 10. Verify Deployment

1. Visit `https://yourdomain.com` to see the public site
2. Visit `https://yourdomain.com/admin` to access the admin dashboard
3. Login with your admin credentials

## Post-Deployment Checklist

- [ ] Update site title and description in `settings` table
- [ ] Add social media links in the database
- [ ] Upload profile picture to R2 and update user avatar_url
- [ ] Create first blog post
- [ ] Add courses
- [ ] Configure SEO settings for all pages
- [ ] Test contact form
- [ ] Verify dark/light mode toggle
- [ ] Test language switcher (English/Arabic)
- [ ] Check mobile responsiveness
- [ ] Run Lighthouse audit

## Environment Variables Reference

### Required
- `SITE_URL` - Your domain URL
- `JWT_SECRET` - Min 32 chars for session tokens
- `ADMIN_EMAIL` - Admin email address

### Optional
- `YOUTUBE_API_KEY` - For YouTube integration
- `SMTP_HOST` - For email notifications
- `SMTP_PORT` - Email port (usually 587)
- `SMTP_USER` - Email username
- `SMTP_PASSWORD` - Email password
- `SENDGRID_API_KEY` - Alternative to SMTP

## Database Backups

### Manual Backup

```bash
# Export database
npx wrangler d1 execute english-portfolio --command "SELECT * FROM blog_posts" --remote
```

### Automated Backups (Coming Soon)

Consider setting up automated backups using Cloudflare Workers scheduled events.

## Troubleshooting

### Database Not Found
```bash
# Verify database exists
npx wrangler d1 list

# Check database ID in wrangler.toml
```

### R2 Upload Issues
```bash
# Verify bucket exists
npx wrangler r2 bucket list

# Check R2 credentials in environment variables
```

### Admin Can't Login
1. Verify JWT_SECRET is set correctly
2. Check password hash is valid bcrypt format
3. Verify user exists in users table:
   ```bash
   npx wrangler d1 execute english-portfolio --command "SELECT * FROM users" --remote
   ```

### Images Not Loading
1. Verify R2 bucket is configured correctly
2. Check R2 URLs in database
3. Verify R2_ACCESS_KEY permissions

## Performance Optimization

### Cloudflare Cache Rules

1. Go to Cloudflare Dashboard → **Caching** → **Cache Rules**
2. Create rules for static assets:
   - Match: `(cf_cache_status eq "MISS")`
   - Set cache TTL to 30 days for images
   - Set to 1 hour for HTML

### Database Query Optimization

1. Monitor slow queries in D1
2. Add indexes for frequently filtered columns (done in schema.sql)
3. Consider caching frequently accessed data

## Monitoring & Logs

### View Deployment Logs
- Cloudflare Pages → Deployments → View build logs

### Monitor API Errors
- Check Cloudflare Workers logs
- Set up error tracking with Sentry (optional)

### Database Performance
- Monitor D1 usage in Cloudflare Dashboard
- Check query execution times

## Scaling Considerations

- **D1 Limits**: 
  - Currently SQLite, suitable for small to medium projects
  - For large scale, consider migrating to Cloudflare Durable Objects

- **R2 Storage**: 
  - Unlimited storage capacity
  - Excellent for large media files
  - Consider implementing image CDN for optimization

- **Workers**: 
  - 100,000 requests/day free
  - Upgrade plan as traffic grows

## Support & Resources

- Cloudflare Docs: https://developers.cloudflare.com
- D1 Documentation: https://developers.cloudflare.com/d1/
- R2 Documentation: https://developers.cloudflare.com/r2/
- Next.js Deployment: https://nextjs.org/docs/deployment

## Security Best Practices

1. **Never commit secrets** to Git
2. **Use strong JWT_SECRET** (min 32 chars, random)
3. **Enable two-factor authentication** on Cloudflare account
4. **Restrict R2 bucket permissions** to least privilege
5. **Use HTTPS only** (automatic with Cloudflare)
6. **Regular security updates** for dependencies
7. **Monitor access logs** for suspicious activity

## Next Steps

1. Set up monitoring and alerting
2. Implement automated database backups
3. Configure email notifications for contact form
4. Add analytics (Google Analytics recommended)
5. Set up CI/CD for automated tests
6. Plan content rollout strategy
7. Create marketing plan for launch

---

Need help? Check the README.md or create an issue on GitHub.
