"use client";

import { createContext, useContext, useState } from "react";

export type ShelfMode = "fram" | "rygg" | "bak";

type BookshelfSettings = {
  mode: ShelfMode;
  setMode: (m: ShelfMode) => void;
  showIssues: boolean;
  setShowIssues: (v: boolean | ((p: boolean) => boolean)) => void;
  showArticles: boolean;
  setShowArticles: (v: boolean | ((p: boolean) => boolean)) => void;
};

const BookshelfSettingsContext = createContext<BookshelfSettings | null>(null);

export function BookshelfSettingsProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ShelfMode>("rygg");
  const [showIssues, setShowIssues] = useState(true);
  const [showArticles, setShowArticles] = useState(true);

  return (
    <BookshelfSettingsContext.Provider value={{ mode, setMode, showIssues, setShowIssues, showArticles, setShowArticles }}>
      {children}
    </BookshelfSettingsContext.Provider>
  );
}

export function useBookshelfSettings() {
  const ctx = useContext(BookshelfSettingsContext);
  if (!ctx) throw new Error("useBookshelfSettings must be used within BookshelfSettingsProvider");
  return ctx;
}
