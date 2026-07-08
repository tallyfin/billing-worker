export interface OverdueInvoice {
  id: string;
  customerId: string;
  dueAt: Date;
}

export interface Reminder {
  invoiceId: string;
  customerId: string;
  sendAt: Date;
  step: number;
}

/** Days after the due date on which a reminder goes out. */
export const REMINDER_OFFSETS_DAYS = [3, 7, 14];

const SEND_HOUR_UTC = 9;

export function scheduleReminders(invoice: OverdueInvoice, now = new Date()): Reminder[] {
  return REMINDER_OFFSETS_DAYS.map((days, index) => {
    const sendAt = new Date(invoice.dueAt);
    sendAt.setUTCDate(sendAt.getUTCDate() + days);
    sendAt.setUTCHours(SEND_HOUR_UTC, 0, 0, 0);
    return { invoiceId: invoice.id, customerId: invoice.customerId, sendAt, step: index + 1 };
  }).filter((reminder) => reminder.sendAt > now);
}
