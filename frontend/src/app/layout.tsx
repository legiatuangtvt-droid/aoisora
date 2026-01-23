import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { IdleTimerProvider } from "@/contexts/IdleTimerContext";
import AuthGuard from "@/components/auth/AuthGuard";
import UserSwitcherBubble from "@/components/UserSwitcherBubble";
import DevLogger from "@/components/DevLogger";
import SessionWarningWrapper from "@/components/SessionWarningWrapper";

// Digital/Calculator style font
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-digital",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "OptiChain WS & DWS",
  description: "Work Schedule and Dispatch Work Schedule Management System",
  icons: {
    icon: "/images/logos/aoisora.png",
    shortcut: "/images/logos/aoisora.png",
    apple: "/images/logos/aoisora.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={orbitron.variable}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                <IdleTimerProvider>
                  <LanguageProvider>
                    <UserProvider>
                      <AuthGuard>
                        {children}
                      </AuthGuard>
                      <SessionWarningWrapper />
                      <UserSwitcherBubble />
                      <DevLogger />
                    </UserProvider>
                  </LanguageProvider>
                </IdleTimerProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
