import { PortableText, PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-baskerVV text-xl text-center mb-4">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="font-baskerVilleOld text-2xl tracking-wider  mb-4 mt-8 text-center">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-baskerVilleOld text-2xl tracking-widest text-center  mb-3 mt-6">
        {children}
      </h2>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-baskerVV text-xl italic border-l-2 border-foreground pl-6 my-6 text-foreground/80">
        {children}
      </blockquote>
    ),
    quote: ({ children }) => (
      <blockquote className="font-baskerVilleOld text-2xl text-center italic my-8 px-8 text-foreground/90">
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
