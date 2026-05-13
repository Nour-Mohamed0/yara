'use client';

import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminHeader } from '@/components/admin/header';

export default function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader />
        <main className="mt-16 p-8">{children}</main>
      </div>
    </div>
  );
}