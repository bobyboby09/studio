
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

import { cn } from "@/lib/utils";
import { Booking, onBookingsUpdate, updateBookingStatus, deleteBooking } from "@/services/bookings";
import { Service, onServicesUpdate, addService, deleteService, updateService } from "@/services/services";
import { PromoCode, onPromoCodesUpdate, addPromoCode, deletePromoCode } from "@/services/promos";
import { Update, onUpdatesUpdate, addUpdate, deleteUpdate, updateUpdate } from "@/services/updates";
import { GalleryImage, onGalleryImagesUpdate, addGalleryImage, deleteGalleryImage } from "@/services/gallery";
import { Partner, onPartnersUpdate, updatePartnerStatus } from "@/services/partners";

import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Handshake, Ticket, GalleryHorizontal, Megaphone, Sparkles, SlidersHorizontal, PlusCircle } from "lucide-react";


const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
});
type ServiceFormData = z.infer<typeof serviceSchema>;

const promoCodeSchema = z.object({
    code: z.string().min(1, "Code is required"),
    discount: z.string().min(1, "Discount is required (e.g., '15%' or '$10')"),
});
type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().or(z.literal('')),
});
type UpdateFormData = z.infer<typeof updateSchema>;

const galleryImageSchema = z.object({
  src: z.string().url({ message: "Please enter a valid URL." }),
  alt: z.string().min(1, "Alt text is required."),
});
type GalleryImageFormData = z.infer<typeof galleryImageSchema>;


export default function AdminPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isPromoCodeDialogOpen, setIsPromoCodeDialogOpen] = useState(false);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);

  const [isGalleryImageDialogOpen, setIsGalleryImageDialogOpen] = useState(false);


  const serviceForm = useForm<ServiceFormData>({ resolver: zodResolver(serviceSchema) });
  const promoCodeForm = useForm<PromoCodeFormData>({ resolver: zodResolver(promoCodeSchema) });
  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });
  const galleryImageForm = useForm<GalleryImageFormData>({ resolver: zodResolver(galleryImageSchema) });


  useEffect(() => {
    const unsubscribeBookings = onBookingsUpdate((bookings) => {
      const sortedBookings = bookings.sort((a, b) => {
        const dateA = a.date as any;
        const dateB = b.date as any;
        if (dateA?.toDate && dateB?.toDate) {
            return dateB.toDate().getTime() - dateA.toDate().getTime();
        }
        return 0;
      });
      setAllBookings(sortedBookings);
    });

    const unsubscribeServices = onServicesUpdate(setServices);
    const unsubscribePromoCodes = onPromoCodesUpdate(setPromoCodes);
    const unsubscribeUpdates = onUpdatesUpdate(setUpdates);
    const unsubscribeGalleryImages = onGalleryImagesUpdate(setGalleryImages);
    const unsubscribePartners = onPartnersUpdate(setPartners);

    return () => {
      unsubscribeBookings();
      unsubscribeServices();
      unsubscribePromoCodes();
      unsubscribeUpdates();
      unsubscribeGalleryImages();
      unsubscribePartners();
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
        try {
            return format(new Date(date), "PPP");
        } catch (e) { return "Invalid Date"; }
    }
    if (typeof date === 'number') {
        try {
            return format(new Date(date), "PPP");
        } catch(e) { return "Invalid Date"; }
    }
    return "Invalid Date";
  }

  // Service handlers
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
  
  // Promo code handlers
  const handlePromoCodeFormSubmit: SubmitHandler<PromoCodeFormData> = async (data) => {
    await addPromoCode(data);
    promoCodeForm.reset();
    setIsPromoCodeDialogOpen(false);
  };

  const handleDeletePromoCode = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promo code?")) {
      await deletePromoCode(id);
    }
  };

  // Update handlers
  const handleUpdateFormSubmit: SubmitHandler<UpdateFormData> = async (data) => {
    if (editingUpdate) {
      await updateUpdate(editingUpdate.id!, data);
    } else {
      await addUpdate(data);
    }
    updateForm.reset();
    setEditingUpdate(null);
    setIsUpdateDialogOpen(false);
  };

  const handleEditUpdate = (update: Update) => {
    setEditingUpdate(update);
    updateForm.setValue("title", update.title);
    updateForm.setValue("description", update.description);
    updateForm.setValue("imageUrl", update.imageUrl || "");
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteUpdate = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this update?")) {
      await deleteUpdate(id);
    }
  };

  const openNewUpdateDialog = () => {
    updateForm.reset();
    setEditingUpdate(null);
    setIsUpdateDialogOpen(true);
  };

  // Gallery Image Handlers
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

  // Partner handlers
  const handlePartnerStatusUpdate = async (id: string, status: Partner['status']) => {
      await updatePartnerStatus(id, status);
  }


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-bold">Admin Panel</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage all aspects of Studio Maestro.</p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6">
          <TabsTrigger value="bookings"><Ticket className="mr-2"/>Bookings</TabsTrigger>
          <TabsTrigger value="services"><SlidersHorizontal className="mr-2"/>Services</TabsTrigger>
          <TabsTrigger value="updates"><Megaphone className="mr-2"/>Updates</TabsTrigger>
          <TabsTrigger value="gallery"><GalleryHorizontal className="mr-2"/>Gallery</TabsTrigger>
          <TabsTrigger value="promos"><Sparkles className="mr-2"/>Promo Codes</TabsTrigger>
          <TabsTrigger value="partners"><Handshake className="mr-2"/>Partners</TabsTrigger>
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
                    <TableHead>Promo</TableHead>
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
                       <TableCell>{booking.promoCode || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={
                          booking.status === 'Confirmed' ? 'default' :
                          booking.status === 'Pending' ? 'secondary' :
                          booking.status === 'Completed' ? 'outline' :
                          'destructive'
                        }
                        className={cn(
                            booking.status === 'Completed' && 'border-green-500 text-green-500'
                        )}
                        >
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
                  <Button onClick={openNewServiceDialog}><PlusCircle className="mr-2"/>Add Service</Button>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-muted-foreground">{service.description}</TableCell>
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

        <TabsContent value="updates">
           <Card>
            <CardHeader  className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Updates</CardTitle>
                <CardDescription>Post news and updates to the home page.</CardDescription>
              </div>
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewUpdateDialog}><PlusCircle className="mr-2"/>Create Update</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUpdate ? "Edit Update" : "Create New Update"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={updateForm.handleSubmit(handleUpdateFormSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...updateForm.register("title")} />
                        {updateForm.formState.errors.title && <p className="text-red-500 text-xs mt-1">{updateForm.formState.errors.title.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...updateForm.register("description")} />
                        {updateForm.formState.errors.description && <p className="text-red-500 text-xs mt-1">{updateForm.formState.errors.description.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                        <Input id="imageUrl" {...updateForm.register("imageUrl")} placeholder="https://placehold.co/600x400.png" />
                         {updateForm.formState.errors.imageUrl && <p className="text-red-500 text-xs mt-1">{updateForm.formState.errors.imageUrl.message}</p>}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">{editingUpdate ? "Save Changes" : "Create Update"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updates.map((update) => (
                    <TableRow key={update.id}>
                      <TableCell className="font-medium">{update.title}</TableCell>
                      <TableCell className="text-muted-foreground">{update.description}</TableCell>
                      <TableCell className="space-x-2">
                         <Button variant="outline" size="sm" onClick={() => handleEditUpdate(update)}>Edit</Button>
                         <Button variant="destructive" size="sm" onClick={() => handleDeleteUpdate(update.id!)}>Delete</Button>
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
        </TabsContent>

        <TabsContent value="promos">
           <Card>
            <CardHeader  className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Promo Codes</CardTitle>
                <CardDescription>Create and manage discount codes for clients.</CardDescription>
              </div>
                <Dialog open={isPromoCodeDialogOpen} onOpenChange={setIsPromoCodeDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { promoCodeForm.reset(); setIsPromoCodeDialogOpen(true); }}><PlusCircle className="mr-2"/>Add Promo Code</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Promo Code</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={promoCodeForm.handleSubmit(handlePromoCodeFormSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="code">Promo Code</Label>
                                <Input id="code" {...promoCodeForm.register("code")} />
                                {promoCodeForm.formState.errors.code && <p className="text-red-500 text-xs mt-1">{promoCodeForm.formState.errors.code.message}</p>}
                            </div>
                             <div>
                                <Label htmlFor="discount">Discount</Label>
                                <Input id="discount" {...promoCodeForm.register("discount")} placeholder="e.g. 15% or $10"/>
                                {promoCodeForm.formState.errors.discount && <p className="text-red-500 text-xs mt-1">{promoCodeForm.formState.errors.discount.message}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Add Code</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">{promo.code}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-primary">{promo.discount}</TableCell>
                      <TableCell>
                         <Button variant="destructive" size="sm" onClick={() => handleDeletePromoCode(promo.id!)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners">
           <Card>
            <CardHeader>
                <CardTitle>Manage Partner Requests</CardTitle>
                <CardDescription>Approve or reject requests from potential partners.</CardDescription>
            </CardHeader>
            <CardContent>
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>WhatsApp Number</TableHead>
                    <TableHead>Status</TableHead>
                     <TableHead>Requested At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>{partner.whatsappNumber}</TableCell>
                      <TableCell>
                         <Badge variant={
                            partner.status === 'Approved' ? 'default' :
                            partner.status === 'Pending' ? 'secondary' :
                            'destructive'
                         }
                         className={cn(
                           partner.status === 'Approved' && 'bg-green-600'
                         )}
                         >
                          {partner.status}
                        </Badge>
                      </TableCell>
                       <TableCell>{getFormattedDate(partner.createdAt)}</TableCell>
                      <TableCell className="space-x-2">
                        {partner.status === 'Pending' && (
                            <>
                                <Button variant="outline" size="sm" onClick={() => handlePartnerStatusUpdate(partner.id!, 'Approved')}>Approve</Button>
                                <Button variant="destructive" size="sm" onClick={() => handlePartnerStatusUpdate(partner.id!, 'Rejected')}>Reject</Button>
                            </>
                        )}
                        {partner.status === 'Approved' && (
                             <Button variant="destructive" size="sm" onClick={() => handlePartnerStatusUpdate(partner.id!, 'Rejected')}>Reject</Button>
                        )}
                        {partner.status === 'Rejected' && (
                              <Button variant="outline" size="sm" onClick={() => handlePartnerStatusUpdate(partner.id!, 'Approved')}>Approve</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
