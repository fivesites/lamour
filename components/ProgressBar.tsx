"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollContainer } from "@/lib/ScrollContainerContext";
import Stretch from "./Stretch";

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
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none bg-background">
      {/* fading background */}
      {/* <div className="absolute inset-0 bg-linear-to-t from-background to-transparent" /> */}

      <div className="relative px-4 pb-4 pt-1.5 pointer-events-auto overflow-hidden">
        {/* row number labels */}
        <div className="relative w-full h-4 mb-2 overflow-hidden">
          {markers.map(({ row, pct }) => (
            <button
              key={row}
              onClick={() => jumpTo(pct)}
              className="absolute font-baskerVilleOld text-xs -translate-x-1/2 text-foreground/40 hover:text-foreground transition-colors cursor-pointer mb-4"
              style={{
                left: `${pct * 100}%`,

                lineHeight: "1",
              }}
            >
              <Stretch text={row.toString()} size="text-xs" />
            </button>
          ))}
        </div>

        {/* track */}
        <div className="relative w-full h-px bg-foreground/15 overflow-visible">
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
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4  bg-foreground"
            style={{ left: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
