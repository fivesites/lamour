"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { MagicText } from "@/components/MagicText";
import { ScrollContainerContext } from "@/lib/ScrollContainerContext";
import SanityPortableText from "@/components/SanityPortableText";
import { urlFor } from "@/lib/sanity/image";
import Link from "next/link";
import Image from "next/image";

type ArticleReaderProps = {
  title: string;
  body?: any[];
  plainText: string;
  author?: {
    name: string;
    slug: { current: string };
    image?: { asset: any; alt?: string };
  };
  issue?: { title: string; issueNumber: number; slug: { current: string } };
  publishedAt?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleReader({
  title,
  body,
  plainText,
  author,
  issue,
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
        <article className="max-w-2xl mx-auto px-4 pt-[25vh] pb-32">
          <Link
            href="/articles"
            className="font-baskerVilleOld text-xl tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-10 inline-block"
          >
            ← Artiklar
          </Link>

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

          <h1 className="font-baskerVilleOld text-4xl md:text-5xl uppercase tracking-[0.2em] leading-tight mb-6">
            {title}
          </h1>

          <div className="flex items-center gap-4 mb-12 border-b border-foreground pb-6">
            {author?.image?.asset && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                <Image
                  src={urlFor(author.image).width(80).url()}
                  alt={author.image.alt ?? author.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {author && (
                <Link
                  href={`/authors/${author.slug.current}`}
                  className="font-baskerVilleOld text-xl tracking-widest hover:opacity-60 transition-opacity"
                >
                  {author.name}
                </Link>
              )}
              {publishedAt && (
                <p className="font-baskervilleClassic italic text-sm tracking-wide text-foreground/60">
                  {formatDate(publishedAt)}
                </p>
              )}
            </div>
          </div>

          {plainText ? (
            <MagicText text={plainText} indent />
          ) : body ? (
            <SanityPortableText value={body} />
          ) : null}
        </article>
      </ScrollContainerContext.Provider>
    </motion.div>
  );
}
