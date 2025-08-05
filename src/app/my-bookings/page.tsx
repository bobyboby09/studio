
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Booking, onBookingsUpdate } from "@/services/bookings";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, CheckCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // In a real app, you'd filter this to the logged-in user's bookings.
    // For now, we'll show all bookings like the admin page.
    const unsubscribe = onBookingsUpdate((allBookings) => {
      const sortedBookings = allBookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        
        const timeA = dateA?.toDate ? dateA.toDate().getTime() : new Date(dateA).getTime();
        const timeB = dateB?.toDate ? dateB.toDate().getTime() : new Date(dateB).getTime();

        if (!isNaN(timeA) && !isNaN(timeB)) {
            return timeB - timeA;
        }
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;
        return 0;
      });
      setBookings(sortedBookings);
    });

    return () => unsubscribe();
  }, []);

  const getFormattedDate = (date: any) => {
    if (!date) return "No Date";
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, "PPP");
    } catch (e) {
        return "अमान्य तारीख";
    }
  }


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">मेरी बुकिंग</h1>
        <p className="text-lg text-muted-foreground mt-2">
          अपने स्टूडियो सत्रों की स्थिति को ट्रैक करें।
        </p>
      </div>
      <Card>
        <CardHeader>
           <CardTitle>आपकी बुकिंग की स्थिति</CardTitle>
           <CardDescription>यहां आपकी सभी पिछली और आने वाली बुकिंग्स हैं।</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
            {bookings.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>सेवा</TableHead>
                        <TableHead>तारीख</TableHead>
                        <TableHead>स्थिति</TableHead>
                        <TableHead className="text-right">कार्रवाई</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{getFormattedDate(booking.date)}</TableCell>
                        <TableCell>
                            <Badge
                            variant="outline"
                            className={cn(
                                'text-sm',
                                booking.status === 'Confirmed' && 'text-yellow-400 border-yellow-400',
                                booking.status === 'User Confirmed' && 'text-blue-400 border-blue-400',
                                booking.status === 'Pending' && 'text-gray-400 border-gray-400',
                                booking.status === 'Completed' && 'text-green-400 border-green-400',
                                booking.status === 'Cancelled' && 'text-red-400 border-red-400'
                            )}
                            >
                            {booking.status}
                            </Badge>
                        </TableCell>
                         <TableCell className="text-right">
                            {booking.status === 'Confirmed' && (
                                <Button asChild size="sm">
                                    <Link href={`/booking-confirmation/${booking.id}`}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        अभी पुष्टि करें
                                    </Link>
                                </Button>
                            )}
                         </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-12">
                    <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">कोई बुकिंग नहीं मिली</h3>
                    <p className="mt-2 text-sm text-muted-foreground">ऐसा लगता है कि आपने अभी तक कोई सेशन बुक नहीं किया है।</p>
                    <Button asChild className="mt-6">
                        <Link href="/booking">अभी बुक करें</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
