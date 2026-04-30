"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/lib/sanity/image";
import type { Article } from "@/lib/contexts/ArticlesContext";

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticleCard({ article }: { article: Article }) {
  const [hovered, setHovered] = useState(false);

  const bgSrc = article.coverImage?.asset
    ? urlFor(article.coverImage).width(800).url()
    : null;

  return (
    <Link
      href={`/articles/${article.slug.current}`}
      className={`relative flex flex-col items-start justify-between ${hovered ? "h-[80vh] px-6 pt-8 pb-12" : "h-auto px-0 pt-0 pb-0"} cursor-pointer overflow-hidden`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered && bgSrc && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, filter: "blur(24px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={bgSrc}
              alt={article.coverImage?.alt ?? ""}
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1
        className="text-4xl font-baskerVilleOld uppercase tracking-[.25em] leading-relaxed relative z-10"
        animate={{ color: hovered ? "#ffffff" : "#000000" }}
        transition={{ duration: 0.3 }}
      >
        {article.title}
      </motion.h1>

      <span className="relative z-10">
        {article.author && (
          <motion.h2
            className="text-2xl font-baskerVilleOld tracking-widest leading-relaxed"
            animate={{ color: hovered ? "#ffffff" : "#000000" }}
            transition={{ duration: 0.3 }}
          >
            {article.author.name}
          </motion.h2>
        )}
        <motion.h3
          className="text-xl font-baskervilleClassic italic tracking-wider leading-relaxed"
          animate={{ color: hovered ? "#ffffff" : "#000000" }}
          transition={{ duration: 0.3 }}
        >
          {formatDate(article.publishedAt)}
          {article.issue && ` — LL#${article.issue.issueNumber}`}
        </motion.h3>
      </span>
    </Link>
  );
}
