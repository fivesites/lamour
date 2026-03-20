import Image from "next/image";

interface ImageBoxProps {
  src: string;
  alt?: string;
  caption?: string;
}

export default function ImageBox({ src, alt = "", caption }: ImageBoxProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full py-8 px-24 my-24">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto"
      />
      {caption && <p className="h4">{caption}</p>}
    </div>
  );
}
