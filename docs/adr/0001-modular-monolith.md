# ADR-0001: Start as a modular monolith

## Status
Accepted

## Context
HeriPHARMAS is a transaction-heavy multi-tenant pharmacy platform. Inventory, receiving, dispensing, transfers, controlled-medicine workflows, audit, and financial operations have strong consistency requirements and frequently need shared database transactions.

Starting with microservices would add operational, deployment, observability, networking, and distributed-transaction complexity before there is evidence that independent services are necessary.

## Decision
Start as a modular monolith using Next.js/TypeScript and PostgreSQL. Domain modules will have explicit boundaries and application/domain operations, while remaining deployable as one application initially.

External providers are accessed through adapters. Background processing is reserved for work that can safely be asynchronous. Critical inventory mutations remain transactional.

## Alternatives considered

- **Microservices first:** rejected because the operational and distributed-consistency cost is premature.
- **Unstructured monolith:** rejected because weak boundaries would create coupling and make later extraction difficult.
- **Serverless functions as independent domain units:** rejected as the primary domain architecture because transaction-heavy workflows benefit from explicit application/domain boundaries and database transaction control.

## Consequences

Positive:

- Strong transaction boundaries are straightforward.
- Deployment and local development remain comparatively simple.
- Cross-module consistency is easier to reason about.
- Testing can exercise domain behavior without network choreography.

Negative:

- A single deployment initially couples release cycles.
- Module boundaries must be actively protected to prevent a large unstructured codebase.
- Later extraction, if needed, will require explicit contracts and operational work.

## Security / privacy implications
Tenant isolation, authorization, sensitive-data handling, and auditability remain centralized enough to apply consistently, but every module must still enforce its own authorization boundaries. Centralization does not remove the need for defense in depth and negative cross-tenant tests.

## Operational implications
The first production architecture should prioritize reliable PostgreSQL operations, migrations, backups, observability, and recovery. A service should be extracted only when there is evidence that independent scaling, isolation, reliability, or regulatory boundaries justify it.
