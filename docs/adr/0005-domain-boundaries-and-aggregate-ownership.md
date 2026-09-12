# ADR-0005: Define aggregate ownership before persistence

## Status
Accepted

## Context
The platform has multiple domains that interact with inventory but should not freely mutate one another's records. Without explicit ownership, a modular monolith can become an unstructured CRUD application where any route changes any table.

## Decision
Each domain owns the invariants and mutation rules for its aggregates. Cross-domain behavior happens through explicit application commands/services and well-defined references, not arbitrary direct mutation from another module.

Initial ownership:

| Domain | Primary ownership |
|---|---|
| Identity & Access | users, credentials, sessions, roles, permissions, memberships |
| Tenancy | tenants, branches, locations, operational scope |
| Master Data | products, identifiers, units, storage/classification metadata |
| Procurement | suppliers, purchase orders, receiving documents |
| Inventory | batches/lots, stock balances, stock movements, counts, adjustments |
| Pharmacy Operations | prescriptions, dispensing, returns, controlled workflows |
| Transfers | transfer requests and transfer state |
| Commercial | prices, invoices, payments, subscription entitlements |
| Delivery | deliveries, assignments, proof of delivery |
| Audit | audit events and evidence metadata |
| Reporting | projections/read models only; never authoritative stock mutation |

The database schema may use foreign keys between domains, but foreign-key visibility does not grant mutation authority. Application code must call the owning module's operation for consequential changes.

## Core inventory aggregate rules

- A batch/lot belongs to a product and is scoped to a tenant.
- A stock balance is scoped to a tenant, location, and batch/lot where applicable.
- A stock movement records the reason and reference for a balance change.
- Inventory mutations update the balance and append the corresponding movement atomically.
- A receiving operation creates/updates stock only through Inventory-owned commands.
- Dispensing, transfer, return, quarantine, recall, and disposal call Inventory operations rather than editing balances directly.

## Alternatives considered

- **Table ownership only:** rejected because schema ownership does not enforce business invariants.
- **Every module may mutate every table:** rejected because it creates hidden coupling and makes audit/reasoning difficult.
- **Full domain-driven design framework from day one:** rejected because the useful constraint is explicit ownership and invariants, not ceremony.

## Consequences

Positive:

- Business rules have a clear home.
- Critical workflows become easier to test independently.
- Future extraction into services remains possible if evidence justifies it.

Negative:

- Cross-domain operations require deliberate application contracts.
- Some simple CRUD screens require more design than directly writing a table.

## Security / privacy implications
Authorization must be checked at the owning operation, not assumed because a caller already passed a route-level check. Sensitive domains such as controlled medicines, audit, and financial operations require explicit permissions.

## Operational implications
Transactions should be scoped around the owning aggregate and the related cross-domain changes required for consistency. Long-running reporting and integration work should use projections or asynchronous workflows rather than holding critical transactions open.
