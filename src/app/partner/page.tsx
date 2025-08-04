
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
import { requestPartnerAccess } from "@/services/partners";
import { Handshake } from "lucide-react";

const partnerFormSchema = z.object({
  whatsappNumber: z.string().min(10, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।").regex(/^\d{10,15}$/, "कृपया एक मान्य फ़ोन नंबर दर्ज करें।"),
});

export default function PartnerPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof partnerFormSchema>>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      whatsappNumber: "",
    },
  });

  async function onSubmit(data: z.infer<typeof partnerFormSchema>) {
    try {
      await requestPartnerAccess(data.whatsappNumber);
      toast({
        title: "अनुरोध भेज दिया गया!",
        description: "पार्टनर बनने के लिए आपका अनुरोध भेज दिया गया है। हम जल्द ही आपसे संपर्क करेंगे।",
      });
      form.reset();
    } catch (error) {
      console.error("पार्टनर अनुरोध में त्रुटि:", error);
      const errorMessage = (error as Error).message || "अनुरोध भेजने में कोई समस्या हुई।";
      
      if (errorMessage.includes("already exists")) {
        toast({
            title: "अनुरोध पहले से मौजूद है",
            description: "इस नंबर से पहले ही पार्टनर बनने का अनुरोध किया जा चुका है।",
            variant: "destructive",
        });
      } else {
        toast({
            title: "त्रुटि",
            description: "आपका अनुरोध भेजने में कोई समस्या हुई। कृपया बाद में पुनः प्रयास करें।",
            variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                <Handshake className="h-10 w-10 text-primary" />
            </div>
          <CardTitle className="font-headline text-4xl">हमारे पार्टनर बनें</CardTitle>
          <CardDescription>
            हमारे साथ जुड़ें और अपने क्षेत्र में हमारे व्यवसाय को बढ़ाने में मदद करें।
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
