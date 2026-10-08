import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidTimeZone, offsetMinutes, zonedTime } from "../src/timezones.ts";

const day = new Date("2026-09-04T00:00:00Z");

test("resolves 9:00 local time in different zones", () => {
  assert.equal(zonedTime(day, 9, "America/Chicago").toISOString(), "2026-09-04T14:00:00.000Z");
  assert.equal(zonedTime(day, 9, "Europe/Berlin").toISOString(), "2026-09-04T07:00:00.000Z");
  assert.equal(zonedTime(day, 9, "Asia/Kolkata").toISOString(), "2026-09-04T03:30:00.000Z");
});

test("keeps 9:00 local on the day DST ends", () => {
  const dstEnd = new Date("2026-11-01T00:00:00Z");
  assert.equal(zonedTime(dstEnd, 9, "America/New_York").toISOString(), "2026-11-01T14:00:00.000Z");
});

test("reports offsets in minutes", () => {
  assert.equal(offsetMinutes(day, "UTC"), 0);
  assert.equal(offsetMinutes(day, "America/Los_Angeles"), -420);
});

test("detects invalid time zones", () => {
  assert.equal(isValidTimeZone("Europe/Stockholm"), true);
  assert.equal(isValidTimeZone("Mars/Olympus_Mons"), false);
});
