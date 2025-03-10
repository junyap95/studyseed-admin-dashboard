"use client";
import Image from "next/image";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    const logout = async () => {
      try {
        await fetch("api/logout");
        localStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error({ message: "unexpected logout error", error });
      }
    };

    logout();
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        p: 3,
        height: "80px",
        border: "1px solid rgba(51, 51, 51, 0.3)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box>
        <Image
          alt="studyseed logo"
          src={"https://ik.imagekit.io/jbyap95/studyseed-logo-original.png"}
          width={200}
          height={80}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 "
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/group.svg" alt="Group icon" width={16} height={16} />
          <p>Users Overview</p>
        </a>
        <Button
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 "
          onClick={handleLogout}
          disabled={!isAuthenticated}
        >
          {isAuthenticated && (
            <>
              <Image aria-hidden src="/logout.svg" alt="Group icon" width={16} height={16} />
              <p>Log Out</p>
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}
