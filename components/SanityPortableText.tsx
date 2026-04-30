import { PortableText, PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-baskerVV text-[19.3px] leading-7 tracking-[0.03em] mb-4">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-baskerVilleOld text-2xl tracking-widest uppercase mb-3 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-baskerVilleOld text-xl italic tracking-wide mb-3 mt-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l border-foreground pl-6 my-6 font-baskerVilleOld italic text-xl tracking-wide">
        {children}
      </blockquote>
    ),
  },
  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="underline underline-offset-2 hover:opacity-60 transition-opacity"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default function SanityPortableText({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
