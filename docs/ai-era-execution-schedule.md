# MAG AI-era Execution Schedule

Status: roadmap addendum

## Order
1. Continue current MAG implementation/data-quality work; do not reset existing phases.
2. Audit representative records for missing shutdown aftermath, acquisition/migration/successor, archives and last verification.
3. Extend lifecycle representation only where the current schema is insufficient.
4. Ship deterministic record-level JSON and validation.
5. Strengthen structured filters/search.
6. Implement/extend historical Compare.
7. Implement Stats for lifespan, closure/change causes, chain distribution, migration/successor outcomes and data quality.
8. Run reviewed lifecycle follow-up batches.
9. Evaluate natural-language-to-filter translation only after deterministic surfaces are stable.

## Gate
Spec -> implementation PR -> CI/validation green -> merge -> production verification where applicable -> docs/status sync.

## Mandatory continuation rule
Future MAG work must read this schedule, `ai-era-registry-spec.md`, and the relevant current v0/design/methodology/implementation documents before choosing work.