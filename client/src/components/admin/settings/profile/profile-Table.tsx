"use client";

import { MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  SettingTable,
  SettingTableColumn,
} from "@/components/ui/settings-component/settings-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ProfileUpdateSheet } from "./profile-Update";
import { useUserData } from "@/hooks/useGetData-UserLogin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ProfileSettingsTable() {
  const user = useUserData();
  const [openUpdate, setOpenUpdate] = useState(false);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const fullName = `${user.lastName} ${user.firstName}`.trim();
  console.log("user in ProfileSettingsTable:", user);

  const columns: SettingTableColumn[] = [
    {
      label: "Avatar",
      value: (
        <Avatar>
          <AvatarImage
            src={user.avatar || ""}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      ),
    },
    { label: "English content normalized from the original source text.", value: user.name || "English content normalized from the original source text." },
    // English content normalized from the original source text.
    { label: "Email", value: user.email },
    { label: "English content normalized from the original source text.", value: user.phoneNumber || "English content normalized from the original source text." },
    {
      label: "English content normalized from the original source text.",
      value: (
        <Badge variant={user.status === "ACTIVE" ? "secondary" : "destructive"}>
          {user.status}
        </Badge>
      ),
    },
    {
      label: "English content normalized from the original source text.",
      value: (
        <Badge variant="outline">
          {typeof user.role === "string" ? user.role : user.role?.name}
        </Badge>
      ), // English content normalized from the original source text.
    },
    {
      label: "English content normalized from the original source text.",
      value: new Date(user.createdAt).toLocaleDateString("vi-VN"),
    },
  ];

  return (
    <>
      <SettingTable
        columns={columns}
        title="English content normalized from the original source text."
        subtitle="English content normalized from the original source text."
        rightAction={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-2 rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setOpenUpdate(true)}>
                <Pencil className="w-4 h-4 mr-2" />English content normalized from the original source text.</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />
      <ProfileUpdateSheet open={openUpdate} onOpenChange={setOpenUpdate} />
    </>
  );
}
