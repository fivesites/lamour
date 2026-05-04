"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MagicText } from "@/components/MagicText";
import { ScrollContainerContext } from "@/lib/ScrollContainerContext";
import SanityPortableText from "@/components/SanityPortableText";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import Image from "next/image";
import LLButton from "./LLButton";

type ArticleReaderProps = {
  title: string;
  body?: any[];
  plainText: string;
  illustrations?: { src: string; alt?: string }[];
  author?: {
    name: string;
    slug: { current: string };
    image?: { asset: any; alt?: string };
  };
  issue?: { title: string; issueNumber: number; slug: { current: string } };
  coverImage?: { asset: any; alt?: string };
  publishedAt?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const month = d.toLocaleDateString("en-US", { month: "long" }).toLowerCase();
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}, ${day}, ${year}`;
}

export default function ArticleReader({
  title,
  body,
  plainText,
  illustrations,
  author,
  issue,
  coverImage,
  publishedAt,
}: ArticleReaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={scrollRef}
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ScrollContainerContext.Provider value={scrollRef}>
        <article className="flex flex-col lg:flex-row lg:gap-x-4 px-4 pt-4 pb-32 max-w-7xl ">
          <LLButton
            text="X"
            href="/articles"
            className="fixed top-0 right-0 z-50 h-16 items-baseline aspect-square justify-center rounded-none gap-0 p-4 bg-background/10 backdrop-blur-sm text-4xl font-baskerVilleOld w-min"
          />

          {coverImage?.asset && (
            <div className="relative w-1/2 aspect-3/4 lg:w-full h-[50vh] mb-4">
              <Image
                src={urlFor(coverImage).url()}
                alt={coverImage.alt ?? title}
                fill
                className="object-contain object-top-left"
              />
            </div>
          )}
          <div className="col-span-2">
            {issue && (
              <p className="font-mono text-foreground/40 tracking-widest text-sm uppercase mb-3">
                <Link
                  href={`/shop/${issue.slug?.current}`}
                  className="hover:text-foreground transition-colors"
                >
                  LL#{issue.issueNumber} — {issue.title}
                </Link>
              </p>
            )}

            <h1 className="font-baskervilleSC text-3xl lg:text-5xl  tracking-widest leading-normal mb-6 max-w-3xl">
              {title}
            </h1>

            <div className="flex flex-col items-start gap-0 mb-16 pb-6 w-full max-w-xl justify-start">
              {author && (
                <Link
                  href={`/authors/${author.slug.current}`}
                  className="font-baskerVV text-lg lg:text-xl tracking-widest hover:opacity-60 transition-opacity mb-2"
                >
                  {author.name}
                </Link>
              )}
              {publishedAt && (
                <p className="font-baskervilleClassic italic text-base tracking-widest ">
                  {formatDate(publishedAt)}
                </p>
              )}
            </div>

            {plainText ? (
              <MagicText
                text={plainText}
                indent
                illustrations={illustrations}
              />
            ) : body ? (
              <SanityPortableText value={body} />
            ) : null}
          </div>
        </article>
      </ScrollContainerContext.Provider>
    </motion.div>
  );
}
