import { Open_Sans } from "next/font/google";
import "./globals.css";

const open = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "St. Bedes",
  description: "Set & forget",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${open.className} text-offblack bg-offwhite`}>{children}</body>
    </html>
  );
}
