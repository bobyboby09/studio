
"use client";

import { useEffect, useState } from "react";
import { onNotificationsUpdate, updateNotificationReadStatus, Notification } from "@/services/notifications";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BellRing, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { hi } from "date-fns/locale";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real app, you'd filter this for the logged-in user.
    // For now, we fetch all notifications.
    const unsubscribe = onNotificationsUpdate(setNotifications);
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await updateNotificationReadStatus(id, true);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">सूचनाएं</h1>
        <p className="text-lg text-muted-foreground mt-2">
          आपकी बुकिंग और स्टूडियो से नवीनतम अपडेट।
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>आपकी सूचनाएं</CardTitle>
          <CardDescription>
            यहां आपकी सभी सूचनाएं सूचीबद्ध हैं, सबसे नई सबसे ऊपर।
          </CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                    notif.read ? "bg-card/50 border-border/50" : "bg-primary/10 border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0 mt-1">
                    <BellRing className={cn("h-6 w-6", notif.read ? "text-muted-foreground" : "text-primary")} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{notif.title}</h4>
                    <p className="text-muted-foreground text-sm">{notif.message}</p>
                    {notif.link && (
                      <Button asChild size="sm" className="mt-2">
                        <Link href={notif.link}>विवरण देखें</Link>
                      </Button>
                    )}
                     <p className="text-xs text-muted-foreground/80 mt-2">
                        {notif.createdAt && typeof (notif.createdAt as any).toDate === 'function'
                            ? formatDistanceToNow((notif.createdAt as any).toDate(), { addSuffix: true, locale: hi })
                            : 'अभी-अभी'
                        }
                    </p>
                  </div>
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id!)}
                      title="पঠিত म्हणून चिन्हांकित करा"
                      className="flex-shrink-0"
                    >
                      <Check className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BellRing className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">कोई सूचना नहीं</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                जब कुछ नया होगा, तो आपको यहां एक सूचना मिलेगी।
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
