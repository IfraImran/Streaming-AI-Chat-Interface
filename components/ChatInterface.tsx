"use client";

// components/ChatInterface.tsx
//
// Client-side streaming chat UI. Uses the AI SDK's `useChat` hook, which
// consumes the SSE stream from app/api/chat/route.ts and gives us:
//  - `messages`: the running conversation (persists across turns)
//  - `status`: "ready" | "submitted" | "streaming" | "error"
//  - `stop()`: cancels an in-flight generation
//
// On top of that we add: a "thinking" indicator before the first token
// arrives, auto-scroll that backs off the moment the user scrolls up to
// read history, and a mobile-friendly composer.

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      api: "/api/chat",
    });

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";
  const canStop = isThinking || isStreaming;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to the newest message, but only while the user hasn't
  // deliberately scrolled up to read earlier history. This is the
  // single most common thing generic chat demos get wrong.
  useEffect(() => {
    if (!autoScroll || !scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, autoScroll]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight;
    // Re-arm auto-scroll once the user scrolls back within ~80px of
    // the bottom; otherwise leave their reading position alone.
    setAutoScroll(distanceFromBottom < 80);
  }

  return (
    <div className="chat-shell">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <p className="chat-empty">Ask a question to get started.</p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user"
                ? "chat-message chat-message-user"
                : "chat-message chat-message-assistant"
            }
          >
            <span className="chat-message-role">
              {message.role === "user" ? "You" : "Assistant"}
            </span>
            <p className="chat-message-text">{message.content}</p>
          </div>
        ))}

        {isThinking && (
          <div className="chat-message chat-message-assistant">
            <span className="chat-message-role">Assistant</span>
            <div className="chat-thinking" aria-label="Assistant is thinking">
              <span className="chat-thinking-dot" />
              <span className="chat-thinking-dot" />
              <span className="chat-thinking-dot" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-composer">
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message…"
          rows={1}
          className="chat-input"
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              (event.target as HTMLTextAreaElement).form?.requestSubmit();
            }
          }}
        />
        {canStop ? (
          <button
            type="button"
            onClick={stop}
            className="chat-send chat-stop"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="chat-send"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
