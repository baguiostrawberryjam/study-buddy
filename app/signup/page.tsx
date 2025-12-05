import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import Logo from "../components/Logo"; // Check this path matches your project
import FormSignUp from "../components/forms/FormSignUp";

export default function Signup() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden relative">

      {/* Stage Light Gradient Effects - Left Side */}
      <div className="fixed left-0 top-0 bottom-0 w-96 pointer-events-none z-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent dark:via-white/5" />
      </div>

      {/* Stage Light Gradient Effects - Right Side */}
      <div className="fixed right-0 top-0 bottom-0 w-96 pointer-events-none z-0 opacity-30 dark:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-l from-white via-white/50 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent dark:via-white/5" />
      </div>

      {/* --- Top Navigation --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <Logo />
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-[#111] mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Learn from the AI tutor with the mind of Einstein and Newton combined.
          </p>
        </div>

        {/* Form Logic Component */}
        <FormSignUp />

        {/* Footer / Login Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}