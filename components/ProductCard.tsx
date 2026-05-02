import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Stretch from "./Stretch";
import LLButton from "./LLButton";

function PriceButton({ price }: { price: string }) {
  return (
    <Button
      size="linkSize"
      variant="link"
      className="font-baskerVilleOld text-4xl w-auto gap-0"
    >
      <Stretch size="text-4xl" text={price} />
      <span className="text-4xl font-normal tracking-wide font-baskerVilleOld ml-2"></span>
    </Button>
  );
}

type ProductCardProps = {
  articleID?: string;
  title: string;
  price: string;
  href?: string;
  image?: string;
  imageSize?: string;
  variant?: "default" | "noIMG";
  description?: string;
  truncate?: boolean;
};

export default function ProductCard({
  articleID,
  title,
  price,
  href,
  image,
  imageSize = "h-64",
  variant = "default",
  description,
  truncate = false,
}: ProductCardProps) {
  const header = (
    <div className="">
      {articleID && (
        <span className="flex items-center font-mono text-foreground/40 tracking-widest whitespace-nowrap text-lg gap-x-0">
          LL#{articleID}
        </span>
      )}
      {/* <span className="flex-1 self-center block h-px bg-black min-w-8" /> */}
      <CardTitle className="text-4xl font-baskerVilleOld font-normal">
        {title}
      </CardTitle>
    </div>
  );

  return (
    <Card className="uppercase w-full gap-0 p-2 rounded-none  font-baskerVilleOld bg-transparent flex flex-col ">
      <CardContent className="flex flex-col w-full justify-start items-start p-0">
        {href ? (
          <Link href={href} className="hover:opacity-60 transition-opacity">
            {header}
          </Link>
        ) : (
          header
        )}
        <PriceButton price={price} />
      </CardContent>
      {variant === "default" && image && (
        <div className={`relative w-full ${imageSize}`}>
          <Image
            src={image.startsWith("http") ? image : `/${image}`}
            alt={title}
            fill
            className="object-top-left object-contain"
          />
        </div>
      )}
      {description && (
        <div className="w-full pt-2">
          <p
            className={`font-baskerVilleClassic text-xl tracking-wide normal-case${truncate ? " line-clamp-2" : ""}`}
          >
            {description}
          </p>
          {truncate && (
            <Button
              variant="link"
              size="linkSize"
              className="font-baskerVilleClassic text-xl normal-case tracking-widest px-0"
            >
              (Read more)
            </Button>
          )}
        </div>
      )}
      <CardFooter className="py-2 px-0 flex items-center justify-end lg:justify-start">
        <LLButton
          text="(Lägg i korg)"
          className="font-baskerVilleClassic uppercase text-xl justify-end w-min whitespace-normal  tracking-widest lg:justify-start  p-0"
        />
      </CardFooter>
    </Card>
  );
}
