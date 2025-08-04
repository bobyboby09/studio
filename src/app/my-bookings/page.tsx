
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const unsubscribe = onBookingsUpdate((allBookings) => {
      // In a real app, you'd filter this to the logged-in user's bookings.
      // For now, we'll show all bookings like the admin page.
      const sortedBookings = allBookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        return dateB.toDate().getTime() - dateA.toDate().getTime();
      });
      setBookings(sortedBookings);
    });

    return () => unsubscribe();
  }, []);

  const getFormattedDate = (date: any) => {
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), "PPP");
    }
    if (date instanceof Date) {
      return format(date, "PPP");
    }
    return "अमान्य तारीख";
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
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>सेवा</TableHead>
                <TableHead>तारीख</TableHead>
                <TableHead className="text-right">स्थिति</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{getFormattedDate(booking.date)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        booking.status === 'Confirmed' && 'text-blue-400 border-blue-400',
                        booking.status === 'Pending' && 'text-yellow-400 border-yellow-400',
                        booking.status === 'Completed' && 'text-green-400 border-green-400',
                        booking.status === 'Cancelled' && 'text-red-400 border-red-400'
                      )}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
