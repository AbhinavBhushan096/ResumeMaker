"use client";

import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from "lucide-react";
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
import type {
  ResumeSection,
  SectionEntry,
  SectionLayout,
} from "@/lib/types";

type SectionEditorProps = {
  section: ResumeSection;
  index: number;
  total: number;
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
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Label htmlFor={`section-title-${section.id}`}>Section title</Label>
          <Input
            id={`section-title-${section.id}`}
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Experience"
          />
        </div>
        <div className="flex items-center gap-1 pt-6">
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move section up"
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
          >
            <ChevronDown className="size-3.5" />
          </Button>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={() => onUpdate({ visible: !section.visible })}
            aria-label={section.visible ? "Hide section" : "Show section"}
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
            onClick={onRemove}
            aria-label="Delete section"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Layout</Label>
        <Select
          value={section.layout}
          onValueChange={(value) => {
            if (value === "entries" || value === "text" || value === "tags") {
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
          Hidden from preview — click the eye icon to show again.
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
          Entry {index + 1}
        </p>
        <Button
          type="button"
          size="icon-xs"
          variant="ghost"
          onClick={onRemove}
          aria-label="Remove entry"
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={entry.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Role / degree / project"
          aria-label="Entry title"
        />
        <Input
          value={entry.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Company / school"
          aria-label="Entry subtitle"
        />
        <Input
          value={entry.dateRange}
          onChange={(e) => onUpdate({ dateRange: e.target.value })}
          placeholder="2022 — Present"
          aria-label="Date range"
        />
        <Input
          value={entry.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          placeholder="Location"
          aria-label="Location"
        />
      </div>
      <Textarea
        value={entry.description}
        onChange={(e) => onUpdate({ description: e.target.value })}
        rows={2}
        placeholder="Optional short description"
        aria-label="Entry description"
      />
      <div className="space-y-1.5">
        <Label className="text-xs">Bullets</Label>
        {entry.bullets.map((bullet, i) => (
          <div key={`${entry.id}-bullet-${i}`} className="flex gap-1.5">
            <Input
              value={bullet}
              onChange={(e) => onUpdateBullet(i, e.target.value)}
              placeholder="Achievement or responsibility"
              aria-label={`Bullet ${i + 1}`}
            />
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => onRemoveBullet(i)}
              aria-label="Remove bullet"
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
