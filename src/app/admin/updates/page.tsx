
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Update, onUpdatesUpdate, addUpdate, deleteUpdate, updateUpdate } from "@/services/updates";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";


const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional().or(z.literal('')),
});
type UpdateFormData = z.infer<typeof updateSchema>;


export default function UpdatesAdminPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);

  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });

  useEffect(() => {
    const unsubscribeUpdates = onUpdatesUpdate(setUpdates);
    return () => {
      unsubscribeUpdates();
    };
  }, []);

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
  );
}
