# Tokenized Collectibles Monitoring

Status: operational specification

## Scope

The monitoring system covers only the `tokenized_collectibles` category and its linked events and evidence.

It checks:

- canonical JSON readability
- duplicate IDs and slugs
- broken cross-file references
- event `source_count` consistency
- evidence depth and archive coverage
- claim-specific evidence
- stale `last_verified_at` values
- unresolved research candidates
- official marketplace URLs
- evidence URLs
- redirects, access restrictions, timeouts, and network failures

## Schedule

The workflow runs:

- every Monday at 03:00 UTC
- on manual `workflow_dispatch`

Workflow file:

```text
.github/workflows/tokenized-collectibles-monitoring.yml
```

## Output

Monitoring writes only when findings exist:

```text
data-staging/monitoring/tokenized-collectibles/YYYY-MM-DD/report.json
data-staging/monitoring/tokenized-collectibles/YYYY-MM-DD/summary.md
data-staging/monitoring/tokenized-collectibles/YYYY-MM-DD/url-checks.json
data-staging/monitoring/tokenized-collectibles/latest/report.json
data-staging/monitoring/tokenized-collectibles/latest/summary.md
data-staging/monitoring/tokenized-collectibles/latest/url-checks.json
data-staging/monitoring/tokenized-collectibles/state/url-state.json
```

The weekly workflow restores consecutive-failure state through the GitHub Actions cache.

## Finding severity

### Critical

- duplicate canonical IDs or slugs
- missing marketplace references
- missing event references
- evidence linked to the wrong marketplace
- canonical mutation by monitoring

### High

- missing official URL
- unsupported backing, custody, redemption, randomized-sale, or buyback claims
- official URL returns 404 or 410
- repeated transient URL failure reaches three consecutive runs
- candidate-state file cannot be parsed

### Medium

- `source_count` mismatch
- missing archive coverage
- stale verification date
- evidence URL returns 404 or 410
- two consecutive transient URL failures
- candidate without a recorded decision

### Low

- one transient URL failure
- cross-domain redirect
- unresolved `unknown` or `unclear` field
- long-held research candidate

## HTTP classification

```text
200–399                 ok
401 / 403 / 429         reachable_restricted
404 / 410               not_found
500–599                 server_error
request timeout         timeout
network/DNS/TLS failure network_error
cross-domain redirect   cross_domain_redirect
other response          unexpected_status
```

A single timeout or 5xx response must never change canonical status.

## Consecutive failure rules

```text
first transient failure   low
second consecutive failure medium
third consecutive failure high
```

A successful or access-restricted response resets the consecutive transient failure counter.

## Pull request behavior

The workflow creates or updates a pull request only when monitoring output changed.

Fixed branch:

```text
auto/tokenized-collectibles-monitoring
```

The automated pull request may include only:

```text
data-staging/monitoring/tokenized-collectibles/**
```

The automated pull request is a report, not a canonical data update.

## Review procedure

For every monitoring pull request:

1. read `latest/summary.md`
2. inspect critical and high findings first
3. verify whether a URL problem is temporary, restricted, redirected, or genuinely unavailable
4. review source pages manually before changing any claim
5. close the monitoring PR if no canonical action is needed
6. create a separate branch and PR for any justified canonical correction
7. never merge an unreviewed status or custody claim

## False-positive handling

Common false positives include:

- bot protection returning 403
- rate limiting returning 429
- region-dependent pages
- temporary documentation outages
- redirectors or authentication walls
- archive pages that block automated requests

These must remain monitoring findings until manually reviewed.

## First-run note

The workflow definition and its offline components are covered by CI. The first full live scheduled or manually dispatched run remains an operational observation point because external services can respond differently from CI fixtures.
