"use client";

import { useIssues } from "@/lib/contexts/IssuesContext";
import { urlFor } from "@/lib/sanity/image";
import ProductCard from "./ProductCard";

export default function HomeHero() {
  const issues = useIssues();
  const latest = issues[0];

  if (!latest) return null;

  const imageUrl = latest.coverImage?.asset
    ? urlFor(latest.coverImage).width(1200).url()
    : undefined;

  return (
    <div className="w-full px-4">
      <ProductCard
        articleID={String(latest.issueNumber)}
        title={latest.title}
        price={latest.price ? String(Math.round(latest.price / 100)) : "—"}
        href={`/shop/${latest.slug.current}`}
        image={imageUrl}
        imageSize="h-[70vh]"
      />
    </div>
  );
}
