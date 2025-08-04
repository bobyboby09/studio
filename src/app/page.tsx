
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Music, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onServicesUpdate, Service } from '@/services/services';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const unsubscribe = onServicesUpdate((allServices) => {
      setServices(allServices); 
    });
    return () => unsubscribe();
  }, []);

  const updates = [
    { title: 'नया एनालॉग कंप्रेसर जोड़ा गया', description: 'नया "गोल्डन इयर्स" कंप्रेसर अब सभी मिक्सिंग सत्रों के लिए उपलब्ध है।' },
    { title: 'स्टूडियो बी की ध्वनिकी अपग्रेड की गई', description: 'हमने और भी स्पष्ट ध्वनि के लिए स्टूडियो बी में ध्वनिकी को नया रूप दिया है।' },
    { title: 'ऑरा रिकॉर्ड्स के साथ सहयोग', description: 'ऑरा रिकॉर्ड्स के कलाकारों के साथ जल्द ही रोमांचक नए प्रोजेक्ट आ रहे हैं।' },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-24 md:py-40 bg-black text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-black"
        />
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-white to-gray-400 mb-4 animate-fade-in-up">
            प्रदीप फिल्म्स स्टूडियो और मिक्सिंग लैब
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            जहाँ आपकी संगीत दृष्टि को उसकी उत्तम ध्वनि मिलती है। सर्वश्रेष्ठ की मांग करने वाले कलाकारों के लिए पेशेवर रिकॉर्डिंग, मिक्सिंग और मास्टरिंग सेवाएँ।
          </p>
          <Button asChild size="lg" className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Link href="/booking">
              अपना सेशन बुक करें <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">हमारी सेवाएँ</h2>
            <p className="text-lg text-muted-foreground mt-2">हर कलाकार के लिए विशेष समाधान।</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={service.id} className="flex flex-col animate-fade-in-up border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm" style={{ animationDelay: `${index * 150}ms`}}>
                <CardHeader>
                  <CardTitle className="pt-4">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/booking">अभी बुक करें</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/services">सभी सेवाएँ देखें <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Separator />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline text-4xl font-bold mb-6">नवीनतम अपडेट</h2>
              <div className="space-y-6">
                {updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Music className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{update.title}</h3>
                      <p className="text-muted-foreground">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-2xl shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    <span className="font-headline text-2xl">विशेष प्रचार</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    अपनी पहली पूरे दिन की बुकिंग पर 15% की छूट पाएं!
                  </p>
                  <p className="text-4xl font-bold font-mono tracking-widest text-primary bg-background/50 rounded-lg p-4 inline-block">
                    MAESTRO15
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    चेकआउट पर इस कोड का प्रयोग करें।
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
