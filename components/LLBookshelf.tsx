import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { latestIssueQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

const spines = [
  {
    src: "/LL-15-cover-scaled.jpg",
    label: "LL 15",
    containerClass: "h-6 w-[75vw] lg:w-6 lg:h-[75vh]",
    rotatorClass: "w-6 h-[75vw]",
  },
  {
    src: "/LL10-cover-lowres-scaled.jpg",
    label: "LL 10",
    containerClass: "h-4 w-[80vw] lg:w-4 lg:h-[80vh]",
    rotatorClass: "w-4 h-[80vw]",
  },
  {
    src: "/LL16-cover-lowres.png",
    label: "LL 16",
    containerClass: "h-4 w-[60vw] lg:w-4 lg:h-[60vh]",
    rotatorClass: "w-4 h-[60vw]",
  },
  {
    src: "/omslag-LL18-scaled.jpg",
    label: "LL 18",
    containerClass: "h-8 w-[50vw] lg:w-8 lg:h-[50vh]",
    rotatorClass: "w-8 h-[50vw]",
  },
];

export default async function LLBookshelf() {
  let latestCoverUrl: string | undefined;
  try {
    const latest = await client.fetch(latestIssueQuery);
    if (latest?.coverImage?.asset) {
      latestCoverUrl = urlFor(latest.coverImage).width(400).url();
    }
  } catch {
    // Sanity not yet configured
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:items-end justify-start gap-0 p-4 w-full min-h-dvh lg:h-dvh overflow-y-auto lg:overflow-hidden">
      {spines.map(({ src, label, containerClass, rotatorClass }) => (
        <div
          key={src}
          className={`relative ${containerClass} overflow-hidden shrink-0`}
        >
          {/* Mobile: rotate the image to fill the horizontal bar */}
          <div className="lg:hidden absolute inset-0">
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 ${rotatorClass}`}>
              <Image src={src} fill alt={label} className="object-cover" />
            </div>
          </div>
          {/* Desktop: normal fill */}
          <Image
            src={src}
            fill
            alt={label}
            className="hidden lg:block object-cover"
          />
          <span className="lg:hidden absolute inset-0 flex items-center px-4">
            <span className="font-baskervilleSC text-background text-sm tracking-widest drop-shadow">
              {label}
            </span>
          </span>
        </div>
      ))}

      {latestCoverUrl && (
        <div className="relative h-[40vh] w-full lg:aspect-3/4 overflow-hidden ml-0 lg:-ml-1 lg:-mb-1">
          <Image
            src={latestCoverUrl}
            fill
            alt="Latest Issue Cover"
            className="object-contain object-bottom-left"
          />
        </div>
      )}
    </div>
  );
}
