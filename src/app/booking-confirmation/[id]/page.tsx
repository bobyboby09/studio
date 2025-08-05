
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Booking, updateBooking, calculateFinalPrice } from "@/services/bookings";
import { Service, getServiceByName } from "@/services/services";
import { getPromoByCode, PromoCode } from "@/services/promos";
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
        
        const price = await calculateFinalPrice(bookingData);
        setFinalPrice(price);

        const serviceData = await getServiceByName(bookingData.service);
        setService(serviceData);
        
        if (bookingData.promoCode) {
            const promoData = await getPromoByCode(bookingData.promoCode);
            setPromoCode(promoData);
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
    if (!booking || finalPrice === null) return;
    setIsLoading(true);
    try {
      await updateBooking(booking.id!, {
        status: "User Confirmed",
        finalPrice: finalPrice,
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

  if (booking.status !== "Confirmed") {
    return (
        <div className="container mx-auto px-4 py-16">
             <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">बुकिंग पहले से ही कन्फर्म है</CardTitle>
                    <CardDescription>यह बुकिंग पहले से ही कन्फर्म या प्रोसेस हो चुकी है।</CardDescription>
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
                {booking.date && typeof (booking.date as any).toDate === 'function' &&
                    <p><strong>तारीख:</strong> {format((booking.date as any).toDate(), "PPPP", { locale: hi })}</p>
                }
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
                {finalPrice !== null ? (
                     <p className="text-2xl font-bold text-primary">
                        अंतिम मूल्य: ₹{finalPrice.toFixed(2)}
                    </p>
                ) : (
                    <p>कीमत की गणना हो रही है...</p>
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
