# HeriPHARMAS Compliance & Regulatory Boundary

**Status:** Foundation compliance framework  
**Initial jurisdiction:** Kenya

## 1. Purpose

This document defines engineering compliance responsibilities and boundaries. It is not legal advice and does not replace formal advice from qualified Kenyan counsel or applicable regulators.

The platform must not claim regulatory compliance merely because a technical control exists. Product, legal, clinical, pharmacy, privacy, and regulatory owners must confirm applicability before launch.

## 2. Regulatory baseline

The initial design must assess, at minimum:

- Pharmacy and Poisons Board (PPB) requirements relevant to pharmacy practice, good pharmacy practice, distribution, storage, transport, controlled medicines, pharmaceutical waste, recalls, and digital pharmacy activity where applicable;
- Kenya Data Protection Act and applicable regulations/ODPC requirements;
- Kenya Digital Health Act requirements where the product processes health information or participates in regulated digital-health workflows;
- applicable tax, financial, employment, consumer, electronic-transactions, and communications obligations based on the commercial model.

## 3. Regulatory boundary matrix

| Area | Engineering implication | Release requirement |
|---|---|---|
| Good pharmacy/storage/distribution practice | storage conditions, FEFO, traceability, stock controls | jurisdiction review |
| Controlled medicines | restricted permissions, evidence, secure storage, retention, loss/theft/disposal workflows | explicit scope + regulatory review |
| Pharmaceutical waste | quarantine, segregation, approvals, disposal evidence | approved SOP + review |
| Recalls/withdrawals | batch traceability and affected-stock reporting | tested recall workflow |
| Digital pharmacy | identity, authorization, prescription/telepharmacy boundaries | formal applicability review |
| Data protection | minimization, access control, retention, rights, incident response | privacy/legal review |
| Health data | sensitive-data handling and confidentiality | security/privacy review |

## 4. Data protection principles

The platform should implement:

- data minimization;
- purpose limitation;
- appropriate lawful basis/consent handling where required;
- role-based and scope-based access;
- secure processing and transmission;
- retention schedules;
- controlled export and data-subject request processes;
- breach/incident workflows;
- processor/subprocessor accountability;
- auditable administrative access.

Health information is treated as sensitive from the design stage rather than retrofitted later.

## 5. Controlled medicines

If controlled medicines are enabled, the release must have a dedicated compliance review. The design should support secure storage controls, restricted roles, detailed stock/dispensing records, required retention, returns, reporting, loss/theft/diversion investigation, and compliant disposal.

The exact retention period and reporting obligations must be configurable or explicitly documented from the current applicable PPB/legal requirements rather than hard-coded from assumptions.

## 6. Waste, quarantine, and disposal

Waste workflows must preserve traceability from the originating batch/stock record through quarantine, approval, transfer/consignment where applicable, and proof of disposal/destruction.

Expired, damaged, recalled, or otherwise blocked stock must not accidentally return to available inventory.

## 7. Recalls and traceability

A recall capability must identify affected products/batches, locations, current status, and relevant transactions. GS1 identifiers should be supported where used by the supply chain.

The system must distinguish a recall campaign from a generic stock adjustment. A recall is a traceability and risk-control workflow.

## 8. Retention

Retention is a policy decision, not a single global database setting. Each record class should have an owner, legal/regulatory basis, minimum retention requirement, deletion/archive rule, and exception process.

Where a regulation requires retention, the platform must prevent ordinary users from deleting the record before the applicable retention period expires.

## 9. Compliance change management

Regulatory guidance can change. Before a production release that depends on a regulated workflow:

1. identify the applicable jurisdiction and authority;
2. confirm the current requirement from authoritative material;
3. record the interpretation and effective date;
4. update affected product rules and SOPs;
5. update tests and documentation;
6. obtain required legal/regulatory sign-off.

## 10. Evidence package

A production release should be able to produce evidence for key controls, including authorization tests, audit records, inventory traceability, recall reports, disposal evidence, backup/restore tests, security tests, and relevant policies/SOPs.
