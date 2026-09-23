"use client";

import { useCallback } from "react";
import { ResumeEditorPanel } from "@/components/editor/resume-editor-panel";
import { VersionToolbar } from "@/components/editor/version-toolbar";
import { ResumePreview } from "@/components/resume/resume-preview";
import { useResumeStore } from "@/hooks/use-resume-store";

export function ResumeMakerApp() {
  const store = useResumeStore();

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!store.hydrated || !store.activeVersion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#f4f6f8_0%,#e8eef3_45%,#f7f3ec_100%)]">
        <div className="rounded-xl border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">
          Loading your resumes…
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-screen flex-col bg-[linear-gradient(160deg,#f4f6f8_0%,#e8eef3_45%,#f7f3ec_100%)]">
      <VersionToolbar
        versions={store.store.versions}
        activeVersionId={store.store.activeVersionId}
        onSelect={store.setActiveVersionId}
        onRename={store.renameVersion}
        onCreate={() => store.createVersion()}
        onDuplicate={store.duplicateVersion}
        onDelete={store.deleteVersion}
        onPrint={handlePrint}
        onResetSamples={store.resetToSamples}
      />

      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-4 p-3 sm:p-4 lg:flex-row lg:items-start lg:gap-6">
        <aside className="no-print w-full shrink-0 lg:max-h-[calc(100vh-5.5rem)] lg:w-[min(100%,26rem)] lg:overflow-y-auto xl:w-[28rem]">
          <ResumeEditorPanel resume={store.activeVersion} store={store} />
        </aside>

        <main className="preview-pane min-w-0 flex-1">
          <div className="no-print mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Live A4 preview
              </h2>
              <p className="text-xs text-muted-foreground">
                Updates as you edit. Use Download PDF to print or save.
              </p>
            </div>
          </div>
          <div className="preview-stage flex justify-center overflow-x-auto rounded-xl border border-border/70 bg-neutral-200/60 p-3 sm:p-6">
            <ResumePreview resume={store.activeVersion} />
          </div>
        </main>
      </div>
    </div>
  );
}
