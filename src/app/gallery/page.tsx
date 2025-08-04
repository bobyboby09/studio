
"use client";

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { onGalleryImagesUpdate, GalleryImage } from '@/services/gallery';

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    const unsubscribe = onGalleryImagesUpdate(setGalleryImages);
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Gallery</h1>
        <p className="text-lg text-muted-foreground mt-2">A glimpse into our creative space.</p>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryImages.map((image) => (
          <Image
            key={image.id}
            src={image.src}
            alt={image.alt}
            width={800}
            height={600}
            className="rounded-lg shadow-lg hover:shadow-primary/20 transition-shadow duration-300 w-full h-auto"
          />
        ))}
      </div>
    </div>
  );
}
