"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollContainer } from "@/lib/ScrollContainerContext";

const ROW_HEIGHT = 28; // matches line-height in MagicText / .p
const ROW_INTERVAL = 24;

export default function ProgressBar() {
  const scrollContainerRef = useScrollContainer();
  const [progress, setProgress] = useState(0);
  const [markers, setMarkers] = useState<{ row: number; pct: number }[]>([]);

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;

    const calcMarkers = () => {
      const total = el.scrollHeight - el.clientHeight;
      if (total <= 0) return;
      const totalRows = Math.floor(el.scrollHeight / ROW_HEIGHT);
      const pts: { row: number; pct: number }[] = [];
      for (let row = ROW_INTERVAL; row <= totalRows; row += ROW_INTERVAL) {
        pts.push({ row, pct: (row * ROW_HEIGHT) / el.scrollHeight });
      }
      setMarkers(pts);
    };

    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? el.scrollTop / total : 0);
    };

    calcMarkers();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(calcMarkers);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [scrollContainerRef]);

  const jumpTo = (pct: number) => {
    const el = scrollContainerRef?.current;
    if (!el) return;
    el.scrollTo({ top: pct * el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none">
      {/* fading background */}
      <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" />

      <div className="relative px-6 pb-6 pt-8 pointer-events-auto">
        {/* row number labels */}
        <div className="relative w-full h-4 mb-1">
          {markers.map(({ row, pct }) => (
            <button
              key={row}
              onClick={() => jumpTo(pct)}
              className="absolute font-baskerville -translate-x-1/2 text-foreground/40 hover:text-foreground transition-colors cursor-pointer"
              style={{
                left: `${pct * 100}%`,
                fontSize: "8px",
                lineHeight: "1",
              }}
            >
              {row}
            </button>
          ))}
        </div>

        {/* track */}
        <div className="relative w-full h-px bg-foreground/15">
          {/* markers on track */}
          {markers.map(({ row, pct }) => (
            <button
              key={row}
              onClick={() => jumpTo(pct)}
              style={{ left: `${pct * 100}%` }}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-2 bg-foreground/30 hover:bg-foreground transition-colors cursor-pointer"
            />
          ))}
          {/* progress fill */}
          <div
            className="absolute top-0 left-0 h-full bg-foreground/60 transition-none"
            style={{ width: `${progress * 100}%` }}
          />
          {/* playhead */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
