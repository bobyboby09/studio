
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/layout/bottom-nav';
import { usePathname } from 'next/navigation';


// export const metadata: Metadata = {
//   title: 'प्रदीप फिल्म्स स्टूडियो',
//   description: 'उच्च गुणवत्ता वाली रिकॉर्डिंग और प्रोडक्शन स्टूडियो।',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="hi" className="dark">
      <head>
        <title>प्रदीप फिल्म्स स्टूडियो</title>
        <meta name="description" content="उच्च गुणवत्ता वाली रिकॉर्डिंग और प्रोडक्शन स्टूडियो।" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
          {!isAdminPage && <Header />}
          <main className={!isAdminPage ? "flex-grow pb-16 md:pb-0" : ""}>{children}</main>
          {!isAdminPage && <Footer />}
          {!isAdminPage && <BottomNav />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
