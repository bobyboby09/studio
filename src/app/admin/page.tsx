import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const allBookings = [
  { id: "BK001", name: "Alice Johnson", service: "Mixing & Mastering", date: "2024-08-15", status: "Confirmed" },
  { id: "BK002", name: "Bob Williams", service: "Full Day Studio Rental", date: "2024-08-20", status: "Pending" },
  { id: "BK003", name: "Charlie Brown", service: "Professional Photoshoot", date: "2024-07-22", status: "Completed" },
  { id: "BK004", name: "Diana Prince", service: "Vocal Production", date: "2024-09-01", status: "Confirmed" },
];

export default function AdminPage() {
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
                    <TableHead>ID</TableHead>
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
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>{booking.name}</TableCell>
                      <TableCell>{booking.service}</TableCell>
                      <TableCell>{booking.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          booking.status === 'Confirmed' && 'text-blue-400 border-blue-400',
                          booking.status === 'Pending' && 'text-yellow-400 border-yellow-400',
                          booking.status === 'Completed' && 'text-green-400 border-green-400'
                        )}>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button variant="outline" size="sm">Confirm</Button>
                        <Button variant="destructive" size="sm">Cancel</Button>
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
            <CardHeader>
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>Add, edit, or remove services offered.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Service management UI will be here.</p>
              <Button className="mt-4">Add New Service</Button>
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
