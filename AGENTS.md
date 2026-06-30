# Repository Working Instructions

These instructions apply to all development, maintenance, review, and automated work in this repository.

## Required reference

Before starting or resuming work:

1. Read this file.
2. Read the relevant sections of `README.md` and any task-specific document.
3. Follow this workflow unless an explicit issue or pull-request requirement overrides it.

Re-check this file before merging, publishing, or reporting completion.

## Separate development from publishing

Development and publishing are separate stages.

- Perform iterative work on a branch.
- Use local builds and GitHub Actions as the primary development and validation loop.
- Do not use a hosted deployment as the normal test runner.
- Do not wait for a hosted deployment before continuing work that does not depend on the live result.
- Treat publication as the final delivery stage for already validated changes.

## Branch and pull-request workflow

- Keep each pull request focused on one coherent change.
- Run the repository's documented validation commands before merge.
- Require the relevant GitHub Actions checks to pass before merging.
- Do not rerun successful checks without a code or configuration change, unless there is clear evidence of a transient failure.
- Do not create empty or no-op commits only to trigger another build or deployment.

## Preview use

Create or request a hosted preview only when browser-hosted review is materially necessary, such as:

- visual layout or responsive behavior
- routing and navigation
- redirects or response headers
- environment-dependent runtime behavior

For data, documentation, validation, generated-output, and internal refactoring changes, prefer local output and CI artifacts unless a hosted preview is explicitly required.

## Production publication

- Production publication must originate from the approved `main` branch state.
- Merge only after the required checks pass.
- After merge, perform one targeted production verification covering the affected surface.
- The minimum verification set for registry-wide changes is:
  - `/version.json`
  - `/data/manifest.json`
  - the home page
  - one representative affected page or endpoint
- If verification reveals a defect, fix it through a new reviewed change rather than repeated manual publication attempts.

## Work while publication is pending

A pending publication does not pause development.

- Continue the next independent branch, review, research, or validation task.
- Pause only work whose correctness directly depends on the new live output.
- Avoid repeatedly checking the same pending state when no new signal is available.

## Completion reporting

Always report these states separately:

1. **Code status** — branch, pull request, merge state, and commit.
2. **Validation status** — local checks and GitHub Actions results.
3. **Publication status** — pending, completed, failed, or not applicable.
4. **Live verification status** — verified, failed, or not independently checked.

Never describe a change as live-verified until the production URL has been fetched and the relevant output has been checked.

## Documentation boundary

Repository documentation should describe reproducible project behavior and workflow only. Do not include private account details, service-plan details, credentials, private operational constraints, or other non-project-specific internal information.
