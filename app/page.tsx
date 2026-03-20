"use client";

import ArticleCard from "@/components/ArticleCard";
import HeroArticlePage from "@/components/HeroArticlePage";
import LogoNav from "@/components/LogoNav";
import Reader from "@/components/Reader";

export default function Home() {
  return (
    <>
      <LogoNav />
      <section className="flex flex-col mt-[100vh]">
        <HeroArticlePage />
        <hr className="border-t border-foreground mx-4" />
        <div className="flex flex-col p-4">
          <ArticleCard />
        </div>
      </section>
    </>
  );
}
