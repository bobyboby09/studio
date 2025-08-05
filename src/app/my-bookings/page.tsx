
"use client";

import { useEffect, useState, useMemo } from "react";
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
import { User, getUser, addUser, updateUser } from "@/services/users";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, CheckCircle, Search, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const phoneSchema = z.object({
  phone: z.string().min(10, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।"),
});
type PhoneFormData = z.infer<typeof phoneSchema>;

const nameSchema = z.object({
  name: z.string().min(2, "नाम कम से_कम 2 अक्षरों का होना चाहिए।"),
});
type NameFormData = z.infer<typeof nameSchema>;


export default function MyBookingsPage() {
  const { toast } = useToast();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [showNameInput, setShowNameInput] = useState(false);

  const phoneForm = useForm<PhoneFormData>({ resolver: zodResolver(phoneSchema) });
  const nameForm = useForm<NameFormData>({ resolver: zodResolver(nameSchema) });


  useEffect(() => {
    const unsubscribe = onBookingsUpdate(setAllBookings);
    const storedPhone = localStorage.getItem("userPhone");
    if(storedPhone) {
      handleSetUser(storedPhone);
    }
    return () => unsubscribe();
  }, []);

  const handlePhoneSubmit: SubmitHandler<PhoneFormData> = async (data) => {
    await handleSetUser(data.phone);
  };

  const handleSetUser = async (phone: string) => {
    setPhone(phone);
    localStorage.setItem("userPhone", phone);
    const existingUser = await getUser(phone);
    if (existingUser) {
      setUser(existingUser);
      nameForm.setValue("name", existingUser.name);
      setShowNameInput(false);
    } else {
      setUser(null);
      setShowNameInput(true);
    }
  }

  const handleNameSubmit: SubmitHandler<NameFormData> = async (data) => {
    if(!phone) return;

    try {
      if(user) {
        // This case should ideally not happen if user is null before showing input
        // but as a fallback
        await updateUser(user.id!, { name: data.name });
      } else {
        await addUser({ name: data.name, phone });
      }
      const updatedUser = await getUser(phone);
      setUser(updatedUser);
      setShowNameInput(false);
      toast({ title: "सफलता", description: "आपका नाम सहेजा गया है।" });
    } catch(error) {
       toast({ title: "त्रुटि", description: "आपका नाम सहेजने में विफल।", variant: "destructive" });
    }
  }

  const userBookings = useMemo(() => {
    if (!phone) return [];
    return allBookings
      .filter(b => b.phone === phone)
      .sort((a, b) => {
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
  }, [allBookings, phone]);

  const getFormattedDate = (date: any) => {
    if (!date) return "No Date";
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, "PPP");
    } catch (e) {
        return "अमान्य तारीख";
    }
  }


  if (!phone) {
    return (
        <div className="container mx-auto px-4 py-16">
            <Card className="max-w-md mx-auto">
                 <CardHeader>
                    <CardTitle className="text-center font-headline text-3xl">मेरी बुकिंग देखें</CardTitle>
                    <CardDescription className="text-center">अपनी बुकिंग देखने के लिए कृपया अपना फ़ोन नंबर दर्ज करें।</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-4">
                        <div>
                            <Input {...phoneForm.register("phone")} placeholder="अपना 10 अंकों का फ़ोन नंबर दर्ज करें" />
                            {phoneForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{phoneForm.formState.errors.phone.message}</p>}
                        </div>
                        <Button type="submit" className="w-full"><Search className="mr-2 h-4 w-4"/>बुकिंग खोजें</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-6">
        <h1 className="font-headline text-5xl font-bold">मेरी बुकिंग</h1>
        <p className="text-lg text-muted-foreground mt-2">
          {user ? `${user.name}, ` : ''}अपने स्टूडियो सत्रों की स्थिति को ट्रैक करें।
        </p>
         <Button variant="link" onClick={() => { setPhone(null); localStorage.removeItem("userPhone"); }}>
            ({phone}) यह आप नहीं हैं?
        </Button>
      </div>

       {showNameInput && (
         <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
                <CardTitle>आपका नाम क्या है?</CardTitle>
                <CardDescription>यह हमें आपके अनुभव को निजीकृत करने में मदद करता है।</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={nameForm.handleSubmit(handleNameSubmit)} className="flex items-center gap-2">
                    <Input {...nameForm.register("name")} placeholder="अपना पूरा नाम दर्ज करें" />
                    <Button type="submit">सहेजें</Button>
                </form>
                 {nameForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{nameForm.formState.errors.name.message}</p>}
            </CardContent>
         </Card>
       )}

      <Card>
        <CardHeader>
           <CardTitle>आपकी बुकिंग की स्थिति</CardTitle>
           <CardDescription>यहां आपकी सभी पिछली और आने वाली बुकिंग्स हैं।</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
            {userBookings.length > 0 ? (
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
                    {userBookings.map((booking) => (
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
                    <p className="mt-2 text-sm text-muted-foreground">ऐसा लगता है कि आपने अभी तक इस फ़ोन नंबर से कोई सेशन बुक नहीं किया है।</p>
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

