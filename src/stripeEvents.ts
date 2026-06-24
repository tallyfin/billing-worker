export interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

export type BillingAction =
  | { kind: "mark_paid"; invoiceId: string }
  | { kind: "notify_payment_failed"; invoiceId: string; reason: string }
  | { kind: "record_refund"; chargeId: string; amount: number }
  | { kind: "ignore"; eventType: string };

function invoiceIdOf(event: StripeEvent): string {
  const metadata = event.data.object.metadata as Record<string, string> | undefined;
  const invoiceId = metadata?.tallyfin_invoice_id;
  if (!invoiceId) {
    throw new Error(`Event ${event.id} has no tallyfin_invoice_id`);
  }
  return invoiceId;
}

export function actionFor(event: StripeEvent): BillingAction {
  switch (event.type) {
    case "payment_intent.succeeded":
      return { kind: "mark_paid", invoiceId: invoiceIdOf(event) };
    case "payment_intent.payment_failed": {
      const error = event.data.object.last_payment_error as { message?: string } | undefined;
      return {
        kind: "notify_payment_failed",
        invoiceId: invoiceIdOf(event),
        reason: error?.message ?? "unknown",
      };
    }
    case "charge.refunded":
      return {
        kind: "record_refund",
        chargeId: String(event.data.object.id),
        amount: Number(event.data.object.amount_refunded),
      };
    default:
      return { kind: "ignore", eventType: event.type };
  }
}
