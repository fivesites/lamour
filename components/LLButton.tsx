"use client";

import { ComponentProps, useEffect, useRef } from "react";
import { useMotionValue, animate } from "motion/react";
import { Button } from "./ui/button";
import LLText, { LLTextProps } from "./LLText";

type LLButtonProps = LLTextProps & {
  /** Animate effect from 0→1 on mount. */
  revealAnimation?: boolean;
  /** Animate effect on hover: 0→1 if at rest, 1→0 if active. */
  hover?: boolean;
  /** Start with effect fully applied (progress = 1). Hover reverses it. */
  active?: boolean;
} & ComponentProps<typeof Button>;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;
const DURATION = 0.5;

export default function LLButton({
  text,
  stretch,
  stretchY,
  justify,
  rotate,
  mono,
  monoFont,
  gap,
  className,
  revealAnimation,
  hover,
  active = false,
  ...buttonProps
}: LLButtonProps) {
  // progress: 0 = effect off (justify-center, no scale), 1 = effect fully on
  const progress = useMotionValue(active ? 1 : 0);
  // Remember where to return on hover-end
  const restRef = useRef(active ? 1 : 0);

  useEffect(() => {
    if (!revealAnimation) return;
    progress.set(0);
    animate(progress, 1, { duration: DURATION, ease: EASE });
    // After reveal, rest state is 1 (effect applied)
    restRef.current = 1;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHoverStart = () => {
    if (!hover) return;
    // Snapshot rest value, then animate toward the opposite state
    restRef.current = progress.get();
    const target = restRef.current > 0.5 ? 0 : 1;
    animate(progress, target, { duration: DURATION, ease: EASE });
  };

  const handleHoverEnd = () => {
    if (!hover) return;
    animate(progress, restRef.current, { duration: DURATION, ease: EASE });
  };

  return (
    <Button
      variant="link"
      className={`w-full ${className ?? ""}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      {...buttonProps}
    >
      <LLText
        text={text}
        stretch={stretch}
        stretchY={stretchY}
        justify={justify}
        rotate={rotate}
        mono={mono}
        monoFont={monoFont}
        gap={gap}
        animProgress={progress}
      />
    </Button>
  );
}
