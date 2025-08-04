
"use client";

import type { Metadata } from 'next';
import '../globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Ticket, SlidersHorizontal, Megaphone, GalleryHorizontal, Sparkles, Handshake, FileText, Camera } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/bookings', label: 'Bookings', icon: Ticket },
    { href: '/admin/services', label: 'Services', icon: SlidersHorizontal },
    { href: '/admin/updates', label: 'Updates', icon: Megaphone },
    { href: '/admin/gallery', label: 'Gallery', icon: GalleryHorizontal },
    { href: '/admin/promos', label: 'Promo Codes', icon: Sparkles },
    { href: '/admin/partners', label: 'Partners', icon: Handshake },
    { href: '/admin/conditions', label: 'Conditions', icon: FileText },
  ];

  return (
    <html lang="hi" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <Sidebar className="bg-card border-r border-border" collapsible="icon">
              <SidebarContent>
                <SidebarHeader>
                  <div className="flex items-center gap-2 p-2">
                    <Button variant="ghost" size="icon" className="md:hidden" asChild>
                      <SidebarTrigger>
                        <Camera />
                      </SidebarTrigger>
                    </Button>
                    <h2 className="font-headline text-lg font-bold">Admin</h2>
                  </div>
                </SidebarHeader>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                         <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <main className="flex-1">
              <div className="p-4 md:p-6">
                <Button variant="ghost" size="icon" className="md:hidden mb-4" asChild>
                  <SidebarTrigger>
                    <Camera />
                  </SidebarTrigger>
                </Button>
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
