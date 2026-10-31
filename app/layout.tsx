import type { Metadata } from "next";
import localFont from "next/font/local";

import { AppShell } from "@/components/app-shell";
import "./globals.css";

const averta = localFont({
  src: "../fonts/Averta-Regular.woff2",
  variable: "--font-averta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wind Analytics | Forecast Accuracy",
  description: "Operational wind forecast accuracy analysis for UK energy trading.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={averta.variable}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
