# Resume Maker

A personal resume builder with a live A4 preview. Edit on one side, see the printable page update on the other. Sections are fully yours — titles, layouts, and content are not locked to a fixed template.

Everything stays in your browser (`localStorage`). No account or server required.

## Features

- **Custom sections** — add, remove, rename, hide, and reorder any section (summary, skills, experience, projects, certifications, or your own)
- **Flexible layouts** — paragraph text, comma-separated skills/tags, or entry lists with bullets
- **Live A4 preview** — Fit or 100% zoom; print stylesheet matches what you see
- **Multiple versions** — keep separate resumes (e.g. Frontend, Cloud/DevOps, General) and switch between them
- **Header & links** — name, title, phone, email, location, plus LinkedIn / GitHub / portfolio links
- **Import / export JSON** — back up a version or move it between browsers
- **PDF export** — **Download PDF** opens the browser print dialog (Save as PDF)
- **Mobile-friendly** — Edit / Preview toggle on small screens; collapsible sections keep the editor usable

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS
- [shadcn/ui](https://ui.shadcn.com/)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:43127](http://localhost:43127) (the dev script uses port `43127`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 43127 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 43127 |
| `npm run lint` | Run ESLint |

## Usage tips

- Sample resumes load on first visit so the preview is never empty.
- Use **Restore sample resumes** in the toolbar menu (⋯) to reset local data.
- Prefer a single-column layout and clear headings for ATS-friendly PDFs.
- Export JSON before restoring samples or clearing site data if you care about a version.

## Deploy on Render

This repo includes a [`render.yaml`](render.yaml) Blueprint.

1. Push to GitHub (already at [AbhinavBhushan096/ResumeMaker](https://github.com/AbhinavBhushan096/ResumeMaker)).
2. Open [Render → New → Blueprint](https://dashboard.render.com/blueprints) and connect that repo, **or** use:

   [Deploy with Render](https://dashboard.render.com/blueprint/new?repo=https://github.com/AbhinavBhushan096/ResumeMaker)

3. Apply the Blueprint. Render will build with `npm ci && npm run build` and start with `npm run start` (listens on `$PORT`).

Free web services spin down after idle time; the first request after that can take a few seconds.

## License

Private / personal use unless you add a license file.
