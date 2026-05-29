"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useIssues, type Issue } from "@/lib/contexts/IssuesContext";
import { useArticles, type Article } from "@/lib/contexts/ArticlesContext";
import { useBookshelfSettings } from "@/lib/contexts/BookshelfSettingsContext";
import { urlFor } from "@/lib/sanity/image";
import { getDimensions } from "@/lib/getDimensions";
import IssueCard from "./IssueCard";
import { Button } from "./ui/button";

export type BookshelfVariant = "home" | "issues" | "articles";

const DEFAULT_DIMS = getDimensions();

const VIEW_MODES = [
  { key: "rygg" as const, label: "Bokhylla" },
  { key: "fram" as const, label: "Framsida" },
  { key: "bak" as const, label: "Baksida" },
];

function ViewToggle() {
  const { mode, setMode } = useBookshelfSettings();
  const idx = VIEW_MODES.findIndex((m) => m.key === mode);
  const current = VIEW_MODES[idx < 0 ? 0 : idx];
  function cycle() {
    setMode(VIEW_MODES[(idx + 1) % VIEW_MODES.length].key);
  }
  return (
    <>
      <button
        onClick={cycle}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 font-baskervilleSC text-sm tracking-widest h-10 lowercase bg-background border border-foreground/20 px-6 pt-1 pb-2 hover:opacity-60 transition-opacity"
      >
        {current.label}
      </button>
      <button
        onClick={cycle}
        className="hidden lg:flex fixed top-0 left-14 z-40 h-12 items-center px-6 pb-1 font-baskervilleSC text-lg tracking-widest lowercase text-foreground bg-background border-b border-r border-foreground/20 hover:opacity-60 transition-opacity"
      >
        {current.label}
      </button>
    </>
  );
}

// ─── BookshelfButton ──────────────────────────────────────────────────────
// Vertical spine on desktop, horizontal bar on mobile.
// Pass href for navigation, onClick for interaction, or neither for a label.

export function BookshelfButton({
  label,
  onClick,
  href,
  horizontal = false,
}: {
  label: string;
  colorIndex: number;
  onClick?: () => void;
  href?: string;
  horizontal?: boolean;
}) {
  const barClass =
    "w-full flex mx-auto lg:mx-0 justify-center items-center font-baskervilleSC text-lg h-12 tracking-widest hover:opacity-60 lowercase text-foreground transition-opacity border-b border-foreground/20 bg-background";
  const mobileClass = `lg:hidden ${barClass}`;
  const desktopClass =
    "hidden lg:flex flex-col shrink-0 w-14  h-dvh max-h-[45dvh] items-center pt-8 justify-start pl-1 font-baskervilleSC tracking-widest text-xl lowercase text-foreground hover:opacity-80 transition-opacity bg-background";

  if (horizontal) {
    if (href)
      return (
        <Link href={href} className={barClass}>
          {label}
        </Link>
      );
    if (onClick)
      return (
        <button onClick={onClick} className={barClass}>
          {label}
        </button>
      );
    return <div className={barClass}>{label}</div>;
  }

  const desktopLabel = (
    <span style={{ writingMode: "vertical-rl" }}>{label}</span>
  );

  if (href) {
    return (
      <>
        <Link href={href} className={mobileClass}>
          {label}
        </Link>
        <Link href={href} className={desktopClass}>
          {desktopLabel}
        </Link>
      </>
    );
  }

  if (onClick) {
    return (
      <>
        <button onClick={onClick} className={mobileClass}>
          {label}
        </button>
        <button onClick={onClick} className={desktopClass}>
          {desktopLabel}
        </button>
      </>
    );
  }

  return (
    <>
      <div className={mobileClass}>{label}</div>
      <div className={desktopClass}>{desktopLabel}</div>
    </>
  );
}

// ─── Issue spine (rygg view) ──────────────────────────────────────────────

function IssueSpine({
  issue,
  isDesktop,
  onSelect,
}: {
  issue: Issue;
  isDesktop: boolean;
  onSelect: (issue: Issue) => void;
}) {
  const dims = getDimensions(issue.dimensions);
  const src = issue.cover?.asset ? urlFor(issue.cover).url() : null;
  const href = `/shop/${issue.slug.current}`;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onSelect(issue);
  }

  if (!isDesktop) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className="relative w-full shrink-0 flex items-center justify-between px-6 h-14 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 font-baskervilleSC text-xl tracking-widest lowercase bg-background text-foreground border-b border-foreground/20"
      >
        {src && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-10 aspect-17/24 overflow-hidden">
            <Image src={src} fill alt="" className="object-cover" />
          </div>
        )}
        <span className="relative z-10 min-w-0 truncate">{issue.title}</span>
        <span className="relative z-10 shrink-0">LL ({issue.issueNumber})</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="relative shrink-0 flex flex-col items-center justify-between pt-8 pb-8 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 w-14 bg-background border-r border-foreground/20"
      style={{ height: `min(${dims.coverHeightPx}px, 75dvh)` }}
    >
      <span
        className="relative z-10 font-baskervilleSC text-foreground text-2xl tracking-widest lowercase whitespace-nowrap overflow-hidden"
        style={{ writingMode: "vertical-rl", maxWidth: "calc(75dvh - 6rem)" }}
      >
        {issue.title}
      </span>
      <span
        className="relative z-10 font-baskervilleSC text-foreground text-xl tracking-widest whitespace-nowrap lowercase shrink-0"
        style={{ writingMode: "vertical-rl" }}
      >
        LL ({issue.issueNumber})
      </span>
    </Link>
  );
}

// ─── Issue front cover (fram view) ───────────────────────────────────────

function IssueFront({
  issue,
  onSelect,
  className = "",
}: {
  issue: Issue;
  onSelect: (issue: Issue) => void;
  className?: string;
}) {
  const dims = getDimensions(issue.dimensions);
  const src = issue.cover?.asset ? urlFor(issue.cover).url() : null;
  const href = `/shop/${issue.slug.current}`;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    onSelect(issue);
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`relative overflow-hidden hover:opacity-90 transition-opacity duration-300 min-h-[50dvh] h-auto shadow lg:max-h-full flex items-end ${className}`}
      style={{ aspectRatio: dims.coverAspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={issue.cover?.alt ?? issue.title}
          className="object-cover object-right"
        />
      ) : (
        <div className=" h-full lg:h-[50dvh] aspect-17/24 bg-foreground/20 flex flex-col justify-end items-start p-4">
          <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest leading-tight">
            {issue.title}
          </span>
          <span className="font-baskerville text-foreground/60 text-xs mt-1">
            LL ({issue.issueNumber})
          </span>
        </div>
      )}
    </Link>
  );
}

// ─── Article front cover ──────────────────────────────────────────────────

function ArticleFront({
  article,
  className = "",
}: {
  article: Article;
  className?: string;
}) {
  const src = article.coverImage?.asset
    ? urlFor(article.coverImage).url()
    : null;
  const href = `/articles/${article.slug.current}`;

  return (
    <Link
      href={href}
      className={`relative shadow overflow-hidden hover:opacity-80 transition-opacity duration-300  h-[50dvh] flex items-center ${className}`}
      style={{ aspectRatio: DEFAULT_DIMS.coverAspectRatio }}
    >
      {src ? (
        <Image
          src={src}
          fill
          alt={article.coverImage?.alt ?? article.title}
          className="object-cover h-full lg:h-[50dvh] aspect-17/24"
        />
      ) : (
        <div className="h-full lg:h-[50dvh] aspect-17/24 bg-foreground/10 flex flex-col justify-center items-center p-6">
          <span className="font-baskervilleSC  text-foreground lowercase text-sm tracking-widest leading-tight">
            {article.title}
          </span>
          {article.author && (
            <span className="font-baskerville text-foreground/60 text-xs mt-1">
              {article.author.name}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}

// ─── Article spine ────────────────────────────────────────────────────────
// vertical=true: desktop shows a narrow w-14 vertical spine (like IssueSpine),
//                mobile shows a horizontal bar.
// vertical=false (default): always a horizontal bar (used inside series columns).

function ArticleSpine({
  article,
  vertical = false,
}: {
  article: Article;
  vertical?: boolean;
}) {
  const src = article.coverImage?.asset
    ? urlFor(article.coverImage).url()
    : null;
  const href = `/articles/${article.slug.current}`;

  const horizontalBar = (
    <Link
      href={href}
      className="relative w-full shrink-0 flex items-center justify-between px-6 h-14 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 border-b border-foreground/20"
    >
      {src ? (
        <Image
          src={src}
          fill
          alt=""
          className="object-cover blur-md scale-150"
        />
      ) : (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-10 aspect-17/24 bg-foreground/20" />
      )}
      <span className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-xl tracking-widest lowercase min-w-0 truncate">
        {article.title}
      </span>
      {article.issue && (
        <span className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-lg tracking-widest lowercase shrink-0">
          LL ({article.issue.issueNumber})
        </span>
      )}
    </Link>
  );

  if (!vertical) return horizontalBar;

  return (
    <>
      {/* Mobile — horizontal bar */}
      <Link
        href={href}
        className="lg:hidden relative w-full shrink-0 flex items-center justify-between px-6 h-14 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 border-b border-foreground/20"
      >
        {src ? (
          <Image
            src={src}
            fill
            alt=""
            className="object-cover blur-md scale-150"
          />
        ) : (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-10 aspect-17/24 bg-foreground/20" />
        )}
        <span className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-xl tracking-widest lowercase min-w-0 truncate">
          {article.title}
        </span>
      </Link>
      {/* Desktop — vertical spine */}
      <Link
        href={href}
        className="hidden lg:flex relative shrink-0 flex-col items-center justify-between pt-8 pb-8 overflow-hidden opacity-80 hover:opacity-100 transition-opacity duration-300 w-14"
        style={{ height: "75dvh" }}
      >
        {src ? (
          <Image
            src={src}
            fill
            alt=""
            className="object-cover blur-md scale-150"
          />
        ) : (
          <div className="absolute inset-0 bg-background border-r border-foreground/20" />
        )}
        <span
          className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-2xl tracking-widest lowercase whitespace-nowrap overflow-hidden"
          style={{ writingMode: "vertical-rl", maxWidth: "calc(75dvh - 6rem)" }}
        >
          {article.title}
        </span>
        {article.issue && (
          <span
            className="relative z-10 mix-blend-difference font-baskervilleSC text-background text-xl tracking-widest whitespace-nowrap lowercase shrink-0"
            style={{ writingMode: "vertical-rl" }}
          >
            LL ({article.issue.issueNumber})
          </span>
        )}
      </Link>
    </>
  );
}

// ─── Shared hooks ─────────────────────────────────────────────────────────

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

function useHorizontalScrollOnWheel() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
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
  return ref;
}

// ─── HOME SHELF ──────────────────────────────────────────────────────────

function HomeShelf() {
  const issues = useIssues();
  const { articles } = useArticles();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const { mode } = useBookshelfSettings();
  const isDesktop = useIsDesktop();
  const containerRef = useHorizontalScrollOnWheel();

  const latestIssue = issues[0] ?? null;
  const latestArticle = articles[0] ?? null;
  const isGrid = mode === "fram" || mode === "bak";

  return (
    <>
      <ViewToggle />
      {isGrid ? (
        <div className="w-full mt-14 lg:mt-0 lg:ml-14 bg-background min-h-dvh grid grid-cols-2 lg:grid-cols-4 pb-16 lg:pb-0">
          {issues.map((issue) => {
            const src =
              mode === "fram"
                ? issue.cover?.asset
                  ? urlFor(issue.cover).url()
                  : null
                : issue.back?.asset
                  ? urlFor(issue.back).url()
                  : null;
            return (
              <div
                key={issue._id}
                className="aspect-3/4 flex flex-col p-6 w-full mx-auto  border-neutral-300 border-[0.5px] items-center lg:items-start text-center lg:text-start group lg:transition-colors lg:hover:bg-neutral-400"
              >
                <Link
                  href={`/shop/${issue.slug.current}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedIssue(issue);
                  }}
                  className="relative aspect-3/4 overflow-hidden block hover:opacity-90 transition-opacity w-full"
                >
                  <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest mt-2 leading-tight">
                    {issue.title}
                  </span>
                  {src ? (
                    <Image
                      src={src}
                      fill
                      alt={issue.title}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0  flex items-center justify-center p-8">
                      <div className=" w-full aspect-3/4 max-w-39.25 bg-foreground/20 flex items-center justify-center shadow">
                        <span className="font-baskervilleSC text-foreground/40 text-sm tracking-widest lowercase">
                          {mode === "bak" ? "back" : issue.title}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
                <span className="flex w-full justify-center lg:justify-between items-baseline lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <h2 className="hidden lg:block text-lg lowercase tracking-widest font-baskervilleSC">
                    {issue.price} SEK
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-baskervilleSC lowercase tracking-widest justify-center w-min whitespace-nowrap"
                  >
                    köp nu
                  </Button>
                </span>
              </div>
            );
          })}
          {articles.map((article) => {
            const src = article.coverImage?.asset
              ? urlFor(article.coverImage).url()
              : null;
            return (
              <div
                key={article._id}
                className="aspect-3/4 flex flex-col p-6 w-full mx-auto border border-foreground items-center lg:items-start text-center lg:text-start group lg:transition-colors lg:hover:bg-neutral-400"
              >
                <Link
                  href={`/articles/${article.slug.current}`}
                  className="relative aspect-3/4 overflow-hidden block hover:opacity-80 transition-opacity w-full"
                >
                  <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest mt-2 leading-tight">
                    {article.title}
                  </span>
                  {src ? (
                    <Image
                      src={src}
                      fill
                      alt={article.title}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="w-full aspect-3/4 max-w-39.25 bg-foreground/10 flex items-center justify-center shadow">
                        <span className="font-baskervilleSC text-foreground/40 text-sm tracking-widest lowercase">
                          {article.title}
                        </span>
                      </div>
                    </div>
                  )}
                </Link>
                <span className="flex w-full justify-center lg:justify-between items-baseline">
                  <h2 className="hidden lg:block text-lg lowercase tracking-widest font-baskervilleSC">
                    {article.author?.name ?? ""}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="font-baskervilleSC lowercase tracking-widest justify-center w-min whitespace-nowrap"
                  >
                    läs nu
                  </Button>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-col items-center justify-end w-full px-0 mt-0 lg:ml-14 bg-neutral-300 min-h-dvh pb-0 lg:flex-row lg:items-end lg:justify-start lg:h-dvh lg:overflow-x-auto"
        >
          {latestIssue && (
            <IssueFront
              issue={latestIssue}
              onSelect={setSelectedIssue}
              className={`${latestIssue.dimensions ? "max-h-120" : "h-120"} shrink-0`}
            />
          )}
          <BookshelfButton label="alla nummer" colorIndex={1} href="/shop" />
          {latestArticle && (
            <ArticleFront article={latestArticle} className="h-120 shrink-0" />
          )}
          <BookshelfButton
            label="alla artiklar"
            colorIndex={2}
            href="/articles"
          />
        </div>
      )}
      <IssueCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </>
  );
}

// ─── ISSUES SHELF ─────────────────────────────────────────────────────────

function IssuesShelf() {
  const issues = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const { mode } = useBookshelfSettings();
  const isDesktop = useIsDesktop();
  const containerRef = useHorizontalScrollOnWheel();
  const isGrid = mode === "fram" || mode === "bak";

  return (
    <>
      <ViewToggle />
      {isGrid ? (
        <div className="w-full mt-14 lg:mt-12 lg:ml-14 bg-neutral-300 min-h-dvh grid grid-cols-2 lg:grid-cols-4 pb-16 lg:pb-0">
          {issues.map((issue) => {
            const src =
              mode === "fram"
                ? issue.cover?.asset
                  ? urlFor(issue.cover).url()
                  : null
                : issue.back?.asset
                  ? urlFor(issue.back).url()
                  : null;
            return (
              <div
                key={issue._id}
                className="flex flex-col p-4 max-w-39.25 w-full mx-auto items-center lg:items-start text-center lg:text-start"
              >
                <Link
                  href={`/shop/${issue.slug.current}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedIssue(issue);
                  }}
                  className="relative aspect-3/4 overflow-hidden block hover:opacity-90 transition-opacity w-full"
                >
                  {src ? (
                    <Image
                      src={src}
                      fill
                      alt={issue.title}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                      <span className="font-baskervilleSC text-foreground/40 text-sm tracking-widest lowercase">
                        {mode === "bak" ? "back" : issue.title}
                      </span>
                    </div>
                  )}
                </Link>
                <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest mt-2 leading-tight">
                  {issue.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-baskervilleSC lowercase tracking-widest px-0 justify-start"
                >
                  köp nu
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-col items-center justify-end w-full lg:mt-0 lg:ml-14 bg-neutral-300 min-h-dvh pb-0 lg:flex-row lg:items-end lg:justify-start lg:h-dvh lg:overflow-x-auto"
        >
          {issues[0] && (
            <IssueFront
              issue={issues[0]}
              onSelect={setSelectedIssue}
              className={`${issues[0].dimensions ? "max-h-120" : "h-120"} shrink-0`}
            />
          )}
          <BookshelfButton label="alla nummer" colorIndex={1} />
          {issues.map((issue) => (
            <IssueSpine
              key={issue._id}
              issue={issue}
              isDesktop={isDesktop}
              onSelect={setSelectedIssue}
            />
          ))}
        </div>
      )}
      <IssueCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </>
  );
}

// ─── ARTICLES SHELF ───────────────────────────────────────────────────────

function ArticlesShelf() {
  const { articles, series } = useArticles();
  const { mode } = useBookshelfSettings();
  const containerRef = useHorizontalScrollOnWheel();
  const latestArticle = articles[0] ?? null;
  const isGrid = mode === "fram" || mode === "bak";

  return (
    <>
      <ViewToggle />
      {isGrid ? (
        <div className="w-full mt-14 lg:mt-12 lg:ml-14 bg-neutral-300 min-h-dvh grid grid-cols-2 lg:grid-cols-4 pb-16 lg:pb-0">
          {articles.map((article) => {
            const src = article.coverImage?.asset
              ? urlFor(article.coverImage).url()
              : null;
            return (
              <div
                key={article._id}
                className="flex flex-col p-4 max-w-39.25 w-full mx-auto items-center lg:items-start text-center lg:text-start"
              >
                <Link
                  href={`/articles/${article.slug.current}`}
                  className="relative aspect-3/4 overflow-hidden block hover:opacity-80 transition-opacity w-full"
                >
                  {src ? (
                    <Image
                      src={src}
                      fill
                      alt={article.title}
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-foreground/10 flex items-end p-3">
                      <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest leading-tight">
                        {article.title}
                      </span>
                    </div>
                  )}
                </Link>
                <span className="font-baskervilleSC text-foreground lowercase text-sm tracking-widest mt-2 leading-tight">
                  {article.title}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-baskervilleSC lowercase tracking-widest px-0 justify-start"
                >
                  läs nu
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-col items-start w-full mt-14 lg:mt-0 lg:ml-14 bg-neutral-300 min-h-dvh pb-0 lg:flex-row lg:items-end lg:h-dvh lg:overflow-x-auto"
        >
          {latestArticle && (
            <ArticleFront article={latestArticle} className="h-120 shrink-0" />
          )}
          {articles
            .filter((a) => !a.series)
            .map((article) => (
              <ArticleSpine key={article._id} article={article} vertical />
            ))}
          {series.map((s, i) => {
            const seriesArticles = articles.filter(
              (a) => a.series?.slug.current === s.slug.current,
            );
            if (seriesArticles.length === 0) return null;
            return (
              <div
                key={s._id}
                className="flex flex-col w-full lg:w-auto lg:min-w-md shrink-0"
              >
                {seriesArticles.map((article) => (
                  <ArticleSpine key={article._id} article={article} />
                ))}
                <BookshelfButton
                  label={s.title}
                  colorIndex={i + 2}
                  horizontal
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────

export default function LLBookshelfClient({
  variant,
}: {
  variant: BookshelfVariant;
}) {
  if (variant === "home") return <HomeShelf />;
  if (variant === "issues") return <IssuesShelf />;
  return <ArticlesShelf />;
}
