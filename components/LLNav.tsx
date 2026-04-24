"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "motion/react";
import LLButton from "./LLButton";

function ArticleSubMenu({ setNavOpen }: { setNavOpen: (open: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center whitespace-normal list-none px-4 gap-4 w-full max-h-[60vh] overflow-y-auto">
      <li className="w-full">
        <Button
          variant="link"
          size="linkSize"
          className="font-baskerVilleOld text-4xl text-center justify-center "
          onClick={() => setNavOpen(false)}
          asChild
        >
          <Link href="/articles">Liveblog från bokmässan 2025</Link>
        </Button>
      </li>
      <li className="w-full">
        <Button
          variant="link"
          size="linkSize"
          className="font-baskerVilleOld text-center justify-center text-4xl"
          asChild
        >
          <Link href="/">Intervju Stig Larsson</Link>
        </Button>
      </li>
      <li className="w-full">
        <Button
          variant="link"
          size="linkSize"
          className="font-baskerVilleOld text-center justify-center text-4xl"
          asChild
        >
          <Link href="/articles ">Liveblog från bokmässan 2023</Link>
        </Button>
      </li>
      <li className="w-full">
        <Button
          variant="link"
          size="linkSize"
          className="font-baskerVilleOld text-center justify-center text-4xl"
          asChild
        >
          <Link href="/">
            Intervju: HUR SMAKAR HEMLÄNGTAN (Teodor Kallifatides & Olena
            Rogozina)
          </Link>
        </Button>
      </li>
    </div>
  );
}

function ShopSubMenu() {
  return (
    <div className="flex flex-col items-start justify-start whitespace-normal p-0 gap-4 w-full max-h-[60vh] overflow-y-auto lg:flex-row lg:flex-wrap">
      <div className="w-full lg:w-1/3">
        <ProductCard
          articleID="20"
          title="Resenärer"
          price="220"
          image="LL-20-Cover-foto-scaled.jpg"
        />
      </div>
      <div className="w-full lg:w-1/3">
        <ProductCard
          articleID="11"
          title="BABO"
          price="150"
          image="LL11-Cover.jpg"
        />
      </div>
      <div className="w-full lg:w-1/3">
        <ProductCard variant="noIMG" title="Presentkort" price="250" />
      </div>
    </div>
  );
}

export default function LLNav() {
  const [navOpen, setNavOpen] = useState(false);
  const [openArticleSubMenu, setOpenArticleSubMenu] = useState(false);
  const [openShopSubMenu, setOpenShopSubMenu] = useState(false);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-auto flex flex-col items-center justify-center gap-0 p-0 z-50 transition-colors duration-500 ${openShopSubMenu ? "bg-[#B3F7FE]" : openArticleSubMenu ? "bg-[#FCC5F8]" : navOpen ? "bg-[#E7F8BE]" : "bg-transparent"}`}
      >
        {/* LAMOUR LA MORT ROW */}
        <motion.div
          className="flex items-center justify-between font-baskerville pt-4 px-4 whitespace-nowrap"
          initial={{ width: "min-content" }}
          animate={{ width: navOpen ? "100%" : "min-content" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Button
            variant="link"
            size="linkSize"
            className="font-baskerVilleOld text-4xl w-auto pr-2"
          >
            L'Amour
          </Button>

          <motion.span
            className="self-center block h-px bg-black min-w-8"
            animate={{ flexGrow: navOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />

          <Button
            className="flex gap-4 font-baskerVilleOld text-4xl w-auto pl-2"
            variant="link"
            size="linkSize"
          >
            La Mort
          </Button>
        </motion.div>

        {/* SECOND ROW */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              className="flex flex-wrap gap-x-4 justify-center w-full font-baskerville py-4 px-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
            >
              <motion.div
                className="flex justify-between w-full"
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
              >
                {[
                  {
                    label: "Affären",
                    count: "(24)",
                    toggle: () => {
                      setOpenShopSubMenu(!openShopSubMenu);
                      setOpenArticleSubMenu(false);
                    },
                    open: openShopSubMenu,
                  },
                  {
                    label: "Artiklar",
                    count: "(44)",
                    toggle: () => {
                      setOpenArticleSubMenu(!openArticleSubMenu);
                      setOpenShopSubMenu(false);
                    },
                    open: openArticleSubMenu,
                  },
                ].map(({ label, count, toggle, open }) => (
                  <Button
                    key={label}
                    variant="link"
                    size="linkSize"
                    className="font-baskerVilleOld text-4xl w-auto"
                    onClick={toggle}
                  >
                    {label} {open ? "(X)" : count}
                  </Button>
                ))}
              </motion.div>
              {openArticleSubMenu ? (
                <ArticleSubMenu setNavOpen={setNavOpen} />
              ) : null}
              {openShopSubMenu ? <ShopSubMenu /> : null}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
              >
                <LLButton
                  text="Senaste  Nytt"
                  rotate
                  justify
                  hover
                  className="text-4xl tracking-widest font-baskervilleClassic"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
              >
                <LLButton
                  text="(Prenumerera)"
                  stretch="scale-x-200"
                  justify
                  hover
                  variant="link"
                  size="linkSize"
                  className="py-4 text-3xl tracking-widest font-baskerVilleOld hover:text-shadow-md"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
                className="w-full"
              >
                <LLButton
                  text="Om oss"
                  justify
                  revealAnimation
                  className="text-2xl mx-auto tracking-wide font-baskervilleClassic uppercase"
                />
              </motion.div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -6 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.3, ease: "easeOut" },
                  },
                }}
                className="w-full"
              >
                <LLButton
                  text="TIDSKRIFTEN"
                  mono
                  revealAnimation
                  className="text-xl justify-center text-center mx-auto font-baskervilleClassic uppercase"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setNavOpen(!navOpen)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 h-auto flex items-center justify-center gap-0 p-0 z-[90] bg-transparent hover:bg-foreground/10 py-0 w-min text-5xl font-baskerVilleOld transition-colors"
      >
        <span className={`tracking-wide rotate-90 leading-none`}>
          {navOpen ? "X" : "II"}
        </span>
      </button>
    </>
  );
}
