
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Camera, Handshake, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { onNotificationsUpdate, Notification } from "@/services/notifications";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const navLinks = [
  { href: "/", label: "होम" },
  { href: "/services", label: "सेवाएं" },
  { href: "/gallery", label: "गैलरी" },
  { href: "/my-bookings", label: "मेरी बुकिंग" },
];

export function Header() {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real app, you'd get the current user's ID
    const userId = "admin";
    const unsubscribe = onNotificationsUpdate(userId, setNotifications);
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-20 items-center justify-between">
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {navLinks.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary text-lg",
                pathname === link.href ? "text-primary font-bold" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-center">
           <Link href="/" className="flex items-center space-x-3">
              <Camera className="h-8 w-8 text-primary" />
              <span className="font-bold sm:inline-block font-headline text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-primary to-yellow-300">
                प्रदीप फिल्म्स स्टूडियो
              </span>
            </Link>
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm">
           {navLinks.slice(2, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary text-lg",
                pathname === link.href ? "text-primary font-bold" : "text-foreground/80"
              )}
            >
              {link.label}
            </Link>
          ))}
            <Button asChild variant="outline" size="sm">
                <Link href="/partner">
                    <Handshake className="mr-2 h-4 w-4" />
                    पार्टनर बनें
                </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications">
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-1">{unreadCount}</Badge>
                    )}
                </Link>
            </Button>
        </div>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden flex items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications">
                    <Bell />
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center p-1">{unreadCount}</Badge>
                    )}
                </Link>
            </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-primary" />
                <span className="sr-only">मेनू टॉगल करें</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 bg-black">
              <SheetHeader className="p-6 text-left border-b border-primary/20">
                <SheetTitle>
                    <Link href="/" className="flex items-center space-x-2">
                      <Camera className="h-6 w-6 text-primary" />
                      <span className="font-bold font-headline text-lg text-white">प्रदीप फिल्म्स स्टूडियो</span>
                    </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 p-6 pt-4">
                {[...navLinks, { href: "/offers", label: "ऑफर्स" }, { href: "/partner", label: "पार्टनर बनें" }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "transition-colors hover:text-primary p-2 rounded-md text-lg",
                      pathname === link.href ? "bg-primary/10 text-primary font-bold" : "text-foreground/70"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  );
}
