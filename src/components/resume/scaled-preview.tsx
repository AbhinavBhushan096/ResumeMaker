"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScaledPreviewProps = {
  zoom: "fit" | 1;
  children: ReactNode;
};

export function ScaledPreview({ zoom, children }: ScaledPreviewProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const page = pageRef.current;
    if (!frame || !page) return;

    const measure = () => {
      const w = page.offsetWidth;
      const h = page.offsetHeight;
      if (!w || !h) return;

      const styles = getComputedStyle(frame);
      const padX =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const available = Math.max(frame.clientWidth - padX, 1);
      const next = zoom === "fit" ? Math.min(1, available / w) : zoom;

      setNatural((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
      setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(page);
    return () => observer.disconnect();
  }, [zoom]);

  return (
    <div
      ref={frameRef}
      className="preview-stage h-full overflow-auto rounded-xl border border-border/70 bg-neutral-200/70 p-3 sm:p-6"
    >
      <div
        className="preview-fit relative mx-auto"
        style={
          natural.w
            ? { width: natural.w * scale, height: natural.h * scale }
            : undefined
        }
      >
        <div
          ref={pageRef}
          className="preview-fit-inner absolute top-0 left-0 w-fit"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
