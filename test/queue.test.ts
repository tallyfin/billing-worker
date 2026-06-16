import { test } from "node:test";
import assert from "node:assert/strict";
import { runJob } from "../src/queue.ts";

const failing = async () => {
  throw new Error("boom");
};

test("retries failed jobs until the attempt limit", async () => {
  assert.equal(await runJob({ id: "j1", payload: {}, attempts: 0 }, failing), "retry");
  assert.equal(await runJob({ id: "j1", payload: {}, attempts: 4 }, failing), "dead");
});
