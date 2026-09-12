# HeriPHARMAS Security Foundation

**Status:** Foundation security policy  
**Scope:** Application, data, tenant isolation, integrations, operations

## 1. Security objectives

HeriPHARMAS must protect pharmacy operations, inventory integrity, tenant boundaries, credentials, financial records, audit evidence, and sensitive personal/health information.

Security controls must be enforced at the server/data layer. Client-side checks are usability controls, not authorization controls.

## 2. Threat model priorities

The initial threat model prioritizes:

- cross-tenant data disclosure;
- insecure direct object references;
- horizontal and vertical privilege escalation;
- credential/session compromise;
- unauthorized stock adjustment or diversion;
- unauthorized controlled-medicine activity;
- manipulation or deletion of audit evidence;
- payment/reconciliation abuse;
- malicious or unsafe file uploads;
- injection and XSS/CSRF attacks;
- webhook replay and forged integration events;
- accidental exposure through logs, exports, backups, or support tooling;
- denial of service and noisy-neighbor behavior.

## 3. Tenant isolation

Tenant context is derived from the authenticated principal and verified membership. Client-provided tenant identifiers are treated as untrusted input.

Every tenant-scoped query must include the resolved authorization scope. Isolation must be tested with negative cases, including attempts to access another tenant's records using guessed or substituted identifiers.

Defense in depth should include PostgreSQL controls such as row-level security where they can be introduced safely and tested thoroughly.

Tenant scope must also be carried into caches, object storage, queues, search, exports, and telemetry.

## 4. Authorization model

Authorization is deny-by-default and action-oriented.

The platform should distinguish:

- authentication: who is the principal?
- membership: which tenant/branch/location may the principal access?
- permission: what business action may the principal perform?
- segregation of duties: must another authorized person approve it?

Privileged actions should be explicitly enumerated and regression-tested.

## 5. Identity and sessions

The implementation must provide, as applicable:

- strong password hashing;
- secure account recovery;
- session rotation and revocation;
- secure, appropriately scoped cookies;
- MFA for privileged accounts and a path to broader MFA;
- login/recovery throttling;
- authentication and security-event audit logging;
- immediate access removal when membership is revoked.

Secrets, session tokens, reset tokens, and provider credentials must never be committed to the repository.

## 6. Application security baseline

The application security program should align with OWASP ASVS and include controls/tests for:

- injection;
- broken access control and IDOR;
- authentication/session failures;
- XSS;
- CSRF where applicable;
- SSRF;
- unsafe file upload and path traversal;
- insecure deserialization or equivalent unsafe parsing;
- security-header configuration;
- rate limiting and abuse controls;
- dependency vulnerabilities;
- secret leakage;
- insecure logging and error disclosure.

## 7. Inventory integrity

Inventory is security-sensitive financial and operational data.

No user may silently change a historical stock movement. Adjustments require an explicit reason and applicable approval. Critical commands are transactional and should be protected against concurrent double-spend/double-dispense behavior.

Controlled medicines require stricter permissions and evidence when that scope is enabled.

## 8. Audit evidence

Security-sensitive actions must create append-oriented audit evidence. Audit records should capture actor, tenant/scope, timestamp, action, object, outcome, correlation/request identifier, and structured change information when appropriate.

Audit records must not contain secrets. Sensitive payloads should be minimized.

## 9. Sensitive data

Health and other sensitive personal data must be classified, minimized, access-controlled, and retained only as justified by an approved policy.

Logs should avoid raw health information and unnecessary personal identifiers. Exports require explicit authorization and should be traceable.

## 10. Integrations and webhooks

Provider webhooks must verify authenticity and support replay protection/idempotency. External calls require bounded timeouts and defined failure behavior.

Payment, courier, messaging, and other provider credentials belong in managed secret storage, not source control.

## 11. Operational security

Production access must be restricted and auditable. Administrative actions should be attributable to an individual or controlled service identity.

Security monitoring should cover authentication anomalies, authorization failures, repeated cross-tenant access attempts, unusual stock adjustments, privileged actions, and integration failures.

## 12. Security testing gates

Before production launch, CI/release controls should include:

- dependency and vulnerability scanning;
- secret scanning;
- static analysis where appropriate;
- authorization regression tests;
- tenant-isolation tests;
- critical API integration tests;
- production-like security configuration checks;
- remediation or documented risk acceptance for unresolved findings.

No critical security issue should be knowingly shipped without an explicit, time-bounded exception approved by the responsible owner.
