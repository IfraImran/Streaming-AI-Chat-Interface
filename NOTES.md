# Streaming AI chat interface — deliverable notes

## Files
- `app/api/chat/route.ts` — server route handler, calls Claude via the AI
  SDK's `streamText`, returns an SSE stream. API key is read from a server
  env var (`ANTHROPIC_API_KEY`) and is never exposed to the client.
- `components/ChatInterface.tsx` — client component. Uses `useChat` to
  consume the stream, renders a thinking indicator before the first token,
  streamed text, and a working Stop button.
- `components/chat.css` — distinct user/assistant bubbles, mobile-friendly
  composer (16px input font to stop iOS auto-zoom, safe-area padding).
- `lib/ai-config.ts` — single well-commented module holding the model name,
  max tokens, and system prompt.

## Setup
```bash
npm install ai @ai-sdk/anthropic
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
