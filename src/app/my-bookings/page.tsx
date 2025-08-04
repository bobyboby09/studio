import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const bookings = [
  {
    id: "BK001",
    service: "Mixing & Mastering",
    date: "2024-08-15",
    status: "Confirmed",
  },
  {
    id: "BK002",
    service: "Full Day Studio Rental",
    date: "2024-08-20",
    status: "Pending",
  },
  {
    id: "BK003",
    service: "Professional Photoshoot",
    date: "2024-07-22",
    status: "Completed",
  },
  {
    id: "BK004",
    service: "Vocal Production",
    date: "2024-09-01",
    status: "Confirmed",
  },
    {
    id: "BK005",
    service: "Album Design",
    date: "2024-06-10",
    status: "Completed",
  },
];

export default function MyBookingsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">My Bookings</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Track the status of your studio sessions.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={cn(
                        booking.status === 'Confirmed' && 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                        booking.status === 'Pending' && 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
                        booking.status === 'Completed' && 'bg-green-500/20 text-green-300 border-green-500/30'
                      )}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
