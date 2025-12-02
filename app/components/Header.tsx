import Link from "next/link";
import Logo from "../components/Logo";

export default function Home() {
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
          <Link href="/login" className="button border">Login</Link>
          <Link href="/signup" className="button border">Sign-up</Link>
        </div>

      </div>
    </header>
  );
}
