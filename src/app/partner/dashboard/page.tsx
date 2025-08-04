
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
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
import { DollarSign, Briefcase, User, Ticket } from "lucide-react";

export default function PartnerDashboardPage() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get('id');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [partnerBookings, setPartnerBookings] = useState<Booking[]>([]);
  
  // Dummy data for now
  const totalReferrals = partnerBookings.length;
  const totalEarnings = partnerBookings.filter(b => b.status === 'Completed').length * 100; // Assuming 100 per completed booking

  useEffect(() => {
    if (!partnerId) return;
    
    const unsubscribe = onBookingsUpdate((allBookings) => {
       const filteredBookings = allBookings.filter(booking => booking.partnerId === partnerId);
       const sortedBookings = filteredBookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        if(dateA?.toDate && dateB?.toDate) {
          return dateB.toDate().getTime() - dateA.toDate().getTime();
        }
        return 0;
      });
      setPartnerBookings(sortedBookings);
    });

    return () => unsubscribe();
  }, [partnerId]);

  const getFormattedDate = (date: any) => {
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), "PPP");
    }
    if (date instanceof Date) {
      return format(date, "PPP");
    }
    return "अमान्य तारीख";
  }


  if (!partnerId) {
      return (
        <div className="container mx-auto px-4 py-16 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>पहुँच अस्वीकृत</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>यह पेज देखने के लिए आपके पास अनुमति नहीं है।</p>
                    <Button asChild className="mt-4">
                        <Link href="/partner">पार्टनर पेज पर वापस जाएं</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">पार्टनर डैशबोर्ड</h1>
        <p className="text-lg text-muted-foreground mt-2">
          अपने रेफरल और कमाई को ट्रैक करें।
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल कमाई</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalEarnings.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">
              सभी समय की कुल कमाई
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल रेफरल</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
             आपके द्वारा लाए गए कुल ग्राहक
            </p>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
           <CardTitle>आपके रेफरल</CardTitle>
           <CardDescription>यहां आपके द्वारा रेफर की गई सभी बुकिंग्स हैं।</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
            {partnerBookings.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>ग्राहक का नाम</TableHead>
                        <TableHead>सेवा</TableHead>
                        <TableHead>तारीख</TableHead>
                        <TableHead className="text-right">स्थिति</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {partnerBookings.map((booking) => (
                        <TableRow key={booking.id}>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{getFormattedDate(booking.date)}</TableCell>
                        <TableCell className="text-right">
                            <Badge
                            variant="outline"
                            className={cn(
                                'text-sm',
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
            ) : (
                <div className="text-center py-12">
                    <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">कोई रेफरल नहीं मिला</h3>
                    <p className="mt-2 text-sm text-muted-foreground">ऐसा लगता है कि आपने अभी तक किसी को रेफर नहीं किया है।</p>
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
