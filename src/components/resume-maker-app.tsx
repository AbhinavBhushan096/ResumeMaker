"use client";

import { useCallback, useState } from "react";
import { ResumeEditorPanel } from "@/components/editor/resume-editor-panel";
import { VersionToolbar } from "@/components/editor/version-toolbar";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ScaledPreview } from "@/components/resume/scaled-preview";
import { useResumeStore } from "@/hooks/use-resume-store";
import { cn } from "@/lib/utils";

export function ResumeMakerApp() {
  const store = useResumeStore();
  const [zoom, setZoom] = useState<"fit" | 1>("fit");
  const [mobilePane, setMobilePane] = useState<"edit" | "preview">("edit");

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!store.hydrated || !store.activeVersion) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[linear-gradient(160deg,#f4f6f8_0%,#e8eef3_45%,#f7f3ec_100%)]">
        <div className="rounded-xl border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">
          Loading your resumes…
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell flex h-dvh flex-col overflow-hidden bg-[linear-gradient(160deg,#f4f6f8_0%,#e8eef3_45%,#f7f3ec_100%)]">
      <VersionToolbar
        versions={store.store.versions}
        activeVersionId={store.store.activeVersionId}
        updatedAt={store.activeVersion.updatedAt}
        onSelect={store.setActiveVersionId}
        onRename={store.renameVersion}
        onCreate={() => store.createVersion()}
        onDuplicate={store.duplicateVersion}
        onDelete={store.deleteVersion}
        onPrint={handlePrint}
        onResetSamples={store.resetToSamples}
        onImport={store.importVersion}
      />

      <div className="no-print flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2 lg:hidden">
        <div className="grid grid-cols-2 rounded-lg bg-muted p-0.5">
          <button
            type="button"
            className={cn(
              "h-7 rounded-md px-3 text-sm font-medium",
              mobilePane === "edit"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
            onClick={() => setMobilePane("edit")}
          >
            Edit
          </button>
          <button
            type="button"
            className={cn(
              "h-7 rounded-md px-3 text-sm font-medium",
              mobilePane === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
            onClick={() => setMobilePane("preview")}
          >
            Preview
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Saved on this device</p>
      </div>

      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1">
        <aside
          className={cn(
            "no-print min-h-0 w-full overflow-y-auto px-3 py-3 sm:px-4 lg:w-[28rem] lg:shrink-0 lg:border-r lg:border-border/80 lg:bg-background/40",
            mobilePane === "preview" && "max-lg:hidden",
          )}
        >
          <ResumeEditorPanel resume={store.activeVersion} store={store} />
        </aside>

        <main
          className={cn(
            "preview-pane flex min-h-0 min-w-0 flex-1 flex-col px-3 py-3 sm:px-4",
            mobilePane === "edit" && "max-lg:hidden",
          )}
        >
          <div className="no-print mb-2 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                A4 preview
              </h2>
              <p className="text-xs text-muted-foreground">
                Fits the pane. Download PDF to print or save.
              </p>
            </div>
            <div className="flex shrink-0 rounded-lg bg-muted p-0.5">
              <button
                type="button"
                className={cn(
                  "h-7 rounded-md px-2.5 text-xs font-medium",
                  zoom === "fit"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
                onClick={() => setZoom("fit")}
              >
                Fit
              </button>
              <button
                type="button"
                className={cn(
                  "h-7 rounded-md px-2.5 text-xs font-medium",
                  zoom === 1
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
                onClick={() => setZoom(1)}
              >
                100%
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1">
            <ScaledPreview zoom={zoom}>
              <ResumePreview resume={store.activeVersion} />
            </ScaledPreview>
          </div>
        </main>
      </div>
    </div>
  );
}
