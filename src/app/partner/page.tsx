
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { requestPartnerAccess, getPartnerByWhatsappNumber, Partner } from "@/services/partners";
import { onPartnerConditionsUpdate, PartnerCondition } from "@/services/partnerConditions";
import { Handshake, FileText, CheckCircle, BadgeCheck, Clock, XCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const partnerFormSchema = z.object({
  whatsappNumber: z.string().min(10, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।").regex(/^\d{10,15}$/, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।"),
});

type View = "check_status" | "show_status" | "apply";

export default function PartnerPage() {
  const { toast } = useToast();
  const [conditions, setConditions] = useState<PartnerCondition[]>([]);
  const [view, setView] = useState<View>("check_status");
  const [partnerStatus, setPartnerStatus] = useState<Partner | null>(null);
  const [checkedNumber, setCheckedNumber] = useState("");

  useEffect(() => {
    const unsubscribe = onPartnerConditionsUpdate(setConditions);
    return () => unsubscribe();
  }, []);

  const form = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      whatsappNumber: "",
    },
  });

  const checkStatusForm = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
        whatsappNumber: "",
    },
  });


  async function onCheckStatus(data: z.infer<typeof partnerFormSchema>) {
      try {
          const partner = await getPartnerByWhatsappNumber(data.whatsappNumber);
          setPartnerStatus(partner);
          setCheckedNumber(data.whatsappNumber);
          if (partner) {
              setView("show_status");
          } else {
              setView("apply");
              form.setValue("whatsappNumber", data.whatsappNumber);
          }
      } catch (error) {
          toast({
              title: "त्रुटि",
              description: "स्थिति की जांच करने में कोई समस्या हुई।",
              variant: "destructive",
          });
      }
  }


  async function onSubmit(data: z.infer<typeof partnerFormSchema>) {
    try {
      await requestPartnerAccess(data.whatsappNumber);
      toast({
        title: "अनुरोध भेज दिया गया!",
        description: "पार्टनर बनने के लिए आपका अनुरोध भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।",
      });
      const partner = await getPartnerByWhatsappNumber(data.whatsappNumber);
      setPartnerStatus(partner);
      setView("show_status");

    } catch (error) {
      console.error("पार्टनर अनुरोध में त्रुटि:", error);
      const errorMessage = (error as Error).message || "अनुरोध भेजने में कोई समस्या हुई।";
      
      if (errorMessage.includes("already exists")) {
        toast({
            title: "अनुरोध पहले से मौजूद है",
            description: "इस नंबर से पहले ही पार्टनर बनने का अनुरोध किया जा चुका है।",
            variant: "destructive",
        });
        const partner = await getPartnerByWhatsappNumber(data.whatsappNumber);
        setPartnerStatus(partner);
        setView("show_status");
      } else {
        toast({
            title: "त्रुटि",
            description: "आपका अनुरोध भेजने में कोई समस्या हुई। कृपया बाद में पुनः प्रयास करें।",
            variant: "destructive",
        });
      }
    }
  }

  const renderStatusCard = () => {
    if (!partnerStatus) return null;

    let icon, title, description, badgeVariant: "default" | "secondary" | "destructive" | "outline";

    switch(partnerStatus.status) {
        case 'Approved':
            icon = <BadgeCheck className="h-10 w-10 text-green-500" />;
            title = "बधाई हो, आप एक पार्टनर हैं!";
            description = "आपका अनुरोध स्वीकृत हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।";
            badgeVariant = "default";
            break;
        case 'Pending':
            icon = <Clock className="h-10 w-10 text-yellow-500" />;
            title = "आपका अनुरोध लंबित है";
            description = "हमने आपका अनुरोध प्राप्त कर लिया है। कृपया अनुमोदन की प्रतीक्षा करें।";
            badgeVariant = "secondary";
            break;
        case 'Rejected':
            icon = <XCircle className="h-10 w-10 text-red-500" />;
            title = "आपका अनुरोध अस्वीकृत कर दिया गया है";
            description = "हमें खेद है, लेकिन हम आपके अनुरोध के साथ आगे नहीं बढ़ सकते।";
            badgeVariant = "destructive";
            break;
    }

    return (
        <div className="text-center p-6 border rounded-lg bg-card">
            <div className="mx-auto bg-background p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-2xl font-headline mb-2">{title}</h3>
            <p className="text-muted-foreground mb-4">{description}</p>
            <Badge variant={badgeVariant} className="text-sm">{partnerStatus.status}</Badge>
            <Button variant="link" onClick={() => {
                setView("check_status");
                checkStatusForm.reset();
            }}>
                दूसरा नंबर जांचें
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
            {view !== "show_status" && (
                 <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    <Handshake className="h-10 w-10 text-primary" />
                </div>
            )}
          <CardTitle className="font-headline text-4xl">हमारे पार्टनर बनें</CardTitle>
          {view !== "show_status" && (
            <CardDescription>
                हमारे साथ जुड़ें और अपने क्षेत्र में हमारे व्यवसाय को बढ़ाने में मदद करें।
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
            {view === 'check_status' && (
                 <Form {...checkStatusForm}>
                    <form onSubmit={checkStatusForm.handleSubmit(onCheckStatus)} className="space-y-4 text-center">
                        <FormField
                            control={checkStatusForm.control}
                            name="whatsappNumber"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>पहले अपनी स्थिति जांचें</FormLabel>
                                <FormControl>
                                <Input placeholder="अपना 10 अंकों का व्हाट्सएप नंबर दर्ज करें" {...field} />
                                </FormControl>
                                <FormDescription>
                                    यह देखने के लिए कि क्या आपने पहले ही आवेदन कर दिया है।
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" size="lg">
                            <Search className="mr-2"/>
                            स्थिति जांचें
                        </Button>
                    </form>
                 </Form>
            )}

            {view === 'show_status' && renderStatusCard()}

            {view === 'apply' && (
                <>
                {conditions.length > 0 && (
                    <div className="mb-8 p-4 bg-card-foreground/5 rounded-lg border border-border">
                    <h3 className="font-headline text-xl mb-4 flex items-center"><FileText className="mr-2 h-5 w-5"/>नियम और शर्तें</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        {conditions.map(condition => (
                        <li key={condition.id} className="flex items-start">
                            <CheckCircle className="h-4 w-4 mr-3 mt-1 text-primary flex-shrink-0" />
                            <span>{condition.text}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                )}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>व्हाट्सएप नंबर</FormLabel>
                            <FormControl>
                            <Input placeholder="अपना 10 अंकों का व्हाट्सएप नंबर दर्ज करें" {...field} />
                            </FormControl>
                            <FormDescription>
                            हम इस नंबर का उपयोग आपसे संपर्क करने और आपके खाते की पुष्टि करने के लिए करेंगे।
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" size="lg">
                        पार्टनर बनने का अनुरोध करें
                    </Button>
                    <Button variant="link" className="w-full" onClick={() => setView('check_status')}>
                        पहले से ही आवेदन किया है? अपनी स्थिति जांचें
                    </Button>
                    </form>
                </Form>
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

