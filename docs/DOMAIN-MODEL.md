# HeriPHARMAS Domain Model Contract

**Status:** Foundation contract  
**Related ADRs:** ADR-0002, ADR-0003, ADR-0004, ADR-0005

This document defines the minimum conceptual model that implementation must preserve. It intentionally does not prescribe every database column yet.

## 1. Tenancy hierarchy

```text
Tenant
  └── Branch
       └── Location
```

- **Tenant** is the security and commercial boundary.
- **Branch** is an operational site belonging to a tenant.
- **Location** is a stock-holding or operational location within a branch.

A user may have tenant membership and scoped branch/location permissions. A platform administrator is a separate security boundary and must not be treated as an ordinary tenant member.

## 2. Product and stock are separate concepts

```text
Product
  └── Batch/Lot
       └── Stock at one or more Locations
```

A Product describes what the medicine/item is. A Batch/Lot describes a traceable instance of that product with attributes such as lot number and expiry. Stock represents quantity in a specific operational state and location.

The system must not encode batch, expiry, or location only as optional fields on a generic quantity record.

## 3. Product identity

The product model must be able to represent, as applicable:

- internal SKU/code;
- generic/INN name;
- brand/trade name;
- strength and strength units;
- dosage form;
- pack size and base unit;
- manufacturer/marketing authorization information where required;
- registration/reference identifiers where required;
- GTIN/barcodes and other identifiers;
- storage requirements;
- controlled-medicine classification;
- active/inactive status;
- aliases/search terms.

Identifier uniqueness must be scoped deliberately. The same GTIN should not accidentally represent two active products within the same tenant.

## 4. Batch/Lot

A batch/lot is the traceability boundary for stock that shares a production lot and relevant expiry/manufacturing attributes.

At minimum, the model must support:

- product reference;
- lot/batch number;
- expiry date where applicable;
- manufacturing date where available;
- supplier/source reference;
- receipt reference;
- received date;
- status/eligibility state;
- relevant quality/quarantine/recall references.

Batch identity must be stable enough to support recall and audit investigation.

## 5. Stock state

Stock quantity must be associated with an explicit unit and location. Operational states should distinguish at least:

- available;
- reserved, when reservation is enabled;
- quarantined;
- damaged/unusable;
- expired;
- recalled/blocked;
- in transit, where transfers require it.

State transitions must be explicit domain operations. A UI checkbox must never be the only mechanism preventing blocked stock from being dispensed.

## 6. Stock movement

Every consequential stock change is represented by a movement with:

- tenant and operational scope;
- product and batch/lot where applicable;
- source and destination location where applicable;
- quantity and unit;
- movement type;
- reason/reference;
- actor;
- timestamp;
- idempotency/command reference when applicable;
- links to the originating business transaction.

Movement types are domain concepts rather than free-form strings. The initial taxonomy should cover receiving, dispensing, transfer, adjustment, return, quarantine/release, recall blocking, disposal, and reversal/compensation, with controlled extensions as requirements emerge.

## 7. Inventory invariants

Implementation must enforce at least:

1. A movement cannot cross tenants.
2. A movement's source/destination locations must belong to the correct tenant.
3. A product, batch, and location reference must resolve within the same tenant.
4. Quantities cannot silently change unit semantics.
5. A normal dispense cannot consume ineligible stock.
6. Balance changes and their movement evidence commit atomically.
7. Retried critical commands cannot create duplicate effects.
8. A correction creates compensating evidence rather than deleting history.
9. Concurrency cannot produce an impossible balance.

## 8. Supplier and procurement

Procurement owns supplier relationships and purchase/receiving documents. Receiving hands controlled stock changes to Inventory.

A receipt should preserve the link:

```text
Supplier → Purchase Order → Receipt → Batch/Lot → Inventory Movement
```

Partial receipts, discrepancies, damaged/rejected goods, short-dated stock, and returns must not be represented as a single opaque quantity adjustment.

## 9. Pharmacy operations

Dispensing owns the dispensing/prescription business record. Inventory owns the resulting stock mutation.

The relationship is:

```text
Prescription / Sale
        ↓
Eligibility validation
        ↓
FEFO candidate selection
        ↓
Actual batch confirmation
        ↓
Dispensing record + Inventory mutation
```

The actual batch consumed must be recorded where batch traceability is applicable.

## 10. Transfers

A transfer is a business workflow, not simply a source quantity decrement plus destination increment.

Initial state model:

```text
requested → approved → picked → dispatched → in_transit → received
                                                    ↘ reconciled
```

Cancellation/failure states must be explicit and must define their inventory effects. The system must not assume that dispatch means receipt.

## 11. Delivery

Delivery is optional and separate from stock state.

```text
Fulfillment / Dispensing
        ↓
Delivery
        ↓
pending → assigned → picked_up → in_transit → delivered
                                      ↘ failed
                                      ↘ cancelled
```

A courier failure must not silently reverse a stock movement. Any stock consequence requires an explicit inventory operation.

## 12. Audit

Audit events are evidence of consequential actions. They reference the actor, tenant, scope, action, target, result, time, correlation/request context, and reason/approval data when applicable.

Audit events do not replace the stock movement ledger. The two serve different purposes:

- stock movements explain inventory state changes;
- audit events explain who/what/when/why from a security and operational evidence perspective.

## 13. Reporting

Reports are consumers of authoritative records. They must not introduce an alternate write path for stock or financial state.

Where performance requires projections, the projection must be rebuildable or reconcilable from authoritative data.

## 14. Persistence rules

The eventual Prisma/PostgreSQL schema must use:

- foreign keys for referential integrity;
- unique constraints for business identities that truly must be unique;
- check constraints where PostgreSQL can safely enforce domain invariants;
- indexes based on actual access patterns;
- explicit timestamps and timezone-safe handling;
- numeric/decimal types for money and quantities where fractional units are possible;
- migrations reviewed as production changes.

Schema design should follow the domain contract rather than allowing the ORM model to become the domain model by accident.
