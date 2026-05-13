"use client";

import Image from "next/image";
import { useState } from "react";

type ShelfMode = "front" | "spine" | "back";
const MODES: ShelfMode[] = ["front", "spine", "back"];

const modeStyles: Record<ShelfMode, { width: string; position: string }> = {
  front: {
    width: "w-[calc(50vw-0.5rem)] lg:w-[75vh]",
    position: "object-right",
  },
  spine: { width: "w-3", position: "object-center" },
  back: { width: "w-[calc(50vw-0.5rem)] lg:w-[75vh]", position: "object-left" },
};

const issues = [
  { src: "/LL-15-cover-scaled.jpg", aspect: "aspect-square" },
  { src: "/LL10-cover-lowres-scaled.jpg", aspect: "aspect-[3/4]" },
  { src: "/LL11-Cover.jpg", aspect: "aspect-[3/4]" },
  { src: "/LL16-cover-lowres.png", aspect: "aspect-[3/4]" },
];

function ModeToggle({
  mode,
  onSetMode,
}: {
  mode: ShelfMode;
  onSetMode: (m: ShelfMode) => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 flex gap-x-4 tracking-widest p-4">
      {MODES.map((m, i) => (
        <button
          key={m}
          onClick={() => onSetMode(m)}
          className={`transition-all font-baskerVilleOld ${i > 0 ? "-ml-px" : ""} ${
            mode === m
              ? " underline underline-offset-4 text-foreground decoration-1"
              : ""
          }`}
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function LLBookshelfClient() {
  const [mode, setMode] = useState<ShelfMode>("spine");
  const { width, position } = modeStyles[mode];

  return (
    <>
      <ModeToggle mode={mode} onSetMode={setMode} />
      <div
        className={`flex lg:items-end items-center   w-full min-h-dvh lg:h-dvh pb-16 ${mode !== "spine" ? "flex-wrap justify-center gap-2" : "justify-start gap-0"}`}
      >
        {issues.map(({ src, aspect }) => (
          <div
            key={src}
            className={`relative overflow-hidden shrink-0 ${
              mode === "spine"
                ? `h-[50vh] lg:h-[75vh] ${width}`
                : `${width} ${aspect}`
            }`}
          >
            <Image
              src={src}
              fill
              alt={src}
              className={`object-cover ${position}`}
            />
          </div>
        ))}
      </div>
    </>
  );
}
