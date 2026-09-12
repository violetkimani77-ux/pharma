# HeriPHARMAS

Production-grade, multi-tenant pharmacy inventory and operations platform.

## Project standard

HeriPHARMAS is being built to production standards from the beginning. Security, tenant isolation, inventory integrity, auditability, recoverability, accessibility, testing, observability, and regulatory boundaries are engineering requirements—not post-MVP enhancements.

## Current status

The repository is currently in the **foundation phase**. Product, architecture, security, compliance, operations, domain-model, and contribution contracts are being established before application implementation.

## Architecture direction

- Modular monolith initially.
- PostgreSQL as the transactional source of truth.
- Prisma as the primary TypeScript persistence layer.
- Explicit domain/application boundaries.
- Multi-tenant isolation enforced server-side.
- Inventory represented through controlled stock movements plus current balances.
- FEFO and stock eligibility enforced as domain rules.
- Delivery & Fulfillment is an optional, decoupled module.

## Repository guide

- [`docs/PRODUCT-MASTER-PLAN.md`](docs/PRODUCT-MASTER-PLAN.md) — product and production-readiness source of truth.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system architecture and domain boundaries.
- [`docs/DOMAIN-MODEL.md`](docs/DOMAIN-MODEL.md) — initial domain model contract.
- [`docs/SECURITY.md`](docs/SECURITY.md) — security and tenant-isolation requirements.
- [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md) — regulatory/privacy boundary and launch considerations.
- [`docs/OPERATIONS.md`](docs/OPERATIONS.md) — reliability, deployment, backups, and incident operations.
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — branch, review, and contribution rules.
- [`docs/adr/`](docs/adr/) — recorded architectural decisions.

## Development workflow

Work is performed on feature/foundation branches and merged through reviewed pull requests. `main` is reserved for reviewed, releasable changes.

Before implementing a domain feature, establish its invariants, authorization rules, transaction boundary, failure/retry behavior, audit requirements, migration impact, and tests.

## Product scope

The core platform focuses on trustworthy pharmacy inventory and operations: product/master data, procurement and receiving, batch/lot traceability, stock management, FEFO, dispensing, transfers, returns, quarantine, recalls, disposal, controlled-medicine workflows where enabled, reporting, audit, and commercial operations.

Delivery and fulfillment can be enabled as a separate module without making courier or delivery state a dependency of inventory correctness.

## Launch context

Initial product and compliance analysis is Kenya-focused. Regulatory guidance is treated as a design input and must be reviewed against the applicable current requirements before production launch.
