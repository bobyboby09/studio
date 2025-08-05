
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Music, Sparkles, Video, Camera, Disc, Mic2, Wind } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { onServicesUpdate, Service } from '@/services/services';
import { onUpdatesUpdate, Update } from '@/services/updates';
import { onGalleryImagesUpdate, GalleryImage } from '@/services/gallery';
import { onPromoCodesUpdate, PromoCode } from '@/services/promos';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


const serviceIcons: { [key: string]: React.ElementType } = {
  "Video Mixing": Video,
  "Photography": Camera,
  "Album Design": Disc,
  "Song Recording": Mic2,
  "Drone Shoot": Wind,
  "default": Camera
};

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);

  useEffect(() => {
    const unsubscribeServices = onServicesUpdate(setServices);
    const unsubscribeUpdates = onUpdatesUpdate(setUpdates);
    const unsubscribeGallery = onGalleryImagesUpdate((images) => setGalleryImages(images.slice(0, 6))); // Get first 6 images for preview
    const unsubscribePromos = onPromoCodesUpdate(setPromoCodes);

    return () => {
      unsubscribeServices();
      unsubscribeUpdates();
      unsubscribeGallery();
      unsubscribePromos();
    };
  }, []);

  const getServiceIcon = (serviceName: string) => {
    const Icon = serviceIcons[serviceName] || serviceIcons.default;
    return <Icon className="w-8 h-8 text-primary mb-4" />;
  }

  return (
    <div className="flex flex-col">
      <section className="h-[60vh] md:h-[80vh] bg-black text-center relative flex items-center justify-center overflow-hidden">
         <video 
            src="https://cdn.pixabay.com/video/2024/05/27/211515-949430484_large.mp4"
            autoPlay
            loop
            muted
            className="absolute top-1/2 left-1/2 w-full h-full object-cover -translate-x-1/2 -translate-y-1/2 opacity-30"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        <div className="container mx-auto px-4 z-10 relative">
          <h1 className="font-headline text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            प्रदीप फिल्म्स स्टूडियो में आपका स्वागत है
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            जहाँ आपकी दृष्टि जीवंत हो उठती है।
          </p>
          <Button asChild size="lg" className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Link href="/booking">
              अपना सेशन बुक करें <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {updates.length > 0 && (
        <section className="py-16 bg-background/90">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold">नवीनतम अपडेट</h2>
                 </div>
                 <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                        {updates.map((update) => (
                        <CarouselItem key={update.id} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden h-full flex flex-col">
                                {update.imageUrl && (
                                     <Image src={update.imageUrl} alt={update.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint="abstract music"/>
                                )}
                                <CardHeader>
                                    <CardTitle>{update.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground">{update.description}</p>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                 </Carousel>
            </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold">हमारी सेवाएँ</h2>
            <p className="text-lg text-muted-foreground mt-2">हर कलाकार के लिए विशेष समाधान।</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {services.map((service, index) => (
              <Link href="/booking" key={service.id}>
                <div className="p-6 bg-card rounded-lg border-2 border-transparent hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center h-full animate-fade-in-up" style={{ animationDelay: `${index * 150}ms`}}>
                  {getServiceIcon(service.name)}
                  <h3 className="font-bold text-lg">{service.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {promoCodes.length > 0 && (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1">
                {promoCodes.slice(0, 1).map((promo) => (
                    <Card key={promo.id} className="bg-gradient-to-br from-primary/80 via-primary to-yellow-400 border-primary/20 shadow-2xl shadow-primary/20 text-primary-foreground overflow-hidden relative">
                         <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                         <div className="absolute -bottom-8 -left-2 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                        <CardContent className="p-8 text-center relative z-10">
                        <p className="text-lg font-bold mb-4 flex items-center justify-center gap-2"><Sparkles /> आज का ऑफर!</p>
                        <p className="text-4xl font-bold font-mono tracking-widest bg-black/20 rounded-lg p-4 inline-block mb-4">
                            {promo.code}
                        </p>
                        <p className="text-2xl font-semibold mb-6">
                            पाएं {promo.discount} की छूट!
                        </p>
                         <Button asChild variant="secondary" size="lg">
                            <Link href="/booking">अभी प्रोमो कोड लागू करें</Link>
                        </Button>
                        </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        </section>
      )}


      {galleryImages.length > 0 && (
         <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-4xl font-bold">हमारी गैलरी</h2>
                    <p className="text-lg text-muted-foreground mt-2">हमारे स्टूडियो के कुछ पल।</p>
                </div>
                 <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent>
                        {galleryImages.map((image) => (
                        <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                             <Image
                                src={image.src}
                                alt={image.alt}
                                width={800}
                                height={600}
                                className="rounded-lg shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full h-auto aspect-video object-cover"
                              />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                 </Carousel>
                 <div className="text-center mt-12">
                    <Button asChild variant="outline">
                        <Link href="/gallery">पूरी गैलरी देखें <ArrowRight className="ml-2" /></Link>
                    </Button>
                </div>
            </div>
        </section>
      )}

    </div>
  );
}
