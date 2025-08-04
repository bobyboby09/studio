
"use client";

import { useEffect, useState } from "react";
import { onPromoCodesUpdate, PromoCode } from "@/services/promos";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function OffersPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    const unsubscribe = onPromoCodesUpdate(setPromoCodes);
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">विशेष ऑफर्स</h1>
        <p className="text-lg text-muted-foreground mt-2">अपनी बुकिंग पर छूट पाने के लिए इन कोड का उपयोग करें।</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {promoCodes.map((promo) => (
          <Card key={promo.id} className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-2xl shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary" />
                <span className="font-headline text-2xl">{promo.discount} की छूट</span>
              </CardTitle>
               <CardDescription>प्रोमो कोड के साथ</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold font-mono tracking-widest text-primary bg-background/50 rounded-lg p-4 inline-block">
                {promo.code}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                चेकआउट पर इस कोड का प्रयोग करें।
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
       {promoCodes.length === 0 && (
          <div className="text-center col-span-full py-12">
              <p className="text-muted-foreground">अभी कोई सक्रिय ऑफ़र नहीं है। जल्द ही वापस जाँचें!</p>
          </div>
      )}
    </div>
  );
}
