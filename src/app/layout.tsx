import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "일정 관리",
  description: "일정을 추가, 수정, 삭제할 수 있는 일정 관리 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
