import { Stack } from "@mui/material";
import Login from "./components/Login";

export default function Landing() {
  return (
    <Stack component="main" alignItems="center" justifyContent="center" flex={1} gap={3}>
      <Stack alignItems={"center"} gap={1}>
        <h1>Administrator Login</h1>
        <p className="mb-2">Sign in to manage users for the programme</p>
      </Stack>
      <Login />
    </Stack>
  );
}
