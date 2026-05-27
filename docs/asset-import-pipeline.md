# Asset import pipeline

This repository uses a manifest-driven asset import pipeline for generated image batches.

## How it works

- Generated images are collected into `input-assets/`.
- Expected filenames and destinations are controlled by `assets-manifest.json`.
- Run `npm run import:assets` to copy assets into their output locations and apply wire replacements in page/source files.
- This PR intentionally keeps binary assets out of version control.
- Future batches should be imported in grouped runs, not one-by-one through manual renaming.
