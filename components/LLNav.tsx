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
      <div className="flex flex-col pt-2  w-full">
        <span className="flex justify-between w-full border-b border-b-foreground py-2 mb-2 px-4">
          <LLButton
            text="Liveblog från Bokmässan 2025"
            className="font-baskervilleSC text-4xl w-full justify-start"
            onClick={() => setOpenSeries(true)}
          />
          <LLButton
            href="/articles"
            text="V"
            className={`font-baskerVilleOld text-4xl w-min  ${openSeries ? "rotate-0" : "-rotate-90"}`}
            onClick={() => setOpenSeries(!openSeries)}
          />
        </span>
        {openSeries && (
          <div className="pl-4">
            {articles.map((article) => (
              <div
                key={article._id}
                className="w-full border-b border-b-foreground"
              >
                <LLButton
                  href={`/articles/${article.slug.current}`}
                  text={article.title}
                  className="font-baskerVilleOld text-4xl justify-start w-full py-2 rounded-none"
                  onClick={() => setNavOpen(false)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShopSubMenu() {
  const issues = useIssues();
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal w-full max-h-[60vh] overflow-y-auto border-b border-b-foreground">
      <div className="flex flex-col px-4 w-full">
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

/* ─── DESKTOP NAV ─── */

function DesktopNav({
  navOpen,
  setNavOpen,
  openShopSubMenu,
  setOpenShopSubMenu,
  openArticleSubMenu,
  setOpenArticleSubMenu,
}: {
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  openShopSubMenu: boolean;
  setOpenShopSubMenu: (v: boolean) => void;
  openArticleSubMenu: boolean;
  setOpenArticleSubMenu: (v: boolean) => void;
}) {
  const { articles } = useArticles();
  const issues = useIssues();

  return (
    <AnimatePresence>
      {navOpen && (
        <div className="hidden lg:flex flex-col w-full">
          {/* NAV ROW */}
          <motion.div
            layout
            className="flex flex-col items-baseline gap-x-8 gap-y-2 w-full py-4 px-4 "
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <motion.div variants={ITEM_VARIANTS}>
              <LLButton
                href="/shop"
                text={`Affären(${issues.length})`}
                className="font-baskerVilleOld text-3xl tracking-wider w-min"
                onClick={() => {
                  setOpenShopSubMenu(!openShopSubMenu);
                  setOpenArticleSubMenu(false);
                }}
              />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS}>
              <LLButton
                href="/articles"
                text={`Artiklar(${articles.length})`}
                className="font-baskerVilleOld text-3xl tracking-widerw-min"
                onClick={() => {
                  setOpenArticleSubMenu(!openArticleSubMenu);
                  setOpenShopSubMenu(false);
                }}
              />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS}>
              <LLButton
                text="Senaste Nytt"
                effect="letterSwap"
                className="font-baskerVilleOld text-3xl w-min tracking-wider"
              />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS}>
              <LLButton
                text="(Prenumerera)"
                effect="stretch"
                className="font-baskerVilleOld text-xl w-min"
              />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS}>
              <LLButton
                text="OM TIDSKRIFTEN"
                mono
                className="font-baskervilleClassic text-xl uppercase w-min"
              />
            </motion.div>
          </motion.div>

          {/* SUBMENUS */}
        </div>
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
      className={`fixed top-0 left-0 w-full flex flex-col items-center justify-start gap-0 pb-0 z-50 transition-colors   duration-500 ${navOpen ? "min-h-dvh bg-background lg:min-h-auto" : "min-h-auto"}`}
    >
      {/* HEADER ROW */}
      <div className="w-full flex justify-between items-baseline h-full ">
        <motion.div className="flex items-baseline justify-between w-full h-full font-baskerville pt-0 px-0 whitespace-nowrap">
          <div className="flex items-center">
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
              className="text-4xl w-min justify-start ml-4 tracking-wider"
              effect="default"
            />
            <span className="self-center block h-px bg-black w-8 mx-2" />
            <LLButton
              href="/"
              text="La Mort"
              className="text-4xl w-min justify-start tracking-wider"
              effect="default"
            />
          </div>
          <motion.button
            key={totalItems}
            className="hidden lg:inline-flex font-baskerVilleOld text-4xl items-baseline px-3 mr-1 hover:opacity-50 transition-opacity"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Öppna korg"
          >
            <span>(</span>
            <Stretch text={`${totalItems}`} size="text-4xl" />
            <span>)</span>
          </motion.button>
        </motion.div>
      </div>

      {/* DESKTOP NAV */}
      <DesktopNav
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        openShopSubMenu={openShopSubMenu}
        setOpenShopSubMenu={setOpenShopSubMenu}
        openArticleSubMenu={openArticleSubMenu}
        setOpenArticleSubMenu={setOpenArticleSubMenu}
      />

      {/* MOBILE NAV */}
      <AnimatePresence>
        {navOpen && (
          <motion.ul
            className=" flex flex-col lg:hidden gap-y-2 w-full justify-start items-start font-baskerville py-4 list-none"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.li className="w-full" variants={ITEM_VARIANTS}>
              <span className="flex justify-between w-full border-b border-b-foreground py-2 px-4">
                <div className="flex gap-x-0">
                  <LLButton
                    href="/shop"
                    text={`Affären`}
                    className="font-baskerVilleOld text-4xl w-min"
                    onClick={() => setOpenShopSubMenu(!openShopSubMenu)}
                  />
                </div>
                <LLButton
                  text="V"
                  className={`font-baskerVilleOld text-4xl w-min mr-2 ${
                    openShopSubMenu ? "rotate-0" : "-rotate-90"
                  }`}
                  onClick={() => setOpenShopSubMenu(!openShopSubMenu)}
                />
              </span>
              <AnimatePresence>
                {openShopSubMenu && <ShopSubMenu />}
              </AnimatePresence>
            </motion.li>

            <motion.li className="w-full" variants={ITEM_VARIANTS}>
              <span className="flex justify-between w-full border-b border-b-foreground py-2 px-4 ">
                <div className="flex gap-x-0">
                  <LLButton
                    href="/articles"
                    text={`Artiklar`}
                    className="font-baskerVilleOld text-4xl w-min"
                    onClick={() => setOpenArticleSubMenu(!openArticleSubMenu)}
                  />
                </div>
                <LLButton
                  text="V"
                  className={`font-baskerVilleOld text-4xl w-min mr-2 ${
                    openArticleSubMenu ? "rotate-0" : "-rotate-90"
                  }`}
                  onClick={() => setOpenArticleSubMenu(!openArticleSubMenu)}
                />
              </span>
              <AnimatePresence>
                {openArticleSubMenu && (
                  <ArticleSubMenu setNavOpen={setNavOpen} />
                )}
              </AnimatePresence>
            </motion.li>

            <motion.li className="w-full pt-4 px-4" variants={ITEM_VARIANTS}>
              <LLButton
                text="Senaste Nytt"
                effect="letterSwap"
                wiggle
                className="font-baskerVilleOld text-5xl w-min justify-between tracking-wider"
              />
            </motion.li>

            <motion.li className="w-full px-4" variants={ITEM_VARIANTS}>
              <LLButton
                text="(Prenumerera)"
                effect="stretch"
                stretch={2}
                gap="2em"
                className="font-baskerVilleOld text-3xl w-min justify-center py-4 "
              />
            </motion.li>

            <motion.li className="w-full px-4" variants={ITEM_VARIANTS}>
              <LLButton
                text="Om oss"
                effect="justify"
                className="font-baskervilleClassic text-4xl uppercase w-min "
              />
            </motion.li>

            <motion.li className="w-full px-4" variants={ITEM_VARIANTS}>
              <LLButton
                text="TIDSKRIFTEN"
                mono
                className="font-baskervilleClassic text-4xl uppercase w-min py-4 justify-center"
              />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>

      {/* MOBILE CART BUTTON */}
      <motion.button
        key={totalItems}
        className="lg:hidden fixed bottom-6 right-6 z-60 font-baskerVilleOld text-4xl inline-flex items-baseline px-4 py-3 hover:opacity-50 transition-opacity"
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
