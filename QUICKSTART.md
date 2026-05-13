# Quick Start Guide

Get your English Teacher Portfolio running in minutes!

## Local Development (5 minutes)

### 1. Install & Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Access Admin Dashboard

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

**Note:** The mock authentication accepts any email/password in development.

### 3. Explore the App

- **Homepage**: `/` - Main landing page
- **About**: `/about` - Teacher profile
- **Courses**: `/courses` - Course listings
- **Blog**: `/blog` - Blog articles
- **Gallery**: `/gallery` - Image gallery
- **Videos**: `/videos` - YouTube videos
- **Contact**: `/contact` - Contact form
- **Admin**: `/admin` - Administration dashboard

## Key Features to Try

### 1. Theme Toggle
Click the sun/moon icon in the navbar to toggle dark/light mode. Your preference is saved.

### 2. Language Switcher
Switch between English and Arabic (RTL support included).

### 3. Admin Dashboard
- View statistics
- Manage profiles
- Create content (blog, courses, gallery)
- Configure site settings

### 4. Responsive Design
Resize your browser to see mobile-responsive layouts.

## File Structure Quick Reference

```
app/
├── page.tsx              # Homepage
├── about/page.tsx        # About page
├── courses/page.tsx      # Courses page
├── blog/page.tsx         # Blog listing
├── contact/page.tsx      # Contact form
├── admin/                # Admin dashboard
└── api/                  # API endpoints

components/
├── navigation/           # Navbar & Footer
├── admin/                # Admin components
├── shared/               # Shared utilities
└── ui/                   # shadcn/ui components

lib/
├── auth/                 # Authentication
├── db/                   # Database utilities
└── translations.ts       # i18n strings
```

## Common Tasks

### Add a New Page

1. Create directory: `app/new-page/`
2. Create `page.tsx`:

```tsx
export const metadata = {
  title: 'New Page | Portfolio',
  description: 'Page description',
};

export default function NewPage() {
  return (
    <main>
      {/* Your content here */}
    </main>
  );
}
```

### Create New Component

1. Create file: `components/my-component.tsx`
2. Use shadcn/ui components as building blocks

### Add Database Query

1. Create helper in `lib/db/my-queries.ts`
2. Use D1 client (see `lib/db/users.ts` for example)

### Create API Endpoint

1. Create file: `app/api/my-endpoint/route.ts`
2. Export GET/POST/PUT/DELETE handlers

## Customization Guide

### Change Site Title
Update in `app/layout.tsx`:
```tsx
title: 'Your Site Title',
description: 'Your description',
```

### Change Colors
Edit `app/globals.css` - theme variables in `:root` and `.dark` sections.

### Add Navigation Link
Edit `components/navigation/navbar.tsx`:
```tsx
const navLinks = [
  { href: '/', label: 'Home' },
  // Add yours here
];
```

### Update Footer
Edit `components/navigation/footer.tsx`

### Add Translations
Edit `lib/translations.ts`:
```tsx
export const translations = {
  en: {
    myKey: 'My English Text',
  },
  ar: {
    myKey: 'نصي بالعربية',
  },
};
```

## Commands Reference

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:init          # Initialize database (when ready)
pnpm db:seed          # Seed sample data (when ready)

# Code Quality
pnpm lint             # Run linter
pnpm type-check       # Check TypeScript types
```

## What's Included

✅ Full-stack Next.js with TypeScript
✅ Responsive design with Tailwind CSS
✅ Dark/Light mode with persistence
✅ Admin dashboard with CMS
✅ Blog system
✅ Course management
✅ Gallery with image uploads
✅ Contact form
✅ Authentication system
✅ Multi-language support (English/Arabic)
✅ SEO optimized
✅ Ready for Cloudflare deployment
✅ Database schema with D1 (when deployed)
✅ File storage with R2 (when deployed)

## Next Steps

1. **Customize content**: Update texts, add your info
2. **Add images**: Replace placeholder images
3. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Add courses**: Create your course content
5. **Write blog posts**: Start sharing knowledge

## Troubleshooting

### Port 3000 already in use?
```bash
pnpm dev -- -p 3001  # Use port 3001 instead
```

### Module not found error?
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Styling not working?
Make sure `app/globals.css` is imported in `app/layout.tsx`

### Admin login not working?
In development, any email/password works as a demo.

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Docs](https://react.dev)

## Getting Help

1. Check README.md for detailed docs
2. Check DEPLOYMENT.md for production setup
3. Review existing code for examples
4. Check Next.js and component documentation

## Happy Building! 🚀

You now have a professional, modern portfolio ready to customize.

Start by editing `app/page.tsx` and see your changes instantly!
