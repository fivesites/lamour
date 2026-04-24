"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reader from "./Reader";

export default function ArticleCard() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        className={`relative flex flex-col items-start justify-between  ${hovered ? "h-[80vh] px-6 pt-8 pb-12" : "h-auto px-0 pt-0 pb-0"} cursor-pointer overflow-hidden`}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, filter: "blur(24px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <Image
                src="/552480399_1135570284737492_1550349593426496482_n-1-451x600.jpg.webp"
                alt="Card background"
                fill
                className="object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.h1
          className=" text-4xl font-baskerVilleOld uppercase tracking-[.25em] leading-relaxed relative z-10"
          animate={{ color: hovered ? "#ffffff" : "#000000" }}
          transition={{ duration: 0.3 }}
        >
          Bokmässan del IV: Litteraturen är forever
        </motion.h1>
        <span className="relative z-10">
          <motion.h2
            className="text-2xl font-baskerVilleOld  tracking-widest leading-relaxed"
            animate={{ color: hovered ? "#ffffff" : "#000000" }}
            transition={{ duration: 0.3 }}
          >
            Charlie Brandin Avehall
          </motion.h2>
          <motion.h3
            className="text-xl font-baskervilleClassic italic  tracking-wider leading-relaxed"
            animate={{ color: hovered ? "#ffffff" : "#000000" }}
            transition={{ duration: 0.3 }}
          >
            september, 28, 2025
          </motion.h3>
        </span>
      </div>

      <AnimatePresence>
        {open && <Reader onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
