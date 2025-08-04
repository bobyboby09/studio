
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Ticket, BookUser, Gift, Handshake, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "होम", icon: Home },
  { href: "/gallery", label: "गैलरी", icon: Camera },
  { href: "/booking", label: "बुक करें", icon: BookUser },
  { href: "/my-bookings", label: "बुकिंग", icon: Ticket },
  { href: "/partner", label: "पार्टनर", icon: Handshake },
  { href: "/partner/dashboard", label: "डैशबोर्ड", icon: LayoutDashboard },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-primary/20 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex flex-col items-center justify-center w-full h-full">
              <Icon className={cn(
                "h-6 w-6 transition-colors",
                isActive ? "text-primary" : "text-gray-400 hover:text-white"
              )} />
              <span className={cn(
                "text-xs mt-1 transition-colors",
                isActive ? "text-primary" : "text-gray-400"
              )}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
