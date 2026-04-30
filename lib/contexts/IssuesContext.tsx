"use client";

import { createContext, useContext } from "react";

export type Issue = {
  _id: string;
  title: string;
  slug: { current: string };
  issueNumber: number;
  coverImage?: { asset: { _ref: string }; alt?: string };
  price?: number;
  inStock?: boolean;
  publishedAt?: string;
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
