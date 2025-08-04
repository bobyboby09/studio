
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
import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().url("Must be a valid URL").min(1, "Image URL is required"),
  aiHint: z.string().min(1, "AI Hint is required"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export default function AdminPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      image: 'https://placehold.co/600x400.png'
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

    return () => {
      unsubscribeBookings();
      unsubscribeServices();
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
    reset();
    setEditingService(null);
    setIsServiceDialogOpen(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setValue("name", service.name);
    setValue("description", service.description);
    setValue("price", service.price);
    setValue("image", service.image);
    setValue("aiHint", service.aiHint);
    setIsServiceDialogOpen(true);
  };

  const handleDeleteService = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
    }
  };
  
  const openNewServiceDialog = () => {
    reset();
    setEditingService(null);
    setIsServiceDialogOpen(true);
  };


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
                  <form onSubmit={handleSubmit(handleServiceFormSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Service Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...register("description")} />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="price">Price</Label>
                        <Input id="price" {...register("price")} />
                         {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="image">Image URL</Label>
                        <Input id="image" {...register("image")} />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="aiHint">AI Hint</Label>
                        <Input id="aiHint" {...register("aiHint")} />
                        {errors.aiHint && <p className="text-red-500 text-xs mt-1">{errors.aiHint.message}</p>}
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
            <CardHeader>
              <CardTitle>Manage Gallery</CardTitle>
              <CardDescription>Upload or delete images from the public gallery.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Gallery management UI will be here.</p>
              <Button className="mt-4">Upload Image</Button>
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
