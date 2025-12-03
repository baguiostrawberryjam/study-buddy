"use client";

import { useChat } from '@ai-sdk/react';
import { Loader2, Paperclip, Send, Sparkles, Bot, AlertCircle } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState, ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import { uploadAndEmbedFile } from '../../lib/actions/embedding'; // Import your server action
import toast from 'react-hot-toast'; // Ensure you have this installed

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
  const [isUploading, setIsUploading] = useState<boolean>(false); // New state for file upload
  const [hasInteracted, setHasInteracted] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input

  // Auto-resize textarea
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

    // Retry after layout shifts
    const timeoutId = setTimeout(scrollToBottom, 100);
    const timeoutIdLong = setTimeout(scrollToBottom, 1000);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutIdLong);
    };
  }, [messages, isLoading, hasInteracted]);

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

  // --- NEW: File Upload Handler ---
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB limit matches your server action)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      e.target.value = ''; // Reset input
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error("Only PDF files are supported currently.");
      e.target.value = '';
      return;
    }

    try {
      setIsUploading(true);

      // Ensure UI expands if this is the first interaction
      if (!hasInteracted) {
        setHasInteracted(true);
        if (onInteraction) onInteraction();
      }

      const formData = new FormData();
      formData.append('file', file);

      // Call the server action directly
      // Passing 'null' as the first argument because the action expects 'prevState'
      const result = await uploadAndEmbedFile(null, formData);

      if (result.error) {
        toast.error(result.error);
        setError(result.error);
      } else {
        toast.success("File added to knowledge base!");
        // Optional: You could append a system message here saying "File uploaded"
      }
    } catch (err: any) {
      console.error("Upload failed", err);
      toast.error("Failed to upload file.");
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`flex flex-col w-full max-w-3xl mx-auto min-h-0 ${hasInteracted ? 'h-full' : 'h-auto'}`}>

      {/* Message Display Area */}
      <div
        className={`
          relative flex-1 overflow-y-auto transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] pr-4 pl-1 space-y-6 pb-6 scrollbar-modern
          ${hasInteracted ? 'flex opacity-100 min-h-0' : 'hidden opacity-0 h-0'}
        `}
      >
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
            <div className="h-4"></div>
          )}

          {/* Loading Bubble (Chat or Upload) */}
          {(isLoading || isUploading) && (
            <div className="flex gap-4 w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="shrink-0 h-8 w-8 rounded-full border border-gray-100 bg-white dark:bg-black dark:border-gray-800 flex items-center justify-center shadow-sm mt-1">
                <Bot className="h-4 w-4 text-gray-900 dark:text-gray-100" />
              </div>
              <div className="bg-white dark:bg-[#111] px-5 py-4 rounded-[20px] rounded-tl-sm border border-gray-100 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
                {isUploading ? (
                  <span className="text-sm text-gray-500">Processing document...</span>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                  </>
                )}
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
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf" // Restricted to PDF as per your server action logic
          />

          {/* Paperclip Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            ) : (
              <Paperclip className="h-5 w-5" />
            )}
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
            disabled={!input.trim() || isLoading || isUploading}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${input.trim() && !isLoading
              ? "cursor-pointer bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm"
              : "bg-transparent text-gray-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5 " />
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