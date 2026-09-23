"use client";

import { useState, useRef } from "react";
import {
  Check,
  Copy,
  Download,
  FileDown,
  FileUp,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ConfirmDialog } from "@/components/editor/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  downloadVersionJson,
  parseImportedVersion,
} from "@/lib/storage";
import type { ResumeVersion } from "@/lib/types";

type VersionToolbarProps = {
  versions: ResumeVersion[];
  activeVersionId: string;
  updatedAt: number;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPrint: () => void;
  onResetSamples: () => void;
  onImport: (version: ResumeVersion) => void;
};

type PendingConfirm = "delete" | "reset" | null;

export function VersionToolbar({
  versions,
  activeVersionId,
  updatedAt,
  onSelect,
  onRename,
  onCreate,
  onDuplicate,
  onDelete,
  onPrint,
  onResetSamples,
  onImport,
}: VersionToolbarProps) {
  const active = versions.find((v) => v.id === activeVersionId);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingConfirm>(null);

  return (
    <div className="no-print border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 sm:px-4">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Resume Maker
        </span>
        <div className="flex items-center gap-1.5">
          <Button type="button" size="sm" variant="outline" onClick={onCreate}>
            <Plus className="size-3.5" />
            New
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onPrint}
            title="Opens the print dialog so you can save a PDF"
          >
            <Download className="size-3.5" />
            Download PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button type="button" size="icon-sm" variant="ghost" />}
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">More actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => active && downloadVersionJson(active)}
                disabled={!active}
              >
                <FileDown className="size-3.5" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.setTimeout(() => importInputRef.current?.click(), 0);
                }}
              >
                <FileUp className="size-3.5" />
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => active && onDuplicate(active.id)}
                disabled={!active}
              >
                <Copy className="size-3.5" />
                Duplicate version
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPending("delete")}
                disabled={!active || versions.length <= 1}
                variant="destructive"
              >
                <Trash2 className="size-3.5" />
                Delete version
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPending("reset")}>
                Restore sample resumes
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              void file.text().then((text) => {
                try {
                  const parsed = parseImportedVersion(JSON.parse(text));
                  if (!parsed) {
                    setImportError(
                      "That file isn’t a resume version. Export one from this app and try again.",
                    );
                    return;
                  }
                  setImportError(null);
                  onImport(parsed);
                } catch {
                  setImportError(
                    "That file isn’t a resume version. Export one from this app and try again.",
                  );
                }
              });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-end sm:px-4">
        <label className="grid min-w-0 flex-1 gap-1 sm:max-w-60">
          <span className="text-[11px] font-medium text-muted-foreground">
            Version
          </span>
          <Select
            value={activeVersionId}
            onValueChange={(value) => {
              if (value) onSelect(value);
            }}
            items={Object.fromEntries(versions.map((v) => [v.id, v.name]))}
          >
            <SelectTrigger className="h-8 w-full" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        {active ? (
          <label className="grid min-w-0 flex-1 gap-1 sm:max-w-60">
            <span className="text-[11px] font-medium text-muted-foreground">
              Rename
            </span>
            <span className="relative">
              <Pencil className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-8 w-full pl-7"
                value={active.name}
                onChange={(e) => onRename(active.id, e.target.value)}
                aria-label="Rename this version"
              />
            </span>
          </label>
        ) : null}
        <span className="hidden items-center gap-1 pb-1.5 text-xs text-muted-foreground sm:inline-flex">
          <Check className="size-3.5 text-emerald-600" />
          {savedLabel(updatedAt)}
        </span>
      </div>
      {importError ? (
        <div className="flex items-start justify-between gap-3 border-t border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive sm:px-4">
          <p role="alert">{importError}</p>
          <button
            type="button"
            className="shrink-0 font-medium underline underline-offset-2"
            onClick={() => setImportError(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <ConfirmDialog
        open={pending === "delete"}
        title={`Delete “${active?.name || "this version"}”?`}
        description="This resume is removed from this browser. Export JSON first if you want a copy."
        confirmLabel="Delete version"
        onConfirm={() => {
          if (active) onDelete(active.id);
        }}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      />
      <ConfirmDialog
        open={pending === "reset"}
        title="Restore sample resumes?"
        description="This replaces every resume stored in this browser with the sample set."
        confirmLabel="Restore samples"
        onConfirm={onResetSamples}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      />
    </div>
  );
}

function savedLabel(updatedAt: number): string {
  if (!updatedAt) return "Saved on this device";
  const seconds = Math.max(0, Math.round((Date.now() - updatedAt) / 1000));
  if (seconds < 8) return "Saved";
  if (seconds < 60) return "Saved just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `Saved ${minutes}m ago`;
  return "Saved on this device";
}
