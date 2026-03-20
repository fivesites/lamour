"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DottedDividerProps {
  className?: string;
  char?: string;
  stagger?: number;  // ms between each dot
  duration?: number; // ms per dot animation
}

export default function DottedDivider({
  className,
  char = ".",
  stagger = 20,
  duration = 400,
}: DottedDividerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const obs = new ResizeObserver(() => {
      const containerWidth = container.getBoundingClientRect().width;
      const charWidth = measure.getBoundingClientRect().width;
      if (charWidth > 0) setCount(Math.floor(containerWidth / charWidth));
    });
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full justify-between overflow-hidden", className)}
      aria-hidden="true"
    >
      <span
        ref={measureRef}
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none" }}
      >
        {char}
      </span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            animationName: "dot-in",
            animationDuration: `${duration}ms`,
            animationDelay: `${i * stagger}ms`,
            animationFillMode: "both",
            animationTimingFunction: "ease-out",
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
