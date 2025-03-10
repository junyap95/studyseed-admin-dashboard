"use client";
import { Stack } from "@mui/material";
import Login from "./signin/components/Login";

export default function Home() {
  return (
    <Stack
      component="main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 3,
      }}
    >
      <h1 className="font-[family-name:var(--font-geist-sans)]">Studyseed User Manager</h1>
      <p className="mb-2 font-[family-name:var(--font-geist-mono)]">
        Sign in to manage users for the programme
      </p>
      <Login />
    </Stack>
  );
}
