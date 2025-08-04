
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking, onBookingsUpdate } from "@/services/bookings";
import { Partner, onPartnersUpdate } from "@/services/partners";
import { Service, onServicesUpdate } from "@/services/services";
import { Ticket, Users, Handshake, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeBookings = onBookingsUpdate(setBookings);
    const unsubscribePartners = onPartnersUpdate(setPartners);
    const unsubscribeServices = onServicesUpdate(setServices);

    return () => {
      unsubscribeBookings();
      unsubscribePartners();
      unsubscribeServices();
    };
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingPartners = partners.filter(p => p.status === 'Pending').length;
  const totalServices = services.length;


  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Dashboard</h1>
        <p className="text-lg text-muted-foreground mt-1">Welcome to your Studio Maestro admin panel.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground">Needs confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">Upcoming sessions</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Requests</CardTitle>
            <Handshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPartners}</div>
            <p className="text-xs text-muted-foreground">Waiting for approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-muted-foreground">Services offered</p>
             <Button variant="link" className="p-0 h-auto text-xs" onClick={() => router.push('/admin/services')}>Manage Services</Button>
          </CardContent>
        </Card>
      </div>
       <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => router.push('/admin/bookings')}>View Bookings</Button>
            <Button onClick={() => router.push('/admin/partners')}>Manage Partners</Button>
            <Button onClick={() => router.push('/admin/updates')}>Create Update</Button>
             <Button onClick={() => router.push('/admin/gallery')}>Add Gallery Image</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
