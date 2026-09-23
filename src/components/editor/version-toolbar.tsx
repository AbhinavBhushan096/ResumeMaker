"use client";

import {
  Copy,
  Download,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
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
import type { ResumeVersion } from "@/lib/types";

type VersionToolbarProps = {
  versions: ResumeVersion[];
  activeVersionId: string;
  onSelect: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onCreate: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onPrint: () => void;
  onResetSamples: () => void;
};

export function VersionToolbar({
  versions,
  activeVersionId,
  onSelect,
  onRename,
  onCreate,
  onDuplicate,
  onDelete,
  onPrint,
  onResetSamples,
}: VersionToolbarProps) {
  const active = versions.find((v) => v.id === activeVersionId);

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          Resume Maker
        </span>
        <Select
          value={activeVersionId}
          onValueChange={(value) => {
            if (value) onSelect(value);
          }}
        >
          <SelectTrigger className="h-8 w-[min(100%,14rem)]" size="sm">
            <SelectValue placeholder="Select version" />
          </SelectTrigger>
          <SelectContent>
            {versions.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {active ? (
          <Input
            className="h-8 w-[min(100%,12rem)]"
            value={active.name}
            onChange={(e) => onRename(active.id, e.target.value)}
            aria-label="Version name"
          />
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button type="button" size="sm" variant="outline" onClick={onCreate}>
          <Plus className="size-3.5" />
          New
        </Button>
        <Button type="button" size="sm" onClick={onPrint}>
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
              onClick={() => active && onDuplicate(active.id)}
              disabled={!active}
            >
              <Copy className="size-3.5" />
              Duplicate version
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => active && onDelete(active.id)}
              disabled={!active || versions.length <= 1}
              variant="destructive"
            >
              <Trash2 className="size-3.5" />
              Delete version
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onResetSamples}>
              Restore sample resumes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
