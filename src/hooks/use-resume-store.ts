"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

function updateActiveVersionInStore(
  store: ResumeStore,
  updater: (version: ResumeVersion) => ResumeVersion,
): ResumeStore {
  return {
    ...store,
    versions: store.versions.map((v) =>
      v.id === store.activeVersionId
        ? { ...updater(v), updatedAt: Date.now() }
        : v,
    ),
  };
}

export function useResumeStore() {
  const [store, setStore] = useState<ResumeStore | null>(null);

  useEffect(() => {
    setStore(loadStore());
  }, []);

  const commit = useCallback((next: ResumeStore) => {
    setStore(next);
    saveStore(next);
  }, []);

  const updateStore = useCallback(
    (updater: (prev: ResumeStore) => ResumeStore) => {
      setStore((prev) => {
        if (!prev) return prev;
        const next = updater(prev);
        saveStore(next);
        return next;
      });
    },
    [],
  );

  const updateActiveVersion = useCallback(
    (updater: (version: ResumeVersion) => ResumeVersion) => {
      updateStore((prev) => updateActiveVersionInStore(prev, updater));
    },
    [updateStore],
  );

  const activeVersion = useMemo(() => {
    if (!store) return null;
    return (
      store.versions.find((v) => v.id === store.activeVersionId) ??
      store.versions[0] ??
      null
    );
  }, [store]);

  const setActiveVersionId = useCallback(
    (id: string) => {
      updateStore((prev) => ({ ...prev, activeVersionId: id }));
    },
    [updateStore],
  );

  const renameVersion = useCallback(
    (id: string, name: string) => {
      updateStore((prev) => ({
        ...prev,
        versions: prev.versions.map((v) =>
          v.id === id ? { ...v, name, updatedAt: Date.now() } : v,
        ),
      }));
    },
    [updateStore],
  );

  const createVersion = useCallback(
    (name?: string) => {
      const version = createBlankVersion(name ?? "Untitled Resume");
      updateStore((prev) => ({
        versions: [...prev.versions, version],
        activeVersionId: version.id,
      }));
      return version.id;
    },
    [updateStore],
  );

  const duplicateVersion = useCallback(
    (id: string) => {
      updateStore((prev) => {
        const source = prev.versions.find((v) => v.id === id);
        if (!source) return prev;
        const copy: ResumeVersion = {
          ...structuredClone(source),
          id: createId("version"),
          name: `${source.name} (copy)`,
          updatedAt: Date.now(),
        };
        return {
          versions: [...prev.versions, copy],
          activeVersionId: copy.id,
        };
      });
    },
    [updateStore],
  );

  const deleteVersion = useCallback(
    (id: string) => {
      updateStore((prev) => {
        if (prev.versions.length <= 1) return prev;
        const versions = prev.versions.filter((v) => v.id !== id);
        const activeVersionId =
          prev.activeVersionId === id ? versions[0].id : prev.activeVersionId;
        return { versions, activeVersionId };
      });
    },
    [updateStore],
  );

  const resetToSamples = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    const defaults = createDefaultStore();
    commit(defaults);
  }, [commit]);

  const patchHeader = useCallback(
    (patch: Partial<ResumeHeader>) => {
      updateActiveVersion((v) => ({
        ...v,
        header: { ...v.header, ...patch },
      }));
    },
    [updateActiveVersion],
  );

  const addLink = useCallback(() => {
    updateActiveVersion((v) => ({
      ...v,
      header: {
        ...v.header,
        links: [...v.header.links, createEmptyLink()],
      },
    }));
  }, [updateActiveVersion]);

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
    [updateActiveVersion],
  );

  const removeLink = useCallback(
    (linkId: string) => {
      updateActiveVersion((v) => ({
        ...v,
        header: {
          ...v.header,
          links: v.header.links.filter((l) => l.id !== linkId),
        },
      }));
    },
    [updateActiveVersion],
  );

  const addSection = useCallback(
    (title?: string, layout: SectionLayout = "entries") => {
      updateActiveVersion((v) => ({
        ...v,
        sections: [...v.sections, createEmptySection(title, layout)],
      }));
    },
    [updateActiveVersion],
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
    [updateActiveVersion],
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.filter((s) => s.id !== sectionId),
      }));
    },
    [updateActiveVersion],
  );

  const moveSection = useCallback(
    (sectionId: string, direction: -1 | 1) => {
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
    },
    [updateActiveVersion],
  );

  const addEntry = useCallback(
    (sectionId: string) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) =>
          s.id === sectionId
            ? { ...s, entries: [...s.entries, createEmptyEntry()] }
            : s,
        ),
      }));
    },
    [updateActiveVersion],
  );

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
    [updateActiveVersion],
  );

  const removeEntry = useCallback(
    (sectionId: string, entryId: string) => {
      updateActiveVersion((v) => ({
        ...v,
        sections: v.sections.map((s) =>
          s.id === sectionId
            ? { ...s, entries: s.entries.filter((e) => e.id !== entryId) }
            : s,
        ),
      }));
    },
    [updateActiveVersion],
  );

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
    [updateActiveVersion],
  );

  const addBullet = useCallback(
    (sectionId: string, entryId: string) => {
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
    },
    [updateActiveVersion],
  );

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
    [updateActiveVersion],
  );

  return {
    hydrated: store !== null,
    store: store ?? { versions: [], activeVersionId: "" },
    activeVersion,
    setActiveVersionId,
    renameVersion,
    createVersion,
    duplicateVersion,
    deleteVersion,
    resetToSamples,
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
