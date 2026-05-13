# English Teacher Portfolio - Premium Educational Website

A modern, production-ready educational portfolio website for English teachers built with Next.js, Cloudflare, and TypeScript.

## Features

### Public Website
- **Modern Homepage** - Compelling hero section with featured courses, testimonials, and CTA
- **Course Catalog** - Browse and filter courses by level
- **Blog System** - Article listings with categories and author information
- **Gallery** - Image gallery for classroom moments and resources
- **Video Section** - Embed YouTube videos and tutorials
- **Contact Form** - Get in touch functionality with validation
- **About Page** - Teacher bio and credentials

### Admin Dashboard
- **Secure Authentication** - Custom session-based auth with httpOnly cookies
- **Profile Management** - Edit teacher profile and credentials
- **Content Management** - Create and manage:
  - Blog posts with rich content
  - Courses with lessons and modules
  - Gallery images with R2 storage
  - Testimonials and social links
  - SEO settings per page
  - Site-wide configuration
- **Dashboard Analytics** - Overview of content and engagement metrics

### Technical Features
- **Dark/Light Mode** - Theme toggle with persistence
- **Responsive Design** - Mobile-first approach, perfect on all devices
- **SEO Optimized** - Meta tags, structured data, sitemap, robots.txt
- **Internationalization** - Arabic/English support (extensible)
- **Image Optimization** - R2 storage integration with signed URLs
- **Database** - D1 SQLite with comprehensive schema
- **Type Safety** - Full TypeScript implementation
- **Performance** - Code splitting, lazy loading, optimized bundles

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui, CSS Variables |
| **Database** | Cloudflare D1 (SQLite) |
| **Storage** | Cloudflare R2 |
| **Authentication** | Custom httpOnly session cookies |
| **Deployment** | Cloudflare Pages |
| **CLI** | Wrangler (Cloudflare CLI) |

## Project Structure

```
project/
├── app/
│   ├── admin/                    # Admin dashboard pages
│   ├── api/                      # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── admin/               # Admin API routes
│   │   └── public/              # Public API endpoints
│   ├── about/                    # About page
│   ├── courses/                  # Courses page
│   ├── blog/                     # Blog pages
│   ├── gallery/                  # Gallery page
│   ├── videos/                   # Videos page
│   ├── contact/                  # Contact page
│   ├── layout.tsx                # Root layout with nav/footer
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles with theme tokens
│   ├── sitemap.ts                # Dynamic sitemap
│   └── robots.ts                 # Robots.txt
├── components/
│   ├── admin/                    # Admin components
│   ├── navigation/               # Navbar and Footer
│   ├── ui/                       # shadcn/ui components
│   └── theme-provider.tsx        # Theme provider wrapper
├── lib/
│   ├── auth/                     # Authentication utilities
│   │   ├── password.ts          # Password hashing/verification
│   │   ├── session.ts           # Session management
│   │   └── middleware.ts        # Auth middleware
│   ├── db/                       # Database utilities
│   │   ├── client.ts            # D1 client wrapper
│   │   └── users.ts             # User queries
│   ├── r2-client.ts             # R2 storage client
│   ├── image-loader.ts          # Next.js image loader for R2
│   ├── seo.ts                   # SEO utilities
│   ├── translations.ts          # i18n translations
│   └── utils.ts                 # Common utilities
├── db/
│   └── schema.sql               # D1 database schema
├── middleware.ts                # Next.js middleware for route protection
├── wrangler.toml                # Cloudflare Wrangler configuration
├── package.json                 # Dependencies
└── next.config.mjs              # Next.js configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm/yarn
- Cloudflare account (for production deployment)

### Local Development

1. **Install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. **Run development server:**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Access admin dashboard:**
```
http://localhost:3000/admin
```

### Database Setup

The project uses Cloudflare D1 (SQLite) for the database. To initialize:

1. **Install Wrangler CLI:**
```bash
pnpm add -D wrangler
```

2. **Create D1 database:**
```bash
npx wrangler d1 create english-portfolio
```

3. **Update wrangler.toml** with your database ID

4. **Run migrations:**
```bash
npx wrangler d1 execute english-portfolio --file db/schema.sql
```

## Configuration

### Environment Variables

See `.env.example` for all required variables:

```env
# Database
DATABASE_URL=your-d1-database-url

# R2 Storage
R2_BUCKET_NAME=english-portfolio-assets
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key

# Site Configuration
SITE_URL=https://yourdomain.com
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Admin Setup

To create your first admin account:

1. Run the initialization script (coming soon)
2. Or manually insert into the database:
```sql
INSERT INTO users (id, email, password_hash, full_name)
VALUES ('admin-id', 'admin@example.com', 'hashed-password', 'Admin Name');
```

## API Documentation

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/verify` - Verify current session

### Public APIs
- `GET /api/public/blog` - List blog posts (paginated)
- `GET /api/public/blog/:slug` - Get single blog post
- `GET /api/public/courses` - List courses
- `GET /api/public/settings` - Get site settings
- `POST /api/public/contact` - Submit contact form

### Admin APIs
- `POST /api/admin/r2-upload` - Generate R2 signed upload URL
- `DELETE /api/admin/r2-upload` - Delete file from R2

## Deployment

### Deploy to Cloudflare Pages

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Connect to Cloudflare:**
   - Go to Cloudflare Dashboard → Pages
   - Create new project → Connect Git
   - Select repository
   - Build settings:
     - Framework: Next.js
     - Build command: `pnpm run build`
     - Build output directory: `.next`

3. **Set environment variables:**
   - Add all required env vars in Cloudflare Pages settings

4. **Deploy:**
   - Cloudflare will automatically deploy on git push

## Development Roadmap

- [ ] User registration and authentication system
- [ ] Payment integration for course enrollment
- [ ] Student progress tracking
- [ ] Quiz and assignment system
- [ ] Video streaming optimization
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## Performance Targets

- Lighthouse Score: 95+
- Core Web Vitals: All green
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

## Security

- Password hashing with bcryptjs (12 rounds)
- Secure httpOnly cookies for sessions
- CSRF protection
- SQL injection prevention via parameterized queries
- Rate limiting (to be implemented)
- CORS configuration for APIs

## License

MIT License - feel free to use for your projects

## Support

For issues, questions, or feedback:
- Email: support@example.com
- GitHub Issues: (if public repo)

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

Built with ❤️ by v0 for Modern Education
