import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import Stretch from "./Stretch";

function PriceButton({ price }: { price: string }) {
  return (
    <Button
      size="linkSize"
      variant="link"
      className="font-baskerVilleOld text-4xl w-auto gap-0 "
    >
      <Stretch size="text-4xl" text={price} />
      <span className="text-4xl font-normal tracking-wide font-baskerVilleOld ml-2">
        KR
      </span>
    </Button>
  );
}

type ProductCardProps = {
  articleID?: string;
  title: string;
  price: string;
  image?: string;
  imageSize?: string;
  variant?: "default" | "noIMG";
};

export default function ProductCard({
  articleID,
  title,
  price,
  image,
  imageSize = "h-64",
  variant = "default",
}: ProductCardProps) {
  return (
    <Card className=" uppercase w-full gap-0 px-0 pt-2  rounded-none border-b border-b-foreground bg-transparent  font-baskerVilleOld  flex flex-col items-start justify-start">
      <CardContent className=" flex flex-wrap w-full justify-between items-center  p-0">
        <div className="flex flex-wrap gap-x-2 items-start">
          {articleID && (
            <span className="flex items-center font-mono text-foreground/40 tracking-widest whitespace-nowrap  text-4xl">
              LL#{articleID}
            </span>
          )}
          <span className="flex-1 self-center block h-[1px] bg-black min-w-8" />
          <CardTitle className=" text-4xl font-baskerVilleOld  font-normal">
            {title}
          </CardTitle>
        </div>
        <PriceButton price={price} />
      </CardContent>
      {variant === "default" && image && (
        <div className={`relative w-full ${imageSize}`}>
          <Image
            src={`/${image}`}
            alt={title}
            fill
            className="object-top-left object-contain"
          />
        </div>
      )}

      <CardFooter className="px-0 pb-0 flex items-start justify-start">
        <Button
          variant="link"
          size="linkSize"
          className="font-baskerVilleClassic uppercase  text-xl justify-start w-full whitespace-normal text-left tracking-widest"
        >
          (Lägg i korg)
        </Button>
      </CardFooter>
    </Card>
  );
}
