"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { useIssues, type Issue } from "@/lib/contexts/IssuesContext";
import { useArticles, type Article } from "@/lib/contexts/ArticlesContext";
import { urlFor } from "@/lib/sanity/image";
import { getDimensions } from "@/lib/getDimensions";
import { Button } from "./ui/button";
import IssueCard from "./IssueCard";

type ShelfMode = "fram" | "rygg" | "bak";
const MODES: ShelfMode[] = ["fram", "rygg", "bak"];
const SHELF_COLORS = ["#FCC5F8", "#C5F8FC", "#F8FCC5"];

export function BookshelfButton({
  label,
  colorIndex,
  onClick,
  currentMode,
}: {
  label: string;
  colorIndex: number;
  onClick?: () => void;
  currentMode?: ShelfMode;
}) {
  const bg = SHELF_COLORS[colorIndex % SHELF_COLORS.length];
  return (
    <>
      {/* Mobile — always horizontal */}
      <button
        onClick={onClick}
        style={{ backgroundColor: bg }}
        className="lg:hidden w-full flex justify-center items-center gap-2 font-baskervilleSC text-2xl h-14 tracking-widest hover:opacity-60 lowercase text-foreground transition-opacity"
      >
        {label}
        {currentMode && <span className="">({currentMode})</span>}
      </button>
      {/* Desktop — always vertical */}
      <button
        onClick={onClick}
        style={{ backgroundColor: bg }}
        className="hidden lg:flex flex-col shrink-0 w-14 hover:w-16 h-dvh max-h-[65vh] items-center pt-8 justify-start pl-1 gap-4 font-baskervilleSC tracking-widest text-2xl lowercase text-foreground hover:opacity-80 transition-opacity"
      >
        <span style={{ writingMode: "vertical-rl" }}>{label}</span>
        {currentMode && (
          <span className="" style={{ writingMode: "vertical-rl" }}>
            ({currentMode})
          </span>
        )}
      </button>
    </>
  );
}

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
    <div className="hidden fixed top-auto bottom-0 left-14 z-30  flex-row gap-y-6 gap-x-6 tracking-widest p-4 w-full lg:h-12 lg:items-center lg:bg-[#FCC5F8] text-foreground">
      <div className="flex flex-col lg:flex-row gap-x-4 w-1/2">
        {MODES.map((m, i) => (
          <Button
            key={m}
            variant="link"
            onClick={() => onSetMode(m)}
            className={`transition-all font-baskerVilleOld whitespace-nowrap w-min ${i > 0 ? "-ml-px" : ""}`}
          >
            {mode === m ? "(X)" : "( )"} {m.toUpperCase()}
          </Button>
        ))}
      </div>
      <div className="flex flex-col lg:flex-row gap-x-3 font-mono text-xs tracking-widest">
        <Button
          variant="link"
          onClick={onToggleIssues}
          className="font-baskerVilleOld w-min cursor-pointer whitespace-nowrap select-none uppercase"
        >
          {showIssues ? "(X)" : "( )"} nummer
        </Button>
        <Button
          variant="link"
          onClick={onToggleArticles}
          className="font-baskerVilleOld w-min cursor-pointer whitespace-nowrap select-none uppercase"
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
  index: _issueIndex = 0,
  onSelect,
}: {
  issue: Issue;
  mode: ShelfMode;
  isDesktop: boolean;
  featured?: boolean;
  index?: number;
  onSelect: (issue: Issue) => void;
}) {
  const dims = getDimensions(issue.dimensions);
  const src = issue.cover?.asset ? urlFor(issue.cover).url() : null;
  const href = `/shop/${issue.slug.current}`;
  const effectiveMode = featured ? "framsida" : mode;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onSelect(issue);
  }

  if (effectiveMode === "rygg") {
    const issueLabel = `LL (${issue.issueNumber})`;
    const titleLabel = `${issue.title}`;
    if (!isDesktop) {
      return (
        <Link
          href={href}
          onClick={handleClick}
          className="relative w-full shrink-0 snap-start flex items-center justify-between px-6 h-14 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 font-baskervilleSC text-2xl tracking-widest lowercase text-foreground"
        >
          {src && <Image src={src} fill alt="" className="object-cover blur-md scale-150" />}
          <span className="relative z-10 mix-blend-difference text-background">{titleLabel}</span>
          <span className="relative z-10 mix-blend-difference text-background">{issueLabel}</span>
        </Link>
      );
    }
    return (
      <Link
        href={href}
        onClick={handleClick}
        className="relative shrink-0 snap-start flex flex-col items-center justify-between pt-8 pb-8 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 w-14"
        style={{ height: `min(${dims.coverHeightPx}px, 100dvh)` }}
      >
        {src && <Image src={src} fill alt="" className="object-cover blur-md scale-150" />}
        <span
          className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-2xl tracking-widest whitespace-nowrap lowercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {titleLabel}
        </span>
        <span
          className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-xl tracking-widest whitespace-nowrap lowercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {issueLabel}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`relative shrink-0 snap-start overflow-hidden hover:opacity-90 transition-opacity duration-300 max-h-[80dvh] ${
        isDesktop ? "" : "w-1/2"
      }`}
      style={{
        aspectRatio: dims.coverAspectRatio,
        ...(isDesktop && { height: `min(${dims.coverHeightPx}px, 100dvh)` }),
      }}
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={issue.cover?.alt ?? issue.title}
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
  index: _index,
  mode,
  isDesktop,
}: {
  article: Article;
  index: number;
  mode: ShelfMode;
  isDesktop: boolean;
}) {
  const src = article.coverImage?.asset
    ? urlFor(article.coverImage).url()
    : null;
  const href = `/articles/${article.slug.current}`;
  const dims = getDimensions();

  if (mode === "rygg") {
    const issueLabel = article.issue ? `LL (${article.issue.issueNumber})` : "";
    if (!isDesktop) {
      return (
        <Link
          href={href}
          className="relative w-full shrink-0 snap-start flex items-center justify-between px-6 h-14 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 font-baskervilleSC text-2xl tracking-widest lowercase text-foreground"
        >
          {src && <Image src={src} fill alt="" className="object-cover blur-md scale-150" />}
          <span className="relative z-10 mix-blend-difference text-background">{article.title}</span>
          {issueLabel && <span className="relative z-10 mix-blend-difference text-background">{issueLabel}</span>}
        </Link>
      );
    }
    return (
      <Link
        href={href}
        className="relative shrink-0 snap-start flex flex-col items-center justify-between py-4 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 w-14"
        style={{ height: "100dvh" }}
      >
        {src && <Image src={src} fill alt="" className="object-cover blur-md scale-150" />}
        <span
          className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-2xl tracking-widest whitespace-nowrap lowercase"
          style={{ writingMode: "vertical-rl" }}
        >
          {article.title}
        </span>
        {issueLabel && (
          <span
            className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-xl tracking-widest whitespace-nowrap lowercase"
            style={{ writingMode: "vertical-rl" }}
          >
            {issueLabel}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`relative shrink-0 snap-start overflow-hidden hover:opacity-80 transition-opacity duration-300 flex flex-col items-center justify-between py-4 max-h-[80dvh] ${
        isDesktop ? "h-dvh" : "w-1/2"
      }`}
      style={{ aspectRatio: isDesktop ? dims.coverAspectRatio : "3/4" }}
    >
      {src && <Image src={src} fill alt={article.coverImage?.alt ?? article.title} className="object-cover blur-md scale-110" />}
      {!src && <div className="absolute inset-0 bg-foreground/10" />}
      <span className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-2xl tracking-widest whitespace-nowrap lowercase">
        {article.title}
      </span>
    </Link>
  );
}

function cycleMode(m: ShelfMode): ShelfMode {
  return MODES[(MODES.indexOf(m) + 1) % MODES.length];
}

export default function LLBookshelfClient() {
  const [mode, setMode] = useState<ShelfMode>("rygg");
  const [featuredMode, setFeaturedMode] = useState<ShelfMode>("rygg");
  const [issueMode, setIssueMode] = useState<ShelfMode>("rygg");
  const [articleMode, setArticleMode] = useState<ShelfMode>("fram");
  const [showIssues, setShowIssues] = useState(true);
  const [showArticles, setShowArticles] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({ container: containerRef });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (window.innerWidth < 1024) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    window.addEventListener("wheel", handler, { passive: false });
    return () => window.removeEventListener("wheel", handler);
  }, []);

  const issues = useIssues();
  const { articles } = useArticles();

  function handleSetMode(m: ShelfMode) {
    setMode(m);
    setFeaturedMode(m);
    setIssueMode(m);
    setArticleMode(m);
  }

  return (
    <>
      <BottomControls
        mode={mode}
        onSetMode={handleSetMode}
        showIssues={showIssues}
        showArticles={showArticles}
        onToggleIssues={() => setShowIssues((v) => !v)}
        onToggleArticles={() => setShowArticles((v) => !v)}
      />
      <div
        ref={containerRef}
        className={`flex flex-row flex-wrap items-start w-full ml-0 lg:ml-14 bg-neutral-300 justify-start min-h-dvh pt-14 lg:pt-0 lg:pb-0 gap-0 lg:flex-nowrap lg:flex-row lg:items-end lg:h-dvh lg:overflow-x-auto ${issueMode === "fram" ? "lg:snap-x lg:snap-mandatory" : ""}`}
      >
        <BookshelfButton
          label="senaste numret"
          colorIndex={0}
          onClick={() => setFeaturedMode(cycleMode(featuredMode))}
          currentMode={featuredMode}
        />
        {showIssues && issues.length > 0 && (
          <IssueItem
            key={`${issues[0]._id}-featured`}
            issue={issues[0]}
            mode={featuredMode}
            isDesktop={isDesktop}
            featured
            onSelect={setSelectedIssue}
          />
        )}
        <BookshelfButton
          label="alla nummer"
          colorIndex={1}
          onClick={() => setIssueMode(cycleMode(issueMode))}
          currentMode={issueMode}
        />
        {showIssues &&
          issues
            .slice(1)
            .map((issue, i) => (
              <IssueItem
                key={issue._id}
                issue={issue}
                mode={issueMode}
                isDesktop={isDesktop}
                index={i + 1}
                onSelect={setSelectedIssue}
              />
            ))}
        <BookshelfButton
          label="artiklar"
          colorIndex={2}
          onClick={() => setArticleMode(cycleMode(articleMode))}
          currentMode={articleMode}
        />
        {showArticles &&
          articles.map((article, i) => (
            <ArticleItem
              key={article._id}
              article={article}
              index={i}
              mode={articleMode}
              isDesktop={isDesktop}
            />
          ))}
      </div>
      <IssueCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </>
  );
}
