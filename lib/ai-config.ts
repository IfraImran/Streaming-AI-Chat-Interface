/**
 * lib/ai-config.ts
 *
 * Single source of truth for the assistant's model configuration and
 * system prompt. Keeping this in one well-commented module means the
 * route handler and any future callers (tests, other routes) never
 * duplicate — or accidentally diverge on — the prompt.
 */

// The model used for the streaming chat. Swap this string to change
// models without touching the route handler.
export const CHAT_MODEL = "claude-sonnet-4-6";

// Hard ceiling on a single assistant turn. Keeps latency predictable
// and protects against runaway generations.
export const MAX_OUTPUT_TOKENS = 1024;

/**
 * System prompt for the capstone's central AI interaction.
 *
 * Edit ROLE_DESCRIPTION and TASK_INSTRUCTIONS below to point this at
 * whichever capstone flow you're wiring up (qualification chat, audit
 * summary stream, etc). Everything else in this file can stay as-is.
 */
const ROLE_DESCRIPTION =
  "You are the assistant embedded in this product's core AI interaction. " +
  "You are concise, plain-spoken, and never pad answers with filler.";

const TASK_INSTRUCTIONS = `
- Ask one clarifying question at a time if the user's request is ambiguous.
- Keep responses short by default; expand only if the user asks for more detail.
- Never claim to take actions you can't actually take (e.g. "I've booked that for you").
- If you don't know something, say so plainly instead of guessing.
`.trim();

export const SYSTEM_PROMPT = `${ROLE_DESCRIPTION}\n\n${TASK_INSTRUCTIONS}`;
