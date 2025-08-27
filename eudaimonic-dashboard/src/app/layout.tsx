import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eudaimonic Dashboard",
  description: "The soul of the Eudaimonic Ecosystem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthCoreContextProvider
          options={{
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
            clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
            appId: process.env.NEXT_PUBLIC_APP_ID!,
            authTypes: ["google", "twitter", "email"],
            theme: "light",
            wallet: {
              visible: true,
              customStyle: {
                supportChains: [{ id: 1, name: "Ethereum" }],
              },
            },
          }}
        >
          {children}
        </AuthCoreContextProvider>
      </body>
    </html>
  );
}
