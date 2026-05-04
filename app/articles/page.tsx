"use client";

import { useState } from "react";
import { useArticles, type Series } from "@/lib/contexts/ArticlesContext";
import ArticleCard from "@/components/ArticleCard";

const SPINE_HEIGHTS = [
  "h-12 lg:h-[75vh]",
  "h-12 lg:h-[60vh]",
  "h-12 lg:h-[80vh]",
  "h-12 lg:h-[55vh]",
  "h-12 lg:h-[70vh]",
  "h-12 lg:h-[65vh]",
];

const SPINE_COLORS = [
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

export default function ArticlesPage() {
  const { articles, series } = useArticles();
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const filteredArticles = selectedSeries
    ? articles.filter((a) => a.series?.slug.current === selectedSeries)
    : articles;

  return (
    <section className="flex flex-col-reverse lg:flex-row lg:items-end w-full min-h-dvh lg:h-dvh p-4 gap-0 overflow-y-auto lg:overflow-hidden">
      {series.map((s, i) => (
        <SeriesCard
          key={s._id}
          series={s}
          index={i}
          selected={selectedSeries === s.slug.current}
          onClick={() =>
            setSelectedSeries(
              selectedSeries === s.slug.current ? null : s.slug.current,
            )
          }
        />
      ))}

      <div className="flex flex-col-reverse lg:flex-row lg:items-end flex-1 gap-0">
        {filteredArticles.length === 0 ? (
          <p className="font-baskervilleClassic italic text-foreground/40 tracking-widest p-4 lg:self-end lg:pb-4">
            Inga artiklar.
          </p>
        ) : (
          filteredArticles.map((article, i) => (
            <ArticleCard key={article._id} article={article} index={i} />
          ))
        )}
      </div>
    </section>
  );
}

function SeriesCard({
  series,
  index,
  selected,
  onClick,
}: {
  series: Series;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const height = SPINE_HEIGHTS[index % SPINE_HEIGHTS.length];
  const color = SPINE_COLORS[index % SPINE_COLORS.length];

  return (
    <button
      onClick={onClick}
      className={`relative w-full lg:w-8 lg:shrink-0 ${height} overflow-hidden transition-opacity duration-300 `}
    >
      <div className="absolute inset-0 bg-[#B3F7FE]" />
      <span className="lg:hidden absolute inset-0 flex items-center px-4">
        <span className="font-baskervilleSC text-foreground text-sm tracking-widest truncate">
          {series.title}
        </span>
      </span>
      <span className="hidden lg:flex absolute inset-0 items-center justify-center bg-[#B3F7FE]">
        <span
          className="font-baskervilleSC text-foeground text-sm tracking-widest whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {series.title}
        </span>
      </span>
    </button>
  );
}
