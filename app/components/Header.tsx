import Link from "next/link";
import Logo from "../components/Logo";

export default function Header() {
  return (
    <header className="w-full bg-transparent text-white">
      {/* Centered inner content */}
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 border border-white rounded-full hover:bg-white hover:text-gray-900 transition-colors duration-200"
          >
            Sign-up
          </Link>
        </div>

      </div>
    </header>
  );
}
