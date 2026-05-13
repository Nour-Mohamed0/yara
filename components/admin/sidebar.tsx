'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image,
  MessageSquare,
  BarChart,
  Link as LinkIcon,
  Settings,
  Users,
  Youtube,
  LogOut,
  Languages,
  MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/profile', label: 'Profile', icon: Users },
  { href: '/admin/content', label: 'Content Manager', icon: Languages },
  { href: '/admin/links', label: 'Link Manager', icon: MousePointer2 },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/admin/youtube', label: 'YouTube', icon: Youtube },
  { href: '/admin/seo', label: 'SEO', icon: BarChart },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="border-b border-border p-6">
          <h1 className="text-xl font-bold text-foreground">TeachDash</h1>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto px-3 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className="w-full justify-start"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-3">
          <form action={handleLogout} className="w-full">
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
