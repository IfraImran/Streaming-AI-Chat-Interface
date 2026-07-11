// app/api/chat/route.ts
//
// Server-side route handler. This is the ONLY place the Anthropic API key
// is ever read — it lives in an environment variable on the server and is
// never sent to the client. The AI SDK's `streamText` calls Claude and
// returns a stream that `toDataStreamResponse()` turns into the
// Server-Sent-Events format the client's `useChat` hook expects.

import { anthropic } from "@ai-sdk/anthropic";
import { streamText, type CoreMessage } from "ai";
import { CHAT_MODEL, MAX_OUTPUT_TOKENS, SYSTEM_PROMPT } from "@/lib/ai-config";

// Streaming responses can run long; opt this route into the Edge runtime
// (or Node with streaming enabled) rather than the default serverless
// buffered response.
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = streamText({
    model: anthropic(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: MAX_OUTPUT_TOKENS,
    // Lets the client cancel generation mid-stream (see the Stop button
    // in ChatInterface.tsx) without the connection erroring out.
    abortSignal: req.signal,
  });

  return result.toDataStreamResponse();
}
