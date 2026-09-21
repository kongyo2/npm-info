import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function textResult(text: string | string[]): CallToolResult {
  return {
    content: [{ type: "text", text: Array.isArray(text) ? text.join("\n") : text }],
  };
}

export function errorResult(error: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: `Error: ${errorMessage(error)}` }],
    isError: true,
  };
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function truncateSafely(
  text: string,
  limit: number
): { text: string; truncated: boolean } {
  if (text.length <= limit) return { text, truncated: false };
  let cut = text.slice(0, limit);
  const lastCode = cut.charCodeAt(cut.length - 1);
  if (lastCode >= 0xd800 && lastCode <= 0xdbff) {
    cut = cut.slice(0, -1);
  }
  const lastNewline = cut.lastIndexOf("\n");
  if (lastNewline > limit * 0.8) {
    cut = cut.slice(0, lastNewline);
  }
  return { text: cut, truncated: true };
}
