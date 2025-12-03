"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
// Adjust imports based on your file structure
import Logo from "../components/Logo";
import FormLogin from "../components/forms/FormLogin";

export default function Login() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 overflow-hidden relative">

      {/* --- Top Navigation --- */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        {/* Logo - Leads to Home */}
        <Link
          href="/"
          className="hover:opacity-70 transition-opacity"
        >
          <Logo />
        </Link>

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm cursor-pointer font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Header Section */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 dark:bg-[#111] mb-4 shadow-sm">
            <Sparkles className="w-5 h-5 text-gray-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Pasok to school
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Pasok na bro, bawal cutting.
          </p>
        </div>

        {/* Form Component */}
        <FormLogin />

        {/* Footer / Sign up Link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-zinc-900 dark:text-white hover:underline">
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}