import { test } from "node:test";
import assert from "node:assert/strict";
import { scheduleReminders } from "../src/dunning.ts";

const invoice = { id: "inv_7", customerId: "cus_3", dueAt: new Date("2026-09-01T00:00:00Z") };

test("schedules reminders 3, 7 and 14 days after the due date", () => {
  const reminders = scheduleReminders(invoice, new Date("2026-09-01T00:00:00Z"));
  assert.deepEqual(
    reminders.map((r) => r.sendAt.toISOString()),
    ["2026-09-04T09:00:00.000Z", "2026-09-08T09:00:00.000Z", "2026-09-15T09:00:00.000Z"],
  );
});

test("skips reminders that are already in the past", () => {
  const reminders = scheduleReminders(invoice, new Date("2026-09-10T00:00:00Z"));
  assert.deepEqual(reminders.map((r) => r.step), [3]);
});
