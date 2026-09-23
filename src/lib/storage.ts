import { createDefaultStore } from "@/lib/sample-data";
import type { ResumeStore } from "@/lib/types";

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
