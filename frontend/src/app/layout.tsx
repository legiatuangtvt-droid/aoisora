import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import UserSwitcherBubble from "@/components/UserSwitcherBubble";

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
    <html lang="vi" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <UserProvider>
            {children}
            <UserSwitcherBubble />
          </UserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
