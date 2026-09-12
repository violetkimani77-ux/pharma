# ADR-0004: Make retryable critical commands idempotent

## Status
Accepted

## Context
Browsers, mobile clients, reverse proxies, workers, and provider webhooks can retry requests after timeouts or ambiguous failures. For pharmacy inventory and financial workflows, a duplicate command can create duplicate stock, duplicate dispensing, duplicate payment posting, or inconsistent state.

## Decision
Critical commands that may be retried must accept or derive an idempotency key and persist enough command identity/result information to make repeated submissions safe.

At minimum, receiving, dispensing, transfers, stock adjustments, returns/reversals, financial postings, and signed provider webhooks require explicit retry semantics. Database uniqueness constraints must backstop application-level checks where a stable natural command identity exists.

Idempotency records and the resulting domain mutation must be committed atomically where practical. A retry must either return the original result or produce a deterministic conflict when the same key is reused with different command parameters.

## Alternatives considered

- **Client-side duplicate prevention only:** rejected because clients can retry, crash, or be bypassed.
- **Database transaction without idempotency:** rejected because transactions do not prevent two legitimate repeated transactions.
- **Blind retry:** rejected because critical operations must not multiply side effects.

## Consequences

Positive:

- Network retries become safer.
- Provider webhook replay is controllable.
- Critical workflows have explicit failure semantics.

Negative:

- Additional persistence and cleanup policies are required for idempotency records.
- Command contracts become more deliberate.

## Security / privacy implications
Idempotency keys must not contain sensitive information. Reuse across tenants must not collide, and an authenticated principal must not be able to retrieve another tenant's prior command result.

## Operational implications
Idempotency failures and conflicting key reuse should be observable. Retention of idempotency records must balance replay protection with storage cost and the actual retry/reconciliation window of each operation.
