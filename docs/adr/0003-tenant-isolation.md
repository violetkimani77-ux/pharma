# ADR-0003: Enforce tenant isolation at multiple layers

## Status
Accepted

## Context
HeriPHARMAS is multi-tenant. A tenant isolation failure can expose another pharmacy's inventory, financial, operational, or sensitive data. Client-supplied tenant identifiers and UI visibility are insufficient security boundaries.

## Decision
Resolve tenant context from the authenticated principal and verified membership. Every protected command/query must enforce tenant scope server-side.

Tenant context must also be propagated to caches, jobs, exports, object storage, search, rate limits, logs, and other infrastructure where tenant data can exist.

PostgreSQL row-level security will be evaluated and introduced where it provides meaningful defense in depth without making legitimate administrative workflows unsafe or opaque.

Automated tests must attempt horizontal cross-tenant access, vertical privilege escalation, branch-scope violations, and stale/offboarded membership access.

## Alternatives considered

- **Client-provided tenant ID:** rejected because it is attacker-controlled input.
- **UI-only tenant filtering:** rejected because APIs and background jobs remain attack surfaces.
- **Database isolation only:** rejected because application and infrastructure layers still require authorization and tenant-aware behavior.

## Consequences

Positive:

- Tenant isolation becomes a system property rather than a UI convention.
- Negative tests can protect against regressions.
- Infrastructure paths are explicitly considered rather than becoming hidden data-leak channels.

Negative:

- More context must flow through application and infrastructure APIs.
- Tests and observability become more important.
- Some platform-level administrative workflows need carefully defined elevated boundaries.

## Security / privacy implications
This is a release-blocking security decision. Cross-tenant access is treated as a critical defect. Tenant context must never be inferred from an unverified client value.

## Operational implications
Jobs, exports, caches, and asynchronous processing must retain tenant context explicitly. Operational dashboards must avoid accidental cross-tenant data aggregation unless the view is intentionally platform-level and separately authorized.
