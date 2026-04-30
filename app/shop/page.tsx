import { client } from "@/lib/sanity/client";
import { issuesQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import LogoNav from "@/components/LogoNav";
import LLNav from "@/components/LLNav";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

type Issue = {
  _id: string;
  title: string;
  slug: { current: string };
  issueNumber: number;
  coverImage?: { asset: any; alt?: string };
  price?: number;
  inStock?: boolean;
};

export default async function ShopPage() {
  let issues: Issue[] = [];
  try {
    issues = await client.fetch(issuesQuery);
  } catch {
    // Sanity not yet configured
  }

  return (
    <>
    
  
      <section className="flex flex-col mt-[25vh] w-full min-h-screen px-4 pt-8 pb-24">
        <h1 className="font-baskerVilleOld text-5xl uppercase tracking-[0.25em] mb-12">
          Affären
        </h1>
        <div className="flex flex-col lg:flex-row lg:flex-wrap gap-0">
          {issues.length === 0 && (
            <p className="font-baskerVV text-foreground/40 tracking-widest">
              Inga nummer ännu.
            </p>
          )}
          {issues.map((issue) => (
            <div key={issue._id} className="w-full lg:w-1/3 lg:pr-8">
              <ProductCard
                articleID={String(issue.issueNumber)}
                title={issue.title}
                href={`/shop/${issue.slug.current}`}
                price={
                  issue.price ? String(Math.round(issue.price / 100)) : "—"
                }
                image={
                  issue.coverImage?.asset
                    ? urlFor(issue.coverImage).width(600).url()
                    : undefined
                }
                imageSize="h-96"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
