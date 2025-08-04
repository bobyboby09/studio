
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Music, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onServicesUpdate, Service } from '@/services/services';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const unsubscribe = onServicesUpdate((allServices) => {
      setServices(allServices.slice(0, 3)); // Show latest 3 services
    });
    return () => unsubscribe();
  }, []);

  const updates = [
    { title: 'New Analog Compressor Added', description: 'The new "Golden Ears" compressor is now available for all mixing sessions.' },
    { title: 'Studio B Acoustics Upgraded', description: 'We have revamped the acoustics in Studio B for an even cleaner sound.' },
    { title: 'Collaboration with Aura Records', description: 'Exciting new projects coming soon with artists from Aura Records.' },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-20 md:py-32 bg-black text-center relative">
        <div className="container mx-auto px-4 z-10">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white mb-4">
            Studio Maestro
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Where your musical vision finds its perfect sound. Professional recording, mixing, and mastering services for artists who demand the best.
          </p>
          <Button asChild size="lg">
            <Link href="/booking">
              Book Your Session <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold text-center mb-12">Our World-Class Facilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
             <Image src="https://placehold.co/600x400.png" alt="Studio A" width={600} height={400} className="rounded-lg shadow-lg object-cover w-full h-full" data-ai-hint="recording studio" />
             <Image src="https://placehold.co/600x800.png" alt="Mixing Console" width={600} height={800} className="rounded-lg shadow-lg object-cover w-full h-full md:col-span-1" data-ai-hint="mixing console" />
             <Image src="https://placehold.co/600x400.png" alt="Lounge Area" width={600} height={400} className="rounded-lg shadow-lg object-cover w-full h-full" data-ai-hint="studio lounge" />
          </div>
           <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/gallery">Explore Gallery <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">Our Services</h2>
            <p className="text-lg text-muted-foreground mt-2">Tailored solutions for every artist.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="pt-4">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-2xl font-bold text-primary">{service.price}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/booking">Book Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/services">View All Services <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Separator />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-headline text-4xl font-bold mb-6">Latest Updates</h2>
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
              <Card className="bg-gradient-to-br from-gray-900 to-black border-primary/50 shadow-2xl shadow-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    <span className="font-headline text-2xl">Special Promotion</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    Get 15% off your first full-day booking!
                  </p>
                  <p className="text-4xl font-bold font-mono tracking-widest text-primary bg-background/50 rounded-lg p-4 inline-block">
                    MAESTRO15
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Use this code at checkout.
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
