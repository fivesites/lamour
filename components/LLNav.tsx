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
  return (
    <Button
      variant="navLink"
      size="navLink"
      className="justify-center lg:justify-start text-center lg:text-left"
      asChild
    >
      <Link
        href={`/articles/${article.slug.current}`}
        onClick={() => setNavOpen(false)}
      >
        {article.title}
      </Link>
    </Button>
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
  return (
    <Button
      variant="navLink"
      size="navLink"
      className="justify-center lg:justify-start text-center lg:text-left"
      asChild
    >
      <Link
        href={`/shop/${issue.slug.current}`}
        onClick={() => setNavOpen(false)}
      >
        <span className="shrink-0">LL{issue.issueNumber}</span>
        {issue.title}
      </Link>
    </Button>
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
          variant="navLink"
          size="navLink"
          className="justify-center lg:justify-start"
          onClick={() => setNavOpen(false)}
        >
          läs alla
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
          variant="navLink"
          size="navLink"
          className="justify-center lg:justify-start"
          onClick={() => {
            setDrawerOpen(true);
            setNavOpen(false);
          }}
        >
          till kassan
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
          className="flex flex-col w-full justify-start items-start font-baskerville mt-24 lg:mt-0  py-0 list-none gap-y-2"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.li className="w-full" variants={ITEM_VARIANTS}>
            <Button
              variant="navLink"
              size="navLink"
              className="justify-center lg:justify-between pr-4"
              onClick={() => {
                setOpenShopSubMenu(!openShopSubMenu);
                setOpenArticleSubMenu(false);
              }}
            >
              Alla nummer
              <span
                className={`transition-transform duration-200 absolute right-6  ${openShopSubMenu ? "rotate-0" : "-rotate-90"}`}
              >
                V
              </span>
            </Button>
            <AnimatePresence>
              {openShopSubMenu && <ShopSubMenu setNavOpen={setNavOpen} />}
            </AnimatePresence>
          </motion.li>

          <motion.li className="w-full" variants={ITEM_VARIANTS}>
            <Button
              variant="navLink"
              size="navLink"
              className="justify-center lg:justify-between pr-4"
              onClick={() => {
                setOpenArticleSubMenu(!openArticleSubMenu);
                setOpenShopSubMenu(false);
              }}
            >
              Alla artiklar
              <span
                className={`transition-transform duration-200 absolute right-6 ${openArticleSubMenu ? "rotate-0" : "-rotate-90"}`}
              >
                V
              </span>
            </Button>
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
              <Button
                variant="navLink"
                size="navLink"
                className="justify-center lg:justify-start"
                asChild
              >
                <Link href={href} onClick={() => setNavOpen(false)}>
                  {label}
                </Link>
              </Button>
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
  const { totalItems, setDrawerOpen, addToCart } = useCart();

  const isGridPage = pathname === "/shop" || pathname === "/articles";
  const modeLabel = mode === "bak" ? "baksida" : "framsida";
  function toggleGridMode() {
    setMode(mode === "bak" ? "fram" : "bak");
  }

  if (pathname.startsWith("/studio") || pathname.startsWith("/articles/"))
    return null;

  return (
    <div
      className={`fixed top-0 left-0 z-50 flex flex-col transition-colors duration-500 group lg:w-14 lg:h-dvh lg:min-h-0
        ${navOpen ? "w-full min-h-dvh bg-background" : "w-full h-16 "}`}
    >
      {/* ── MOBILE HEADER ── */}
      <div
        className={`lg:hidden flex items-center shadow w-full shrink-0 h-14 px-4 transition-colors duration-200 ${navOpen ? "bg-transparent" : "bg-background"}`}
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
            className={`bg-foreground transition-[width,height] duration-300 h-px lg:transition-[width,height] ${navOpen ? "w-16 lg:h-8" : "w-8"}`}
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
        className={`hidden lg:flex flex-col items-center w-14 lg:group-hover:w-16 transition-[width,background-color] duration-200 h-full shrink-0 cursor-pointer ${navOpen ? "bg-neutral-300" : "bg-neutral-300"}`}
        onClick={() => setNavOpen((v) => !v)}
      >
        {navOpen ? (
          <div className="flex flex-col items-center justify-start flex-1 pt-8">
            <span
              className="font-baskervilleSC text-lg tracking-widest lowercase whitespace-nowrap hover:opacity-60 transition-opacity"
              style={{ writingMode: "vertical-rl" }}
            >
              stäng (x)
            </span>
          </div>
        ) : (
          <div className="flex flex-col justify-start items-center flex-1 pt-8 gap-4">
            <Link
              href="/"
              className="font-baskervilleSC text-xl tracking-wider hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
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
        )}
      </div>

      {/* ── NAV OVERLAY (mobile: full-width scrollable; desktop: fixed panel next to sidebar) ── */}
      <div
        className={`flex flex-col flex-1 overflow-y-auto ${navOpen ? "lg:fixed lg:top-0 lg:left-14 lg:h-dvh lg:overflow-y-auto lg:z-70 lg:bg-[#FCC5F8] lg:w-80" : "lg:hidden"}`}
      >
        <NavOverlay
          navOpen={navOpen}
          openShopSubMenu={openShopSubMenu}
          setOpenShopSubMenu={setOpenShopSubMenu}
          openArticleSubMenu={openArticleSubMenu}
          setOpenArticleSubMenu={setOpenArticleSubMenu}
          setNavOpen={setNavOpen}
        />
      </div>

      {/* ── DESKTOP NAV OVERLAY (full-width 4-column grid) ── */}
      {navOpen && (
        <div className="hidden lg:grid grid-cols-4 fixed left-14 lg:group-hover:left-16 transition-[left] duration-200 top-0 h-dvh right-0 z-70 bg-[#FCC5F8]">
          {/* Column 1 — Alla nummer */}
          <div className="flex flex-col border-r border-foreground/20 overflow-y-auto">
            <Button
              variant="navLink"
              size="navLink"
              asChild
              className="shrink-0"
            >
              <Link href="/shop" onClick={() => setNavOpen(false)}>
                Alla nummer
              </Link>
            </Button>
            {issues.map((issue) => (
              <IssueRow
                key={issue._id}
                issue={issue}
                setNavOpen={setNavOpen}
                addToCart={addToCart}
              />
            ))}
          </div>

          {/* Column 2 — Alla artiklar */}
          <div className="flex flex-col border-r border-foreground/20 overflow-y-auto">
            <Button
              variant="navLink"
              size="navLink"
              asChild
              className="shrink-0"
            >
              <Link href="/articles" onClick={() => setNavOpen(false)}>
                Alla artiklar
              </Link>
            </Button>
            {articles.map((article) => (
              <ArticleRow
                key={article._id}
                article={article}
                setNavOpen={setNavOpen}
              />
            ))}
          </div>

          {/* Column 3 — Other links */}
          <div className="flex flex-col border-r border-foreground/20">
            {[
              { label: "Om oss", href: "/" },
              { label: "Prenumerera", href: "/" },
              { label: "Kontakt", href: "/" },
              { label: "Nästa nummer", href: "/" },
            ].map(({ label, href }) => (
              <Button key={label} variant="navLink" size="navLink" asChild>
                <Link href={href} onClick={() => setNavOpen(false)}>
                  {label}
                </Link>
              </Button>
            ))}
          </div>

          {/* Column 4 — Cart & frakt */}
          <div className="flex flex-col">
            <Button
              variant="navLink"
              size="navLink"
              onClick={() => setDrawerOpen(true)}
            >
              I varukorgen ({totalItems})
            </Button>
            <Button
              variant="navLink"
              size="navLink"
              onClick={() => {
                setDrawerOpen(true);
                setNavOpen(false);
              }}
            >
              Till kassan
            </Button>
            <Button
              variant="navLink"
              size="navLink"
              className="cursor-default hover:opacity-100"
            >
              Frakt &amp; info
            </Button>
          </div>
        </div>
      )}

      <div className="fixed top-0 right-0 z-60 flex items-center h-14 lg:h-16">
        {isGridPage && (
          <button
            onClick={toggleGridMode}
            className="hidden lg:inline-flex h-full items-center px-4 font-baskervilleSC text-lg lowercase tracking-widest hover:opacity-50 transition-opacity"
          >
            {modeLabel}
          </button>
        )}
        <motion.button
          key={totalItems}
          className="h-full inline-flex items-center px-4 font-baskerVilleOld hover:opacity-50 transition-opacity"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Öppna korg"
        >
          <span className="hidden lg:flex font-baskervilleSC text-lg lowercase tracking-widest">
            I varukorgen ({totalItems})
          </span>
          <span className="flex lg:hidden font-baskervilleSC text-lg lowercase">
            ({totalItems})
          </span>
        </motion.button>
      </div>

      {isGridPage && (
        <button
          onClick={toggleGridMode}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 font-baskervilleSC text-lg tracking-widest h-10 lowercase bg-background border border-foreground/20 px-6 pt-1 pb-2 hover:opacity-60 transition-opacity"
        >
          {modeLabel}
        </button>
      )}
    </div>
  );
}
