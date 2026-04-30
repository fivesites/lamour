"use client";

import { CSSProperties, useEffect, useMemo, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";

/* -------- CHARACTER SUBSTITUTIONS (rotate effect) -------- */

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
  return parts.length
    ? { transform: parts.join(" "), display: "inline-block" }
    : {};
}

/* -------- MONO MEASUREMENT (canvas) -------- */

function measureMonoScales(
  chars: string[],
  fontStyle: string,
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
    result[char] = w > 0 ? Math.min(REF_PX / w, 4) : 1;
  }
  return result;
}

/* -------- TEXT PARSER -------- */

function parseChars(text: string) {
  return text.split("").map((char) => ({ char, isSpace: char === " " }));
}

/* -------- ANIMATED CHAR (keeps hooks-in-loops legal) -------- */

function AnimChar({
  char,
  progress,
  targetScaleX,
  targetScaleY,
  rotateCls,
  subStyle,
}: {
  char: string;
  progress: MotionValue<number>;
  targetScaleX: number;
  targetScaleY: number;
  rotateCls: string;
  subStyle: CSSProperties;
}) {
  const scaleX = useTransform(
    progress,
    (p) => 1 + (targetScaleX - 1) * p,
  );
  const scaleY = useTransform(
    progress,
    (p) => 1 + (targetScaleY - 1) * p,
  );
  return (
    <motion.span
      className={`inline-block origin-center ${rotateCls}`}
      style={{ ...subStyle, scaleX, scaleY }}
    >
      {char}
    </motion.span>
  );
}

/* -------- TYPES -------- */

export type LLTextProps = {
  text: string;
  /** scaleX target (e.g. 2 = 200%). Animated via progress. */
  stretch?: number;
  /** scaleY target. Animated via progress. */
  stretchY?: number;
  /** Animate letter-spacing from center-clustered to fully justified. */
  justify?: boolean;
  /** Apply character substitutions (S→rotated S, etc.) */
  rotate?: boolean;
  /** Make all characters equal width using canvas measurement. */
  mono?: boolean;
  monoFont?: string;
  /** Width of a space character (not animated). */
  gap?: string;
  className?: string;
  /** External 0-1 motion value that drives all animation. */
  animProgress?: MotionValue<number>;
};

/* -------- COMPONENT -------- */

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
  animProgress,
}: LLTextProps) {
  // Fallback: static progress at 1 (effect fully applied when no animation)
  const staticProgress = useMotionValue(1);
  const progress = animProgress ?? staticProgress;

  // Step 1: pretext ref for measuring natural text width
  const pretextRef = useRef<HTMLSpanElement>(null);
  // Container ref for available width
  const containerRef = useRef<HTMLSpanElement>(null);
  // MotionValue for max gap — updating it triggers columnGap recompute
  const maxGapMV = useMotionValue(0);

  const parsed = useMemo(() => parseChars(text), [text]);

  const monoScales = useMemo(() => {
    if (!mono) return {} as Record<string, number>;
    const uniqueChars = [...new Set(parsed.map((c) => c.char))];
    return measureMonoScales(uniqueChars, monoFont);
  }, [mono, parsed, monoFont]);

  // Step 1: measure pretext vs container to compute max justify gap
  useEffect(() => {
    if (!justify) return;

    const measure = () => {
      const pretext = pretextRef.current;
      const container = containerRef.current;
      if (!pretext || !container) return;

      const textW = pretext.offsetWidth;
      const containerW = container.offsetWidth;
      const totalItems = parsed.length; // chars + spaces as separate flex items
      if (totalItems > 1) {
        maxGapMV.set(Math.max(0, (containerW - textW) / (totalItems - 1)));
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [justify, parsed, maxGapMV]);

  // Step 3: animate columnGap from 0 → maxGap via progress
  const columnGap = useTransform(
    [progress, maxGapMV] as MotionValue[],
    ([p, maxG]: number[]) => (justify ? p * maxG : 0),
  );

  const hasCharAnimation =
    mono || (stretch !== undefined && stretch !== 1) || (stretchY !== undefined && stretchY !== 1);

  return (
    // Step 2: container always at justify-center as the base
    <span
      ref={containerRef}
      className={`relative flex items-center w-full justify-center ${className}`}
    >
      {/* Step 1: hidden pretext for dimension measurement */}
      {justify && (
        <span
          ref={pretextRef}
          className="absolute opacity-0 pointer-events-none whitespace-nowrap"
          aria-hidden
        >
          {text}
        </span>
      )}

      {/* Step 2+3: actual text with motion-driven gap */}
      <motion.span
        className="flex items-center justify-center"
        style={{ columnGap }}
      >
        {parsed.map((item, i) => {
          if (item.isSpace) {
            return <span key={i} style={{ width: gap }} aria-hidden />;
          }

          const sub = rotate ? SUBSTITUTIONS[item.char] : undefined;
          const displayChar = sub?.char ?? item.char;
          const rotateCls = sub?.rotate ?? "";
          const subStyle = sub ? buildTransform(sub) : {};

          const targetScaleX = mono
            ? (monoScales[item.char] ?? 1)
            : (stretch ?? 1);
          const targetScaleY = stretchY ?? 1;

          if (hasCharAnimation) {
            return (
              <AnimChar
                key={i}
                char={displayChar}
                progress={progress}
                targetScaleX={targetScaleX}
                targetScaleY={targetScaleY}
                rotateCls={rotateCls}
                subStyle={subStyle}
              />
            );
          }

          return (
            <span
              key={i}
              className={`inline-block origin-center ${rotateCls}`}
              style={subStyle}
            >
              {displayChar}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}
