"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/editor/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  ResumeSection,
  SectionEntry,
  SectionLayout,
} from "@/lib/types";

type SectionEditorProps = {
  section: ResumeSection;
  index: number;
  total: number;
  open: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<ResumeSection>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
  onAddEntry: () => void;
  onUpdateEntry: (entryId: string, patch: Partial<SectionEntry>) => void;
  onRemoveEntry: (entryId: string) => void;
  onAddBullet: (entryId: string) => void;
  onUpdateBullet: (
    entryId: string,
    bulletIndex: number,
    value: string,
  ) => void;
  onRemoveBullet: (entryId: string, bulletIndex: number) => void;
};

const LAYOUT_LABELS: Record<SectionLayout, string> = {
  entries: "Entries (jobs, projects…)",
  text: "Paragraph text",
  tags: "Tags / skills list",
};

export function SectionEditor({
  section,
  index,
  total,
  open,
  onToggle,
  onUpdate,
  onRemove,
  onMove,
  onAddEntry,
  onUpdateEntry,
  onRemoveEntry,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet,
}: SectionEditorProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const title = section.title || "Untitled section";

  const requestRemove = () => {
    if (sectionHasContent(section)) {
      setConfirmDelete(true);
      return;
    }
    onRemove();
  };

  return (
    <div
      id={`section-card-${section.id}`}
      className={cn(
        "rounded-xl border bg-card",
        section.visible ? "border-border" : "border-dashed border-border",
      )}
    >
      <div className="flex items-start gap-1 p-2">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          title={open ? "Collapse section" : "Expand section"}
        >
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
        </Button>

        <div className="min-w-0 flex-1 pt-0.5">
          {open ? (
            <Input
              id={`section-title-${section.id}`}
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Experience"
              aria-label="Section title"
            />
          ) : (
            <button
              type="button"
              className="w-full py-1 text-left"
              onClick={onToggle}
            >
              <span className="block truncate text-sm font-medium text-foreground">
                {title}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {sectionMeta(section)}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move section up"
            title="Move up"
          >
            <ChevronUp className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(1)}
            disabled={index >= total - 1}
            aria-label="Move section down"
            title="Move down"
          >
            <ChevronDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onUpdate({ visible: !section.visible })}
            aria-label={section.visible ? "Hide from preview" : "Show in preview"}
            title={section.visible ? "Hide from preview" : "Show in preview"}
          >
            {section.visible ? (
              <Eye className="size-3.5" />
            ) : (
              <EyeOff className="size-3.5 text-muted-foreground" />
            )}
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={requestRemove}
            aria-label="Delete section"
            title="Delete section"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {open ? (
        <div className="space-y-3 px-3 pb-3">
          <div className="space-y-1.5">
            <Label>Layout</Label>
            <Select
              value={section.layout}
              onValueChange={(value) => {
                if (
                  value === "entries" ||
                  value === "text" ||
                  value === "tags"
                ) {
                  onUpdate({ layout: value });
                }
              }}
              items={LAYOUT_LABELS}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LAYOUT_LABELS) as SectionLayout[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {LAYOUT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!section.visible ? (
            <p className="rounded-md bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
              Hidden from the preview and the PDF. Use the eye icon to show it
              again.
            </p>
          ) : null}

          {section.layout === "text" || section.layout === "tags" ? (
            <div className="space-y-1.5">
              <Label htmlFor={`section-text-${section.id}`}>
                {section.layout === "tags"
                  ? "Skills (comma-separated)"
                  : "Content"}
              </Label>
              <Textarea
                id={`section-text-${section.id}`}
                value={section.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                rows={section.layout === "tags" ? 3 : 4}
                placeholder={
                  section.layout === "tags"
                    ? "React, TypeScript, Node.js…"
                    : "Write a short professional summary…"
                }
              />
            </div>
          ) : (
            <div className="space-y-3">
              {section.entries.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                  No entries in this section yet.
                </p>
              ) : (
                section.entries.map((entry, entryIndex) => (
                  <EntryEditor
                    key={entry.id}
                    entry={entry}
                    index={entryIndex}
                    onUpdate={(patch) => onUpdateEntry(entry.id, patch)}
                    onRemove={() => onRemoveEntry(entry.id)}
                    onAddBullet={() => onAddBullet(entry.id)}
                    onUpdateBullet={(i, value) =>
                      onUpdateBullet(entry.id, i, value)
                    }
                    onRemoveBullet={(i) => onRemoveBullet(entry.id, i)}
                  />
                ))
              )}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onAddEntry}
              >
                <Plus className="size-3.5" />
                Add entry
              </Button>
            </div>
          )}
        </div>
      ) : null}

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete “${title}”?`}
        description="This section and everything in it will be removed from the resume."
        confirmLabel="Delete section"
        onConfirm={onRemove}
        onOpenChange={setConfirmDelete}
      />
    </div>
  );
}

function sectionMeta(section: ResumeSection): string {
  const layout =
    section.layout === "text"
      ? "Paragraph"
      : section.layout === "tags"
        ? "Skills"
        : section.entries.length === 1
          ? "1 entry"
          : `${section.entries.length} entries`;
  return section.visible ? layout : `${layout} · Hidden`;
}

function sectionHasContent(section: ResumeSection): boolean {
  if (section.text.trim()) return true;
  return section.entries.some(
    (entry) =>
      entry.title.trim() ||
      entry.subtitle.trim() ||
      entry.dateRange.trim() ||
      entry.location.trim() ||
      entry.description.trim() ||
      entry.bullets.some((bullet) => bullet.trim()),
  );
}

type EntryEditorProps = {
  entry: SectionEntry;
  index: number;
  onUpdate: (patch: Partial<SectionEntry>) => void;
  onRemove: () => void;
  onAddBullet: () => void;
  onUpdateBullet: (bulletIndex: number, value: string) => void;
  onRemoveBullet: (bulletIndex: number) => void;
};

function EntryEditor({
  entry,
  index,
  onUpdate,
  onRemove,
  onAddBullet,
  onUpdateBullet,
  onRemoveBullet,
}: EntryEditorProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border/80 bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          {entry.title.trim() || `Entry ${index + 1}`}
        </p>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={onRemove}
          aria-label="Remove entry"
          title="Remove entry"
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Role / project">
          <Input
            value={entry.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Senior Frontend Engineer"
            aria-label="Entry title"
          />
        </Field>
        <Field label="Company / school">
          <Input
            value={entry.subtitle}
            onChange={(e) => onUpdate({ subtitle: e.target.value })}
            placeholder="Northstar Labs"
            aria-label="Entry subtitle"
          />
        </Field>
        <Field label="Dates">
          <Input
            value={entry.dateRange}
            onChange={(e) => onUpdate({ dateRange: e.target.value })}
            placeholder="2022 — Present"
            aria-label="Date range"
          />
        </Field>
        <Field label="Location">
          <Input
            value={entry.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            placeholder="Austin, TX"
            aria-label="Location"
          />
        </Field>
      </div>
      <Field label="Description">
        <Textarea
          value={entry.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          placeholder="Optional short description"
          aria-label="Entry description"
        />
      </Field>
      <div className="space-y-1.5">
        <Label className="text-xs">Bullets</Label>
        {entry.bullets.map((bullet, i) => (
          <div key={`${entry.id}-bullet-${i}`} className="flex items-start gap-1.5">
            <Textarea
              value={bullet}
              onChange={(e) => onUpdateBullet(i, e.target.value)}
              rows={1}
              className="min-h-8 py-1.5"
              placeholder="Achievement or responsibility"
              aria-label={`Bullet ${i + 1}`}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => onRemoveBullet(i)}
              aria-label="Remove bullet"
              title="Remove bullet"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <Button type="button" size="xs" variant="ghost" onClick={onAddBullet}>
          <Plus className="size-3" />
          Add bullet
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
