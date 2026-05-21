import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

/*
 * SF Pro is Apple's system font — available natively on macOS, iOS, and iPadOS.
 * It cannot be loaded from a CDN; instead we use the system font stack so the
 * browser picks it up automatically on Apple devices.
 * On Windows/Linux, Segoe UI / Roboto / Helvetica fill in gracefully.
 * The font-family is set in globals.css via --font-sans.
 */

export const metadata: Metadata = {
  title: "QuantumVest — AI-Powered Investment Platform",
  description:
    "Access institutional-grade trading tools, real-time analytics, and automated portfolio management. Trusted by 10M+ investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
