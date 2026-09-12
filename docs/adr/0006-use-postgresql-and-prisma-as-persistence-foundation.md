# ADR-0006: Use PostgreSQL and Prisma as the persistence foundation

## Status
Accepted

## Context
HeriPHARMAS requires transactional integrity, relational constraints, tenant-scoped data, reporting, batch/lot traceability, audit evidence, and concurrent inventory operations. The reference implementation already uses PostgreSQL with Prisma, but the target repository is being rebuilt deliberately rather than copying an existing schema wholesale.

## Decision
Use PostgreSQL as the transactional system of record and Prisma as the primary TypeScript persistence/migration layer.

Use PostgreSQL-native capabilities where they materially improve correctness or security, including foreign keys, unique constraints, check constraints, indexes, transactions, and potentially row-level security after explicit evaluation.

Prisma models are implementation artifacts derived from the domain contract. They do not replace domain rules.

## Alternatives considered

- **Document database:** rejected for the transactional relational core because stock, tenancy, procurement, transfers, and audit have strong relational integrity requirements.
- **ORM-only enforcement:** rejected because critical invariants should also be enforced by the database where practical.
- **Custom SQL-only persistence:** rejected initially because Prisma provides useful typed access and migration ergonomics; raw SQL remains available for cases where PostgreSQL features require it.

## Consequences

Positive:

- Strong transactional behavior.
- Mature relational integrity and indexing.
- Good TypeScript integration.
- Clear migration history.

Negative:

- Schema changes require disciplined migrations.
- Prisma abstractions must not hide transaction or concurrency semantics.
- Some PostgreSQL-specific features may require carefully reviewed SQL migrations.

## Security / privacy implications
Database credentials remain server-side. Tenant isolation must be enforced in application queries and, where adopted, database policy. Production database access is restricted and audited.

## Operational implications
Migrations are production deployment artifacts. Backups, restore tests, connection limits, query performance, indexes, and migration rollback/recovery procedures are part of the operational design rather than afterthoughts.
