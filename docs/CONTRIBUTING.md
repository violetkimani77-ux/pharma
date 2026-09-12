# Contributing to HeriPHARMAS

## Branch policy

- `main` is the protected integration/release branch.
- `foundation` is the current repository-foundation branch.
- New work should use focused feature/fix branches created from the appropriate base branch.
- Do not commit directly to `main`.
- Merge through a reviewed pull request.

## Pull requests

A PR should explain:

- what changed;
- why it changed;
- affected domain/module;
- security/privacy implications;
- migration/data implications;
- test evidence;
- operational/release implications.

Critical domain changes should include updates to the relevant documentation and ADRs.

## Engineering standards

- Keep tenant isolation server-side and test it negatively.
- Treat inventory movements as durable evidence.
- Make retryable commands idempotent.
- Prefer explicit state machines over loosely defined status strings.
- Keep financial and quantity calculations exact and unit-aware.
- Do not put secrets in source control.
- Do not bypass authorization for convenience or tests.
- Do not use production data as a development fixture.

## Definition of done

A change is complete only when its required implementation, authorization, tests, audit behavior, documentation, migration, observability, and failure handling are addressed.

## Commit guidance

Use concise imperative commit messages, for example:

```text
feat: add batch receiving workflow
fix: prevent cross-tenant stock lookup
chore: update dependency policy
docs: define recall workflow
```
