
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Camera } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "होम" },
  { href: "/services", label: "सेवाएं" },
  { href: "/gallery", label: "गैलरी" },
  { href: "/my-bookings", label: "मेरी बुकिंग" },
  { href: "/admin", label: "एडमिन" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Camera className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-xl">
              प्रदीप फिल्म्स स्टूडियो
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">मेनू टॉगल करें</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader className="p-6 text-left">
                  <SheetTitle>
                     <Link href="/" className="flex items-center space-x-2">
                        <Camera className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-lg">प्रदीप फिल्म्स स्टूडियो</span>
                      </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 p-6 pt-0">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "transition-colors hover:text-foreground/80 p-2 rounded-md",
                        pathname === link.href ? "bg-accent text-accent-foreground" : "text-foreground/70"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Camera className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">प्रदीप फिल्म्स स्टूडियो</span>
          </Link>
          <Button asChild>
            <Link href="/booking">अभी बुक करें</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
