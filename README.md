# Resume Maker

Personal resume builder with a live A4 preview. You control section titles, layouts, and content — not locked to a fixed template.

## Features

- **Custom sections** — add, remove, rename, hide, and reorder any section (summary, skills, experience, projects, certifications, or your own)
- **Live A4 preview** — editor on one side, printable resume on the other
- **Multiple versions** — save and switch resumes (e.g. Frontend, Cloud/DevOps, General); persisted in `localStorage`
- **Header & links** — name, title, phone, email, location, plus add/remove reference links
- **PDF export** — Download PDF opens the browser print dialog (Save as PDF) with an A4 print stylesheet matching the preview

No account or database — everything stays in your browser.

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui

## Run locally

```bash
npm install
npm run dev -- --port 43127
```

Open [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Notes

- Sample resumes load on first visit so the preview is never empty.
- Use **Restore sample resumes** in the toolbar menu to reset local data.
- Prefer a single-column layout and clear headings for ATS-friendly PDFs.
