"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useBookshelfSettings } from "@/lib/contexts/BookshelfSettingsContext";

import { motion, AnimatePresence } from "motion/react";
import LLButton from "./LLButton";
import { useIssues, type Issue } from "@/lib/contexts/IssuesContext";
import { useArticles, type Article } from "@/lib/contexts/ArticlesContext";
import { useCart } from "@/lib/contexts/CartContext";

import Link from "next/link";
import { Button } from "./ui/button";

/* ─── ROW COMPONENTS ─── */

function ArticleRow({
  article,
  setNavOpen,
}: {
  article: Article;
  setNavOpen: (v: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`relative flex items-center w-full border-b border-b-foreground min-h-12 py-2 pl-12 pr-12 ${expanded ? "" : "justify-center lg:justify-start"}`}
    >
      <Link
        className="font-baskervilleSC text-2xl tracking-widest lowercase flex justify-center text-center  max-w-sm"
        href={`/articles/${article.slug.current}`}
        onClick={() => setNavOpen(false)}
      >
        {article.title}
      </Link>
      <motion.div
        animate={{ flexGrow: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="shrink-0 min-w-0"
      />
    </div>
  );
}

function IssueRow({
  issue,
  setNavOpen,
  addToCart,
}: {
  issue: Issue;
  setNavOpen: (v: boolean) => void;
  addToCart: (item: { id: string; title: string; price: string }) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`relative flex items-center w-full border-b border-b-foreground h-auto min-h-12 pl-16 pr-16 lg:pr-6 ${expanded ? "" : "justify-center lg:justify-start"}`}
    >
      <Link
        className="font-baskervilleSC text-2xl tracking-widest gap-x-4 lowercase flex justify-start"
        href={`/shop/${issue.slug.current}`}
        onClick={() => setNavOpen(false)}
      >
        <span className="lowercase">LL{issue.issueNumber}</span>
        {issue.title}
      </Link>
      <motion.div
        animate={{ flexGrow: expanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="shrink-0 min-w-0"
      />
    </div>
  );
}

/* ─── ARTICLE SUBMENU ─── */

function ArticleSubMenu({
  setNavOpen,
}: {
  setNavOpen: (open: boolean) => void;
}) {
  const { articles } = useArticles();
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal w-full max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col w-full">
        {articles.map((article) => (
          <ArticleRow
            key={article._id}
            article={article}
            setNavOpen={setNavOpen}
          />
        ))}

        <Button
          variant="ghost"
          className="px-12 pb-1 border-b border-b-foreground"
          onClick={() => setNavOpen(false)}
        >
          <div className="flex w-full items-baseline justify-between">
            {"läs alla".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block leading-none font-baskervilleSC transition-transform duration-300 hover:rotate-12 lowercase text-2xl"
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </div>
        </Button>
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
          <IssueRow
            key={issue._id}
            issue={issue}
            setNavOpen={setNavOpen}
            addToCart={addToCart}
          />
        ))}

        <Button
          variant="ghost"
          className="px-12 pb-1 border-b border-b-foreground"
          onClick={() => {
            setDrawerOpen(true);
            setNavOpen(false);
          }}
        >
          <div className="flex w-full items-baseline justify-between ">
            {"till kassan".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block leading-none font-baskervilleSC transition-transform duration-300 hover:rotate-12 lowercase text-2xl"
              >
                {char === " " ? " " : char}
              </span>
            ))}
          </div>
        </Button>
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
            <span
              className={`flex w-full border-b border-b-foreground items-center pl-6 pr-6 lg:pr-3 h-14 ${openShopSubMenu ? "" : "justify-center lg:justify-start"}`}
            >
              <Link
                href="/shop"
                className="font-baskervilleSC lowercase text-2xl tracking-widest pr-6"
                onClick={() => {
                  setOpenShopSubMenu(!openShopSubMenu);
                  setOpenArticleSubMenu(false);
                  setNavOpen(false);
                }}
              >
                Alla nummer
              </Link>
              <motion.div
                animate={{ flexGrow: openShopSubMenu ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="shrink-0 min-w-0"
              />
              <button
                className={`font-baskervilleSC lowercase text-2xl tracking-widest w-min ${
                  openShopSubMenu ? "rotate-0" : "-rotate-90 mt-1"
                }`}
                onClick={() => {
                  setOpenShopSubMenu(!openShopSubMenu);
                  setOpenArticleSubMenu(false);
                }}
              >
                V
              </button>
            </span>
            <AnimatePresence>
              {openShopSubMenu && <ShopSubMenu setNavOpen={setNavOpen} />}
            </AnimatePresence>
          </motion.li>

          <motion.li
            className={`w-full lg:col-span-2  ${!openShopSubMenu ? "" : ""}`}
            variants={ITEM_VARIANTS}
          >
            <span
              className={`flex w-full border-b border-b-foreground items-center pl-6 pr-6 lg:pr-3 h-14 ${openArticleSubMenu ? "" : "justify-center lg:justify-start"}`}
            >
              <Link
                href="/articles"
                className="font-baskervilleSC lowercase text-2xl pr-6 tracking-widest"
                onClick={() => {
                  setOpenArticleSubMenu(!openArticleSubMenu);
                  setOpenShopSubMenu(false);
                  setNavOpen(false);
                }}
              >
                Alla artiklar
              </Link>
              <motion.div
                animate={{ flexGrow: openArticleSubMenu ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="shrink-0 min-w-0"
              />
              <button
                className={`font-baskervilleSC lowercase text-2xl tracking-widest w-min ${
                  openArticleSubMenu ? "rotate-0" : "-rotate-90 mt-1"
                }`}
                onClick={() => {
                  setOpenArticleSubMenu(!openArticleSubMenu);
                  setOpenShopSubMenu(false);
                }}
              >
                V
              </button>
            </span>
            <AnimatePresence>
              {openArticleSubMenu && <ArticleSubMenu setNavOpen={setNavOpen} />}
            </AnimatePresence>
          </motion.li>

          {[
            { label: "Om oss", href: "/" },
            { label: "Prenumerera", href: "/" },
            { label: "Kontakt", href: "/" },
            { label: "Nästa nummer", href: "/" },
          ].map(({ label, href }) => (
            <motion.li key={label} className="w-full" variants={ITEM_VARIANTS}>
              <span className="flex w-full border-b border-b-foreground justify-center lg:justify-start items-center pl-6 pr-6 h-14">
                <Link
                  href={href}
                  className="font-baskervilleSC lowercase text-2xl -mt-2 tracking-widest"
                  onClick={() => setNavOpen(false)}
                >
                  {label}
                </Link>
              </span>
            </motion.li>
          ))}
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
  const {
    mode,
    setMode,
    showIssues,
    setShowIssues,
    showArticles,
    setShowArticles,
  } = useBookshelfSettings();
  const { articles } = useArticles();
  const issues = useIssues();
  const { totalItems, setDrawerOpen } = useCart();

  if (pathname.startsWith("/studio") || pathname.startsWith("/articles/"))
    return null;

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex flex-col transition-colors duration-500 group lg:w-14 lg:h-dvh lg:min-h-0
        ${navOpen ? "w-full min-h-dvh bg-[#FCC5F8]" : "w-full h-16 "}`}
    >
      {/* ── MOBILE HEADER ── */}
      <div
        className={`lg:hidden flex items-center w-full shrink-0 h-14 px-4 transition-colors duration-200 ${navOpen ? "bg-[#FCC5F8]" : "bg-background"}`}
      >
        {/* Hamburger */}
        <button
          onClick={() => setNavOpen((v) => !v)}
          className={`w-10 h-10 flex items-center justify-center font-baskerVilleOld text-sm tracking-widest  ${navOpen ? "rotate-0 mt-2" : "rotate-90 mt-1.5"}  hover:opacity-60 transition-opacity shrink-0`}
        >
          {navOpen ? "X" : "II"}
        </button>

        {/* Logo centered */}
        <div className="flex-1 flex items-center justify-center gap-3 font-baskerville">
          <Link
            href="/"
            className="font-baskervilleSC text-xl tracking-widest hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
          >
            L'Amour
          </Link>
          <div
            className={`h-px bg-foreground transition-[width] duration-200 ${navOpen ? "w-16" : "w-8"}`}
          />
          <Link
            href="/"
            className="font-baskervilleSC text-xl tracking-widest hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
          >
            La Mort
          </Link>
        </div>

        {/* Spacer matching cart button width */}
        <div className="w-10 shrink-0" />
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div
        className={`hidden lg:flex flex-col items-center w-14 lg:group-hover:w-16 transition-[width,background-color] duration-200 h-full shrink-0 cursor-pointer ${navOpen ? "bg-[#FCC5F8]" : "bg-neutral-300"}`}
        onClick={() => setNavOpen((v) => !v)}
      >
        <LLButton
          text={navOpen ? "X" : "II"}
          onClick={() => setNavOpen(!navOpen)}
          className={` h-16 hidden  w-full items-center justify-center rounded-none p-4 text-xl shrink-0 ${navOpen ? "rotate-0 " : "rotate-90 -ml-2"}`}
        />
        <div className="flex flex-col justify-start items-center flex-1 pt-8 gap-4 ">
          <Link
            href="/"
            className="font-baskervilleSC text-xl tracking-wider hover:opacity-60 lowercase  transition-opacity whitespace-nowrap"
            style={{ writingMode: "vertical-lr", transform: "rotate(0deg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            L'Amour
          </Link>
          <div className="w-px h-8 bg-foreground my-1 -ml-2" />
          <Link
            href="/"
            className="font-baskervilleSC text-xl tracking-wider hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(0deg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            La Mort
          </Link>
        </div>
      </div>

      {/* ── MOBILE NAV OVERLAY ── */}
      <div className="lg:hidden flex flex-col flex-1">
        <NavOverlay
          navOpen={navOpen}
          openShopSubMenu={openShopSubMenu}
          setOpenShopSubMenu={setOpenShopSubMenu}
          openArticleSubMenu={openArticleSubMenu}
          setOpenArticleSubMenu={setOpenArticleSubMenu}
          setNavOpen={setNavOpen}
        />
      </div>

      {/* ── DESKTOP NAV OVERLAY (fixed panel right of sidebar) ── */}
      {navOpen && (
        <div className="hidden lg:block fixed left-14 lg:group-hover:left-16 transition-[left] duration-200 top-0 h-dvh bg-[#FCC5F8] w-md overflow-y-auto z-40">
          <NavOverlay
            navOpen={navOpen}
            openShopSubMenu={openShopSubMenu}
            setOpenShopSubMenu={setOpenShopSubMenu}
            openArticleSubMenu={openArticleSubMenu}
            setOpenArticleSubMenu={setOpenArticleSubMenu}
            setNavOpen={setNavOpen}
          />
        </div>
      )}

      <motion.button
        key={totalItems}
        className="fixed top-0 right-0 z-60 font-baskerVilleOld h-14 inline-flex items-center px-4 lg:h-16 hover:opacity-50 transition-opacity"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => setDrawerOpen(true)}
        aria-label="Öppna korg"
      >
        <span className="hidden lg:flex font-baskervilleSC text-lg lowercase">
          I varukorgen ({totalItems})
        </span>
        <span className="flex lg:hidden font-baskervilleSC text-lg lowercase">
          ({totalItems})
        </span>
      </motion.button>
    </div>
  );
}
