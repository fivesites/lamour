import { client } from "@/lib/sanity/client";
import { issueBySlugQuery, issuesQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import LogoNav from "@/components/LogoNav";
import LLNav from "@/components/LLNav";
import SanityPortableText from "@/components/SanityPortableText";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

type Issue = {
  _id: string;
  title: string;
  slug: { current: string };
  issueNumber: number;
  coverImage?: { asset: any; alt?: string };
  previewImages?: Array<{ asset: any; alt?: string; _key: string }>;
  description?: any[];
  price?: number;
  stripePriceId?: string;
  inStock?: boolean;
  publishedAt?: string;
};

export async function generateStaticParams() {
  try {
    const issues: Issue[] = await client.fetch(issuesQuery);
    return issues.map((issue) => ({ slug: issue.slug.current }));
  } catch {
    return [];
  }
}

function formatPrice(price?: number) {
  if (!price) return null;
  return Math.round(price / 100);
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let issue: Issue | null = null;
  try {
    issue = await client.fetch(issueBySlugQuery, { slug });
  } catch {
    // Sanity not yet configured
  }

  if (!issue) notFound();

  return (
    <>
      <section className="flex flex-col mt-[25vh] w-full min-h-screen px-4 pt-8 pb-32">
        {/* back */}
        <Link
          href="/shop"
          className="font-baskerVilleOld text-xl tracking-widest text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block"
        >
          ← Affären
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 w-full">
          {/* Cover */}
          {issue.coverImage?.asset && (
            <div className="relative w-full lg:w-1/3 aspect-[2/3]">
              <Image
                src={urlFor(issue.coverImage).width(800).url()}
                alt={issue.coverImage.alt ?? issue.title}
                fill
                className="object-contain object-top"
                priority
              />
            </div>
          )}

          {/* Details */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-foreground/40 tracking-widest text-2xl">
                LL#{issue.issueNumber}
              </span>
              <span className="block h-px bg-foreground/20 flex-1 self-center" />
            </div>

            <h1 className="font-baskerVilleOld text-5xl uppercase tracking-[0.2em] leading-tight">
              {issue.title}
            </h1>

            {issue.publishedAt && (
              <p className="font-baskervilleClassic italic text-xl tracking-wide text-foreground/60">
                {new Date(issue.publishedAt).toLocaleDateString("sv-SE", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            )}

            {issue.description && (
              <div className="max-w-prose">
                <SanityPortableText value={issue.description} />
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center gap-6 mt-4">
              {issue.price && (
                <span className="font-baskerVilleOld text-4xl tracking-widest">
                  {formatPrice(issue.price)} KR
                </span>
              )}
              <button
                disabled={!issue.inStock}
                className="font-baskerVilleOld text-2xl tracking-widest uppercase border-b border-foreground pb-1 hover:text-foreground/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {issue.inStock === false ? "Slutsåld" : "(Lägg i korg)"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview gallery */}
        {issue.previewImages && issue.previewImages.length > 0 && (
          <div className="mt-16">
            <h2 className="font-baskerVilleOld text-2xl uppercase tracking-[0.25em] mb-6 border-b border-foreground pb-2">
              Inblick
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {issue.previewImages.filter((img) => img.asset?._ref).map((img) => (
                <div key={img._key} className="relative aspect-[3/4]">
                  <Image
                    src={urlFor(img).width(600).url()}
                    alt={img.alt ?? ""}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
