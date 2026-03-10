"use client";

import { Review } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ReviewTable({ reviews }: { reviews: Review[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.product}
                </TableCell>

                <TableCell>⭐ {r.rating}</TableCell>

                <TableCell className="max-w-sm truncate">
                  {r.message}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      r.status === "New"
                        ? "default"
                        : r.status === "In Progress"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}