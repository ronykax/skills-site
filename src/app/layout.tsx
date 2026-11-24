import localFont from "next/font/local";
import "./globals.css";

const allo = localFont({
  src: "../../node_modules/allo-font/fonts/webfonts/AlloVariable.woff2",
  variable: "--font-allo",
  weight: "100 900",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html className={`${allo.variable} antialiased`} lang="en">
      <body>{children}</body>
    </html>
  );
}
