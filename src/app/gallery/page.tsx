import Image from 'next/image';

const galleryImages = [
  { src: 'https://placehold.co/800x600.png', alt: 'Main mixing console', aiHint: 'mixing desk' },
  { src: 'https://placehold.co/600x800.png', alt: 'Vocal booth with microphone', aiHint: 'vocal booth' },
  { src: 'https://placehold.co/800x600.png', alt: 'Studio lounge area', aiHint: 'studio lounge' },
  { src: 'https://placehold.co/800x600.png', alt: 'Drum kit set up in live room', aiHint: 'drum kit' },
  { src: 'https://placehold.co/600x800.png', alt: 'Guitar amplifier collection', aiHint: 'guitar amps' },
  { src: 'https://placehold.co/800x600.png', alt: 'Analog gear rack', aiHint: 'studio rack' },
  { src: 'https://placehold.co/600x800.png', alt: 'Grand piano in Studio A', aiHint: 'grand piano' },
  { src: 'https://placehold.co/800x600.png', alt: 'Artist performing in studio', aiHint: 'musician studio' },
  { src: 'https://placehold.co/800x600.png', alt: 'Detailed shot of audio interface', aiHint: 'audio interface' },
];

export default function GalleryPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Gallery</h1>
        <p className="text-lg text-muted-foreground mt-2">A glimpse into our creative space.</p>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {galleryImages.map((image, index) => (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            width={800}
            height={600}
            className="rounded-lg shadow-lg hover:shadow-primary/20 transition-shadow duration-300 w-full h-auto"
            data-ai-hint={image.aiHint}
          />
        ))}
      </div>
    </div>
  );
}
