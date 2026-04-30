import { client } from "@/lib/sanity/client";
import { articleBySlugQuery } from "@/lib/sanity/queries";
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
  body?: any[];
  publishedAt?: string;
};

function extractPlainText(body?: any[]): string {
  if (!body) return "";
  return body
    .filter((b) => b._type === "block" && b.children)
    .map((b) =>
      b.children
        .filter((c: any) => c._type === "span")
        .map((c: any) => c.text)
        .join(""),
    )
    .join("\n\n");
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

  const plainText = extractPlainText(article.body);

  return (
    <>
      <ArticleReader
        title={article.title}
        body={article.body}
        plainText={plainText}
        author={article.author}
        issue={article.issue}
        publishedAt={article.publishedAt}
      />
    </>
  );
}
