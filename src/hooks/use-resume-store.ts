"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createBlankVersion, createDefaultStore } from "@/lib/sample-data";
import { loadStore, saveStore, STORAGE_KEY } from "@/lib/storage";
import {
  createEmptyEntry,
  createEmptyLink,
  createEmptySection,
  createId,
  type ResumeHeader,
  type ResumeSection,
  type ResumeStore,
  type ResumeVersion,
  type SectionEntry,
  type SectionLayout,
} from "@/lib/types";

let memoryStore: ResumeStore | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function getSnapshot(): ResumeStore {
  if (!memoryStore) {
    memoryStore = loadStore();
  }
  return memoryStore;
}

function getServerSnapshot(): ResumeStore {
  return {
    versions: [],
    activeVersionId: "",
  };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function updateStore(updater: (prev: ResumeStore) => ResumeStore) {
  const next = updater(getSnapshot());
  memoryStore = next;
  saveStore(next);
  emit();
}

function updateActiveVersion(
  updater: (version: ResumeVersion) => ResumeVersion,
) {
  updateStore((prev) => ({
    ...prev,
    versions: prev.versions.map((v) =>
      v.id === prev.activeVersionId
        ? { ...updater(v), updatedAt: Date.now() }
        : v,
    ),
  }));
}

export function useResumeStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    memoryStore = loadStore();
    emit();
    setHydrated(true);
  }, []);

  const activeVersion = useMemo(() => {
    return (
      store.versions.find((v) => v.id === store.activeVersionId) ??
      store.versions[0] ??
      null
    );
  }, [store]);

  const setActiveVersionId = useCallback((id: string) => {
    updateStore((prev) => ({ ...prev, activeVersionId: id }));
  }, []);

  const renameVersion = useCallback((id: string, name: string) => {
    updateStore((prev) => ({
      ...prev,
      versions: prev.versions.map((v) =>
        v.id === id ? { ...v, name, updatedAt: Date.now() } : v,
      ),
    }));
  }, []);

  const createVersion = useCallback((name?: string) => {
    const version = createBlankVersion(name ?? "Untitled Resume");
    updateStore((prev) => ({
      versions: [...prev.versions, version],
      activeVersionId: version.id,
    }));
    return version.id;
  }, []);

  const duplicateVersion = useCallback((id: string) => {
    const source = getSnapshot().versions.find((v) => v.id === id);
    if (!source) return;
    const copy: ResumeVersion = {
      ...structuredClone(source),
      id: createId("version"),
      name: `${source.name} (copy)`,
      updatedAt: Date.now(),
    };
    updateStore((prev) => ({
      versions: [...prev.versions, copy],
      activeVersionId: copy.id,
    }));
  }, []);

  const deleteVersion = useCallback((id: string) => {
    updateStore((prev) => {
      if (prev.versions.length <= 1) return prev;
      const versions = prev.versions.filter((v) => v.id !== id);
      const activeVersionId =
        prev.activeVersionId === id ? versions[0].id : prev.activeVersionId;
      return { versions, activeVersionId };
    });
  }, []);

  const resetToSamples = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    const defaults = createDefaultStore();
    memoryStore = defaults;
    saveStore(defaults);
    emit();
  }, []);

  const updateHeader = useCallback((header: ResumeHeader) => {
    updateActiveVersion((v) => ({ ...v, header }));
  }, []);

  const patchHeader = useCallback((patch: Partial<ResumeHeader>) => {
    updateActiveVersion((v) => ({ ...v, header: { ...v.header, ...patch } }));
  }, []);

  const addLink = useCallback(() => {
    updateActiveVersion((v) => ({
      ...v,
      header: {
        ...v.header,
        links: [...v.header.links, createEmptyLink()],
      },
    }));
  }, []);

  const updateLink = useCallback(
    (linkId: string, patch: Partial<{ label: string; url: string }>) => {
      updateActiveVersion((v) => ({
        ...v,
        header: {
          ...v.header,
          links: v.header.links.map((l) =>
            l.id === linkId ? { ...l, ...patch } : l,
          ),
        },
      }));
    },
    [],
  );

  const removeLink = useCallback((linkId: string) => {
    updateActiveVersion((v) => ({
      ...v,
      header: {
        ...v.header,
        links: v.header.links.filter((l) => l.id !== linkId),
      },
    }));
  }, []);

  const addSection = useCallback(
    (title?: string, layout: SectionLayout = "entries") => {
      updateActiveVersion((v) => ({
        ...v,
        sections: [...v.sections, createEmptySection(title, layout)],
      }));
    },
    [],
  );

  const updateSection = useCallback(
    (sectionId: string, patch: Partial<ResumeSection>) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) =>
          s.id === sectionId ? { ...s, ...patch } : s,
        ),
      }));
    },
    [],
  );

  const removeSection = useCallback((sectionId: string) => {
    updateActiveVersion((v) => ({
      ...v,
      sections: v.sections.filter((s) => s.id !== sectionId),
    }));
  }, []);

  const moveSection = useCallback((sectionId: string, direction: -1 | 1) => {
    updateActiveVersion((v) => {
      const index = v.sections.findIndex((s) => s.id === sectionId);
      if (index < 0) return v;
      const target = index + direction;
      if (target < 0 || target >= v.sections.length) return v;
      const sections = [...v.sections];
      const [item] = sections.splice(index, 1);
      sections.splice(target, 0, item);
      return { ...v, sections };
    });
  }, []);

  const addEntry = useCallback((sectionId: string) => {
    updateActiveVersion((v) => ({
      ...v,
      sections: v.sections.map((s) =>
        s.id === sectionId
          ? { ...s, entries: [...s.entries, createEmptyEntry()] }
          : s,
      ),
    }));
  }, []);

  const updateEntry = useCallback(
    (sectionId: string, entryId: string, patch: Partial<SectionEntry>) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                entries: s.entries.map((e) =>
                  e.id === entryId ? { ...e, ...patch } : e,
                ),
              }
            : s,
        ),
      }));
    },
    [],
  );

  const removeEntry = useCallback((sectionId: string, entryId: string) => {
    updateActiveVersion((v) => ({
      ...v,
      sections: v.sections.map((s) =>
        s.id === sectionId
          ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
          : s,
      ),
    }));
  }, []);

  const updateBullet = useCallback(
    (
      sectionId: string,
      entryId: string,
      bulletIndex: number,
      value: string,
    ) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            entries: s.entries.map((e) => {
              if (e.id !== entryId) return e;
              const bullets = [...e.bullets];
              bullets[bulletIndex] = value;
              return { ...e, bullets };
            }),
          };
        }),
      }));
    },
    [],
  );

  const addBullet = useCallback((sectionId: string, entryId: string) => {
    updateActiveVersion((v) => ({
      ...v,
      sections: v.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          entries: s.entries.map((e) =>
            e.id === entryId ? { ...e, bullets: [...e.bullets, ""] } : e,
          ),
        };
      }),
    }));
  }, []);

  const removeBullet = useCallback(
    (sectionId: string, entryId: string, bulletIndex: number) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) => {
          if (s.id !== sectionId) return s;
          return {
            ...s,
            entries: s.entries.map((e) => {
              if (e.id !== entryId) return e;
              return {
                ...e,
                bullets: e.bullets.filter((_, i) => i !== bulletIndex),
              };
            }),
          };
        }),
      }));
    },
    [],
  );

  return {
    hydrated,
    store,
    activeVersion,
    setActiveVersionId,
    renameVersion,
    createVersion,
    duplicateVersion,
    deleteVersion,
    resetToSamples,
    updateHeader,
    patchHeader,
    addLink,
    updateLink,
    removeLink,
    addSection,
    updateSection,
    removeSection,
    moveSection,
    addEntry,
    updateEntry,
    removeEntry,
    updateBullet,
    addBullet,
    removeBullet,
  };
}
