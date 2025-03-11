"use client";
import Image from "next/image";
import { Box } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useLocalStorage } from "usehooks-ts";
import Avatar from "@mui/material/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ZodAdminSchema } from "@/lib/adminSchema";

export default function NavBar() {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, setIsAuthenticated, isLoading } = useAuth();
  const [breadcrumbs, setBreadcrumbs] = useState<{ breadcrumb: string; href: string }[] | null>(
    null
  );
  const [adminProfile] = useLocalStorage("admin-profile", {} as ZodAdminSchema, {
    deserializer: (value) => JSON.parse(value),
  });

  useEffect(() => {
    if (pathName) {
      const linkPath = pathName.split("/");
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return { breadcrumb: path, href: "/" + linkPath.slice(0, i + 1).join("/") };
      });

      setBreadcrumbs(pathArray);
    }
  }, [pathName]);

  const handleLogout = () => {
    const logout = async () => {
      try {
        // note: include / in front of the URL to make it absolute, otherwise it will be relative to the current path
        await fetch("/api/logout");
        localStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error({ message: "unexpected logout error", error });
      }
    };

    logout();
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Link href={"/"}>
          <Image
            alt="studyseed logo"
            src={"https://ik.imagekit.io/jbyap95/studyseed-logo-original.png"}
            width={200}
            height={80}
          />
        </Link>
        {!!breadcrumbs && breadcrumbs?.length > 1 && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="hover:underline capitalize" href="/">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              {breadcrumbs?.map((b) => {
                const formattedText = b.breadcrumb.replace("-", " ");
                return (
                  <React.Fragment key={b.breadcrumb}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <BreadcrumbItem>
                        {b.href === pathName ? (
                          <BreadcrumbPage className="text-studyseed-blue capitalize">
                            {formattedText}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink className="hover:underline capitalize" href={b.href}>
                            {formattedText}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Box>
                    {b.href !== pathName && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </Box>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="hover:cursor-pointer">
              {adminProfile?.username?.[0].toUpperCase()}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-8">
            <DropdownMenuLabel>Admin: {adminProfile.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>{adminProfile.email}</DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="flex items-center gap-2 hover:underline hover:underline-offset-4 cursor-pointer"
                onClick={handleLogout}
              >
                <LogoutRoundedIcon />
                <p>Log Out</p>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        !isLoading &&
        !pathName.includes("login") && (
          <button
            className="flex items-center gap-2 hover:underline hover:underline-offset-4 cursor-pointer"
            onClick={handleLogin}
          >
            <LoginRoundedIcon />
            <p>LOG IN</p>
          </button>
        )
      )}
    </Box>
  );
}
