"use client";

import { useEffect, useRef, useState } from "react";

const ROW_HEIGHT = 28;
const ROW_INTERVAL = 6;

export default function RowNumbers({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [rows, setRows] = useState<{ row: number; top: number }[]>([]);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;

    const calc = () => {
      const totalRows = Math.floor(el.scrollHeight / ROW_HEIGHT);
      const pts: { row: number; top: number }[] = [];
      for (let row = ROW_INTERVAL; row <= totalRows; row += ROW_INTERVAL) {
        pts.push({ row, top: row * ROW_HEIGHT });
      }
      setRows(pts);
    };

    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return (
    <>
      {rows.map(({ row, top }) => (
        <span
          key={row}
          className=" absolute left-2 text-foreground/40 select-none text-center font-baskerville pointer-events-none "
          style={{ top, fontSize: "8px", lineHeight: "1" }}
        >
          {row}
        </span>
      ))}
    </>
  );
}
