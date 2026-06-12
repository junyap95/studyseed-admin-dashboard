"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, LogIn } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocalStorage } from "usehooks-ts";

import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SafeAdminUser } from "@/lib/adminSchema";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { DashboardPagePath } from "@/enums/pagePaths.enum";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const dashboardPages = [
  {
    pageName: "Home",
    href: DashboardPagePath.HOME,
  },
  {
    pageName: "Create User",
    href: DashboardPagePath.CREATE_NEW_USER,
  },
  {
    pageName: "Users Overview",
    href: DashboardPagePath.USERS_OVERVIEW,
  },
  {
    pageName: "Manage Questions",
    href: DashboardPagePath.MANAGE_QUESTIONS,
  },
];

export default function NavBar() {
  const router = useRouter();
  const pathName = usePathname();
  const { isAuthenticated, setIsAuthenticated, isLoading } = useAuth();
  const [adminProfile] = useLocalStorage("admin-profile", {} as SafeAdminUser, {
    deserializer: (value) => JSON.parse(value),
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    const logout = async () => {
      try {
        // note: include / in front of the URL to make it absolute, otherwise it will be relative to the current path
        await fetch("/api/logout", {
          credentials: "include",
        });
        localStorage.clear();
        setIsAuthenticated(false);
      } catch (error) {
        console.error({ message: "unexpected logout error", error });
      }
    };

    logout();
    router.push(DashboardPagePath.HOME);
  };

  const handleLogin = () => router.push(DashboardPagePath.LOGIN);

  return (
    <div>
      <div className="flex justify-between items-center p-3 shadow-md">
        <Link href={DashboardPagePath.HOME}>
          <Image
            alt="studyseed logo"
            src={"https://ik.imagekit.io/jbyap95/studyseed-logo-original.png"}
            width={200}
            height={80}
          />
        </Link>

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="hover:cursor-pointer">
                <AvatarImage src="https://ik.imagekit.io/jbyap95/favicon3.png" />
                <AvatarFallback>{adminProfile?.username?.[0].toUpperCase()}</AvatarFallback>
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
                  <LogOut />
                  <p>Log Out</p>
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-studyseed-blue">
                Version {process.env.NEXT_PUBLIC_APP_VERSION}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          !isLoading &&
          pathName !== DashboardPagePath.LOGIN && (
            <button
              className="flex items-center gap-2 hover:underline hover:underline-offset-4 cursor-pointer"
              onClick={handleLogin}
            >
              <LogIn />
              <p>LOG IN</p>
            </button>
          )
        )}
      </div>
      <NavigationMenu orientation="horizontal">
        <NavigationMenuList>
          {dashboardPages.map((page) => (
            <NavigationMenuItem key={page.pageName}>
              <NavigationMenuLink asChild data-active={isMounted && pathName === page.href}>
                <Link href={page.href}>{page.pageName}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
