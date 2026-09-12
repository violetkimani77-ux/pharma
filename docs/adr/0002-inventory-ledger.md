# ADR-0002: Treat inventory as a controlled ledger

## Status
Accepted

## Context
A pharmacy inventory balance is consequential operational data. Directly editing a quantity loses the explanation for how the balance changed and makes reconciliation, recall investigation, controlled-medicine oversight, and audit difficult.

The platform must also support batch/lot, expiry, location, quarantine, recall, disposal, returns, and concurrent operations.

## Decision
Represent stock changes as explicit, append-oriented stock movements. Maintain a current stock balance as a transactional projection of those movements for efficient reads.

Each consequential stock mutation must identify the product, batch/lot where applicable, source/destination location where applicable, quantity and unit, movement type, actor, timestamp, reason/reference, and idempotency context when applicable.

Corrections use compensating or reversal movements. Critical movement history is never silently rewritten or deleted.

## Alternatives considered

- **Mutable quantity only:** rejected because it loses operational evidence.
- **Event sourcing for the entire application:** rejected initially because the complexity is not justified outside the inventory/evidence domain.
- **Ledger without a current balance:** rejected because operational reads would become unnecessarily expensive and harder to index.

## Consequences

Positive:

- Every balance change is explainable.
- Reconciliation and audit investigations have a durable evidence trail.
- Batch/location traceability is explicit.
- Reversals can preserve history instead of erasing it.

Negative:

- More records and stronger transaction discipline are required.
- Queries and reporting must understand movement semantics.
- Data retention and indexing require deliberate operational planning.

## Security / privacy implications
Stock history may expose sensitive operational information, especially for controlled medicines. Access to detailed movement history and exports must be permissioned and audited. Tenant and branch scope must be enforced for both balances and movements.

## Operational implications
The database must enforce useful uniqueness and integrity constraints. Critical mutation paths require transaction and concurrency tests, including retry/idempotency tests and reconciliation checks between balances and movement history.
