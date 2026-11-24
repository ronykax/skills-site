import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Rony's Agent Skills to give AI agents new capabilities and expertise.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className="antialiased" lang="en">
      <body>{children}</body>
    </html>
  );
}
