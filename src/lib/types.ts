export type ResumeLink = {
  id: string;
  label: string;
  url: string;
};

export type ResumeHeader = {
  name: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  links: ResumeLink[];
};

export type SectionEntry = {
  id: string;
  title: string;
  subtitle: string;
  dateRange: string;
  location: string;
  description: string;
  bullets: string[];
};

export type SectionLayout = "entries" | "text" | "tags";

export type ResumeSection = {
  id: string;
  title: string;
  visible: boolean;
  layout: SectionLayout;
  text: string;
  entries: SectionEntry[];
};

export type ResumeVersion = {
  id: string;
  name: string;
  header: ResumeHeader;
  sections: ResumeSection[];
  updatedAt: number;
};

export type ResumeStore = {
  versions: ResumeVersion[];
  activeVersionId: string;
};

export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyEntry(): SectionEntry {
  return {
    id: createId("entry"),
    title: "",
    subtitle: "",
    dateRange: "",
    location: "",
    description: "",
    bullets: [""],
  };
}

export function createEmptySection(
  title = "New Section",
  layout: SectionLayout = "entries",
): ResumeSection {
  return {
    id: createId("section"),
    title,
    visible: true,
    layout,
    text: "",
    entries: layout === "entries" ? [createEmptyEntry()] : [],
  };
}

export function createEmptyLink(): ResumeLink {
  return {
    id: createId("link"),
    label: "Portfolio",
    url: "https://",
  };
}
