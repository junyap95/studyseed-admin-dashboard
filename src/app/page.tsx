import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";

export default function Home() {
  return (
    <Stack
      component="main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Stack textAlign={"center"} mt={-6} gap={2}>
        <Stack alignItems={"center"} gap={1}>
          <h1>Welcome to Studyseed User Manager</h1>
          <p className="mb-2">
            Easily add new users to the system or browse existing user accounts.
          </p>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <Link href="/manage" passHref>
            <Button variant="contained" endIcon={<KeyboardDoubleArrowRightRoundedIcon />}>
              Get Started
            </Button>
          </Link>
        </Box>
      </Stack>
    </Stack>
  );
}
