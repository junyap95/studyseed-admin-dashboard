import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ZodUserSchema } from "@/lib/adminSchema";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface UserTableProps {
  userArray: ZodUserSchema[];
  caption?: string;
}

export default function UserTable({ userArray, caption }: UserTableProps) {
  const handleCopy = (userid: string) => {
    navigator.clipboard
      .writeText(userid)
      .then(() => {
        toast.success(`User ID ${userid} copied!`); // Provide feedback
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  return (
    <Table>
      <TableCaption>
        {!!caption
          ? caption
          : userArray?.length > 0
          ? "A list of recently added users"
          : "No users have been added yet"}
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User ID</TableHead>
          <TableHead>First Name</TableHead>
          <TableHead>Last Name</TableHead>
          <TableHead className="text-right">Course Enrolled</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {userArray?.map((user, index) => (
          <TableRow key={`${index} - ${user}`}>
            <TableCell className="font-medium flex gap-2">
              <Copy
                className="toast-button cursor-pointer"
                size={15}
                onClick={() => handleCopy(user.userid)}
              />
              {user.userid}
            </TableCell>
            <TableCell>{user.first_name}</TableCell>
            <TableCell>{user.last_name}</TableCell>
            <TableCell className="text-right">{user?.enrolled_courses?.join(", ")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
