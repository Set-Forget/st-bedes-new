import { Overpass } from "next/font/google";
import "./globals.css";

const overpass = Overpass({ subsets: ["latin"] });

export const metadata = {
  title: "St. Bedes",
  description: "Set & forget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${overpass.className} text-offblack bg-offwhite`}>{children}</body>
    </html>
  );
}
