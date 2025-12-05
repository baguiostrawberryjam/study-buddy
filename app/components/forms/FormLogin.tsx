'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react' // Import the signIn function
import { Loader2, Mail, Lock } from 'lucide-react'

export default function FormLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // State to track login errors

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Get data from form
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError("Please enter both your email address and password to sign in.");
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to sign in using the credentials provider defined in authOptions
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false, // We handle the redirect manually to show errors inline if needed
      });

      if (res?.error) {
        setError("The email address or password you entered is incorrect. Please check your credentials and try again. If you've forgotten your password, you may need to create a new account.");
        setIsLoading(false);
      } else {
        // Login successful
        router.refresh(); // Update Server Components (like Navbar) with the new session
        router.push('/'); // Redirect to home/dashboard
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("Unable to sign in at this time. This may be due to a temporary connection issue. Please check your internet connection and try again. If the problem persists, contact support.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">

      {/* Error Message Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center font-medium animate-in fade-in slide-in-from-top-1">
          {error}
        </div>
      )}

      {/* Email Input */}
      <div className="relative group">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
        <input
          name="email" // Added name attribute for FormData
          type="email"
          placeholder="Email address"
          required
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all placeholder:text-gray-400"
        />
      </div>

      {/* Password Input */}
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
        <input
          name="password" // Added name attribute for FormData
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
        className="w-full py-3.5 rounded-full bg-zinc-900 text-white font-medium hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          "Login"
        )}
      </button>

    </form>
  )
}