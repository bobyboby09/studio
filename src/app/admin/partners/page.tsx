
"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";
import { Partner, onPartnersUpdate, updatePartner } from "@/services/partners";

import { format } from "date-fns";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, MessageSquare } from "lucide-react";


const partnerEarningsSchema = z.object({
    earnings: z.preprocess(
        (val) => (val === "" ? undefined : Number(val)),
        z.number({ invalid_type_error: "Please enter a valid number." }).min(0, "Earnings must be a positive number.").optional()
    ),
});
type PartnerEarningsFormData = z.infer<typeof partnerEarningsSchema>;

const partnerMessageSchema = z.object({
  message: z.string().optional(),
});
type PartnerMessageFormData = z.infer<typeof partnerMessageSchema>;


export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const partnerEarningsForm = useForm<PartnerEarningsFormData>({ resolver: zodResolver(partnerEarningsSchema) });
  const partnerMessageForm = useForm<PartnerMessageFormData>({ resolver: zodResolver(partnerMessageSchema) });

  useEffect(() => {
    const unsubscribePartners = onPartnersUpdate(setPartners);

    return () => {
      unsubscribePartners();
    };
  }, []);

  const getFormattedDate = (date: any) => {
    if (!date) return "No Date";
    try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return format(d, "PPP");
    } catch (e) {
        return "Invalid Date";
    }
  }

  const handlePartnerStatusUpdate = async (id: string, status: Partner['status']) => {
      await updatePartner(id, { status });
  }

  const handleEditPartner = (partner: Partner) => {
      setEditingPartner(partner);
      partnerEarningsForm.setValue("earnings", partner.earnings || 0);
      partnerMessageForm.setValue("message", partner.message || "");
  };

  const handlePartnerEarningsFormSubmit: SubmitHandler<PartnerEarningsFormData> = async (data) => {
      if (editingPartner) {
          await updatePartner(editingPartner.id!, { earnings: data.earnings });
      }
      partnerEarningsForm.reset();
      setEditingPartner(null);
  };
  
  const handlePartnerMessageFormSubmit: SubmitHandler<PartnerMessageFormData> = async (data) => {
      if (editingPartner) {
          await updatePartner(editingPartner.id!, { message: data.message });
      }
      partnerMessageForm.reset();
      setEditingPartner(null);
  }

  return (
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
            <TableHead>Earnings</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requested At</TableHead>
            <TableHead>Actions</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {partners.map((partner) => (
            <TableRow key={partner.id}>
                <TableCell>{partner.whatsappNumber}</TableCell>
                <TableCell>₹{partner.earnings || 0}</TableCell>
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
                <TableCell className="space-x-2 flex items-center">
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
                <Dialog onOpenChange={(open) => { if(!open) setEditingPartner(null); }}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => handleEditPartner(partner)}><Edit className="h-4 w-4"/></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Partner Earnings</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={partnerEarningsForm.handleSubmit(handlePartnerEarningsFormSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="earnings">Earnings</Label>
                                <Input id="earnings" type="number" {...partnerEarningsForm.register("earnings")} />
                                {partnerEarningsForm.formState.errors.earnings && <p className="text-red-500 text-xs mt-1">{partnerEarningsForm.formState.errors.earnings.message}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                <Dialog onOpenChange={(open) => { if(!open) setEditingPartner(null); }}>
                    <DialogTrigger asChild>
                         <Button variant="outline" size="icon" onClick={() => handleEditPartner(partner)}><MessageSquare className="h-4 w-4"/></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Send Message to Partner</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={partnerMessageForm.handleSubmit(handlePartnerMessageFormSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="message">Message / Offer</Label>
                                <Textarea id="message" {...partnerMessageForm.register("message")} placeholder="e.g., Special offer for your next 5 referrals!"/>
                                {partnerMessageForm.formState.errors.message && <p className="text-red-500 text-xs mt-1">{partnerMessageForm.formState.errors.message.message}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="ghost">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Send Message</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </CardContent>
    </Card>
  );
}
