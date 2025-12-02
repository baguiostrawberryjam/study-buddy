"use client";

import { Loader2, Paperclip, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function FormChat() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea logic
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to calculate correct scrollHeight (shrink if text is deleted)
      textareaRef.current.style.height = "auto";
      // Set to scrollHeight but cap it via CSS max-height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    console.log("Sending to StudyBuddy:", input);

    setTimeout(() => {
      setInput("");
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <form
        onSubmit={handleSubmit}
        data-loading={isLoading}
        // items-end ensures buttons stay at the bottom when text grows
        className="relative flex w-full items-end gap-2 rounded-3xl border border-gray-200 bg-white p-2 shadow-sm transition-all focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-800 dark:bg-gray-950 dark:focus-within:border-gray-700 dark:focus-within:ring-gray-800"
      >
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <div className="relative flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask StudyBuddy a question..."
            // CHANGED: Reduced max-h-[200px] to max-h-[120px] (approx 4 lines)
            // Added overflow-y-auto to show scrollbar when limit is reached
            className="block max-h-[120px] w-full resize-none overflow-y-auto bg-transparent py-3 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 scrollbar-thin focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${input.trim() && !isLoading
            ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
            : "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600"
            }`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5 ml-0.5" />
          )}
        </button>
      </form>

      <div className="mt-2 text-center text-xs text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3" />
        <span>StudyBuddy can make mistakes. Verify important info.</span>
      </div>
    </div>
  );
}