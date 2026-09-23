"use client";

import { useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ResumeHeader } from "@/lib/types";

type HeaderEditorProps = {
  header: ResumeHeader;
  onPatch: (patch: Partial<ResumeHeader>) => void;
  onAddLink: () => void;
  onUpdateLink: (
    linkId: string,
    patch: Partial<{ label: string; url: string }>,
  ) => void;
  onRemoveLink: (linkId: string) => void;
};

export function HeaderEditor({
  header,
  onPatch,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
}: HeaderEditorProps) {
  const [open, setOpen] = useState(() => !header.name.trim());
  const summary = [header.name || "Your name", header.title]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 p-3">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Collapse header" : "Expand header"}
          title={open ? "Collapse header" : "Expand header"}
        >
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform",
              open ? "rotate-0" : "-rotate-90",
            )}
          />
        </Button>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="block text-sm font-semibold text-foreground">
            Header & contact
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {open ? "Name, title, and how recruiters reach you." : summary}
          </span>
        </button>
      </div>

      {open ? (
        <div className="space-y-4 px-4 pb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={header.name}
                onChange={(e) => onPatch({ name: e.target.value })}
                placeholder="Alex Morgan"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Professional title</Label>
              <Input
                id="title"
                value={header.title}
                onChange={(e) => onPatch({ title: e.target.value })}
                placeholder="Frontend Developer"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={header.phone}
                onChange={(e) => onPatch({ phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={header.email}
                onChange={(e) => onPatch({ email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={header.location}
                onChange={(e) => onPatch({ location: e.target.value })}
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label>Links</Label>
              <Button
                type="button"
                size="xs"
                variant="outline"
                onClick={onAddLink}
              >
                <Plus className="size-3" />
                Add link
              </Button>
            </div>
            {header.links.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                No links yet. Add LinkedIn, GitHub, a portfolio, or anything
                else.
              </p>
            ) : (
              <ul className="space-y-2">
                {header.links.map((link) => (
                  <li
                    key={link.id}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-[7rem_minmax(0,1fr)_auto]"
                  >
                    <Input
                      value={link.label}
                      onChange={(e) =>
                        onUpdateLink(link.id, { label: e.target.value })
                      }
                      placeholder="Label"
                      aria-label="Link label"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) =>
                        onUpdateLink(link.id, { url: e.target.value })
                      }
                      placeholder="https://"
                      aria-label="Link URL"
                    />
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onRemoveLink(link.id)}
                      aria-label="Remove link"
                      title="Remove link"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
