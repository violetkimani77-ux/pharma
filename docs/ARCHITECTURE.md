# HeriPHARMAS Architecture

**Status:** Foundation architecture  
**Product:** HeriPHARMAS  
**Repository:** `violetkimani77-ux/pharma`

## 1. Architectural direction

HeriPHARMAS starts as a **modular monolith** backed by PostgreSQL. The goal is strong transactional integrity, clear domain boundaries, simple deployment, and an upgrade path to independently scaled components only when operational evidence justifies it.

The first implementation should avoid premature microservices. Inventory, receiving, dispensing, transfers, audit, and financial operations benefit from shared transactional boundaries.

## 2. System shape

```text
Web / future mobile clients
          |
          v
   Next.js application
          |
   -------------------
   Application layer
   Domain layer
   Authorization
   Validation
   -------------------
          |
       Prisma
          |
      PostgreSQL

External providers are isolated behind adapters:
payments | messaging | barcode/GS1 | courier | accounting
```

Background work may be introduced for notifications, reports, imports, integrations, and other non-critical asynchronous work. Critical stock mutations remain synchronous and transactional unless an explicit design proves otherwise.

## 3. Domain modules

Initial bounded modules:

- **Identity & Access** — users, authentication, sessions, roles, permissions, MFA policy.
- **Tenancy** — tenants, memberships, branches, locations, tenant lifecycle.
- **Pharmacy Master Data** — products, identifiers, dosage forms, units, storage rules, controlled classifications.
- **Suppliers & Procurement** — suppliers, catalogues, purchase orders, approvals, receiving.
- **Inventory** — batches/lots, stock balances, stock movements, counts, adjustments, FEFO, expiry, quarantine, recall, disposal.
- **Pharmacy Operations** — prescriptions, dispensing, returns, controlled-medicine workflows.
- **Transfers** — branch/location transfer state machine and reconciliation.
- **Commercial** — prices, invoices, payments, subscriptions, entitlements.
- **Delivery & Fulfillment** — optional feature module; delivery state is not inventory state.
- **Audit & Compliance** — immutable audit events, security evidence, compliance exports.
- **Reporting** — read models and reports derived from authoritative records.
- **Platform Operations** — jobs, observability, feature flags, operational controls.

Modules should expose domain/application operations rather than allowing arbitrary cross-module database mutation.

## 4. Core inventory model

The conceptual relationship is:

```text
Tenant
  └── Branch
       └── Location
            └── Product
                 └── Batch/Lot
                      ├── Stock Balance
                      └── Stock Movements
```

A stock balance is a current projection of controlled inventory state. The movement ledger provides the historical explanation for changes.

A typical receipt is:

```text
Supplier
  -> Purchase Order
  -> Receipt
  -> Batch/Lot
  -> Location
  -> Stock Movement
  -> Updated Balance
```

A typical dispense is:

```text
Prescription / Sale
  -> Eligibility validation
  -> FEFO candidate selection
  -> Actual batch confirmation
  -> Dispensing record
  -> Stock movement
  -> Balance update
  -> Audit event
```

## 5. Transaction boundaries

Critical operations must use database transactions and enforce invariants at the server/data layer.

Examples:

- receiving stock;
- dispensing stock;
- moving stock between locations;
- stock-count adjustments;
- returns and reversals;
- quarantine/release;
- recall blocking;
- disposal;
- controlled-medicine movements;
- financial posting where consistency matters.

The implementation must define retry behavior and idempotency keys for operations that can be submitted again after timeouts or client retries.

## 6. FEFO and stock eligibility

FEFO is implemented as domain logic, not merely a UI sorting preference.

Candidate stock must satisfy the product's eligibility rules before selection. At minimum, normal dispensing must exclude:

- expired batches;
- recalled batches;
- quarantined batches;
- damaged/unusable stock;
- batches otherwise blocked by policy.

When eligible batches compete, the system should prefer the earliest valid expiry according to the product's configured unit/lot rules.

## 7. Tenant isolation

Every protected application operation resolves tenant scope from authenticated identity and membership. A request-supplied tenant ID is never treated as authoritative.

Tenant isolation applies to:

- database queries and writes;
- cache keys;
- object-storage paths;
- queues/jobs;
- search indexes;
- exports;
- rate limits;
- logs and telemetry where tenant context is present.

Cross-tenant access tests are mandatory. Database-level defense in depth, including PostgreSQL row-level security where appropriate, should be evaluated before production.

## 8. Authorization

Authorization is server-side and deny-by-default.

Permissions should be expressed around business actions, not only page visibility. Examples:

- view inventory;
- receive stock;
- approve purchase order;
- adjust stock;
- dispense;
- approve controlled-medicine action;
- quarantine/release;
- execute recall;
- dispose stock;
- manage users;
- export sensitive data.

Branch/location scope and segregation-of-duties rules are enforced in application/domain services and tested independently of the UI.

## 9. Audit and evidence

Critical actions emit structured audit events containing, where applicable:

- actor and authenticated principal;
- tenant and operational scope;
- timestamp in UTC;
- action and outcome;
- target object and identifiers;
- request/correlation ID;
- reason or approval reference;
- structured before/after changes where safe and useful.

Audit history is append-oriented. Corrections are represented by new events or compensating transactions rather than silent rewriting.

## 10. Reporting architecture

Operational dashboards and reports must derive from authoritative transactional data or explicitly maintained projections. A dashboard value must never become a second source of truth for stock.

Long-running reports may be asynchronous, but report generation must preserve tenant scope and data classification.

## 11. Optional Delivery & Fulfillment

Delivery is a separate bounded module.

Its lifecycle is represented independently from inventory:

```text
pending
  -> assigned
  -> picked up
  -> in transit
  -> delivered
```

Alternative terminal outcomes include `failed` and `cancelled`.

Delivery may reference the fulfillment/dispensing record and recipient information, but inventory correctness must not depend on courier APIs, rider availability, or delivery status.

## 12. External integrations

External services are accessed through adapters/interfaces. Domain code should not depend directly on provider SDKs.

Provider integrations must define:

- credential management;
- request authentication/signatures;
- timeout/retry policy;
- idempotency;
- replay protection for webhooks;
- provider outage behavior;
- reconciliation strategy;
- structured integration logging without exposing secrets or unnecessary sensitive data.

## 13. Data principles

- PostgreSQL is the transactional source of truth.
- Critical identifiers are stable and non-semantic.
- Timestamps are stored consistently in UTC.
- Monetary values use exact numeric representations appropriate for financial data.
- Quantities and units are explicit; implicit unit conversion is prohibited.
- Critical records are not hard-deleted merely to correct mistakes.
- Database migrations are version-controlled and reviewed.
- Sensitive fields are classified before adding them to the model.

## 14. Application layering

A module should generally separate:

```text
UI / route handler
      ↓
Application command/query
      ↓
Authorization + validation
      ↓
Domain rules
      ↓
Persistence / integration adapters
```

UI components must not become the enforcement point for business rules. API/route handlers should remain thin enough that important rules can be tested without a browser.

## 15. Architectural decision records

Material decisions should be recorded under `docs/adr/` using a small template:

```text
# ADR-NNNN: Decision title

## Status
Proposed | Accepted | Superseded | Rejected

## Context

## Decision

## Alternatives considered

## Consequences

## Security / privacy implications

## Operational implications
```

## 16. Evolution rule

The architecture should become more distributed only when there is a demonstrated reason such as scale, isolation, deployment independence, reliability, or regulatory boundary. Complexity itself is not an architectural goal.
