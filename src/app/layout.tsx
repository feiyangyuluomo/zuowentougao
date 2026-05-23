import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLayout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "作文投稿平台 - AI投稿助手 + 活动数据库",
  description:
    "专业的中小学生作文投稿服务平台，帮助学生找到适合的投稿渠道，实现文学梦想。提供AI改稿、AI推荐活动、自主投稿、平台代投等服务。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.variable}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}