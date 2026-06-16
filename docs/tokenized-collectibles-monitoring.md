# Tokenized Collectibles Monitoring

Status: operational specification

## Scope

The monitoring system covers only the `tokenized_collectibles` category and its linked events and evidence.

It checks:

- canonical JSON readability
- duplicate IDs and slugs affecting the category
- broken category-linked cross-file references
- category event `source_count` consistency
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

Monitoring writes a report when notification findings exist. Forced local smoke runs may also write reports.

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

- duplicate category-affecting canonical IDs or slugs
- missing category marketplace references
- missing category event references
- category evidence linked to the wrong marketplace
- canonical mutation by monitoring

### High

- missing official URL
- unsupported backing, custody, redemption, randomized-sale, or buyback claims
- official URL returns 404 or 410
- repeated transient URL failure reaches three consecutive runs
- candidate-state file cannot be parsed

### Medium

- category `source_count` mismatch
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

## Notification policy

Not every low finding should create a weekly pull request.

The following low categories are backlog-only:

```text
unresolved_field
stale_hold_candidate
```

Backlog-only findings remain available in forced reports and internal results, but they do not create a monitoring pull request by themselves.

A monitoring pull request is created when at least one notification finding exists. Notification findings include:

- every critical, high, or medium finding
- low URL failures
- low cross-domain redirects
- other low findings not explicitly classified as backlog-only

This prevents known `unknown` or `unclear` fields from reopening the same monitoring pull request every week.

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

The workflow creates or updates a pull request only when monitoring output changed because a notification finding exists.

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

## Initial live observation

The first live CI observation completed on 2026-06-16. It checked 38 URL targets and completed without canonical changes. Thirty-six targets were reachable normally, one returned an access-restricted response, and one Collector Crypt evidence URL had a first-run network error.

The live run also revealed that the internal `source_count` monitor was scanning unrelated legacy events. The monitor was subsequently restricted to category-linked events and evidence, with regression coverage added.
