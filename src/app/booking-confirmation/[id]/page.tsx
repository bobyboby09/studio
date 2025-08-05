
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Booking, updateBooking } from "@/services/bookings";
import { Service } from "@/services/services";
import { PromoCode } from "@/services/promos";
import { CheckCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { hi } from "date-fns/locale";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [promoCode, setPromoCode] = useState<PromoCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const bookingId = params.id as string;

  useEffect(() => {
    if (!bookingId) return;

    const fetchBookingData = async () => {
      setIsLoading(true);
      try {
        const bookingDocRef = doc(db, "bookings", bookingId);
        const bookingSnap = await getDoc(bookingDocRef);

        if (!bookingSnap.exists()) {
          toast({ title: "त्रुटि", description: "बुकिंग नहीं मिली।", variant: "destructive" });
          setIsLoading(false);
          return;
        }

        const bookingData = { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
        setBooking(bookingData);

        // Fetch Service details
        const serviceQuery = await getDoc(doc(db, "services", bookingData.service));
        if (serviceQuery.exists()) {
             // In a real app, you would fetch the service by its ID, not name.
             // For this app structure, we will find it by name for now.
             const servicesSnap = await getDoc(doc(db, 'services', bookingData.service));
             // This is inefficient, we should query by name. But for now...
             const allServicesSnap = await getDoc(collection(db, 'services'));
             const serviceDoc = allServicesSnap.docs.find(d => d.data().name === bookingData.service);
             if (serviceDoc) {
                const serviceData = { id: serviceDoc.id, ...serviceDoc.data() } as Service;
                setService(serviceData);
                let currentPrice = parseFloat(serviceData.price.replace(/[^0-9.-]+/g,""));

                 // Fetch Promo Code details if it exists
                if (bookingData.promoCode) {
                    const promoQuery = await getDoc(doc(db, "promoCodes", bookingData.promoCode));
                     const allPromosSnap = await getDocs(collection(db, 'promoCodes'));
                     const promoDoc = allPromosSnap.docs.find(d => d.data().code === bookingData.promoCode);

                    if (promoDoc) {
                        const promoData = { id: promoDoc.id, ...promoDoc.data() } as PromoCode;
                        setPromoCode(promoData);
                        
                        const discount = promoData.discount;
                        if (discount.includes('%')) {
                            const percentage = parseFloat(discount.replace('%', ''));
                            currentPrice = currentPrice - (currentPrice * (percentage / 100));
                        } else if (discount.includes('₹')) {
                            const amount = parseFloat(discount.replace('₹', ''));
                            currentPrice = currentPrice - amount;
                        } else {
                            const amount = parseFloat(discount);
                            if(!isNaN(amount)) {
                                currentPrice = currentPrice - amount;
                            }
                        }
                    }
                }
                setFinalPrice(currentPrice);
             }
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast({ title: "त्रुटि", description: "बुकिंग डेटा लाने में विफल।", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();
  }, [bookingId, toast]);

  const handleConfirmBooking = async () => {
    if (!booking) return;
    setIsLoading(true);
    try {
      await updateBooking(booking.id!, {
        status: "User Confirmed",
        userConfirmed: true,
        finalPrice: finalPrice!,
      });
      toast({
        title: "बुकिंग कन्फर्म हो गई!",
        description: "आपकी बुकिंग अब अंतिम रूप से कन्फर्म हो गई है। हम आपसे जल्द ही मिलेंगे।",
        className: "bg-green-500 text-white",
      });
      router.push("/my-bookings");
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast({ title: "त्रुटि", description: "बुकिंग कन्फर्म करने में विफल।", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!booking) {
    return <div className="text-center py-16">बुकिंग नहीं मिली।</div>;
  }

  if (booking.status === "User Confirmed") {
    return (
        <div className="container mx-auto px-4 py-16">
             <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">बुकिंग पहले से ही कन्फर्म है</CardTitle>
                    <CardDescription>आप इस बुकिंग को पहले ही कन्फर्म कर चुके हैं।</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p>हम स्टूडियो में आपका इंतजार कर रहे हैं।</p>
                    <Button onClick={() => router.push('/my-bookings')} className="mt-6">मेरी बुकिंग देखें</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">अपनी बुकिंग कन्फर्म करें</CardTitle>
          <CardDescription>कृपया नीचे दिए गए विवरण की समीक्षा करें और अपनी बुकिंग की पुष्टि करें।</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">सेवा विवरण</h3>
            <div className="p-4 border rounded-md bg-muted/50">
                <p><strong>सेवा:</strong> {booking.service}</p>
                <p><strong>तारीख:</strong> {format(booking.date.toDate(), "PPPP", { locale: hi })}</p>
                {service && <p><strong>मूल्य:</strong> {service.price}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
             <h3 className="font-semibold">मूल्य विवरण</h3>
             <div className="p-4 border rounded-md bg-muted/50 space-y-2">
                {promoCode && (
                    <p className="text-green-600">
                        <strong>प्रोमो कोड लागू:</strong> {promoCode.code} ({promoCode.discount} की छूट)
                    </p>
                )}
                {finalPrice !== null && (
                     <p className="text-2xl font-bold text-primary">
                        अंतिम मूल्य: ₹{finalPrice.toFixed(2)}
                    </p>
                )}
             </div>
          </div>

        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button onClick={handleConfirmBooking} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-5 w-5" />}
             मैं बुकिंग कन्फर्म करता हूँ
          </Button>
          <Button variant="ghost" onClick={() => router.push('/my-bookings')}>बाद में कन्फर्म करें</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
