import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Financial Planner",
  description:
    "This is a personal project created by Mckade Daines. In this app you will be able to track you finances, set new goals, and get help from Artifical Intelligence on how to improve your financial situation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
