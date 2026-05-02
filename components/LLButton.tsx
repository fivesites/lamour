"use client";

import {
  CSSProperties,
  ComponentProps,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { Button } from "./ui/button";

/* -------- CHARACTER SUBSTITUTIONS -------- */

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

/* -------- MONO MEASUREMENT -------- */

function measureMonoScales(
  chars: string[],
  fontStyle: string,
): Record<string, number> {
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

/* -------- ANIMATED CHAR -------- */

function AnimChar({
  char,
  progress,
  targetScaleX,
  targetScaleY,
  rotateCls,
  subStyle,
  wiggleRotate,
  wiggleActive,
  rotateDistortion,
  staggerIndex,
  wiggleFactor,
}: {
  char: string;
  progress: MotionValue<number>;
  targetScaleX: number;
  targetScaleY: number;
  rotateCls: string;
  subStyle: CSSProperties;
  wiggleRotate?: boolean;
  wiggleActive?: boolean;
  rotateDistortion?: number;
  staggerIndex?: number;
  wiggleFactor?: number;
}) {
  const scaleX = useTransform(progress, (p) => 1 + (targetScaleX - 1) * p);
  const scaleY = useTransform(progress, (p) => 1 + (targetScaleY - 1) * p);
  const f = wiggleFactor ?? 1;

  const animateTarget =
    wiggleRotate && rotateDistortion !== undefined
      ? { rotate: wiggleActive ? rotateDistortion * f : 0 }
      : undefined;

  return (
    <motion.span
      className={`inline-block origin-center leading-none [text-box-trim:both] [text-box-edge:cap_alphabetic] ${rotateCls}`}
      style={{ ...subStyle, scaleX, scaleY }}
      animate={animateTarget}
      transition={
        wiggleRotate
          ? {
              duration: 0.18,
              ease: "easeOut" as const,
              delay: wiggleActive ? (staggerIndex ?? 0) * 0.015 : 0,
            }
          : undefined
      }
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

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const DURATION = 0.5;

type LLButtonProps = LLTextProps & {
  /** Animate effect from 0→1 on mount. */
  revealAnimation?: boolean;
  /** Animate stretch/justify on hover. */
  hover?: boolean;
  /** Start with effect fully applied. Hover reverses it. */
  active?: boolean;
  /** Per-letter random rotation on hover. */
  wiggleRotate?: boolean;
  /** Wiggle intensity grows from left to right. */
  wiggleGradient?: boolean;
  /** Render as a Next.js Link. */
  href?: string;
} & ComponentProps<typeof Button>;

/* -------- COMPONENT -------- */

export default function LLButton({
  text,
  stretch,
  stretchY,
  justify = false,
  rotate = false,
  mono = false,
  monoFont = "Baskerville, 'Baskerville Old Face', serif",
  gap = "0.35em",
  className,
  animProgress,
  revealAnimation,
  hover,
  active = false,
  wiggleRotate = false,
  wiggleGradient = false,
  href,
  ...buttonProps
}: LLButtonProps) {
  // --- stretch / justify progress ---
  const ownProgress = useMotionValue(active ? 1 : 0);
  const progress = animProgress ?? ownProgress;
  const restRef = useRef(active ? 1 : 0);

  useEffect(() => {
    if (!revealAnimation) return;
    ownProgress.set(0);
    animate(ownProgress, 1, { duration: DURATION, ease: EASE });
    restRef.current = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- wiggle ---
  const [wiggleHovered, setWiggleHovered] = useState(false);
  const rotateDistortions = useRef<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    rotateDistortions.current = text
      .split("")
      .map(() => parseFloat((Math.random() * 14 - 7).toFixed(1)));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const wiggleActive = wiggleRotate && mounted && (active || wiggleHovered);

  // --- hover handlers ---
  const handleHoverStart = () => {
    if (hover) {
      restRef.current = ownProgress.get();
      const target = restRef.current > 0.5 ? 0 : 1;
      animate(ownProgress, target, { duration: DURATION, ease: EASE });
    }
    if (wiggleRotate) setWiggleHovered(true);
  };

  const handleHoverEnd = () => {
    if (hover) {
      animate(ownProgress, restRef.current, { duration: DURATION, ease: EASE });
    }
    if (wiggleRotate) setWiggleHovered(false);
  };

  // --- justify measurement ---
  const pretextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const maxGapMV = useMotionValue(0);

  const parsed = useMemo(() => parseChars(text), [text]);

  const [monoScales, setMonoScales] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!mono) return;
    const uniqueChars = [...new Set(parsed.map((c) => c.char))];
    setMonoScales(measureMonoScales(uniqueChars, monoFont));
  }, [mono, monoFont, parsed]);

  useEffect(() => {
    if (!justify) return;
    const measure = () => {
      const pretext = pretextRef.current;
      const container = containerRef.current;
      if (!pretext || !container) return;
      const totalItems = parsed.length;
      if (totalItems > 1) {
        maxGapMV.set(
          Math.max(
            0,
            (container.offsetWidth - pretext.offsetWidth) / (totalItems - 1),
          ),
        );
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [justify, parsed, maxGapMV]);

  const columnGap = useTransform(
    [progress, maxGapMV] as MotionValue[],
    ([p, maxG]: number[]) => (justify ? p * maxG : 0),
  );

  const hasCharAnimation =
    mono ||
    (stretch !== undefined && stretch !== 1) ||
    (stretchY !== undefined && stretchY !== 1);

  // --- render ---
  const inner = (
    <span
      ref={containerRef}
      className="font-baskerVilleOld relative flex items-center w-full justify-center"
    >
      {justify && (
        <span
          ref={pretextRef}
          className="absolute opacity-0 pointer-events-none whitespace-nowrap"
          aria-hidden
        >
          {text}
        </span>
      )}
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
          const wiggleFactor = wiggleGradient
            ? i / Math.max(parsed.length - 1, 1)
            : 1;

          if (hasCharAnimation || wiggleRotate) {
            return (
              <AnimChar
                key={i}
                char={displayChar}
                progress={progress}
                targetScaleX={targetScaleX}
                targetScaleY={targetScaleY}
                rotateCls={rotateCls}
                subStyle={subStyle}
                wiggleRotate={wiggleRotate}
                wiggleActive={wiggleActive}
                rotateDistortion={
                  wiggleRotate ? rotateDistortions.current[i] : undefined
                }
                staggerIndex={i}
                wiggleFactor={wiggleFactor}
              />
            );
          }

          return (
            <span
              key={i}
              className={`inline-block origin-center leading-none [text-box-trim:both] [text-box-edge:cap_alphabetic] ${rotateCls}`}
              style={subStyle}
            >
              {displayChar}
            </span>
          );
        })}
      </motion.span>
    </span>
  );

  return (
    <Button
      variant="link"
      className={`w-full ${className ?? ""}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      asChild={!!href}
      {...buttonProps}
    >
      {href ? <Link href={href}>{inner}</Link> : inner}
    </Button>
  );
}
