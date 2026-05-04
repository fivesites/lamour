import { client } from "@/lib/sanity/client";
import { articleBySlugQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import LogoNav from "@/components/LogoNav";
import LLNav from "@/components/LLNav";
import ArticleReader from "@/components/ArticleReader";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Article = {
  _id: string;
  title: string;
  slug: { current: string };
  author?: {
    name: string;
    slug: { current: string };
    image?: { asset: any; alt?: string };
    bio?: any[];
  };
  issue?: { title: string; issueNumber: number; slug: { current: string } };
  coverImage?: { asset: any; alt?: string };
  body?: any[];
  publishedAt?: string;
};

function extractContent(body?: any[]): { plainText: string; illustrations: { src: string; alt?: string }[] } {
  if (!body) return { plainText: "", illustrations: [] };
  const illustrations: { src: string; alt?: string }[] = [];
  let imgIndex = 0;
  const lines = body
    .map((b) => {
      if (b._type === "block" && b.children) {
        return b.children
          .filter((c: any) => c._type === "span")
          .map((c: any) => c.text)
          .join("");
      }
      if (b._type === "image" && b.asset) {
        illustrations.push({ src: urlFor(b).url(), alt: b.alt });
        return `[img:${imgIndex++}]`;
      }
      return null;
    })
    .filter(Boolean) as string[];
  return { plainText: lines.join("\n"), illustrations };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article: Article | null = null;
  try {
    article = await client.fetch(articleBySlugQuery, { slug });
  } catch {
    // Sanity not yet configured
  }

  if (!article) notFound();

  const { plainText, illustrations } = extractContent(article.body);

  return (
    <div className="">
      <ArticleReader
        title={article.title}
        body={article.body}
        plainText={plainText}
        illustrations={illustrations}
        author={article.author}
        issue={article.issue}
        publishedAt={article.publishedAt}
        coverImage={article.coverImage}
      />
    </div>
  );
}
