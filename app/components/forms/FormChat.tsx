"use client";


import { useChat } from '@ai-sdk/react';
import { Loader2, Paperclip, Send, Sparkles, UserRound, Bot } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function FormChat() {
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

  // FIX: Tell TypeScript this ref points to a textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // UseEffect for Input Change
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle Chat Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

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
    setIsLoading(true);
    console.log("Sending to StudyBuddy:", input);

    setTimeout(() => {
      setInput("");
      setIsLoading(false);
    }, 1000);
  };

  // Handle Enter Press to Submit
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // We need to cast 'e' or create a synthetic form event, 
      // but calling submit directly is easier here:
      const form = e.currentTarget.form;
      if (form && input.trim()) form.requestSubmit();
    }
  };

  return (
    <div className="mx-auto mt-4 w-full max-w-3xl px-4 text">
      {/* Message Display Area */}
      {messages && messages.length > 0 && (
        <div className="flex-1 flex flex-col gap-1">
          {messages.map((message) => (
            <div
              data-loading={isLoading}
              key={message.id}
              className="flex gap-3  p-2"
            >
              {message.role === 'user' ? (
                <div className="h-10 w-10 aspect-square rounded-full border flex items-center justify-center bg-gray-300">
                  <UserRound />
                </div>
              ) : (
                <div className="h-10 w-10 aspect-square rounded-full border flex items-center justify-center bg-gray-300">
                  <Bot />
                </div>
              )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="bg-gray-800 flex flex-col items-start p-3 rounded-md"
                      >
                        <div className="[&>p]:mb-3 [&>p]:last:mb-0 [&>ul]:mb-4 [&>ul>li]:list-disc [&>ul>li]:ml-5 [&>ol>li]:list-decimal [&>ol>li]:ml-5">
                          <ReactMarkdown>
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )
                }
              })}
            </div>
          ))}
          {/** Mark end of chat */}
          <div ref={messagesEndRef} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        data-loading={isLoading}
        className="relative flex w-full items-end gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-sm transition-all focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-blue-100 dark:border-gray-800 dark:bg-gray-950 dark:focus-within:border-gray-700 dark:focus-within:ring-gray-800"
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
            onChange={(e) => {
              console.log(input);
              setInput(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask StudyBuddy a question..."
            className="block max-h-[120px] w-full resize-none overflow-y-auto bg-transparent py-2 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 scrollbar-thin focus:outline-none dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${input.trim() && !isLoading
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