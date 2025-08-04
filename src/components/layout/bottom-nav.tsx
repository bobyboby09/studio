
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Camera, Ticket, BookUser, Gift, Handshake, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const baseNavLinks = [
  { href: "/", label: "होम", icon: Home },
  { href: "/gallery", label: "गैलरी", icon: Camera },
  { href: "/booking", label: "बुक करें", icon: BookUser },
  { href: "/my-bookings", label: "बुकिंग", icon: Ticket },
];

const partnerLink = { href: "/partner", label: "पार्टनर", icon: Handshake };
const dashboardLinkInfo = { href: "/partner/dashboard", label: "डैशबोर्ड", icon: LayoutDashboard };


export function BottomNav() {
  const pathname = usePathname();
  const [partnerId, setPartnerId] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client-side
    const storedPartnerId = localStorage.getItem("partnerId");
    if (storedPartnerId) {
      setPartnerId(storedPartnerId);
    }
  }, [pathname]); // Rerun when path changes to update active state correctly

  let allLinks = [...baseNavLinks];
  if (partnerId) {
    allLinks.push({ ...dashboardLinkInfo, href: `/partner/dashboard?id=${partnerId}` });
  } else {
    allLinks.push(partnerLink);
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-primary/20 md:hidden">
      <div className="flex justify-around items-center h-16">
        {allLinks.map((link) => {
          const isActive = pathname === link.href || (link.href.startsWith('/partner/dashboard') && pathname === '/partner/dashboard');
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
