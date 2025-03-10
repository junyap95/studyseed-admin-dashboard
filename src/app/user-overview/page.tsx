"use client";
import BasicContainer from "@/components/BasicContainer";
import { ZodUserSchema } from "@/lib/adminSchema";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import dynamic from "next/dynamic";
import Loading from "../create-user/loading";
import deepEqual from "deep-equal";
import { Input } from "@/components/ui/input";
import { Box } from "@mui/material";

const UserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <Loading />,
  ssr: false,
});
export default function UserOverview() {
  const [allUsers, setAllUsers] = useLocalStorage<ZodUserSchema[]>("all-users", []);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredUsers = allUsers.filter(
    (user) =>
      user.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    if (searchString.length % 2 === 0) setSearchTerm(searchString);
  };

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await fetch("/api/get-all-users");
      if (response.ok) {
        const resObj = await response.json();
        const { data } = resObj;
        console.log(data, resObj);
        if (!deepEqual([...data?.allUsers], allUsers)) setAllUsers([...data?.allUsers]);
      }
    };

    console.log(allUsers);

    getAllUsers();
  }, [allUsers, setAllUsers]);

  return (
    <Box
      sx={{
        display: "flex",
        px: 4,
        py: 2,
        gap: 2,
        flex: 1,
      }}
    >
      <BasicContainer sx={{ gap: 2, width: "500px", p: 3 }}>
        <Input
          style={{
            height: "4em",
          }}
          type="search"
          placeholder="Filter users by ID or Name"
          onChange={(e) => handleChange(e)}
        />
        <UserTable userArray={filteredUsers} caption="All users in the database" />
      </BasicContainer>
    </Box>
  );
}
