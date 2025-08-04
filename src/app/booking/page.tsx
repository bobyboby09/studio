
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { addBooking } from "@/services/bookings"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { onServicesUpdate, Service } from "@/services/services"
import { getPartnerByWhatsappNumber } from "@/services/partners"

const bookingFormSchema = z.object({
  service: z.string({
    required_error: "कृपया एक सेवा चुनें।",
  }),
  date: z.date({
    required_error: "आपकी बुकिंग के लिए एक तारीख आवश्यक है।",
  }),
  name: z.string().min(2, "नाम कम से कम 2 अक्षरों का होना चाहिए।"),
  phone: z.string().min(10, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।"),
  notes: z.string().optional(),
  promoCode: z.string().optional(),
  partnerId: z.string().optional(),
  partnerWhatsapp: z.string().optional(),
})

function BookingFormComponent() {
    const { toast } = useToast()
    const [services, setServices] = useState<Service[]>([]);
    const searchParams = useSearchParams();
    const refWhatsapp = searchParams.get('ref');

    const form = useForm<z.infer<typeof bookingFormSchema>>({
        resolver: zodResolver(bookingFormSchema),
        defaultValues: {
            name: "",
            phone: "",
            notes: "",
            promoCode: "",
            partnerId: "",
            partnerWhatsapp: "",
        },
    })

    useEffect(() => {
        const unsubscribe = onServicesUpdate(setServices);
        
        const setPartnerData = async () => {
            if (refWhatsapp) {
                const partner = await getPartnerByWhatsappNumber(refWhatsapp);
                if (partner && partner.status === 'Approved') {
                    form.setValue('partnerId', partner.id);
                    form.setValue('partnerWhatsapp', partner.whatsappNumber);
                }
            }
        }
        setPartnerData();

        return () => unsubscribe();
    }, [refWhatsapp, form]);

    async function onSubmit(data: z.infer<typeof bookingFormSchema>) {
        try {
            await addBooking(data);
            toast({
                title: "बुकिंग सबमिट हो गई!",
                description: "हमें आपका अनुरोध मिल गया है और पुष्टि के लिए हम जल्द ही आपसे संपर्क करेंगे।",
            })
            form.reset();
        } catch (error) {
            console.error("बुकिंग जोड़ने में त्रुटि: ", error);
            toast({
                title: "त्रुटि",
                description: "आपकी बुकिंग सबमिट करने में कोई समस्या हुई। कृपया बाद में पुनः प्रयास करें।",
                variant: "destructive"
            })
        }
    }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">एक सेशन बुक करें</CardTitle>
          <CardDescription>बुकिंग का अनुरोध करने के लिए नीचे दिया गया फ़ॉर्म भरें। हम 24 घंटे के भीतर आपसे संपर्क करेंगे।</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>सेवा</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="बुक करने के लिए एक सेवा चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                           <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>तारीख</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>एक तारीख चुनें</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>पूरा नाम</FormLabel>
                    <FormControl>
                      <Input placeholder="जैसे - राहुल कुमार" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>फोन नंबर</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>नोट्स (वैकल्पिक)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="हमें अपने प्रोजेक्ट के बारे में थोड़ा बताएं"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      कोई भी विवरण जैसे गानों की संख्या, शैली, या विशिष्ट आवश्यकताएं।
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>प्रोमो कोड (वैकल्पिक)</FormLabel>
                    <FormControl>
                      <Input placeholder="प्रोमो कोड दर्ज करें" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.getValues("partnerWhatsapp") && (
                <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                    <p className="text-sm text-primary font-medium">
                        रेफरल पार्टनर: {form.getValues("partnerWhatsapp")}
                    </p>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg">बुकिंग अनुरोध सबमिट करें</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingFormComponent />
        </Suspense>
    )
}
