import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopMenu from "@/components/TopMenu";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Reservation",
  description: "Book and manage event tickets easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TopMenu />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
          <footer className="px-8 py-4 text-center text-gray-500 text-sm bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            © {new Date().getFullYear()} Event Reservation. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
