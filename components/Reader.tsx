"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import Article from "@/components/Article";
import ProgressBar from "@/components/ProgressBar";
import { ScrollContainerContext } from "@/lib/ScrollContainerContext";

export default function Reader({ onClose }: { onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={scrollRef}
      className="fixed inset-0 z-50 bg-background overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* top bar */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        {/* <div className="absolute inset-0 bg-linear-to-b from-background to-transparent" /> */}
        <div className="relative flex items-center justify-center px-4 pt-4 pb-8 pointer-events-auto gap-16 w-full">
          <button
            onClick={onClose}
            className="absolute left-1/2 top-4 right-0 -translate-x-1/2 z-50 w-10 h-10 flex items-center justify-center"
            aria-label="Close"
          >
            <Image src="/X_Icon.svg" alt="Close" width={16} height={16} />
          </button>
        </div>
      </div>
      <ScrollContainerContext.Provider value={scrollRef}>
        <Article />
        <ProgressBar />
      </ScrollContainerContext.Provider>
    </motion.div>
  );
}
