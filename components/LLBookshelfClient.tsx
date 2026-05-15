"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useIssues, type Issue } from "@/lib/contexts/IssuesContext";
import { useArticles, type Article } from "@/lib/contexts/ArticlesContext";
import { urlFor } from "@/lib/sanity/image";
import { getDimensions } from "@/lib/getDimensions";
import { Button } from "./ui/button";

type ShelfMode = "framsida" | "rygg" | "baksida";
const MODES: ShelfMode[] = ["framsida", "rygg", "baksida"];
const MOBILE_SPINE_SCALE = 3;

const ARTICLE_COLORS = [
  "#2D4A3E",
  "#8B1A1A",
  "#1A3A5C",
  "#4A3728",
  "#3D2B5E",
  "#1A4A2E",
  "#5C3A1A",
  "#2A3D5C",
  "#4A1A2E",
  "#1A4A4A",
];

function BottomControls({
  mode,
  onSetMode,
  showIssues,
  showArticles,
  onToggleIssues,
  onToggleArticles,
}: {
  mode: ShelfMode;
  onSetMode: (m: ShelfMode) => void;
  showIssues: boolean;
  showArticles: boolean;
  onToggleIssues: () => void;
  onToggleArticles: () => void;
}) {
  return (
    <div className="fixed top-12 lg:top-auto bottom-auto lg:bottom-0  left-0  z-40 flex  flex-row gap-y-6 gap-x-6 tracking-widest p-4 w-full lg:h-12 lg:items-center lg:bg-[#FCC5F8] text-foreground">
      <div className="flex flex-col lg:flex-row gap-x-4 w-1/2">
        {MODES.map((m, i) => (
          <Button
            key={m}
            variant="link"
            onClick={() => onSetMode(m)}
            className={`transition-all font-baskerVilleOld whitespace-nowrap w-min  ${i > 0 ? "-ml-px" : ""} ${
              mode === m ? "" : ""
            }`}
          >
            {mode === m ? "(X)" : "( )"} {m.toUpperCase()}
          </Button>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-x-3 font-mono text-xs tracking-widest">
        <Button
          variant="link"
          onClick={onToggleIssues}
          className="font-baskerVilleOld w-min  cursor-pointer whitespace-nowrap select-none uppercase"
        >
          {showIssues ? "(X)" : "( )"} nummer
        </Button>
        <Button
          variant="link"
          onClick={onToggleArticles}
          className="font-baskerVilleOld w-min   cursor-pointer whitespace-nowrap select-none uppercase "
        >
          {showArticles ? "(X)" : "( )"} artiklar
        </Button>
      </div>
    </div>
  );
}

function IssueItem({
  issue,
  mode,
  isDesktop,
  featured = false,
}: {
  issue: Issue;
  mode: ShelfMode;
  isDesktop: boolean;
  featured?: boolean;
}) {
  const dims = getDimensions(issue.dimensions);
  const src = issue.coverImage?.asset ? urlFor(issue.coverImage).url() : null;
  const href = `/shop/${issue.slug.current}`;
  const effectiveMode = featured ? "framsida" : mode;

  if (effectiveMode === "rygg") {
    return (
      <Link
        href={href}
        className="relative shrink-0 w-full overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 lg:w-auto lg:h-[75vh]"
        style={{
          aspectRatio: isDesktop
            ? dims.spineAspectRatio
            : 1 / (dims.spineAspectRatio * MOBILE_SPINE_SCALE),
          clipPath: isDesktop ? undefined : "inset(0)",
        }}
      >
        {src &&
          (isDesktop ? (
            <Image
              src={src}
              fill
              alt={issue.coverImage?.alt ?? issue.title}
              className="object-cover object-center"
            />
          ) : (
            <div
              style={{
                position: "absolute",
                width: `${dims.spineAspectRatio * MOBILE_SPINE_SCALE * 100}vw`,
                height: "100vw",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-90deg)",
              }}
            >
              <Image
                src={src}
                fill
                alt={issue.coverImage?.alt ?? issue.title}
                className="object-cover object-center"
              />
            </div>
          ))}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`relative shrink-0 overflow-hidden hover:opacity-90 transition-opacity duration-300 ${
        isDesktop ? "h-[65vh]" : "w-full max-w-[65vw]"
      }`}
      style={{ aspectRatio: dims.coverAspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={issue.coverImage?.alt ?? issue.title}
          className={`object-cover ${effectiveMode === "framsida" ? "object-right" : "object-left"}`}
        />
      ) : (
        <div className="absolute inset-0 bg-foreground/20" />
      )}
    </Link>
  );
}

function ArticleItem({
  article,
  index,
  mode,
  isDesktop,
}: {
  article: Article;
  index: number;
  mode: ShelfMode;
  isDesktop: boolean;
}) {
  const color = ARTICLE_COLORS[index % ARTICLE_COLORS.length];
  const src = article.coverImage?.asset
    ? urlFor(article.coverImage).url()
    : null;
  const href = `/articles/${article.slug.current}`;
  const dims = getDimensions();

  if (mode === "rygg") {
    return (
      <Link
        href={href}
        className="relative shrink-0 w-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300 lg:w-8 lg:h-[65vh]"
        style={{
          aspectRatio: isDesktop
            ? undefined
            : 1 / (dims.spineAspectRatio * MOBILE_SPINE_SCALE),
        }}
      >
        <div className="absolute inset-0" style={{ background: color }} />
        <span className="flex absolute inset-0 items-center justify-center">
          <span
            className="font-baskervilleSC text-background text-xs tracking-widest whitespace-nowrap"
            style={
              isDesktop
                ? { writingMode: "vertical-rl", transform: "rotate(180deg)" }
                : undefined
            }
          >
            {article.title}
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`relative shrink-0 overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-300 shadow-md ${
        isDesktop ? "h-[65vh]" : "w-full max-w-[65vw]"
      }`}
      style={{ aspectRatio: dims.coverAspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={article.coverImage?.alt ?? article.title}
          className={`object-cover ${mode === "framsida" ? "object-right" : "object-left"}`}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: color }} />
      )}
    </Link>
  );
}

export default function LLBookshelfClient() {
  const [mode, setMode] = useState<ShelfMode>("rygg");
  const [showIssues, setShowIssues] = useState(true);
  const [showArticles, setShowArticles] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const issues = useIssues();
  const { articles } = useArticles();

  return (
    <>
      <BottomControls
        mode={mode}
        onSetMode={setMode}
        showIssues={showIssues}
        showArticles={showArticles}
        onToggleIssues={() => setShowIssues((v) => !v)}
        onToggleArticles={() => setShowArticles((v) => !v)}
      />
      <div
        className={`flex w-full h-dvh lg:min-h-dvh pt-16 lg:pt-0  lg:pb-12 ${
          mode === "rygg"
            ? "flex-col gap-0 justify-end items-end lg:flex-row lg:flex-wrap lg:items-end lg:justify-start"
            : "flex-col items-center gap-2 lg:flex-row lg:flex-wrap lg:items-end lg:justify-start"
        }`}
      >
        {showIssues && issues.length > 0 && mode !== "framsida" && (
          <IssueItem
            key={`${issues[0]._id}-featured`}
            issue={issues[0]}
            mode={mode}
            isDesktop={isDesktop}
            featured
          />
        )}
        {showIssues &&
          issues.map((issue) => (
            <IssueItem
              key={issue._id}
              issue={issue}
              mode={mode}
              isDesktop={isDesktop}
            />
          ))}
        {showArticles &&
          articles.map((article, i) => (
            <ArticleItem
              key={article._id}
              article={article}
              index={i}
              mode={mode}
              isDesktop={isDesktop}
            />
          ))}
      </div>
    </>
  );
}
