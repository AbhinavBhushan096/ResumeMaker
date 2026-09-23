import { createDefaultStore } from "@/lib/sample-data";
import {
  createId,
  type ResumeHeader,
  type ResumeStore,
  type ResumeVersion,
  type SectionEntry,
  type SectionLayout,
} from "@/lib/types";

const LAYOUTS = new Set<SectionLayout>(["entries", "text", "tags"]);

export const STORAGE_KEY = "resume-maker:v1";

export function loadStore(): ResumeStore {
  if (typeof window === "undefined") {
    return createDefaultStore();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultStore();
    const parsed = JSON.parse(raw) as ResumeStore;
    if (
      !parsed ||
      !Array.isArray(parsed.versions) ||
      parsed.versions.length === 0 ||
      !parsed.activeVersionId
    ) {
      return createDefaultStore();
    }
    if (!parsed.versions.some((v) => v.id === parsed.activeVersionId)) {
      parsed.activeVersionId = parsed.versions[0].id;
    }
    return parsed;
  } catch {
    return createDefaultStore();
  }
}

export function saveStore(store: ResumeStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function parseEntry(value: unknown): SectionEntry | null {
  if (!value || typeof value !== "object") return null;
  const entry = value as Record<string, unknown>;
  const bullets = Array.isArray(entry.bullets)
    ? entry.bullets.filter((item): item is string => typeof item === "string")
    : [""];
  return {
    id: asString(entry.id) || createId("entry"),
    title: asString(entry.title),
    subtitle: asString(entry.subtitle),
    dateRange: asString(entry.dateRange),
    location: asString(entry.location),
    description: asString(entry.description),
    bullets: bullets.length > 0 ? bullets : [""],
  };
}

function parseHeader(value: unknown): ResumeHeader | null {
  if (!value || typeof value !== "object") return null;
  const header = value as Record<string, unknown>;
  const links = Array.isArray(header.links)
    ? header.links.flatMap((link) => {
        if (!link || typeof link !== "object") return [];
        const item = link as Record<string, unknown>;
        return [
          {
            id: asString(item.id) || createId("link"),
            label: asString(item.label),
            url: asString(item.url),
          },
        ];
      })
    : [];
  return {
    name: asString(header.name),
    title: asString(header.title),
    phone: asString(header.phone),
    email: asString(header.email),
    location: asString(header.location),
    links,
  };
}

function parseVersion(value: unknown): ResumeVersion | null {
  if (!value || typeof value !== "object") return null;
  const version = value as Record<string, unknown>;
  const header = parseHeader(version.header);
  if (!header || !Array.isArray(version.sections)) return null;

  const sections = version.sections.flatMap((section) => {
    if (!section || typeof section !== "object") return [];
    const item = section as Record<string, unknown>;
    const layout = LAYOUTS.has(item.layout as SectionLayout)
      ? (item.layout as SectionLayout)
      : "entries";
    const entries = Array.isArray(item.entries)
      ? item.entries.flatMap((entry) => {
          const parsed = parseEntry(entry);
          return parsed ? [parsed] : [];
        })
      : [];
    return [
      {
        id: asString(item.id) || createId("section"),
        title: asString(item.title, "Untitled section"),
        visible: item.visible !== false,
        layout,
        text: asString(item.text),
        entries,
      },
    ];
  });

  return {
    id: createId("version"),
    name: asString(version.name, "Imported Resume"),
    header,
    sections,
    updatedAt: Date.now(),
  };
}

export function parseImportedVersion(raw: unknown): ResumeVersion | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  if (Array.isArray(data.versions)) {
    const active =
      data.versions.find(
        (version) =>
          version &&
          typeof version === "object" &&
          (version as ResumeVersion).id === data.activeVersionId,
      ) ?? data.versions[0];
    return parseVersion(active);
  }
  return parseVersion(data);
}

export function versionFileName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "resume"}.json`;
}

export function downloadVersionJson(version: ResumeVersion): void {
  const blob = new Blob([JSON.stringify(version, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = versionFileName(version.name);
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
