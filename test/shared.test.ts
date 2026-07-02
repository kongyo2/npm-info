import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  textResult,
  errorResult,
  errorMessage,
  truncateSafely,
} from "../src/tools/shared.js";

describe("textResult", () => {
  it("wraps a string", () => {
    assert.deepEqual(textResult("hello"), {
      content: [{ type: "text", text: "hello" }],
    });
  });

  it("joins line arrays with newlines", () => {
    assert.deepEqual(textResult(["a", "b"]), {
      content: [{ type: "text", text: "a\nb" }],
    });
  });
});

describe("errorResult / errorMessage", () => {
  it("uses the message of Error instances", () => {
    const result = errorResult(new Error("boom"));
    assert.equal(result.isError, true);
    assert.deepEqual(result.content, [{ type: "text", text: "Error: boom" }]);
  });

  it("stringifies non-Error values", () => {
    assert.equal(errorMessage("plain"), "plain");
    assert.equal(errorMessage(42), "42");
  });
});

describe("truncateSafely", () => {
  it("returns short text untouched", () => {
    assert.deepEqual(truncateSafely("short", 100), {
      text: "short",
      truncated: false,
    });
  });

  it("truncates to the limit", () => {
    const { text, truncated } = truncateSafely("a".repeat(200), 100);
    assert.equal(truncated, true);
    assert.equal(text.length, 100);
  });

  it("never splits a surrogate pair", () => {
    // "😀" is two UTF-16 code units; a limit of 3 would land mid-pair.
    const { text, truncated } = truncateSafely("ab😀cd", 3);
    assert.equal(truncated, true);
    assert.equal(text, "ab");
    // Round-tripping through the code-point iterator must not produce U+FFFD.
    assert.ok(![...text].some((c) => c === "�"));
  });

  it("prefers a nearby line boundary", () => {
    const content = `${"x".repeat(90)}\n${"y".repeat(20)}`;
    const { text } = truncateSafely(content, 100);
    assert.equal(text, "x".repeat(90));
  });

  it("keeps a mid-line cut when no newline is close", () => {
    const { text } = truncateSafely("z".repeat(300), 100);
    assert.equal(text.length, 100);
  });
});
