"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { HeaderEditor } from "@/components/editor/header-editor";
import { SectionEditor } from "@/components/editor/section-editor";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { useResumeStore } from "@/hooks/use-resume-store";
import type { ResumeVersion, SectionLayout } from "@/lib/types";

type StoreApi = ReturnType<typeof useResumeStore>;

type ResumeEditorPanelProps = {
  resume: ResumeVersion;
  store: StoreApi;
};

const SECTION_PRESETS: { title: string; layout: SectionLayout }[] = [
  { title: "Professional Summary", layout: "text" },
  { title: "Technical Skills", layout: "tags" },
  { title: "Experience", layout: "entries" },
  { title: "Projects", layout: "entries" },
  { title: "Education", layout: "entries" },
  { title: "Certifications", layout: "entries" },
  { title: "Azure Projects", layout: "entries" },
  { title: "Achievements", layout: "entries" },
];

export function ResumeEditorPanel({ resume, store }: ResumeEditorPanelProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    resume.sections[0]?.id ?? null,
  );
  const skipScroll = useRef(true);

  useEffect(() => {
    setOpenSectionId((current) => {
      if (
        current &&
        resume.sections.some((section) => section.id === current)
      ) {
        return current;
      }
      return resume.sections[0]?.id ?? null;
    });
  }, [resume.id, resume.sections]);

  useEffect(() => {
    if (skipScroll.current) {
      skipScroll.current = false;
      return;
    }
    if (!openSectionId) return;
    document
      .getElementById(`section-card-${openSectionId}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [openSectionId]);

  const openAddedSection = (title: string, layout: SectionLayout) => {
    const id = store.addSection(title, layout);
    setOpenSectionId(id);
  };

  return (
    <div className="space-y-3 pb-8">
      <HeaderEditor
        key={resume.id}
        header={resume.header}
        onPatch={store.patchHeader}
        onAddLink={store.addLink}
        onUpdateLink={store.updateLink}
        onRemoveLink={store.removeLink}
      />

      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Sections</h2>
          <p className="text-xs text-muted-foreground">
            Open one at a time. Reorder, hide, or rename each.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" size="sm" variant="outline" />}
          >
            <Plus className="size-3.5" />
            Add section
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-52">
            {SECTION_PRESETS.map((preset) => (
              <DropdownMenuItem
                key={preset.title}
                onClick={() => openAddedSection(preset.title, preset.layout)}
              >
                {preset.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => openAddedSection("Custom Section", "entries")}
            >
              Custom section…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {resume.sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No sections yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add a summary, skills, experience, or any custom section.
          </p>
        </div>
      ) : (
        resume.sections.map((section, index) => (
          <SectionEditor
            key={section.id}
            section={section}
            index={index}
            total={resume.sections.length}
            open={openSectionId === section.id}
            onToggle={() =>
              setOpenSectionId((current) =>
                current === section.id ? null : section.id,
              )
            }
            onUpdate={(patch) => store.updateSection(section.id, patch)}
            onRemove={() => store.removeSection(section.id)}
            onMove={(dir) => store.moveSection(section.id, dir)}
            onAddEntry={() => store.addEntry(section.id)}
            onUpdateEntry={(entryId, patch) =>
              store.updateEntry(section.id, entryId, patch)
            }
            onRemoveEntry={(entryId) =>
              store.removeEntry(section.id, entryId)
            }
            onAddBullet={(entryId) => store.addBullet(section.id, entryId)}
            onUpdateBullet={(entryId, bulletIndex, value) =>
              store.updateBullet(section.id, entryId, bulletIndex, value)
            }
            onRemoveBullet={(entryId, bulletIndex) =>
              store.removeBullet(section.id, entryId, bulletIndex)
            }
          />
        ))
      )}
    </div>
  );
}
