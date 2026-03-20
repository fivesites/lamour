"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useScrollContainer } from "@/lib/ScrollContainerContext";

export interface MagicTextProps {
  text: string;
  indent?: boolean;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block mr-[0.3em]">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({ text, indent }) => {
  const container = useRef(null);
  const scrollContainer = useScrollContainer();

  const { scrollYProgress } = useScroll({
    target: container,
    container: scrollContainer ?? undefined,
    offset: ["start 0.9", "start 0.1"],
  });

  const paragraphs = text.split("\n");
  const allWords = paragraphs.flatMap((p, pi) => [
    ...(indent ? [{ word: "", break: false, spacer: true }] : []),
    ...p.split(" ").map((w) => ({ word: w, break: false, spacer: false })),
    ...(pi < paragraphs.length - 1
      ? [{ word: "", break: true, spacer: false }]
      : []),
  ]);

  return (
    <p
      ref={container}
      className="font-baskerville text-[19.3px] leading-7 tracking-[0.04em] p-0"
    >
      {allWords.map((item, i) => {
        if (item.break) return <br key={`br-${i}`} />;
        if (item.spacer)
          return <span key={`indent-${i}`} className="inline-block w-16" />;
        const start = i / allWords.length;
        const end = start + 1 / allWords.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {item.word}
          </Word>
        );
      })}
    </p>
  );
};
