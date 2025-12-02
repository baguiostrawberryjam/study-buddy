import Link from "next/link";
import Logo from "../components/Logo";

export default function Header() {
  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Buttons */}
        <div className="flex gap-3 text-sm font-medium">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-all shadow-sm"
          >
            Sign up
          </Link>
        </div>

      </div>
    </header>
  );
}