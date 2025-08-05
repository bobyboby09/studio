
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Booking, onBookingsUpdate, updateBookingStatus, deleteBooking } from "@/services/bookings";

import { format } from "date-fns";

export default function BookingsAdminPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    const unsubscribeBookings = onBookingsUpdate((bookings) => {
      const sortedBookings = bookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        if (dateA?.toDate && dateB?.toDate) {
            return dateB.toDate().getTime() - dateA.toDate().getTime();
        }
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
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), "PPP");
    }
    if (date instanceof Date) {
      return format(date, "PPP");
    }
    if (typeof date === 'string') {
        try {
            return format(new Date(date), "PPP");
        } catch (e) { return "Invalid Date"; }
    }
    if (typeof date === 'number') {
        try {
            return format(new Date(date), "PPP");
        } catch(e) { return "Invalid Date"; }
    }
    return "Invalid Date";
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
                    <Badge variant={
                        booking.status === 'Confirmed' ? 'default' :
                        booking.status === 'Pending' ? 'secondary' :
                        booking.status === 'User Confirmed' ? 'default' :
                        booking.status === 'Completed' ? 'outline' :
                        'destructive'
                    }
                    className={cn(
                        booking.status === 'Completed' && 'border-green-500 text-green-500',
                        booking.status === 'User Confirmed' && 'bg-blue-500'
                    )}
                    >
                        {booking.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                    {booking.status === 'Pending' && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Confirmed')}>Confirm</Button>
                    )}
                    {booking.status === 'Confirmed' && (
                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Completed')}>Complete</Button>
                    )}
                     {booking.status === 'User Confirmed' && (
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
