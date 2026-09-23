"use client";

import type { ResumeVersion } from "@/lib/types";

function cleanUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

type ResumePreviewProps = {
  resume: ResumeVersion;
};

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { header, sections } = resume;
  const visibleSections = sections.filter((s) => s.visible);
  const contactBits = [header.phone, header.email, header.location].filter(
    Boolean,
  );
  const links = header.links.filter((l) => l.label || l.url);

  return (
    <article
      id="resume-print-root"
      className="resume-page bg-white text-neutral-900 shadow-md"
      aria-label="Resume preview"
    >
      <header className="resume-header border-b border-neutral-800 pb-3">
        <h1 className="resume-name text-[22pt] font-semibold leading-tight tracking-tight">
          {header.name || "Your Name"}
        </h1>
        {header.title ? (
          <p className="resume-title mt-0.5 text-[11pt] font-medium text-neutral-700">
            {header.title}
          </p>
        ) : null}
        {contactBits.length > 0 ? (
          <p className="resume-contact mt-2 text-[9pt] leading-relaxed text-neutral-700">
            {contactBits.join("  ·  ")}
          </p>
        ) : null}
        {links.length > 0 ? (
          <p className="resume-links mt-1 text-[9pt] leading-relaxed text-neutral-700">
            {links
              .map((link) =>
                [link.label, cleanUrl(link.url)].filter(Boolean).join(": "),
              )
              .join("  ·  ")}
          </p>
        ) : null}
      </header>

      {visibleSections.length === 0 ? (
        <p className="mt-8 text-center text-[10pt] text-neutral-500">
          No visible sections yet. Add a section in the editor or unhide one.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {visibleSections.map((section) => (
            <section key={section.id} className="resume-section">
              <h2 className="resume-section-title border-b border-neutral-400 pb-0.5 text-[11pt] font-bold uppercase tracking-[0.06em] text-neutral-900">
                {section.title || "Untitled section"}
              </h2>

              {section.layout === "text" ? (
                <p className="mt-2 text-[10pt] leading-snug text-neutral-800 whitespace-pre-wrap">
                  {section.text || (
                    <span className="text-neutral-400 italic">
                      Add summary text in the editor…
                    </span>
                  )}
                </p>
              ) : null}

              {section.layout === "tags" ? (
                <p className="mt-2 text-[10pt] leading-snug text-neutral-800">
                  {section.text
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .join(" · ") || (
                    <span className="text-neutral-400 italic">
                      Add skills separated by commas…
                    </span>
                  )}
                </p>
              ) : null}

              {section.layout === "entries" ? (
                <div className="mt-2 space-y-3">
                  {section.entries.length === 0 ? (
                    <p className="text-[10pt] italic text-neutral-400">
                      No entries yet.
                    </p>
                  ) : (
                    section.entries.map((entry) => (
                      <div key={entry.id} className="resume-entry">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                          <h3 className="text-[10.5pt] font-semibold text-neutral-900">
                            {entry.title || "Untitled"}
                            {entry.subtitle ? (
                              <span className="font-normal text-neutral-700">
                                {" "}
                                — {entry.subtitle}
                              </span>
                            ) : null}
                          </h3>
                          {(entry.dateRange || entry.location) && (
                            <p className="shrink-0 text-[9pt] text-neutral-600">
                              {[entry.dateRange, entry.location]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          )}
                        </div>
                        {entry.description ? (
                          <p className="mt-1 text-[10pt] leading-snug text-neutral-800 whitespace-pre-wrap">
                            {entry.description}
                          </p>
                        ) : null}
                        {entry.bullets.filter((b) => b.trim()).length > 0 ? (
                          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[10pt] leading-snug text-neutral-800">
                            {entry.bullets
                              .filter((b) => b.trim())
                              .map((bullet, i) => (
                                <li key={`${entry.id}-b-${i}`}>{bullet}</li>
                              ))}
                          </ul>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </article>
  );
}
