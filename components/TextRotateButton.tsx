import { Button } from "./ui/button";
import { ComponentProps, CSSProperties } from "react";

type Substitution = {
  char: string;
  rotate?: string; // Tailwind rotate class e.g. "rotate-90"
  rotateZ?: number; // arbitrary Z-axis degrees
  flipX?: boolean; // horizontal mirror
  flipY?: boolean; // vertical mirror
};

const SUBSTITUTIONS: Record<string, Substitution> = {
  S: { char: "S", rotate: "rotate-180" },
  N: { char: "Z", rotate: "rotate-90" },
  t: { char: "f", rotate: "-rotate-180", flipX: true },
  M: { char: "W", rotate: "rotate-180" },
};

function buildTransform(sub: Substitution): CSSProperties | undefined {
  const parts: string[] = [];
  if (sub.rotateZ !== undefined) parts.push(`rotateZ(${sub.rotateZ}deg)`);
  if (sub.flipX) parts.push("scaleX(-1)");
  if (sub.flipY) parts.push("scaleY(-1)");
  return parts.length
    ? { transform: parts.join(" "), display: "inline-block" }
    : undefined;
}

function TextRotate({ text, gap = "0.35em" }: { text: string; gap?: string }) {
  return (
    <span className="flex items-center">
      {text.split("").map((char, i) => {
        if (char === " ") return <span key={i} style={{ width: gap }} aria-hidden />;
        const sub = SUBSTITUTIONS[char];
        if (!sub) return <span key={i}>{char}</span>;
        return (
          <span
            key={i}
            className={`inline-block ${sub.rotate ?? ""}`}
            style={buildTransform(sub)}
          >
            {sub.char}
          </span>
        );
      })}
    </span>
  );
}

export default function TextRotateButton({
  text,
  gap,
  className,
  ...props
}: { text: string; gap?: string } & ComponentProps<typeof Button>) {
  return (
    <Button variant="link" className={className} {...props}>
      <TextRotate text={text} gap={gap} />
    </Button>
  );
}
