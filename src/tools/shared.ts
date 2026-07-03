import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/** Build a successful text tool result from a string or lines of markdown. */
export function textResult(text: string | string[]): CallToolResult {
  return {
    content: [{ type: "text", text: Array.isArray(text) ? text.join("\n") : text }],
  };
}

/** Build an error tool result with a normalized `Error: <message>` body. */
export function errorResult(error: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: `Error: ${errorMessage(error)}` }],
    isError: true,
  };
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Truncate `text` to at most `limit` UTF-16 code units without splitting a
 * surrogate pair, preferring a nearby line boundary so markdown structures
 * are less likely to be cut mid-line.
 */
export function truncateSafely(
  text: string,
  limit: number
): { text: string; truncated: boolean } {
  if (text.length <= limit) return { text, truncated: false };
  let cut = text.slice(0, limit);
  const lastCode = cut.charCodeAt(cut.length - 1);
  // Drop a trailing lone high surrogate (first half of an astral character).
  if (lastCode >= 0xd800 && lastCode <= 0xdbff) {
    cut = cut.slice(0, -1);
  }
  const lastNewline = cut.lastIndexOf("\n");
  if (lastNewline > limit * 0.8) {
    cut = cut.slice(0, lastNewline);
  }
  return { text: cut, truncated: true };
}
