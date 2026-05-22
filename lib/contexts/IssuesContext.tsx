"use client";

import { createContext, useContext } from "react";

export type Issue = {
  _id: string;
  title: string;
  slug: { current: string };
  issueNumber: number;
  cover?: { asset: { _ref: string }; alt?: string };
  spine?: { asset: { _ref: string }; alt?: string };
  back?: { asset: { _ref: string }; alt?: string };
  price?: number;
  weight?: number;
  inStock?: boolean;
  publishedAt?: string;
  dimensions?: {
    cover?: { width: number; height: number };
    spine?: { width: number };
  };
  description?: any[];
  previewImages?: Array<{ _key: string; asset: any; alt?: string }>;
};

const IssuesContext = createContext<Issue[]>([]);

export function IssuesProvider({
  issues,
  children,
}: {
  issues: Issue[];
  children: React.ReactNode;
}) {
  return (
    <IssuesContext.Provider value={issues}>{children}</IssuesContext.Provider>
  );
}

export function useIssues() {
  return useContext(IssuesContext);
}
