"use client";
import BasicContainer from "@/components/BasicContainer";
import { ZodUserSchema } from "@/lib/adminSchema";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Box } from "@mui/material";
import Loading from "../components/loading";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Data = {
  users: ZodUserSchema[];
  totalUsers: number;
  pageNumber: number;
  limitNumber: number;
};

const UserTable = dynamic(() => import("@/components/UserTable"), {
  loading: () => <Loading />,
  ssr: false,
});

const getAllUsers = async (queryKey: [string, string, number]) => {
  const page = queryKey[2];
  const searchTerm = queryKey[1];
  const response = await fetch(`/api/get-paginated-users?searchTerm=${searchTerm}&page=${page}`);
  if (response.ok) {
    const resObj = await response.json();
    const { data } = resObj;
    return data;
  }
};

export default function UserOverview() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data } = useQuery<Data>({
    queryKey: ["all-users", searchTerm, currentPage],
    queryFn: () => getAllUsers(["all-users", searchTerm, currentPage]),
    placeholderData: keepPreviousData,
  });

  const totalPages = Math.ceil((data?.totalUsers ?? 0) / (data?.limitNumber ?? 0));
  const pageArray = !!totalPages && new Array(totalPages).fill(0);

  const filteredUsers = data?.users?.filter(
    (user) =>
      user.userid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) as ZodUserSchema[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchString = e.target.value;
    // if (searchString.length % 2 === 0) {
    setCurrentPage(1);
    setSearchTerm(searchString);
    // }
  };

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
          style={{ height: "4em" }}
          type="search"
          placeholder="Filter users by ID or Name"
          onChange={(e) => handleChange(e)}
        />
        <UserTable userArray={filteredUsers} caption="All users in the database" />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                isActive={currentPage !== 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              />
            </PaginationItem>

            {pageArray &&
              pageArray?.map((page, index) => {
                const isActive = index + 1 === currentPage;
                return (
                  <PaginationItem key={`page ${index + 1}`}>
                    <PaginationLink
                      href="#"
                      isActive={isActive}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

            <PaginationItem>
              <PaginationNext
                href="#"
                isActive={currentPage !== totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </BasicContainer>
    </Box>
  );
}
