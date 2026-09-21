import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createLimiter } from "../src/services/concurrency.js";

describe("createLimiter", () => {
  it("runs tasks with at most `max` in flight", async () => {
    const runLimited = createLimiter(2);
    let active = 0;
    let peak = 0;
    const task = () =>
      new Promise<number>((resolve) => {
        active++;
        peak = Math.max(peak, active);
        setTimeout(() => {
          active--;
          resolve(active);
        }, 5);
      });
    await Promise.all(Array.from({ length: 10 }, () => runLimited(task)));
    assert.equal(peak, 2);
  });

  it("releases the slot when fn throws synchronously", async () => {
    const runLimited = createLimiter(1);
    await assert.rejects(
      runLimited(() => {
        throw new Error("sync boom");
      }),
      /sync boom/
    );
    const result = await runLimited(() => Promise.resolve("ok"));
    assert.equal(result, "ok");
  });

  it("keeps draining the queue after a synchronous throw", async () => {
    const runLimited = createLimiter(1);
    const results: string[] = [];
    await Promise.all([
      runLimited(() => {
        throw new Error("first fails sync");
      }).catch(() => results.push("first")),
      runLimited(() => Promise.resolve("second")).then((r) => results.push(r)),
    ]);
    assert.deepEqual(results, ["first", "second"]);
  });

  it("propagates async rejections without leaking a slot", async () => {
    const runLimited = createLimiter(1);
    await assert.rejects(
      runLimited(() => Promise.reject(new Error("async boom"))),
      /async boom/
    );
    assert.equal(await runLimited(() => Promise.resolve(42)), 42);
  });
});
