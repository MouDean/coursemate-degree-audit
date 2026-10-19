# Validation record

Public edition prepared on 19 October 2026.

- Locked dependency installation and Vite production build completed locally.
- Four targeted Node tests passed for this project (`pnpm test`).
- Public source reviewed against original student identifiers/passwords and credential patterns; real student records were replaced with fictional examples.
- Office documents, PDFs, media evidence, local exports, dependencies, build output and old repository history are excluded from publication.

The build emits a large-bundle warning. This does not prevent building, but further splitting/optimization would help constrained devices. Dependency versions follow the supplied project; a current dependency/security review remains necessary before production adoption.

This record covers automated source-level tests and the build. It does not claim browser end-to-end coverage, validate academic rules or predictive models, or certify institutional readiness. GitHub workflow results are available in the repository's Actions tab once publication is complete.

The original pnpm lockfile did not match package.json; it was refreshed in the public copy and the resulting build passed. The current GPA helper uses an unweighted arithmetic mean, rather than a credit-weighted institutional calculation.
