"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import LLButton from "./LLButton";
import { useIssues } from "@/lib/contexts/IssuesContext";
import { useArticles } from "@/lib/contexts/ArticlesContext";
import { truncate } from "node:fs";

function ArticleSubMenu({
  setNavOpen,
}: {
  setNavOpen: (open: boolean) => void;
}) {
  const { articles } = useArticles();
  const [openSeries, setOpenSeries] = useState(false);
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal  w-full max-h-[60vh] overflow-y-auto ">
      <div className="flex flex-col pt-2 pl-4 w-full">
        <span
          className={`flex justify-between w-full border-b border-b-foreground py-2 mb-2  `}
        >
          <LLButton
            text="Liveblog från Bokmässan 2025"
            className="font-baskerVilleOld text-4xl w-min justify-start  "
            onClick={() => setOpenSeries(true)}
          />
          <LLButton
            href="/articles"
            text="V"
            className={`font-baskerVilleOld text-4xl w-min mr-2 ${openSeries ? "rotate-0" : "-rotate-90"} `}
            onClick={() => {
              setOpenSeries(!openSeries);
            }}
          />
        </span>
        {openSeries && (
          <>
            {articles.map((article) => (
              <div
                key={article._id}
                className="w-full border-b border-b-foreground "
              >
                <LLButton
                  href={`/articles/${article.slug.current}`}
                  text={article.title}
                  className="font-baskerVilleOld text-4xl justify-start w-min py-2 rounded-none   "
                  onClick={() => setNavOpen(false)}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ShopSubMenu() {
  const issues = useIssues();

  return (
    <div className="flex flex-col items-start justify-start whitespace-normal  w-full max-h-[60vh] overflow-y-auto border-b border-b-foreground">
      <div className="flex flex-col px-4  w-full">
        {issues.map((issue) => (
          <ProductCard
            key={issue._id}
            variant="noIMG"
            articleID={String(issue.issueNumber)}
            title={issue.title}
            href={`/shop/${issue.slug.current}`}
            price={issue.price ? String(Math.round(issue.price / 100)) : "—"}
          />
        ))}
      </div>
    </div>
  );
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
} as const;

export default function LLNav() {
  const [navOpen, setNavOpen] = useState(false);
  const [openArticleSubMenu, setOpenArticleSubMenu] = useState(false);
  const [openShopSubMenu, setOpenShopSubMenu] = useState(false);
  const { articles } = useArticles();
  const issues = useIssues();

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full   flex flex-col items-center justify-start gap-0  pb-3 z-50 transition-colors duration-500 ${openShopSubMenu ? "bg-[#B3F7FE]" : openArticleSubMenu ? "bg-[#FCC5F8]" : navOpen ? " bg-[#E7F8BE]" : "bg-transparent  "} ${navOpen ? "min-h-dvh" : "min-h-auto"}`}
      >
        <div className="w-full flex justify-between">
          {/* LOGO ANIMATION */}
          <motion.div
            className="flex items-center justify-between w-full font-baskerville pt-4 px-4 whitespace-nowrap"
            initial={{ width: "min-content" }}
            animate={{ width: navOpen ? "100%" : "min-content" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <LLButton
              href="/"
              text="L'Amour"
              className="text-4xl w-min justify-start mr-2 "
              hover
              revealAnimation
            />
            <motion.span
              className="self-center block h-px bg-black  min-w-8"
              animate={{ flexGrow: navOpen ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />

            <LLButton
              href="/"
              text="La Mort"
              className="text-4xl w-min justify-start ml-2 "
              hover
              revealAnimation
            />
          </motion.div>
          {/* DESKTOP button */}
          <LLButton
            text={navOpen ? "X" : "II"}
            onClick={() => setNavOpen(!navOpen)}
            className={`h-auto flex items-center justify-center gap-0 p-0 mt-4 mr-6 text-4xl   py-0 w-min ${navOpen ? "rotate-0" : "rotate-90"}  `}
          />
        </div>
        {/* SECOND ROW AFFÄREN / ARTIKLAR */}

        <AnimatePresence>
          {navOpen && (
            <motion.ul
              className="flex flex-col gap-y-2 w-full justify-start items-start font-baskerville py-4 pl-4 pr-4 list-none"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.li className="w-full " variants={ITEM_VARIANTS}>
                <span
                  className={`flex justify-between w-full border-b border-b-foreground py-2 `}
                >
                  {" "}
                  <LLButton
                    href="/shop"
                    text={`Affären(${issues.length})`}
                    className="font-baskerVilleOld text-4xl w-min"
                    onClick={() => {
                      setOpenShopSubMenu(!openShopSubMenu);
                    }}
                  />
                  <LLButton
                    href="/articles"
                    text="V"
                    className={`font-baskerVilleOld text-4xl w-min mr-2 ${openShopSubMenu ? "rotate-0" : "-rotate-90"} `}
                    onClick={() => {
                      setOpenShopSubMenu(!openShopSubMenu);
                    }}
                  />
                </span>
                <AnimatePresence>
                  {openShopSubMenu && <ShopSubMenu />}
                </AnimatePresence>
              </motion.li>
              <motion.li className="w-full " variants={ITEM_VARIANTS}>
                <span
                  className={`flex justify-between w-full border-b border-b-foreground py-2 `}
                >
                  {" "}
                  <LLButton
                    href="/articles"
                    text={`Artiklar(${articles.length})`}
                    className="font-baskerVilleOld text-4xl w-min"
                    onClick={() => {
                      setOpenArticleSubMenu(!openArticleSubMenu);
                    }}
                  />
                  <LLButton
                    href="/articles"
                    text="V"
                    className={`font-baskerVilleOld text-4xl w-min mr-2 ${openArticleSubMenu ? "rotate-0" : "-rotate-90"} `}
                    onClick={() => {
                      setOpenArticleSubMenu(!openArticleSubMenu);
                    }}
                  />
                </span>
                <AnimatePresence>
                  {openArticleSubMenu && (
                    <ArticleSubMenu setNavOpen={setNavOpen} />
                  )}
                </AnimatePresence>
              </motion.li>
              {/* <motion.li className="w-full" variants={ITEM_VARIANTS}>
                <LLButton
                  text="Senaste Nytt"
                  hover
                  active
                  rotate
                  wiggleRotate
                  justify
                  revealAnimation
                  className="w-full text-6xl tracking-wider "
                />
              </motion.li>
              <motion.li className="w-full" variants={ITEM_VARIANTS}>
                <LLButton
                  text="(Prenumerera)"
                  stretch={2}
                  justify
                  active
                  gap="gap-x-[2em]"
                  variant="link"
                  size="linkSize"
                  className="py-4 text-5xl w-full font-baskerVilleOld hover:text-shadow-md"
                />
              </motion.li>
              <motion.li className="w-full" variants={ITEM_VARIANTS}>
                <LLButton
                  text="Om oss"
                  justify
                  revealAnimation
                  className="text-2xl mx-auto tracking-wide font-baskervilleClassic uppercase"
                />
              </motion.li>
              <motion.li className="w-full" variants={ITEM_VARIANTS}>
                <LLButton
                  text="TIDSKRIFTEN"
                  mono
                  revealAnimation
                  className="text-xl justify-center text-center mx-auto font-baskervilleClassic uppercase"
                />
              </motion.li> */}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE BUTTON */}
      {/* <button
        onClick={() => setNavOpen(!navOpen)}
        className="fixed lg:hidden bottom-6 left-1/2 -translate-x-1/2 h-auto flex items-center justify-center gap-0 p-0 z-[90] bg-transparent hover:bg-foreground/10 py-0 w-min text-5xl font-baskerVilleOld transition-colors"
      >
        <span className={`tracking-wide rotate-90 leading-none`}>
          {navOpen ? "X" : "II"}
        </span>
      </button> */}
    </>
  );
}
