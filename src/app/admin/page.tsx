
"use client";

import { useEffect, useState } from "react";
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


export default function AdminPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isPromoCodeDialogOpen, setIsPromoCodeDialogOpen] = useState(false);

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);


  const serviceForm = useForm<ServiceFormData>({ resolver: zodResolver(serviceSchema) });
  const promoCodeForm = useForm<PromoCodeFormData>({ resolver: zodResolver(promoCodeSchema) });
  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });


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

    return () => {
      unsubscribeBookings();
      unsubscribeServices();
      unsubscribePromoCodes();
      unsubscribeUpdates();
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


  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="font-headline text-5xl font-bold">Admin Panel</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage all aspects of Studio Maestro.</p>
      </div>

      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
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

        <TabsContent value="updates">
           <Card>
            <CardHeader  className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Updates</CardTitle>
                <CardDescription>Post news and updates to the home page.</CardDescription>
              </div>
                <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openNewUpdateDialog}>Create New Update</Button>
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
                      <TableCell>{update.title}</TableCell>
                      <TableCell>{update.description}</TableCell>
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

        <TabsContent value="promos">
           <Card>
            <CardHeader  className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Promo Codes</CardTitle>
                <CardDescription>Create and manage discount codes for clients.</CardDescription>
              </div>
                <Dialog open={isPromoCodeDialogOpen} onOpenChange={setIsPromoCodeDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { promoCodeForm.reset(); setIsPromoCodeDialogOpen(true); }}>Add Promo Code</Button>
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
                      <TableCell>{promo.code}</TableCell>
                      <TableCell>{promo.discount}</TableCell>
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
      </Tabs>
    </div>
  );
}
