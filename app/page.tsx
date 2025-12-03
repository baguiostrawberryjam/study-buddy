"use client";

import { useState } from "react";
import FormChat from "./components/forms/FormChat";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const [isChatStarted, setIsChatStarted] = useState(false);

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0a0a0a]">

      {/* Fixed Header */}
      <div className="shrink-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 transition-all duration-500">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col items-center w-full max-w-6xl mx-auto px-4 sm:px-6 
        transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
        /* ADDED: overflow-hidden to force children to respect boundaries */
        overflow-hidden
        ${isChatStarted ? 'justify-start pt-4 sm:pt-6' : 'justify-center pb-32 sm:pb-40'}
      `}>

        {/* Large Hero Text */}
        <div className={`
          w-full text-center transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] shrink-0
          ${isChatStarted ? 'opacity-0 max-h-0 mb-0 scale-95 blur-sm' : 'opacity-100 max-h-[400px] mb-8 sm:mb-12 scale-100 blur-0'}
        `}>
          <h1 className="inline-block text-5xl sm:text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-400 dark:from-white dark:via-gray-200 dark:to-gray-600 tracking-tighter leading-tight px-4 py-4">
            StudyBuddy
          </h1>
          <p className="mt-2 text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light px-4">
            Your personal AI research assistant.
          </p>
        </div>

        {/* Chat Component Wrapper */}
        <div className={`
          w-full flex flex-col
          transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          /* CRITICAL FIX: Ensure min-h-0 is present so flex child scrolls work */
          ${isChatStarted ? 'flex-1 min-h-0 opacity-100 translate-y-0' : 'flex-none opacity-100 translate-y-0'}
        `}>
          <FormChat onInteraction={() => setIsChatStarted(true)} />
        </div>

      </div>

      {/* Footer */}
      <div className="shrink-0 py-4 opacity-80 hover:opacity-100 transition-opacity">
        <Footer />
      </div>
    </main>
  );
}