"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/lib/contexts/CartContext";
import LLButton from "./LLButton";
import Stretch from "./Stretch";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    clearCart,
    totalItems,
    drawerOpen,
    setDrawerOpen,
  } = useCart();

  const subtotal = items.reduce((sum, item) => {
    const numeric = parseFloat(
      item.price.replace(/[^0-9.,]/g, "").replace(",", "."),
    );
    return sum + (isNaN(numeric) ? 0 : numeric * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-foreground/0 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <motion.div
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background  flex flex-col shadow-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4  border-b border-foreground h-[64px]  w-full">
              <span className="font-baskerVilleOld text-4xl tracking-wider  whitespace-nowrap flex justify-start items-baseline  ">
                Korg (<Stretch text={`${totalItems}`} size="text-4xl" />)
              </span>
              <button
                className="font-baskerVilleOld text-3xl leading-none hover:opacity-50 transition-opacity"
                onClick={() => setDrawerOpen(false)}
                aria-label="Stäng korg"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-0 py-4 flex flex-col gap-4">
              {items.length === 0 ? (
                <p className="font-baskerVV text-xl tracking-wider text-foreground/50 normal-case pt-4">
                  Korgen är tom.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-baseline justify-between border-b border-foreground/20 pb-4 px-4"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-baskervilleSC text-xl uppercase tracking-wider">
                        {item.title}
                      </span>
                      <span className="font-baskervilleSC lowercase text-lg  text-foreground/60 flex items-baseline">
                        {item.price} × {item.quantity}
                      </span>
                    </div>
                    <button
                      className="font-baskerVilleOld text-2xl leading-none hover:opacity-50 transition-opacity ml-4"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Ta bort ${item.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-foreground flex flex-col gap-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-baskerVilleOld text-xl uppercase tracking-wider">
                    Summa
                  </span>
                  <span className="font-baskerVilleOld text-2xl">
                    {subtotal % 1 === 0 ? subtotal : subtotal.toFixed(2)} kr
                  </span>
                </div>
                <span className="inline-flex rounded-[50%] bg-foreground overflow-hidden self-stretch">
                  <LLButton
                    text="Till kassan"
                    variant="ghost"
                    className="font-baskerVilleClassic uppercase text-xl tracking-widest text-background hover:bg-transparent hover:text-background px-8 py-4 h-auto w-full "
                  />
                </span>
                <button
                  className="font-baskervilleSC hidden lowercase text-sm  text-foreground/50 hover:text-foreground transition-colors tracking-wider text-center "
                  onClick={clearCart}
                >
                  (Töm korg)
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
