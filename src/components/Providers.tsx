"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouterCacheProvider>
          {children}
          <Toaster />
        </AppRouterCacheProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
