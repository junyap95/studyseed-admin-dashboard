import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PeopleIcon from "@mui/icons-material/People";

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
      <Box sx={{ textAlign: "center", mt: -6 }}>
        <h1>User Management</h1>
        <p className="mb-2">Easily add new users to the system or browse existing user accounts.</p>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <Link href="/manage/create-user" passHref>
            <Button variant="contained" startIcon={<PersonAddIcon />}>
              Create New Users
            </Button>
          </Link>
          <Link href="/manage/users-overview" passHref>
            <Button variant="outlined" startIcon={<PeopleIcon />}>
              All Existing Users
            </Button>
          </Link>
        </Box>
      </Box>
    </Stack>
  );
}
