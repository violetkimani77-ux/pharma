# HeriPHARMAS — Production Readiness & Product Master Plan

**Status:** Authoritative foundation document  
**Product:** HeriPHARMAS  
**Repository:** `violetkimani77-ux/pharma`  
**Initial launch context:** Kenya  
**Architecture direction:** Multi-tenant modular monolith + PostgreSQL

## 1. Purpose

HeriPHARMAS is intended to be a credible, production-grade pharmacy inventory and operations platform. This document is the product and engineering source of truth until superseded by an approved ADR or a newer version of this plan.

A feature is not complete merely because its UI works. Critical behavior must be correct, transactional where required, traceable, auditable, secure, recoverable, tested under failure and concurrency, and operationally supportable.

## 2. Product vision

The platform is centered on trustworthy inventory. A pharmacy should be able to answer:

- What product and batch/lot do we have?
- Where is it stored and in what state?
- When does it expire and is it eligible for use?
- Where did it come from and what did it cost?
- Who received, moved, dispensed, adjusted, quarantined, recalled, or disposed of it?
- Which transactions explain the current balance?
- Which stock is affected by a recall?
- What evidence exists for an audit or investigation?

Delivery and fulfillment is an optional first-class module. Inventory correctness must never depend on delivery being enabled.

## 3. Non-negotiable product rules

1. **Inventory is a controlled ledger, not a mutable number.** Product identity is separate from inventory state. The conceptual model is `Tenant → Branch → Location → Product → Batch/Lot → Stock Balance + Stock Movement`.
2. **FEFO is a domain rule.** Expired, quarantined, recalled, damaged, or otherwise blocked stock is not eligible for normal dispensing.
3. **Traceability is end-to-end.** Where applicable, support supplier → purchase → receipt → batch/lot → location → transfer → dispense/fulfillment → recipient, including GS1 identifiers.
4. **Tenant security is server-side.** Tenant context comes from verified identity and membership, never from a trusted client-supplied tenant ID.
5. **Critical commands are transactional.** Receiving, dispensing, transfer, counts, adjustments, returns, recalls, disposal, and financial operations require explicit transaction boundaries and idempotency where retries are possible.
6. **History is evidence.** Corrections use compensating/reversal events; critical history is not silently overwritten or hard-deleted.
7. **Least privilege and segregation of duties are default controls.** Sensitive workflows may require dual approval.
8. **The UI is simple; the domain is rigorous.** Barcode/search-first workflows, prominent expiry/batch information, clear warnings, and recoverable errors are preferred over unnecessary complexity.

## 4. Scope checklist

### Product, regulatory, and scope

- [ ] Jurisdiction matrix and regulatory ownership defined.
- [ ] Kenya PPB applicability assessed for GPP, GDP, controlled medicines, pharmaceutical waste, recalls, and digital pharmacy boundaries.
- [ ] Controlled-medicine scope explicitly enabled/disabled per release.
- [ ] Privacy, retention, terms, support/SLA, and data-processing responsibilities documented.

### Architecture and engineering

- [ ] Modular monolith with clear domain boundaries.
- [ ] PostgreSQL as transactional source of truth.
- [ ] Explicit migrations and rollback/recovery strategy.
- [ ] Idempotent commands for retryable operations.
- [ ] Domain events for important state transitions.
- [ ] Versioned external/API contracts where compatibility matters.
- [ ] ADR process for material architecture decisions.

### Multi-tenancy and authorization — release blocker

- [ ] Verified tenant context on every protected request.
- [ ] Defense-in-depth isolation, including database controls where appropriate.
- [ ] Tenant-aware caches, object storage, queues, search, logs, and rate limits.
- [ ] Automated cross-tenant denial tests.
- [ ] Horizontal and vertical privilege-escalation tests.
- [ ] Machine-testable role/permission matrix.
- [ ] Branch/location scope enforced server-side.
- [ ] Offboarding, membership changes, quotas, and noisy-neighbor controls defined.

### Identity and sessions

- [ ] Secure password hashing and credential recovery.
- [ ] MFA strategy and privileged-account policy.
- [ ] Session rotation/revocation and secure cookies.
- [ ] Rate limiting, CSRF protection where applicable, security headers, and authentication event logging.

### Pharmacy master data

- [ ] Product is distinct from stock.
- [ ] Generic/brand, strength, dosage form, pack size, units, identifiers, GTIN/barcodes, registration references, storage conditions, controlled classification, aliases, and status are modeled deliberately.
- [ ] Import/export and duplicate detection rules exist.

### Inventory engine

- [ ] Batch/lot and expiry are first-class.
- [ ] Location and stock states include available, reserved, quarantined, damaged, expired, recalled/blocked, and in-transit where needed.
- [ ] Immutable movement ledger is authoritative for history.
- [ ] Adjustments require reason and approval policy.
- [ ] FEFO selection is enforced by domain logic.
- [ ] Negative-stock policy is explicit.
- [ ] Unit-of-measure conversion is explicit and validated.
- [ ] Counts, variance reconciliation, valuation, reorder rules, and alerts are defined.
- [ ] Concurrency behavior is tested.

### Procurement and receiving

- [ ] Suppliers, supplier catalogue/pricing, requisitions/POs, approvals, partial receipts, discrepancies, short-dated warnings, rejected/damaged goods, returns, and receiving evidence are modeled.
- [ ] Receipt creates the correct batch/location/movement records atomically.

### Dispensing and fulfillment

- [ ] Prescription validation and authorized-dispensing controls are explicit where applicable.
- [ ] Actual dispensed batch is recorded.
- [ ] Inventory update and dispensing record are atomic.
- [ ] Reversal/return uses compensating transactions.
- [ ] Delivery remains decoupled from inventory core.

### Controlled medicines

- [ ] Dedicated permissions and secure-storage controls.
- [ ] Detailed movement/dispensing records and evidence.
- [ ] Loss/theft/diversion incident workflow.
- [ ] Returns, destruction, reporting, retention, and dual approval policies.

### Quarantine, recalls, expiry, and waste

- [ ] Secure quarantine reasons and release rules.
- [ ] Recall campaign and affected-batch impact reporting.
- [ ] Recalled/expired stock blocked from normal use.
- [ ] Disposal approval, segregation, proof of destruction, and consignment traceability.

### Branches, transfers, and logistics

- [ ] Branch/location permissions.
- [ ] Transfer request → approve → pick → dispatch → in-transit → receive → reconcile state machine.

### Optional Delivery & Fulfillment module

Tenant-level feature flag; no dependency from inventory core. Scope includes delivery address/contact, zones/fees, assignment, riders/couriers, scheduling, state machine (`pending → assigned → picked up → in transit → delivered/failed/cancelled`), proof of delivery, failure reasons, notifications, COD where applicable, courier APIs, reporting, and audit.

### Commercial and SaaS

- [ ] Price history and margins.
- [ ] Idempotent payments, refunds, and reversals.
- [ ] Subscription entitlements, metering, limits, billing-failure behavior, and server-side enforcement.

### Security and privacy

- [ ] Threat model and OWASP ASVS-aligned controls.
- [ ] SAST/dependency/secret scanning and API/DAST testing strategy.
- [ ] Secure uploads, TLS, encryption/key management, SSRF/injection/XSS/CSRF/IDOR/auth-bypass regression tests.
- [ ] Health and other sensitive data classified, minimized, retained, exported, and deleted according to approved policy.
- [ ] Breach and data-subject request workflows documented.

### Audit and reporting

- [ ] Immutable audit events for security, stock, controlled medicine, financial, and administrative actions.
- [ ] Events include actor, tenant, branch/scope, timestamp, action, object, outcome, request/correlation ID, and structured changes where appropriate.
- [ ] Reports derive from authoritative transactional records.

### Reliability and operations

- [ ] Structured logs, metrics, traces/errors, health/readiness checks, job retry/dead-letter strategy, alerts, and runbooks.
- [ ] Encrypted backups, point-in-time recovery where supported, tested restores, documented RPO/RTO, and recovery drills.
- [ ] Capacity/load/concurrency tests and noisy-neighbor protection.

### Testing and release

- [ ] Domain/unit tests.
- [ ] PostgreSQL integration and transaction/concurrency tests.
- [ ] Authorization and tenant-isolation regression suite.
- [ ] Critical E2E and accessibility tests.
- [ ] Migration and backup/restore tests.
- [ ] CI quality/security gates.
- [ ] Protected `main`, feature branches, reviewed PRs, staging smoke tests, rollback plan, and post-deploy verification.

## 5. Delivery sequence

### Phase 0 — Foundation
Architecture, repository conventions, PostgreSQL, tenancy, authentication, RBAC, audit, migrations, CI/CD, security, tests, observability.

**Exit:** secure multi-tenant skeleton with enforceable authorization and operational foundations.

### Phase 1 — Inventory engine
Products, identifiers, suppliers, locations, batches, ledger, receiving, FEFO, expiry, counts, adjustments, and inventory reporting.

**Exit:** reliable inventory truth.

### Phase 2 — Pharmacy operations
Dispensing, transfers, returns, quarantine, recalls, disposal, and controlled medicines where enabled.

**Exit:** traceable, auditable pharmacy workflows.

### Phase 3 — Commercial and optional delivery
Pricing, margins, payments, subscriptions, notifications, Delivery & Fulfillment, courier integrations.

**Exit:** complete commercial operating model without coupling delivery to stock correctness.

### Phase 4 — Production hardening
Load/concurrency, security, recovery, migration, compliance, operational readiness, and final launch gates.

## 6. Definition of done

A domain capability is done only when behavior is specified; authorization and tenant scope are defined; invariants are enforced; failure/retry/rollback behavior is defined; audit evidence exists; tests cover normal and failure paths; observability exists; migrations are safe; documentation is current; security review is complete; and CI passes.

## 7. Engineering guardrails

- Never commit directly to `main`.
- Work on feature/foundation branches and merge through reviewed PRs.
- Never weaken tenant isolation for convenience.
- Never silently mutate stock history.
- Never rely on UI-only authorization.
- Never treat production as a test environment.
- A backup is not considered proven until a restore has been tested.
- Regulatory claims must be jurisdiction-specific and reviewed before production launch.
- Use explicit state machines for operational workflows.
- Make retryable commands idempotent.
- Prefer compensating transactions over destructive edits.
- Keep optional modules decoupled from core inventory correctness.
- Record material architecture choices as ADRs.

## 8. Research baseline

Initial design is informed by WHO good storage/distribution and stock-management guidance, Kenya Pharmacy and Poisons Board guidance, GS1 healthcare traceability standards, OWASP multi-tenant/authorization/ASVS guidance, and Kenya data-protection/digital-health requirements. These are inputs to engineering decisions, not a substitute for formal legal or regulatory review.

## 9. Change control

This document evolves with the product. A material change must state the domain, security, compliance, data, migration, operational, and testing implications. Regulatory changes must update the compliance matrix before a release can be considered production-ready.
