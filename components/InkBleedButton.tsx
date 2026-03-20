"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface InkBleedButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  hoverBlur?: number;
}

export default function InkBleedButton({
  children,
  className,
  variant,
  size,
  hoverBlur = 1,
  ...props
}: InkBleedButtonProps) {
  const textRef = React.useRef<HTMLSpanElement>(null);

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      onMouseEnter={() => {
        if (textRef.current)
          textRef.current.style.filter = `blur(${hoverBlur}px)`;
      }}
      onMouseLeave={() => {
        if (textRef.current) textRef.current.style.filter = "blur(0px)";
      }}
      {...props}
    >
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="ink-threshold-btn">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
      <span
        style={{ filter: "url(#ink-threshold-btn)", display: "inline-flex" }}
      >
        <span
          ref={textRef}
          style={{ filter: "blur(0px)", transition: "filter 0.3s ease" }}
        >
          {children}
        </span>
      </span>
    </button>
  );
}
