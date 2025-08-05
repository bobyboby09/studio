
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Booking, onBookingsUpdate, updateBookingStatus, deleteBooking, calculateFinalPrice } from "@/services/bookings";

import { format } from "date-fns";

type BookingWithPrice = Booking & { finalPrice?: number | null };

export default function BookingsAdminPage() {
  const [allBookings, setAllBookings] = useState<BookingWithPrice[]>([]);
  
  useEffect(() => {
    const unsubscribeBookings = onBookingsUpdate(async (bookings) => {
      const bookingsWithPrices = await Promise.all(
        bookings.map(async (booking) => {
          const finalPrice = await calculateFinalPrice(booking);
          return { ...booking, finalPrice };
        })
      );
      const sortedBookings = bookingsWithPrices.sort((a, b) => {
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
      setAllBookings(sortedBookings);
    });

    return () => {
      unsubscribeBookings();
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
  };

  const handleDeleteBooking = async (id: string) => {
    if(window.confirm("Are you sure you want to cancel this booking?")) {
      await deleteBooking(id);
    }
  }

  const getFormattedDate = (date: any) => {
    if (!date) return "No Date";
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, "PPP");
    } catch (e) {
        return "Invalid Date";
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Manage Bookings</CardTitle>
            <CardDescription>View, confirm, or cancel client bookings.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Promo</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {allBookings.map((booking) => (
                <TableRow key={booking.id}>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{getFormattedDate(booking.date)}</TableCell>
                    <TableCell>{booking.partnerWhatsapp || 'N/A'}</TableCell>
                    <TableCell>{booking.promoCode || 'N/A'}</TableCell>
                    <TableCell>
                        {booking.finalPrice !== null && booking.finalPrice !== undefined ? `₹${booking.finalPrice.toFixed(2)}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                    <Badge variant={
                        booking.status === 'Confirmed' ? 'default' :
                        booking.status === 'Pending' ? 'secondary' :
                        booking.status === 'User Confirmed' ? 'default' :
                        booking.status === 'Completed' ? 'outline' :
                        'destructive'
                    }
                    className={cn(
                        booking.status === 'Completed' && 'border-green-500 text-green-500',
                        booking.status === 'User Confirmed' && 'bg-blue-500',
                         booking.status === 'Confirmed' && 'bg-yellow-500'
                    )}
                    >
                        {booking.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                    {booking.status === 'Pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Confirmed')}>Confirm</Button>
                    )}
                    {(booking.status === 'Confirmed' || booking.status === 'User Confirmed') && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Completed')}>Complete</Button>
                    )}
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking.id!)}>Cancel</Button>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
