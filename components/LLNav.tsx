"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "motion/react";
import LLButton from "./LLButton";
import { useIssues, type Issue } from "@/lib/contexts/IssuesContext";
import { useArticles, type Article } from "@/lib/contexts/ArticlesContext";
import { useCart } from "@/lib/contexts/CartContext";
import Stretch from "./Stretch";
import Link from "next/link";

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
        className="font-baskervilleSC text-2xl tracking-widest lowercase flex justify-start max-w-sm"
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
      <button
        className="font-baskervilleSC lowercase text-2xl -rotate-90 shrink-0"
        onClick={() => setExpanded((v) => !v)}
      >
        V
      </button>
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
      <button
        className="font-baskervilleSC lowercase text-2xl -rotate-90 shrink-0"
        onClick={() => {
          setExpanded((v) => !v);
          addToCart({
            id: issue._id,
            title: issue.title,
            price: issue.price != null ? `${issue.price} kr` : "0",
          });
        }}
      >
        V
      </button>
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
        <div className="flex justify-end bg-transparent hover:bg-foreground pl-16 pr-16 border-b border-b-foreground">
          <button
            className="font-baskerVilleOld w-full rounded-none px-4 py-4 bg-transparent text-foreground hover:bg-foreground hover:text-background"
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
          </button>
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
          <IssueRow
            key={issue._id}
            issue={issue}
            setNavOpen={setNavOpen}
            addToCart={addToCart}
          />
        ))}
        <div className="flex justify-end bg-transparent hover:bg-foreground pb-2 pl-12 pr-12 border-b border-b-foreground">
          <button
            className="font-baskervilleSC  w-full rounded-none px-4 py-4 bg-transparent text-foreground hover:bg-foreground hover:text-background"
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
          </button>
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
        className={`lg:hidden flex flex-col w-full shrink-0 cursor-pointer transition-[background-color,height] duration-200 overflow-hidden h-14 ${navOpen ? "bg-[#FCC5F8]" : "bg-background"}`}
        onClick={() => setNavOpen((v) => !v)}
      >
        {/* Logo centered */}
        <div className="flex items-center justify-center flex-1">
          <div
            className="flex items-center gap-3 font-baskerville"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/"
              className="font-baskervilleSC text-2xl tracking-widest hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
            >
              L'Amour
            </Link>
            <div
              className={`h-px mt-2 bg-foreground transition-[width] duration-200 ${navOpen ? "w-16" : "w-8"}`}
            />
            <Link
              href="/"
              className="font-baskervilleSC text-2xl tracking-widest hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
            >
              La Mort
            </Link>
          </div>
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <div
        className={`hidden lg:flex flex-col items-center w-14 lg:group-hover:w-16 transition-[width,background-color] duration-200 h-full shrink-0 cursor-pointer ${navOpen ? "bg-[#FCC5F8]" : "bg-background"}`}
        onClick={() => setNavOpen((v) => !v)}
      >
        <LLButton
          text={navOpen ? "X" : "II"}
          onClick={() => setNavOpen(!navOpen)}
          className={` h-16 hidden  w-full items-center justify-center rounded-none p-4 text-4xl shrink-0 ${navOpen ? "rotate-0 " : "rotate-90 -ml-2"}`}
        />
        <div className="flex flex-col justify-start items-center flex-1 pt-8 gap-4 ">
          <Link
            href="/"
            className="font-baskervilleSC text-2xl tracking-wider hover:opacity-60 lowercase  transition-opacity whitespace-nowrap"
            style={{ writingMode: "vertical-lr", transform: "rotate(0deg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            L'Amour
          </Link>
          <div className="w-px h-8 bg-foreground my-1 -ml-2" />
          <Link
            href="/"
            className="font-baskervilleSC text-2xl tracking-wider hover:opacity-60 lowercase transition-opacity whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(0deg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            La Mort
          </Link>
        </div>
      </div>

      {/* ── MOBILE NAV OVERLAY ── */}
      <div className="lg:hidden">
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

      <button className="fixed bottom-0 right-0 hidden">
        <span className="inline-flex rounded-[50%] bg-foreground overflow-hidden self-stretch -rotate-12 mb-5">
          <Stretch
            text="Prenumerera"
            className="tracking-widest text-background px-16 py-4 lg:py-4"
            size="text-2xl"
          />
        </span>
      </button>

      <motion.button
        key={totalItems}
        className="fixed bottom-6 right-6 lg:bottom-auto lg:top-0 lg:right-4 z-60 font-baskerVilleOld text-4xl inline-flex items-baseline px-4 py-3 lg:h-16 hover:opacity-50 transition-opacity"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={() => setDrawerOpen(true)}
        aria-label="Öppna korg"
      >
        <Stretch text={`${totalItems}`} size="text-3xl" />
      </motion.button>
    </div>
  );
}
