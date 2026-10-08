/**
 * Returns the instant at which it is `hour`:00 in `timeZone` on the calendar date of `day`
 * (read in UTC).
 */
export function zonedTime(day: Date, hour: number, timeZone: string): Date {
  const wallClock = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour);
  const firstGuess = wallClock - offsetMinutes(new Date(wallClock), timeZone) * 60_000;
  // Around DST changes the offset at the real instant can differ from the first guess.
  return new Date(wallClock - offsetMinutes(new Date(firstGuess), timeZone) * 60_000);
}

/** Minutes `timeZone` is ahead of UTC at the given instant. */
export function offsetMinutes(at: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(at);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const local = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"));
  return Math.round((local - at.getTime()) / 60_000);
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
