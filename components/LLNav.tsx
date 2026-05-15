"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import LLButton from "./LLButton";
import { useIssues } from "@/lib/contexts/IssuesContext";
import { useArticles } from "@/lib/contexts/ArticlesContext";
import { useCart } from "@/lib/contexts/CartContext";
import Stretch from "./Stretch";
import Link from "next/link";
import { Button } from "./ui/button";

/* ─── ARTICLE SUBMENU ─── */

function ArticleSubMenu({
  setNavOpen,
}: {
  setNavOpen: (open: boolean) => void;
}) {
  const { articles } = useArticles();
  const [openSeries, setOpenSeries] = useState(false);
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal w-full max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col   items-start justify-start w-full">
        <span className="flex items-center justify-start text-left whitespace-normal w-full border-b border-b-foreground h-12 px-8">
          <button
            className="font-baskervilleSC text-2xl w-full justify-start whitespace-normal flex flex-wrap items-start text-left"
            onClick={() => setOpenSeries(true)}
          >
            Liveblog från Bokmässan 2025
          </button>
        </span>
        {openSeries && (
          <div className="pl-0">
            {articles.map((article) => (
              <Link
                className=" font-baskervilleSC text-2xl tracking-wider py-2 gap-x-4 flex border-b border-b-foreground px-12 w-full"
                href={`/articles/${article.slug.current}`}
                key={article._id}
              >
                {article.title}
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-end  bg-transparent hover:bg-foreground w-full  ">
          <LLButton
            text="Läs alla"
            className="font-baskerVilleOld text-4xl w-min rounded-none px-8 h-16 bg-transparent text-foreground hover:bg-foreground hover:text-background"
          />
        </div>
      </div>
    </div>
  );
}

function ShopSubMenu({ setNavOpen }: { setNavOpen: (v: boolean) => void }) {
  const issues = useIssues();
  const { addToCart, setDrawerOpen } = useCart();
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal w-full max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col w-full">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="relative flex items-center w-full border-b border-b-foreground justify-between h-12 pl-8 pr-8 lg:pr-6"
          >
            <Link
              className=" font-baskervilleSC text-2xl tracking-wider gap-x-4 flex  justify-start "
              href={`/shop/${issue.slug.current}`}
              key={issue._id}
              onClick={() => setNavOpen(false)}
            >
              <span className="lowercase">LL{issue.issueNumber}</span>
              {issue.title}
            </Link>

            <button
              onClick={() => {
                addToCart({
                  id: issue._id,
                  title: issue.title,
                  price: issue.price != null ? String(issue.price) : "0",
                });
              }}
              className=" text-3xl font-baskervilleSC"
            >
              +
            </button>
          </div>
        ))}
        <div className="flex justify-end  bg-transparent hover:bg-foreground ">
          <LLButton
            text="Till kassan"
            className="font-baskerVilleOld text-4xl w-min rounded-none px-8 h-16 bg-transparent text-foreground hover:bg-foreground hover:text-background"
            onClick={() => {
              setDrawerOpen(true);
              setNavOpen(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
} as const;

/* ─── NAV OVERLAY (shared mobile + desktop) ─── */

function NavOverlay({
  navOpen,
  openShopSubMenu,
  setOpenShopSubMenu,
  openArticleSubMenu,
  setOpenArticleSubMenu,
  setNavOpen,
}: {
  navOpen: boolean;
  openShopSubMenu: boolean;
  setOpenShopSubMenu: (v: boolean) => void;
  openArticleSubMenu: boolean;
  setOpenArticleSubMenu: (v: boolean) => void;
  setNavOpen: (v: boolean) => void;
}) {
  return (
    <AnimatePresence>
      {navOpen && (
        <motion.ul
          className="flex flex-col  w-full justify-start items-start font-baskerville mt-24 lg:mt-0 py-0 list-none gap-y-2"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.li
            className={`w-full lg:col-span-1 ${openShopSubMenu ? "" : ""}`}
            variants={ITEM_VARIANTS}
          >
            <span className="flex justify-between lg:justify-start lg:gap-x-6 w-full border-b border-b-foreground pl-6 pr-6 lg:pr-3 h-16">
              <LLButton
                href="/shop"
                text="Shop / Alla nummer"
                className="font-baskerVilleOld text-4xl w-min"
                onClick={() => {
                  setOpenShopSubMenu(!openShopSubMenu);
                  setOpenArticleSubMenu(false);
                  setNavOpen(false);
                }}
              />
              <LLButton
                text="V"
                className={`font-baskerVilleOld text-4xl w-min mr-2  ${
                  openShopSubMenu ? "rotate-0" : "-rotate-90"
                }`}
                onClick={() => {
                  setOpenShopSubMenu(!openShopSubMenu);
                  setOpenArticleSubMenu(false);
                }}
              />
            </span>
            <AnimatePresence>
              {openShopSubMenu && <ShopSubMenu setNavOpen={setNavOpen} />}
            </AnimatePresence>
          </motion.li>

          <motion.li
            className={`w-full lg:col-span-2  ${!openShopSubMenu ? "" : ""}`}
            variants={ITEM_VARIANTS}
          >
            <span className="flex justify-between lg:justify-start w-full gap-x-8 border-b border-b-foreground pl-6 pr-6 lg:pr-3 h-16">
              <LLButton
                href="/articles"
                text="Alla artiklar"
                className="font-baskerVilleOld text-4xl w-min"
                onClick={() => {
                  setOpenArticleSubMenu(!openArticleSubMenu);
                  setOpenShopSubMenu(false);
                  setNavOpen(false);
                }}
              />
              <LLButton
                text="V"
                className={`font-baskerVilleOld text-4xl w-min mr-2  ${
                  openArticleSubMenu ? "rotate-0" : "-rotate-90"
                }`}
                onClick={() => {
                  setOpenArticleSubMenu(!openArticleSubMenu);
                  setOpenShopSubMenu(false);
                }}
              />
            </span>
            <AnimatePresence>
              {openArticleSubMenu && <ArticleSubMenu setNavOpen={setNavOpen} />}
            </AnimatePresence>
          </motion.li>

          <motion.li
            className="col-start-1 flex flex-col w-full px-3 pt-2 gap-y-2"
            variants={ITEM_VARIANTS}
          >
            <LLButton
              href="/"
              text=" Om Oss"
              className="font-baskerVilleOld text-4xl w-min h-12"
              onClick={() => setNavOpen(false)}
            />
            <LLButton
              href="/"
              text=" Prenumerera"
              className="font-baskerVilleOld text-4xl w-min h-12"
              onClick={() => setNavOpen(false)}
            />
            <LLButton
              href="/"
              text=" Kontakt"
              className="font-baskerVilleOld text-4xl w-min h-12"
              onClick={() => setNavOpen(false)}
            />
            <LLButton
              href="/"
              text=" Nästa nummer, monsieur?"
              className="font-baskerVilleOld text-4xl w-min h-12"
              onClick={() => setNavOpen(false)}
            />
          </motion.li>
        </motion.ul>
      )}
    </AnimatePresence>
  );
}
/* ─── MAIN NAV ─── */

export default function LLNav() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [openArticleSubMenu, setOpenArticleSubMenu] = useState(false);
  const [openShopSubMenu, setOpenShopSubMenu] = useState(false);
  const { articles } = useArticles();
  const issues = useIssues();
  const { totalItems, setDrawerOpen } = useCart();

  if (pathname.startsWith("/studio") || pathname.startsWith("/articles/"))
    return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full flex flex-col items-center  justify-start gap-0 pb-0 z-50 transition-colors duration-500 ${navOpen ? "min-h-dvh bg-[#FCC5F8] lg:min-h-auto" : "min-h-auto h-16 bg-transparent"}`}
    >
      {/* HEADER ROW */}
      <div className="w-full flex justify-between items-baseline h-full lg:pr-16 ">
        <motion.div
          className={`flex items-baseline h-full font-baskerville pt-0 px-0 whitespace-nowrap ${navOpen ? "justify-between" : "justify-start"}`}
          initial={{ width: "min-content" }}
          animate={{ width: navOpen ? "calc(100% - 3rem)" : "min-content" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <LLButton
            text={navOpen ? "X" : "II"}
            onClick={() => setNavOpen(!navOpen)}
            className={`flex h-16 items-baseline aspect-square justify-center rounded-none gap-0 p-4 text-4xl w-min ${
              navOpen ? "rotate-0" : "rotate-90"
            }`}
          />
          <LLButton
            href="/"
            text="L'Amour"
            className="text-4xl w-min justify-start mr-2 ml-4 tracking-wider"
            effect="default"
          />
          <motion.span
            className="self-center block h-px bg-black min-w-8"
            animate={{ flexGrow: navOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <LLButton
            href="/"
            text="La Mort"
            className="text-4xl w-min justify-start ml-2 tracking-wider"
            effect="default"
          />
        </motion.div>
      </div>

      {/* NAV OVERLAY */}
      <NavOverlay
        navOpen={navOpen}
        openShopSubMenu={openShopSubMenu}
        setOpenShopSubMenu={setOpenShopSubMenu}
        openArticleSubMenu={openArticleSubMenu}
        setOpenArticleSubMenu={setOpenArticleSubMenu}
        setNavOpen={setNavOpen}
      />

      <button className="fixed bottom-0 right-0 hidden lg:block">
        <span className="inline-flex rounded-[50%] bg-foreground overflow-hidden self-stretch -rotate-12 mb-5">
          <Stretch
            text="Prenumerera"
            className="tracking-widest text-background px-16 py-4 lg:py-4 "
            size="text-2xl"
          />
        </span>
      </button>

      {/* CART BUTTON — fixed bottom-right on mobile, fixed top-right on desktop */}
      <motion.button
        key={totalItems}
        className="fixed bottom-6 right-6 lg:bottom-auto lg:top-0 lg:right-0 z-60 font-baskerVilleOld text-4xl inline-flex items-baseline px-4 py-3 lg:h-16 hover:opacity-50 transition-opacity"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => setDrawerOpen(true)}
        aria-label="Öppna korg"
      >
        <span>(</span>
        <Stretch text={`${totalItems}`} size="text-4xl" />
        <span>)</span>
      </motion.button>
    </div>
  );
}
