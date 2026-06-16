export interface Job<T> {
  id: string;
  payload: T;
  attempts: number;
}

export type Handler<T> = (payload: T) => Promise<void>;

export async function runJob<T>(job: Job<T>, handler: Handler<T>, maxAttempts = 5): Promise<"done" | "retry" | "dead"> {
  try {
    await handler(job.payload);
    return "done";
  } catch {
    return job.attempts + 1 >= maxAttempts ? "dead" : "retry";
  }
}
