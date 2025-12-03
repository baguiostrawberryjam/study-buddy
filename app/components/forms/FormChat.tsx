"use client";

import { useChat } from '@ai-sdk/react';
import { Loader2, Paperclip, Send, Sparkles, UserRound, Bot, AlertCircle } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface FormChatProps {
  onInteraction?: () => void;
}

export default function FormChat({ onInteraction }: FormChatProps) {
  // AI SDK
  const { messages, sendMessage } = useChat({
    onError: (error) => {
      console.error('Chat error:', error);
      setError(error.message || "Something went wrong.");
      setIsLoading(false);
    }
  });

  const [error, setError] = useState('');
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Robust Scroll Logic
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Scroll immediately
    scrollToBottom();

    // Retry after layout shifts (fixes the "first chat" scroll issue)
    const timeoutId = setTimeout(scrollToBottom, 100);
    const timeoutIdLong = setTimeout(scrollToBottom, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutIdLong);
    };
  }, [messages, isLoading, hasInteracted]); // Added hasInteracted dependency

  const handleFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteraction) onInteraction();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError('');

    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteraction) onInteraction();
    }
    let chatInput = input;
    setInput('');
    try {
      setIsLoading(true);
      await sendMessage({ text: chatInput });
      setInput('');
    }
    catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      ``
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form && input.trim()) form.requestSubmit();
    }
  };

  return (
    // REMOVED: transition-all on this wrapper. It causes layout confusion.
    <div className={`flex flex-col w-full max-w-3xl mx-auto min-h-0 ${hasInteracted ? 'h-full' : 'h-auto'}`}>

      {/* Message Display Area */}
      {/* FIX: Removed 'transition-all' from this div. 
         We rely on the parent (page.tsx) shrinking the hero text.
         This div simply switches from hidden -> flex-1 immediately.
         This ensures overflow-y-auto works instantly.
      */}
      <div
        className={`
          relative flex-1 overflow-y-auto transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] pr-4 pl-1 space-y-6 pb-6 scrollbar-modern
          ${hasInteracted ? 'flex opacity-100 min-h-0' : 'hidden opacity-0 h-0'}
        `}
      >
        {/* We wrap the content in a fade-in div so the *content* is smooth, but the scroll container is rigid */}
        <div className="flex flex-col w-full space-y-6 animate-in fade-in duration-1000">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role !== 'user' && (
                  <div className="shrink-0 h-8 w-8 rounded-full border border-gray-100 bg-white dark:bg-black dark:border-gray-800 flex items-center justify-center shadow-sm mt-1">
                    <Bot className="h-4 w-4 text-gray-900 dark:text-gray-100" />
                  </div>
                )}

                <div className={`
                    relative flex flex-col max-w-[85%] sm:max-w-[80%] px-5 py-3 shadow-sm text-[15px] leading-relaxed
                    ${message.role === 'user'
                    ? 'bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 rounded-[20px] rounded-tr-sm'
                    : 'bg-white text-gray-800 dark:bg-[#111] dark:text-gray-200 rounded-[20px] rounded-tl-sm border border-gray-100 dark:border-zinc-800'
                  }
                `}>
                  {message.parts.map((part, i) => (
                    part.type === 'text' && (
                      <div key={`${message.id}-${i}`} className="prose prose-zinc max-w-none dark:prose-invert break-words">
                        <ReactMarkdown>{part.text}</ReactMarkdown>
                      </div>
                    )
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Keep this minimal to prevent layout jumping
            <div className="h-4"></div>
          )}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex gap-4 w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="shrink-0 h-8 w-8 rounded-full border border-gray-100 bg-white dark:bg-black dark:border-gray-800 flex items-center justify-center shadow-sm mt-1">
                <Bot className="h-4 w-4 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="bg-white dark:bg-[#111] px-5 py-4 rounded-[20px] rounded-tl-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex justify-center w-full animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm rounded-full border border-red-100 dark:border-red-800/50">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className={`
        relative pb-2 transition-all duration-700 ease-out
        ${hasInteracted ? 'mt-4 pt-0' : 'mt-0'}
      `}>
        <form
          onSubmit={handleSubmit}
          className={`
            relative flex w-full items-end gap-2 rounded-[26px] p-1.5 transition-all duration-500 ease-out
            ${hasInteracted
              ? 'bg-gray-50 border border-gray-200 dark:bg-[#151515] dark:border-gray-800'
              : 'bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] scale-105 p-2 dark:bg-[#111] dark:border-gray-800'
            }
            ${error ? 'border-red-200 ring-1 ring-red-100 dark:border-red-900 dark:ring-red-900/30' : ''}
          `}
        >
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <div className="relative flex-1 min-w-0 py-2">
            <textarea
              ref={textareaRef}
              onFocus={handleFocus}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="block max-h-[160px] w-full resize-none overflow-y-auto bg-transparent text-[16px] leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500 scrollbar-modern"
              style={{ minHeight: '24px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${input.trim() && !isLoading
              ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm"
              : "bg-transparent text-gray-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>

        <div className={`
           mt-2 text-center text-[10px] text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1.5 transition-opacity duration-700
           ${hasInteracted ? 'opacity-100' : 'opacity-0'}
        `}>
          <Sparkles className="w-3 h-3" />
          <span>StudyBuddy can make mistakes.</span>
        </div>
      </div>

    </div>
  );
}