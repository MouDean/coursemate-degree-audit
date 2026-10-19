# CourseMate — Degree Audit & Study Planner

A thesis research prototype for exploring student study plans, academic progress, and advisor registration workflows.

Created by [Mousa Alhatti / codebea](https://github.com/codebea) during thesis work. This public edition preserves the application source while replacing private records and embedded access details with fictional demo data. It is an independent portfolio/research project, without university endorsement.

## Features

- Student portal with course status, grades and progress summaries.
- Interactive study roadmap and course recommendation views.
- Excel transcript import and JSON/PDF export.
- Advisor portal for local registration requests and responses.
- Light/dark themes and local browser persistence.

## Run locally

Use Node.js 22 and pnpm 10.4.1 (the package manager recorded by the project).

```sh
git clone https://github.com/codebea/coursemate-degree-audit.git
cd coursemate-degree-audit
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

Open the local address printed by Vite. No backend or environment secrets are required for this demo.

```sh
pnpm test
pnpm build
pnpm preview
```

Serve the built `dist/` folder from a local/static server. Service-worker and asset paths assume hosting at the site root; deployment under a subdirectory needs path configuration. Source publication does not deploy a live site.

## Explore the demo

All bundled accounts and academic records are fictional:

| Role | Username / ID | Demo password |
|---|---|---|
| Student, example plan 1 | `DEMO001` | `demo-student` |
| Student, example plan 2 | `DEMO002` | `demo-student` |
| Demo administrator | `admin` | `demo-admin` |
| Advisor | `demo-advisor` | `demo-advisor` |

Registration requests stay in the same browser. The public demo does not launch email or send records. Use the advisor mode in that browser to review requests.

These accounts are client-side demonstration controls, not secure authentication. Example curricula, grades, prerequisite rules and GPA calculations must be reviewed for each institution; this is not an official degree audit or registration service.

## Architecture

React, Vite, Tailwind CSS, Radix UI, Lucide, SheetJS/XLSX and jsPDF form the core stack. Browser storage holds local application state; there is no shared database or institutional identity integration.

- `src/data/studentDatabase.js`: fictional students and illustrative curricula.
- `src/data/studyPlan.js`: study-plan presentation data.
- `src/services/`: local student and registration-request persistence.
- `src/components/`: student/advisor portals, importers and roadmap.
- `src/utils/`: grade calculations and PDF export.

## Data and research limits

Use fictional records when evaluating this public edition. Browser storage and local exports can be read by someone with access to that browser profile or device. Backups and exported files need their own handling controls. No thesis participant records, attendance, transcripts, media evidence, password documents, feedback files or earlier repository history are included.

Moving to institutional use requires a separately designed backend, server-side authentication and authorization, secure storage, retention controls, accessibility review, and verification of academic rules. Analytics are exploratory and do not establish research validity or decision-making accuracy.

## Validation

The repository includes targeted Node tests for core utilities and fictional seed records. GitHub Actions runs those checks and a production build. These are smoke/regression checks, not a complete end-to-end or security certification. See [VALIDATION.md](VALIDATION.md) for the checks actually completed.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md). Use synthetic fixtures only and describe how a proposed change was checked. Report sensitive issues without posting real records; see [SECURITY.md](SECURITY.md).

## License

This public edition is released under the [MIT License](LICENSE). Third-party packages and assets retain their respective licenses.
