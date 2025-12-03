"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../components/Logo";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.location.reload();
    }
  };

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="hover:opacity-80 transition-opacity"
        >
          <Logo />
        </Link>

        {/* Buttons */}
        <div className="flex gap-3 text-sm font-medium">
          {/* Loading state (optional) */}
          {status === "loading" && (
            <span className="text-gray-600 dark:text-gray-300">...</span>
          )}

          {/* Logged OUT */}
          {status === "unauthenticated" && (
            <>
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
                Sign-up
              </Link>
            </>
          )}

          {/* Logged IN */}
          {status === "authenticated" && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 cursor-pointer bg-foreground text-background rounded-full hover:opacity-90 transition-all shadow-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
