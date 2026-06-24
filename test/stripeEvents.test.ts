import { test } from "node:test";
import assert from "node:assert/strict";
import { actionFor } from "../src/stripeEvents.ts";

const metadata = { tallyfin_invoice_id: "inv_7" };

test("marks invoices paid", () => {
  const action = actionFor({ id: "evt_1", type: "payment_intent.succeeded", data: { object: { metadata } } });
  assert.deepEqual(action, { kind: "mark_paid", invoiceId: "inv_7" });
});

test("passes on the failure reason", () => {
  const action = actionFor({
    id: "evt_2",
    type: "payment_intent.payment_failed",
    data: { object: { metadata, last_payment_error: { message: "Your card was declined." } } },
  });
  assert.deepEqual(action, { kind: "notify_payment_failed", invoiceId: "inv_7", reason: "Your card was declined." });
});

test("ignores unknown events", () => {
  assert.equal(actionFor({ id: "evt_3", type: "customer.created", data: { object: {} } }).kind, "ignore");
});
