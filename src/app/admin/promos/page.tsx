
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { PromoCode, onPromoCodesUpdate, addPromoCode, deletePromoCode } from "@/services/promos";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle } from "lucide-react";


const promoCodeSchema = z.object({
    code: z.string().min(1, "Code is required"),
    discount: z.string().min(1, "Discount is required (e.g., '15%' or '$10')"),
});
type PromoCodeFormData = z.infer<typeof promoCodeSchema>;


export default function PromosAdminPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [isPromoCodeDialogOpen, setIsPromoCodeDialogOpen] = useState(false);

  const promoCodeForm = useForm<PromoCodeFormData>({ resolver: zodResolver(promoCodeSchema) });
  
  useEffect(() => {
    const unsubscribePromoCodes = onPromoCodesUpdate(setPromoCodes);
    return () => {
      unsubscribePromoCodes();
    };
  }, []);
  
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

  return (
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
  );
}
