"use client";

import { useState } from "react";
import { useArticles, type Series } from "@/lib/contexts/ArticlesContext";
import ArticleCard from "@/components/ArticleCard";
import HeroArticlePage from "@/components/HeroArticlePage";

export default function ArticlesPage() {
  const { articles, series } = useArticles();
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  const filteredArticles = selectedSeries
    ? articles.filter((a) => a.series?.slug.current === selectedSeries)
    : articles;

  return (
    <section className="flex flex-col mt-[25vh] w-full">
      <HeroArticlePage />

      {series.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border-t border-foreground mt-8">
          {series.map((s) => (
            <SeriesCard
              key={s._id}
              series={s}
              selected={selectedSeries === s.slug.current}
              onClick={() =>
                setSelectedSeries(
                  selectedSeries === s.slug.current ? null : s.slug.current
                )
              }
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border-t border-foreground mt-8">
        {filteredArticles.length === 0 ? (
          <p className="col-span-full p-4 font-baskervilleClassic italic text-foreground/40 tracking-widest">
            Inga artiklar.
          </p>
        ) : (
          filteredArticles.map((article) => (
            <div
              key={article._id}
              className="border-b border-foreground p-4 md:border-r last:border-r-0"
            >
              <ArticleCard article={article} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SeriesCard({
  series,
  selected,
  onClick,
}: {
  series: Series;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start text-left p-6 border-b border-foreground md:border-r transition-colors duration-300 ${
        selected ? "bg-foreground text-background" : "hover:bg-foreground/5"
      }`}
    >
      <h2 className="text-3xl font-baskerVilleOld uppercase tracking-[.25em] leading-relaxed">
        {series.title}
      </h2>
      {series.aboutText && (
        <p
          className={`mt-2 text-sm font-baskervilleClassic italic tracking-wider leading-relaxed ${
            selected ? "opacity-80" : "opacity-60"
          }`}
        >
          {series.aboutText}
        </p>
      )}
    </button>
  );
}
