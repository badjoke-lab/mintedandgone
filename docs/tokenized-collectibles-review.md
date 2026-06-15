# Tokenized Collectibles Review

Use this guide before merging category data or monitoring reports.

## Data review

Confirm that the service has a marketplace function, all marketplace JSON files were checked for duplicates, unresolved facts remain unknown, and the review date is current.

Confirm that each entity has at least one event, at least three evidence records, first-party marketplace evidence, and archive coverage.

Claims about physical backing, custody, redemption, randomized sales, and platform buyback must have evidence with matching claim scopes.

## Candidate review

Every candidate must have a recorded disposition: promoted, hold, duplicate, or out of scope. Promoted candidates must point to their canonical marketplace IDs. Hold decisions must explain what evidence remains missing.

## Monitoring review

Monitoring pull requests must contain monitoring files only. Review critical and high findings first. Access restrictions, one temporary failure, or one redirect must not be used alone to change canonical status.

Any justified marketplace, event, or evidence correction must use a separate reviewed pull request.

## Publication review

Confirm category-page discovery, encyclopedia filtering, detail-page fields, methodology wording, sitemap generation, and desktop and mobile builds.

## Final commands

```text
npm run validate:tokenized
npm run test:monitoring:tokenized-url
npm run monitor:tokenized
npm run monitor:tokenized:smoke
npm run check
```
