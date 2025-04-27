import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Providers>
            <NavBar />
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </AuthProvider>
  );
}
