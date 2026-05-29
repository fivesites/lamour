import LLBookshelfClient, { type BookshelfVariant } from "./LLBookshelfClient";

export default function LLBookshelf({ variant = "home" }: { variant?: BookshelfVariant }) {
  return <LLBookshelfClient variant={variant} />;
}
