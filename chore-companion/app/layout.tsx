import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "家事コンパニオン(プロトタイプ)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex justify-center py-6 px-3">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </body>
    </html>
  );
}
