import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OptiChain WS & DWS",
  description: "Work Schedule and Dispatch Work Schedule Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
