"use client";

import { useChat } from '@ai-sdk/react';
import { Loader2, Paperclip, Send, Sparkles, UserRound, Bot } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface FormChatProps {
  onInteraction?: () => void;
}

export default function FormChat({ onInteraction }: FormChatProps) {
  // AI SDK
  const { messages, sendMessage } = useChat({
    onError: (error) => {
      console.log('error: ' + error)
      setError(error.toString)
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFocus = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteraction) onInteraction();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!hasInteracted) {
      setHasInteracted(true);
      if (onInteraction) onInteraction();
    }

    try {
      setIsLoading(true)
      await sendMessage({ text: input })
      setInput('')
    }
    catch (error: any) {
      console.log('error: ' + error);
      setError(error.toString());
    } finally {
      setIsLoading(false);
    }

    // KEEPING ORIGINAL LOGIC
    setIsLoading(true);
    console.log("Sending to StudyBuddy:", input);

    setTimeout(() => {
      setInput("");
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form && input.trim()) form.requestSubmit();
    }
  };

  return (
    <div className={`flex flex-col w-full max-w-3xl mx-auto transition-all duration-1000 ease-in-out ${hasInteracted ? 'h-full' : 'h-auto'}`}>

      {/* Message Display Area */}
      <div
        className={`
          flex-1 overflow-y-auto pr-4 pl-1 space-y-6 pb-6 scrollbar-modern transition-all duration-1000 delay-100
          ${hasInteracted ? 'opacity-100 min-h-0' : 'opacity-0 h-0 overflow-hidden'}
        `}
      >
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
          <div className="h-full"></div>
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

        <div ref={messagesEndRef} />
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
          `}
        >
          {/* Paperclip Button */}
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Text Area */}
          <div className="relative flex-1 min-w-0 py-2">
            <textarea
              ref={textareaRef}
              onFocus={handleFocus}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              // Adjusted leading and padding to match the 40px height of buttons
              className="block max-h-[160px] w-full resize-none overflow-y-auto bg-transparent text-[16px] leading-6 text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500 scrollbar-modern"
              style={{ minHeight: '24px' }}
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${input.trim() && !isLoading
              ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm transform hover:scale-105"
              : "bg-transparent text-gray-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 ml-0.5" />
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