import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import { getDB } from '@/lib/db/client'
import { ContentProvider } from '@/components/content-provider'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const db = getDB();
    const settings: any = await db.prepare('SELECT site_title, site_description, favicon_url FROM settings LIMIT 1').first();

    return {
      title: settings?.site_title || 'English Teacher Portfolio',
      description: settings?.site_description || 'Professional English teaching platform with courses, blog, and resources',
      generator: 'v0.app',
      icons: {
        icon: settings?.favicon_url ? [
          { url: settings.favicon_url },
        ] : [
          { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
          { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
          { url: '/icon.svg', type: 'image/svg+xml' }
        ],
        apple: '/apple-icon.png',
      },
    }
  } catch (e) {
    return {
      title: 'English Teacher Portfolio',
      description: 'Professional English teaching platform',
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <ContentProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              {process.env.NODE_ENV === 'production' && <Analytics />}
            </ContentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
