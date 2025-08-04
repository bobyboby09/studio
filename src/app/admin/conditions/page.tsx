
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { PartnerCondition, onPartnerConditionsUpdate, addPartnerCondition, deletePartnerCondition, updatePartnerCondition } from "@/services/partnerConditions";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";


const partnerConditionSchema = z.object({
  text: z.string().min(1, "Condition text is required"),
});
type PartnerConditionFormData = z.infer<typeof partnerConditionSchema>;


export default function ConditionsAdminPage() {
  const [partnerConditions, setPartnerConditions] = useState<PartnerCondition[]>([]);
  
  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<PartnerCondition | null>(null);

  const conditionForm = useForm<PartnerConditionFormData>({ resolver: zodResolver(partnerConditionSchema) });

  useEffect(() => {
    const unsubscribePartnerConditions = onPartnerConditionsUpdate(setPartnerConditions);

    return () => {
      unsubscribePartnerConditions();
    };
  }, []);


  const handleConditionFormSubmit: SubmitHandler<PartnerConditionFormData> = async (data) => {
    if (editingCondition) {
        await updatePartnerCondition(editingCondition.id!, data);
    } else {
        await addPartnerCondition(data);
    }
    conditionForm.reset();
    setEditingCondition(null);
    setIsConditionDialogOpen(false);
  };

  const handleEditCondition = (condition: PartnerCondition) => {
      setEditingCondition(condition);
      conditionForm.setValue("text", condition.text);
      setIsConditionDialogOpen(true);
  };

  const handleDeleteCondition = async (id: string) => {
      if (window.confirm("Are you sure you want to delete this condition?")) {
          await deletePartnerCondition(id);
      }
  };

  const openNewConditionDialog = () => {
      conditionForm.reset();
      setEditingCondition(null);
      setIsConditionDialogOpen(true);
  };


  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Partner Conditions</CardTitle>
                <CardDescription>Set the terms for users to become partners.</CardDescription>
            </div>
            <Dialog open={isConditionDialogOpen} onOpenChange={setIsConditionDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openNewConditionDialog}><PlusCircle className="mr-2"/>Add Condition</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCondition ? "Edit Condition" : "Add New Condition"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={conditionForm.handleSubmit(handleConditionFormSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="text">Condition Text</Label>
                            <Textarea id="text" {...conditionForm.register("text")} />
                            {conditionForm.formState.errors.text && <p className="text-red-500 text-xs mt-1">{conditionForm.formState.errors.text.message}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">{editingCondition ? "Save Changes" : "Add Condition"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Condition</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {partnerConditions.map((condition) => (
                        <TableRow key={condition.id}>
                            <TableCell className="font-medium">{condition.text}</TableCell>
                            <TableCell className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditCondition(condition)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteCondition(condition.id!)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
