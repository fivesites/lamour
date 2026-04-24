"use client";

import { ComponentProps, useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import LLText, { LLTextProps } from "./LLText";

type LLButtonProps = LLTextProps & {
  revealAnimation?: boolean;
  hover?: boolean;
} & ComponentProps<typeof Button>;

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

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
  ...buttonProps
}: LLButtonProps) {
  const [hovered, setHovered] = useState(false);

  const useAnimation = revealAnimation || hover;

  const animate = hover
    ? { width: hovered ? "100%" : "min-content" }
    : { width: "100%" };

  const initial = useAnimation ? { width: "min-content" } : undefined;

  const shouldCenter = useAnimation && !justify;

  const inner = (
    <Button
      variant="link"
      className={`w-full ${shouldCenter ? "justify-center text-center" : ""} ${className ?? ""}`}
      {...buttonProps}
    >
      <LLText
        text={text}
        stretch={stretch}
        stretchY={stretchY}
        justify={hover ? false : justify}
        rotate={rotate}
        mono={mono}
        monoFont={monoFont}
        gap={gap}
      />
    </Button>
  );

  if (!useAnimation) return inner;

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration: 0.5, ease: EASE }}
      style={shouldCenter ? { marginInline: "auto" } : undefined}
      onHoverStart={hover ? () => setHovered(true) : undefined}
      onHoverEnd={hover ? () => setHovered(false) : undefined}
    >
      {inner}
    </motion.div>
  );
}
