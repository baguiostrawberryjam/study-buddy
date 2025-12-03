'use client'

import { useActionState } from 'react'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { createUser } from '../../lib/actions/user' // Pointing to your uploaded file

// Initial state matching your ActionResponse type
const initialState = {
  success: false,
  message: null,
  payload: null,
  errors: [],
  input: {
    name: '',
    email: '',
    password: ''
  }
}

export default function FormSignUp() {
  const [state, formAction, isPending] = useActionState(createUser, initialState)

  // Helper to check if a specific field has an error
  const getError = (field: string) => {
    return state.errors?.find((err) => err.field === field)?.message
  }

  return (
    <form action={formAction} className="w-full space-y-4">

      {/* Global Success/Error Message */}
      {!state.success && state.message && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center font-medium">
          {state.message}
        </div>
      )}
      {state.success && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg text-center font-medium">
          Account created successfully! Redirecting...
        </div>
      )}

      {/* Name Input */}
      <div>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            defaultValue={state.input?.name}
            className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border rounded-2xl outline-none focus:ring-2 transition-all placeholder:text-gray-400
              ${getError('name')
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-200 dark:border-gray-800 focus:ring-gray-200 dark:focus:ring-gray-700'
              }`}
          />
        </div>
        {getError('name') && (
          <p className="text-red-500 text-xs mt-1 ml-2 font-medium slide-in-from-top-1">
            {getError('name')}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
          <input
            name="email"
            type="text" // using text helps test regex, but email is fine too
            placeholder="Email address"
            defaultValue={state.input?.email}
            className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border rounded-2xl outline-none focus:ring-2 transition-all placeholder:text-gray-400
              ${getError('email')
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-200 dark:border-gray-800 focus:ring-gray-200 dark:focus:ring-gray-700'
              }`}
          />
        </div>
        {getError('email') && (
          <p className="text-red-500 text-xs mt-1 ml-2 font-medium slide-in-from-top-1">
            {getError('email')}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-white transition-colors" />
          <input
            name="password"
            type="password"
            placeholder="Password"
            defaultValue={state.input?.password}
            className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#111] border rounded-2xl outline-none focus:ring-2 transition-all placeholder:text-gray-400
              ${getError('password')
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-200 dark:border-gray-800 focus:ring-gray-200 dark:focus:ring-gray-700'
              }`}
          />
        </div>
        {getError('password') && (
          <p className="text-red-500 text-xs mt-1 ml-2 font-medium slide-in-from-top-1">
            {getError('password')}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3.5 rounded-full bg-zinc-900 text-white font-medium hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          "Sign-up"
        )}
      </button>

    </form>
  )
}