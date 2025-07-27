import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SorVL School Management Dashboard",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      // publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      publishableKey={`pk_test_c29saWQtYnVjay00MS5jbGVyay5hY2NvdW50cy5kZXYk`}
    >
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" href="/favicon.png" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
