
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { GalleryImage, onGalleryImagesUpdate, addGalleryImage, deleteGalleryImage } from "@/services/gallery";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";


const galleryImageSchema = z.object({
  src: z.string().url({ message: "Please enter a valid URL." }),
  alt: z.string().min(1, "Alt text is required."),
});
type GalleryImageFormData = z.infer<typeof galleryImageSchema>;


export default function GalleryAdminPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryImageDialogOpen, setIsGalleryImageDialogOpen] = useState(false);

  const galleryImageForm = useForm<GalleryImageFormData>({ resolver: zodResolver(galleryImageSchema) });

  useEffect(() => {
    const unsubscribeGalleryImages = onGalleryImagesUpdate(setGalleryImages);
    return () => {
      unsubscribeGalleryImages();
    };
  }, []);

  const handleGalleryImageFormSubmit: SubmitHandler<GalleryImageFormData> = async (data) => {
      await addGalleryImage({ ...data, aiHint: "studio" });
      galleryImageForm.reset();
      setIsGalleryImageDialogOpen(false);
  };

  const handleDeleteGalleryImage = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this image?")) {
          await deleteGalleryImage(id);
      }
  };

  const openNewGalleryImageDialog = () => {
      galleryImageForm.reset();
      setIsGalleryImageDialogOpen(true);
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Gallery</CardTitle>
                <CardDescription>Add or remove images from the gallery.</CardDescription>
            </div>
            <Dialog open={isGalleryImageDialogOpen} onOpenChange={setIsGalleryImageDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openNewGalleryImageDialog}><PlusCircle className="mr-2"/>Add Image</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Gallery Image</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={galleryImageForm.handleSubmit(handleGalleryImageFormSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="src">Image URL</Label>
                            <Input id="src" {...galleryImageForm.register("src")} placeholder="https://placehold.co/800x600.png" />
                            {galleryImageForm.formState.errors.src && <p className="text-red-500 text-xs mt-1">{galleryImageForm.formState.errors.src.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="alt">Image Description (Alt Text)</Label>
                            <Input id="alt" {...galleryImageForm.register("alt")} placeholder="e.g., A photo of the main studio." />
                            {galleryImageForm.formState.errors.alt && <p className="text-red-500 text-xs mt-1">{galleryImageForm.formState.errors.alt.message}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Add Image</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {galleryImages.map((image) => (
                    <div key={image.id} className="relative group">
                        <Image src={image.src} alt={image.alt} width={200} height={150} className="rounded-lg object-cover aspect-[4/3]" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteGalleryImage(image.id!)}>Delete</Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
