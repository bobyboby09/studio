
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, onUsersUpdate } from "@/services/users";
import { Badge } from "@/components/ui/badge";

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onUsersUpdate(setUsers);
    return () => unsubscribe();
  }, []);

  return (
    <Card>
        <CardHeader>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>View all users who have interacted with your booking system.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone Number</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{user.phone}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No users found yet.
                </div>
            )}
        </CardContent>
    </Card>
  );
}
