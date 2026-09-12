# HeriPHARMAS Operations & Reliability

**Status:** Foundation operations policy

## 1. Operating principle

Production readiness includes the ability to detect, contain, recover from, and learn from failures. Availability without recoverability is not sufficient for a pharmacy inventory system.

## 2. Environments

At minimum, maintain clear separation between:

- local development;
- CI/test;
- staging/pre-production;
- production.

Production data must not be copied into development or test environments without an approved, minimized, protected process.

## 3. Backups and recovery

Production databases must have automated encrypted backups appropriate to the service's RPO/RTO targets.

A backup is considered effective only after restore testing demonstrates that the system can recover usable data.

Recovery controls must define:

- target RPO;
- target RTO;
- backup frequency;
- retention;
- point-in-time recovery where supported;
- restore procedure;
- credential/key recovery;
- post-restore integrity checks;
- inventory reconciliation after recovery.

## 4. Observability

Use structured logs, metrics, traces/errors where useful, and correlation/request IDs.

Operational telemetry should cover at least:

- request latency/error rate;
- database health and slow queries;
- queue/job health;
- authentication/security failures;
- inventory transaction failures;
- integration/webhook failures;
- backup status;
- resource saturation.

Sensitive personal/health information must not be written unnecessarily to logs.

## 5. Health and readiness

Services should expose appropriate liveness/readiness signals. Readiness should fail when the application cannot safely perform its required critical dependencies.

Deployments require smoke tests for authentication, tenant authorization, core inventory read/write paths, and other release-critical capabilities.

## 6. Jobs and asynchronous work

Background jobs must have:

- stable identifiers;
- retry policy;
- bounded retry count;
- idempotent handlers where retries can repeat effects;
- dead-letter or failure visibility;
- alerting for sustained failures;
- tenant-aware execution context.

Critical inventory state must not rely on an unobservable background job to become correct.

## 7. Incident management

Incidents should be classified by impact and tracked through:

1. detection;
2. acknowledgement;
3. containment;
4. recovery;
5. verification;
6. communication;
7. post-incident review.

Security, privacy, stock-integrity, and regulatory incidents require specialized escalation paths.

## 8. Stock-integrity incidents

If inventory data becomes suspect, the response must preserve evidence. Do not repair the ledger by deleting history or overwriting movements.

Use controlled reconciliation, compensating movements, affected-batch identification, and an audit trail.

## 9. Deployment and rollback

Production deployments must be reproducible and versioned. Database migrations must be reviewed for compatibility with the deployed application version.

Release plans should specify:

- migration order;
- application rollout order;
- feature-flag strategy;
- smoke tests;
- rollback decision criteria;
- rollback limitations for irreversible data migrations.

## 10. Capacity and performance

Load testing must model realistic pharmacy workloads, including concurrent stock operations, barcode/search activity, reports, imports, and multiple tenants operating simultaneously.

Protect against noisy neighbors through query limits, pagination, queue controls, quotas, and appropriate resource isolation.

## 11. Runbooks

Each critical subsystem should eventually have a short operator runbook covering symptoms, checks, safe remediation, escalation, and recovery verification.

Initial runbook set:

- authentication/session incident;
- tenant-isolation incident;
- database outage;
- backup/restore;
- stock-integrity discrepancy;
- failed migration;
- payment provider outage;
- messaging/courier provider outage;
- recall or controlled-medicine incident;
- security/privacy incident.

## 12. Operational release gate

A production release is not ready until the team can demonstrate monitoring, alerting, backup/restore capability, rollback or mitigation strategy, support ownership, and documented response for critical failure modes.
