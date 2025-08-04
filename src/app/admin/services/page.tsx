
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Service, onServicesUpdate, addService, deleteService, updateService } from "@/services/services";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";


const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
});
type ServiceFormData = z.infer<typeof serviceSchema>;


export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const serviceForm = useForm<ServiceFormData>({ resolver: zodResolver(serviceSchema) });

  useEffect(() => {
    const unsubscribeServices = onServicesUpdate(setServices);
    return () => {
      unsubscribeServices();
    };
  }, []);

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

  return (
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
  );
}
