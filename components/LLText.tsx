"use client";

import { CSSProperties, useMemo } from "react";
import { motion } from "motion/react";

type Substitution = {
  char: string;
  rotate?: string;
  rotateZ?: number;
  flipX?: boolean;
  flipY?: boolean;
};

const SUBSTITUTIONS: Record<string, Substitution> = {
  S: { char: "S", rotate: "rotate-180" },
  N: { char: "Z", rotate: "rotate-90" },
  t: { char: "f", rotate: "-rotate-180", flipX: true },
  M: { char: "W", rotate: "rotate-180" },
};

function buildTransform(sub: Substitution): CSSProperties {
  const parts: string[] = [];
  if (sub.rotateZ !== undefined) parts.push(`rotateZ(${sub.rotateZ}deg)`);
  if (sub.flipX) parts.push("scaleX(-1)");
  if (sub.flipY) parts.push("scaleY(-1)");
  return parts.length ? { transform: parts.join(" "), display: "inline-block" } : {};
}

function mxFromStretch(stretch?: string): string | undefined {
  if (!stretch) return undefined;
  const match = stretch.match(/scale-x-(\d+)/);
  if (!match) return undefined;
  const scale = parseInt(match[1], 10);
  const mx = ((scale - 100) / 100) * 0.2;
  return mx > 0 ? `${mx.toFixed(3)}em` : undefined;
}

// Measure each character's natural width at a fixed size to derive scaleX
// so it fills a 1:1 square (cell size = font-size = height of em square).
function measureMonoScales(
  chars: string[],
  fontStyle: string
): Record<string, number> {
  if (typeof window === "undefined") return {};
  const REF_PX = 100;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${REF_PX}px ${fontStyle}`;
  const result: Record<string, number> = {};
  for (const char of chars) {
    if (char === " ") continue;
    const w = ctx.measureText(char).width;
    // scaleX to make char fill REF_PX wide square; clamp so we don't over-squish
    result[char] = w > 0 ? Math.min(REF_PX / w, 4) : 1;
  }
  return result;
}

export type LLTextProps = {
  text: string;
  stretch?: string;
  stretchY?: string;
  justify?: boolean;
  rotate?: boolean;
  mono?: boolean;
  monoFont?: string; // font-family string for canvas measurement
  gap?: string;
  className?: string;
};

export default function LLText({
  text,
  stretch,
  stretchY,
  justify = false,
  rotate = false,
  mono = false,
  monoFont = "Baskerville, 'Baskerville Old Face', serif",
  gap = "0.35em",
  className = "",
}: LLTextProps) {
  const mx = mxFromStretch(stretch);

  const monoScales = useMemo(() => {
    if (!mono) return {};
    const chars = [...new Set(text.split(""))];
    return measureMonoScales(chars, monoFont);
  }, [mono, text, monoFont]);

  return (
    <span
      className={`flex items-center w-full ${justify ? "justify-between" : mono ? "justify-center" : ""} ${className}`}
      style={mono ? { gap: "0.3em", flexWrap: "wrap" } : undefined}
    >
      {(() => {
        let charIdx = 0;
        return text.split("").map((char, i) => {
          if (char === " ") {
            return (
              <span key={i} style={{ width: mono ? "1.2em" : gap }} aria-hidden />
            );
          }

          const sub = rotate ? SUBSTITUTIONS[char] : undefined;
          const displayChar = sub?.char ?? char;
          const rotateCls = sub?.rotate ?? "";
          const stretchCls = [stretch, stretchY].filter(Boolean).join(" ");
          const subTransform = sub ? buildTransform(sub) : {};

          if (mono) {
            const scaleX = monoScales[char] ?? 1;
            const delay = charIdx * 0.04;
            charIdx++;
            return (
              <span
                key={i}
                className={`inline-flex items-center justify-center ${rotateCls}`}
                style={{ width: "1.2em", height: "1.2em", flexShrink: 0 }}
              >
                <motion.span
                  className={`inline-block ${stretchCls}`}
                  style={{ ...subTransform, originX: 0.5, originY: 0.5 }}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX }}
                  transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {displayChar}
                </motion.span>
              </span>
            );
          }

          return (
            <span
              key={i}
              className={`inline-block origin-center ${rotateCls} ${stretchCls}`}
              style={mx ? { ...subTransform, marginInline: mx } : subTransform}
            >
              {displayChar}
            </span>
          );
        });
      })()}
    </span>
  );
}
