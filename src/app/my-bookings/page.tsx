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
      const sortedBookings = allBookings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setBookings(sortedBookings);
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">My Bookings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track the status of your studio sessions.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{format(new Date(booking.date), "PPP")}</TableCell>
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
