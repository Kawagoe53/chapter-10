"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `text-gray-700  font-bold px-2 py-1 ${
      pathname === href ? "bg-blue-200" : "hover:bg-gray-200"
    }`;

  return (
    <nav className="bg-gray-100 min-h-screen w-56 shrink-0 px-3 py-4 flex flex-col space-y-1">
      <Link href="/admin/posts" className={linkClass("/admin/posts")}>
        記事一覧
      </Link>
      <Link href="/admin/categories" className={linkClass("/admin/categories")}>
        カテゴリー一覧
      </Link>
    </nav>
  );
}
