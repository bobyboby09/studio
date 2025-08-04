
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { onServicesUpdate, Service } from '@/services/services';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const unsubscribe = onServicesUpdate(setServices);
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Our Services</h1>
        <p className="text-lg text-muted-foreground mt-2">Tailored solutions for every artist.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <Image src={service.image} alt={service.name} width={600} height={400} className="rounded-t-lg aspect-[3/2] object-cover" data-ai-hint={service.aiHint} />
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
    </div>
  );
}
