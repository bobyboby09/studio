
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Booking, onBookingsUpdate, updateBookingStatus, deleteBooking } from "@/services/bookings";
import { Service, onServicesUpdate, addService, deleteService, updateService } from "@/services/services";
import { GalleryImage, onGalleryImagesUpdate, addGalleryImage, deleteGalleryImage } from "@/services/gallery";
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const galleryImageSchema = z.object({
  src: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  aiHint: z.string().min(1, "AI Hint is required"),
});

type GalleryImageFormData = z.infer<typeof galleryImageSchema>;


export default function AdminPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);


  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
  });

  const galleryForm = useForm<GalleryImageFormData>({
    resolver: zodResolver(galleryImageSchema),
     defaultValues: {
      src: 'https://placehold.co/800x600.png',
      alt: 'A placeholder image',
      aiHint: 'placeholder'
    }
  });


  useEffect(() => {
    const unsubscribeBookings = onBookingsUpdate((bookings) => {
      const sortedBookings = bookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        return dateB.toDate().getTime() - dateA.toDate().getTime();
      });
      setAllBookings(sortedBookings);
    });

    const unsubscribeServices = onServicesUpdate(setServices);
    const unsubscribeGallery = onGalleryImagesUpdate(setGalleryImages);

    return () => {
      unsubscribeBookings();
      unsubscribeServices();
      unsubscribeGallery();
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    await updateBookingStatus(id, status);
  };

  const handleDeleteBooking = async (id: string) => {
    if(window.confirm("Are you sure you want to cancel this booking?")) {
      await deleteBooking(id);
    }
  }

  const getFormattedDate = (date: any) => {
    if (date && typeof date.toDate === 'function') {
      return format(date.toDate(), "PPP");
    }
    if (date instanceof Date) {
      return format(date, "PPP");
    }
    if (typeof date === 'string') {
        return format(new Date(date), "PPP");
    }
    if (typeof date === 'number') {
        return format(new Date(date), "PPP");
    }
    return "Invalid Date";
  }

  const handleServiceFormSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    if (editingService) {
      await updateService(editingService.id!, data);
    } else {
      await addService(data);
    }
    serviceForm.reset();
    setEditingService(null);
    setIsServiceDialogOpen(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    serviceForm.setValue("name", service.name);
    serviceForm.setValue("description", service.description);
    serviceForm.setValue("price", service.price);
    setIsServiceDialogOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };
  
  const openNewServiceDialog = () => {
    serviceForm.reset();
    setEditingService(null);
    setIsServiceDialogOpen(true);
  };

  const handleGalleryFormSubmit: SubmitHandler<GalleryImageFormData> = async (data) => {
    await addGalleryImage(data);
    galleryForm.reset();
    setIsGalleryDialogOpen(false);
  };

  const handleDeleteGalleryImage = async (id: string) => {
     if (window.confirm("Are you sure you want to delete this image?")) {
      await deleteGalleryImage(id);
    }
  }


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-bold">Admin Panel</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage all aspects of Studio Maestro.</p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="updates">Updates</TabsTrigger>
          <TabsTrigger value="promos">Promo Codes</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Manage Bookings</CardTitle>
              <CardDescription>View, confirm, or cancel client bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{getFormattedDate(booking.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          booking.status === 'Confirmed' && 'text-blue-400 border-blue-400',
                          booking.status === 'Pending' && 'text-yellow-400 border-yellow-400',
                          booking.status === 'Completed' && 'text-green-400 border-green-400',
                           booking.status === 'Cancelled' && 'text-red-400 border-red-400'
                        )}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        {booking.status === 'Pending' && (
                           <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Confirmed')}>Confirm</Button>
                        )}
                         {booking.status === 'Confirmed' && (
                           <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(booking.id!, 'Completed')}>Complete</Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking.id!)}>Cancel</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Services</CardTitle>
                <CardDescription>Add, edit, or remove services offered.</CardDescription>
              </div>
               <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewServiceDialog}>Add New Service</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={serviceForm.handleSubmit(handleServiceFormSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Service Name</Label>
                        <Input id="name" {...serviceForm.register("name")} />
                        {serviceForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{serviceForm.formState.errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...serviceForm.register("description")} />
                        {serviceForm.formState.errors.description && <p className="text-red-500 text-xs mt-1">{serviceForm.formState.errors.description.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" {...serviceForm.register("price")} />
                         {serviceForm.formState.errors.price && <p className="text-red-500 text-xs mt-1">{serviceForm.formState.errors.price.message}</p>}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">{editingService ? "Save Changes" : "Add Service"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.price}</TableCell>
                      <TableCell className="space-x-2">
                         <Button variant="outline" size="sm" onClick={() => handleEditService(service)}>Edit</Button>
                         <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id!)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gallery">
           <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Gallery</CardTitle>
                    <CardDescription>Add or remove images from the public gallery.</CardDescription>
                </div>
                 <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { galleryForm.reset(); setIsGalleryDialogOpen(true); }}>Add Image</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Gallery Image</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={galleryForm.handleSubmit(handleGalleryFormSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="src">Image URL</Label>
                                <Input id="src" {...galleryForm.register("src")} />
                                {galleryForm.formState.errors.src && <p className="text-red-500 text-xs mt-1">{galleryForm.formState.errors.src.message}</p>}
                            </div>
                             <div>
                                <Label htmlFor="alt">Alt Text</Label>
                                <Input id="alt" {...galleryForm.register("alt")} />
                                {galleryForm.formState.errors.alt && <p className="text-red-500 text-xs mt-1">{galleryForm.formState.errors.alt.message}</p>}
                            </div>
                             <div>
                                <Label htmlFor="aiHint">AI Hint</Label>
                                <Input id="aiHint" {...galleryForm.register("aiHint")} />
                                {galleryForm.formState.errors.aiHint && <p className="text-red-500 text-xs mt-1">{galleryForm.formState.errors.aiHint.message}</p>}
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {galleryImages.map(image => (
                        <div key={image.id} className="relative group">
                            <Image 
                                src={image.src} 
                                alt={image.alt} 
                                width={400} 
                                height={300} 
                                className="rounded-lg object-cover w-full aspect-square"
                                data-ai-hint={image.aiHint}
                            />
                            <div className="absolute top-0 right-0 m-2">
                                <Button variant="destructive" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDeleteGalleryImage(image.id!)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="updates">
           <Card>
            <CardHeader>
              <CardTitle>Manage Updates</CardTitle>
              <CardDescription>Post news and updates to the home page.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Updates management UI will be here.</p>
              <Button className="mt-4">Create New Update</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="promos">
           <Card>
            <CardHeader>
              <CardTitle>Manage Promo Codes</CardTitle>
              <CardDescription>Create and manage discount codes for clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Promo code management UI will be here.</p>
               <Button className="mt-4">Create Promo Code</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
