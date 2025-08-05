
"use client";

import { useEffect, useState } from "react";
import { onNotificationsUpdate, Notification, markNotificationAsRead } from "@/services/notifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from 'date-fns';
import { hi } from 'date-fns/locale';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    // In a real app, you'd get the current user's ID
    const userId = "admin";
    const unsubscribe = onNotificationsUpdate(userId, setNotifications);
    return () => unsubscribe();
  }, []);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markNotificationAsRead(notification.id!);
    }
    router.push(`/booking-confirmation/${notification.bookingId}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">सूचनाएं</h1>
        <p className="text-lg text-muted-foreground mt-2">
          आपकी बुकिंग और स्टूडियो से अपडेट।
        </p>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
           <CardTitle>आपकी सूचनाएं</CardTitle>
           <CardDescription>यहां आपकी हाल की सभी गतिविधियां हैं।</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                       <button
                         key={notification.id}
                         onClick={() => handleNotificationClick(notification)}
                         className={cn(
                           "w-full text-left p-4 rounded-lg border transition-colors",
                           notification.isRead ? "bg-card/50 text-muted-foreground" : "bg-primary/10 border-primary/20 text-foreground"
                         )}
                       >
                         <div className="flex items-start gap-4">
                           <div className={cn("mt-1", !notification.isRead && "text-primary")}>
                             {notification.isRead ? <Check className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
                           </div>
                           <div className="flex-1">
                             <p className="font-medium">{notification.message}</p>
                             <p className="text-xs text-muted-foreground mt-1">
                               {formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true, locale: hi })}
                             </p>
                           </div>
                         </div>
                       </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <BellRing className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">कोई सूचना नहीं मिली</h3>
                    <p className="mt-2 text-sm text-muted-foreground">अभी तक कोई नई सूचना नहीं है।</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
