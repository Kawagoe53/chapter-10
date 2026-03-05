import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between bg-[#333333]  items-center p-4 ">
      <Link href="/" className="text-white no-underline font-bold">
        Blog
      </Link>
      <Link href="/contact" className="text-white no-underline font-bold">
        問い合わせ
      </Link>
    </header>
  );
}
