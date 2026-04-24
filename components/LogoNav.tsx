"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LogoNav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.65]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="fixed left-0 w-full z-80 flex justify-center"
      animate={{
        height: scrolled ? 64 : "100vh",
        alignItems: "center",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ display: "flex", top: 0 }}
    >
      <motion.div className="relative w-28 h-28" style={{ scale: logoScale }}>
        <Image
          src="/LL_monster_logo.svg"
          alt="Lamour Logo"
          fill
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
}
