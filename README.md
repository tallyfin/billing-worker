# tallyfin/billing-worker

Background jobs for billing: payment reminders (dunning) and Stripe event handling.

Jobs are idempotent and safe to retry. Run the tests with:

```sh
npm test
```
