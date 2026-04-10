"use client";

import SideBar from "../_components/sidebar";
import "../globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div className="flex min-h-screen">
          <SideBar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
