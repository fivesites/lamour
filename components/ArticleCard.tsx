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
        className="relative flex flex-col items-start justify-between px-6 pt-8 pb-12 h-[80vh] cursor-pointer overflow-hidden"
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute inset-4 z-0"
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
          className="h1 relative z-10"
          animate={{ color: hovered ? "#ffffff" : "#000000" }}
          transition={{ duration: 0.3 }}
        >
          Bokmässan del IV: Litteraturen är forever
        </motion.h1>
        <span className="relative z-10">
          <motion.h2
            className="h2"
            animate={{ color: hovered ? "#ffffff" : "#000000" }}
            transition={{ duration: 0.3 }}
          >
            Charlie Brandin Avehall
          </motion.h2>
          <motion.h3
            className="h3"
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
