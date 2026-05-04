"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useMemo } from "react";
import Image from "next/image";
import { useScrollContainer } from "@/lib/ScrollContainerContext";

export interface MagicTextProps {
  text: string;
  indent?: boolean;
  illustrations?: { src: string; alt?: string }[];
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
      <span className="absolute opacity-60">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

/* ---------------- PRETEXT HOOK ---------------- */

type WordItem =
  | { word: string; break: false; spacer: false; imageIndex?: undefined }
  | { word: ""; break: true; spacer: false; imageIndex?: undefined }
  | { word: ""; break: false; spacer: true; imageIndex?: undefined }
  | { word: ""; break: false; spacer: false; imageIndex: number };

function usePretextWords(text: string, indent?: boolean): WordItem[] {
  return useMemo(() => {
    if (!text) return [];

    const paragraphs = text.split("\n").filter(Boolean);

    return paragraphs.flatMap((p, pi) => {
      const imgMatch = p.match(/^\[img:(\d+)\]$/);
      if (imgMatch) {
        return [
          {
            word: "" as const,
            break: false as const,
            spacer: false as const,
            imageIndex: Number(imgMatch[1]),
          },
        ];
      }

      const words: WordItem[] = p
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({
          word: w,
          break: false as const,
          spacer: false as const,
        }));

      return [
        ...(indent
          ? [
              {
                word: "" as const,
                break: false as const,
                spacer: true as const,
              },
            ]
          : []),
        ...words,
        ...(pi < paragraphs.length - 1
          ? [
              {
                word: "" as const,
                break: true as const,
                spacer: false as const,
              },
            ]
          : []),
      ] as WordItem[];
    });
  }, [text, indent]);
}

/* ---------------- MAIN COMPONENT ---------------- */

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  indent,
  illustrations,
}) => {
  const container = useRef(null);
  const scrollContainer = useScrollContainer();

  const { scrollYProgress } = useScroll({
    target: container,
    container: scrollContainer ?? undefined,
    offset: ["start 0.9", "start 0.1"],
  });

  const allWords = usePretextWords(text, indent);

  return (
    <p
      ref={container}
      className="font-baskerVV  text-[19.3px] tracking-wide leading-normal p-0 "
    >
      {allWords.map((item, i) => {
        if (item.break) return <br key={`br-${i}`} />;

        if (item.spacer) {
          return <span key={`indent-${i}`} className="inline-block w-16" />;
        }

        if (item.imageIndex !== undefined) {
          const ill = illustrations?.[item.imageIndex];
          if (!ill) return null;
          return (
            <span key={`img-${i}`} className="block my-6 relative w-full h-64">
              <Image
                src={ill.src}
                alt={ill.alt ?? ""}
                fill
                className="object-cover"
              />
            </span>
          );
        }

        const spread = 0.15;
        const start = i / allWords.length;
        const end = start + spread;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {item.word}
          </Word>
        );
      })}
    </p>
  );
};
