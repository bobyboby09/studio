import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

const services = [
  {
    name: 'Album Design',
    description: 'Complete album art and layout design, from concept to print-ready files.',
    price: '$500+',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'album cover'
  },
  {
    name: 'Professional Photoshoots',
    description: 'High-quality photoshoots for artists and bands, perfect for press kits and social media.',
    price: '$800 / day',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'musician portrait'
  },
  {
    name: 'Mixing & Mastering',
    description: 'Expert mixing and mastering services to give your tracks a professional, polished sound.',
    price: '$250 / song',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'mixing console'
  },
  {
    name: 'Video Editing',
    description: 'Full video editing services for music videos, promotional content, and more.',
    price: '$120 / hour',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'video editing'
  },
   {
    name: 'Full Day Studio Rental',
    description: 'Access to our main recording studio for a full 8-hour session with an engineer.',
    price: '$1200 / day',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'recording studio'
  },
  {
    name: 'Vocal Production',
    description: 'Dedicated vocal recording and production session to capture the perfect take.',
    price: '$150 / hour',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'microphone studio'
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Our Services</h1>
        <p className="text-lg text-muted-foreground mt-2">Tailored solutions for every artist.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Card key={service.name} className="flex flex-col">
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
