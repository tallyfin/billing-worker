import { isValidTimeZone, zonedTime } from "./timezones.ts";

export interface OverdueInvoice {
  id: string;
  customerId: string;
  dueAt: Date;
  /** IANA time zone of the customer, for example "America/Chicago". */
  customerTimeZone?: string;
}

export interface Reminder {
  invoiceId: string;
  customerId: string;
  sendAt: Date;
  step: number;
}

/** Days after the due date on which a reminder goes out. */
export const REMINDER_OFFSETS_DAYS = [3, 7, 14];

/** Reminders go out at 9:00 in the customer's local time. */
const SEND_HOUR_LOCAL = 9;

function timeZoneFor(invoice: OverdueInvoice): string {
  const zone = invoice.customerTimeZone;
  return zone && isValidTimeZone(zone) ? zone : "UTC";
}

export function scheduleReminders(invoice: OverdueInvoice, now = new Date()): Reminder[] {
  const timeZone = timeZoneFor(invoice);
  return REMINDER_OFFSETS_DAYS.map((days, index) => {
    const day = new Date(invoice.dueAt);
    day.setUTCDate(day.getUTCDate() + days);
    const sendAt = zonedTime(day, SEND_HOUR_LOCAL, timeZone);
    return { invoiceId: invoice.id, customerId: invoice.customerId, sendAt, step: index + 1 };
  }).filter((reminder) => reminder.sendAt > now);
}
