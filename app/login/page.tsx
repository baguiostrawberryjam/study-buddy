"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles, Mail, Lock } from "lucide-react";
import { useState } from "react";
// Adjust this import path based on where your components folder is located
// If this file is app/login/page.tsx and Logo is app/components/Logo.tsx, use ../../components/Logo
import Logo from "../components/Logo";

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

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

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">

          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white-500 transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white-500 transition-colors" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-10 rounded-full bg-zinc-900 text-white font-medium hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Login"
            )}
          </button>

        </form>

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