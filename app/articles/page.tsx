"use client";

import ArticleCard from "@/components/ArticleCard";
import HeroArticlePage from "@/components/HeroArticlePage";
import LLNav from "@/components/LLNav";
import LLogo from "@/components/LogoNav";
import LogoNav from "@/components/LogoNav";

export default function ArticlesPage() {
  return (
    <section className="flex flex-col mt-[25vh] w-full ">
      <LogoNav />
      <LLNav />
      <HeroArticlePage />

      <div className="flex flex-col p-4 w-full">
        <ArticleCard />
      </div>
    </section>
  );
}
