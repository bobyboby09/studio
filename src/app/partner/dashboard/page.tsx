
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
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
import { Partner, onPartnerUpdate } from "@/services/partners";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DollarSign, Briefcase, Ticket, Gift, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

function PartnerDashboardComponent() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get('id');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [partnerBookings, setPartnerBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    if (!partnerId) return;

    const unsubscribePartner = onPartnerUpdate(partnerId, setPartner);
    const unsubscribeBookings = onBookingsUpdate((allBookings) => {
       const filteredBookings = allBookings.filter(booking => booking.partnerId === partnerId);
       const sortedBookings = filteredBookings.sort((a, b) => {
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
      setPartnerBookings(sortedBookings);
    });

    return () => {
        if(unsubscribePartner) unsubscribePartner();
        if(unsubscribeBookings) unsubscribeBookings();
    }
  }, [partnerId]);
  
  const totalReferrals = useMemo(() => {
    return partnerBookings.filter(b => b.status !== 'Pending' && b.status !== 'Cancelled').length;
  }, [partnerBookings]);

  const getFormattedDate = (date: any) => {
    if (!date) return "No Date";
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, "PPP");
    } catch (e) {
        return "अमान्य तारीख";
    }
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">कुल कमाई</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(partner?.earnings || 0).toLocaleString('en-IN')}</div>
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
      
      {partner?.message && (
        <Card className="mb-8 bg-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-start gap-4">
            <Gift className="h-8 w-8 text-primary flex-shrink-0"/>
            <div>
              <CardTitle className="text-primary">आपके लिए एक संदेश</CardTitle>
              <CardDescription className="text-primary/80">एडमिन की ओर से एक विशेष ऑफर या अपडेट।</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{partner.message}</p>
          </CardContent>
        </Card>
      )}


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
                        <TableHead>स्थिति</TableHead>
                        <TableHead className="text-right">आपकी कमाई</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {partnerBookings.map((booking) => (
                        <TableRow key={booking.id}>
                        <TableCell>{booking.name}</TableCell>
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
                         <TableCell className="text-right font-medium text-primary">
                            {booking.status === 'Completed' && booking.partnerEarning ?
                                `₹${booking.partnerEarning.toFixed(2)}` : 'N/A'
                            }
                         </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-12">
                    <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">कोई रेफरल नहीं मिला</h3>
                    <p className="mt-2 text-sm text-muted-foreground">अपनी रेफरल लिंक साझा करें और कमाई शुरू करें।</p>
                </div>
            )}
        </CardContent>
      </Card>
      
       <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5"/>आपका रेफरल लिंक</CardTitle>
                <CardDescription>इस लिंक को अपने ग्राहकों के साथ साझा करें। जब वे इस लिंक का उपयोग करके बुक करेंगे, तो आपको क्रेडिट मिलेगा।</CardDescription>
            </CardHeader>
            <CardContent>
                <Input 
                    readOnly 
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/booking?ref=${partner?.whatsappNumber}`} 
                    className="bg-muted text-lg"
                />
                <Button className="mt-4" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/booking?ref=${partner?.whatsappNumber}`);
                    alert("लिंक कॉपी हो गया!");
                }}>
                    लिंक कॉपी करें
                </Button>
            </CardContent>
        </Card>

    </div>
  );
}


export default function PartnerDashboardPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PartnerDashboardComponent />
        </Suspense>
    )
}
