import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillBond — Reputation-Backed Escrow Protocol",
  description:
    "Decentralized escrow protocol where reputation lowers costs. Build verifiable credentials, earn discounts, and get paid fairly with on-chain reputation.",
  keywords: ["blockchain", "escrow", "reputation", "freelance", "credentials", "W3C", "polygon"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col relative" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {children}
      </body>
    </html>
  );
}
