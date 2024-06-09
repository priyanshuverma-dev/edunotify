import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import SignedOutView from "@/components/signed-out-view";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modals";
import QueryProvider from "@/providers/query";
import CenterContainer from "@/components/center-container";
import Footer from "@/components/footer";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduNotify",
  description:
    "EduNotify is a platform for students to get notified about their school activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <QueryProvider>
            <SignedOut>
              <SignedOutView />
            </SignedOut>
            <SignedIn>
              <Navbar />
              <CenterContainer>{children}</CenterContainer>
              <ModalProvider />
              <Footer />
            </SignedIn>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
