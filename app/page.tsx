"use client";

import ArticleCard from "@/components/ArticleCard";
import HeroArticlePage from "@/components/HeroArticlePage";
import LogoNav from "@/components/LogoNav";
import Reader from "@/components/Reader";
import LLNav from "@/components/LLNav";

export default function Home() {
  return (
    <>
      <LogoNav />
      <section className="flex flex-col mt-[25vh] w-full min-h-[200vh]">
        <LLNav />
      </section>
    </>
  );
}
