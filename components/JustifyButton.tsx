import { Button } from "./ui/button";
import { ComponentProps } from "react";
import { motion } from "motion/react";

function JustifyText({ text }: { text: string }) {
  return (
    <span className="flex justify-between items-center w-full">
      {text.split("").map((char, i) => (
        <span key={i}>{char === " " ? " " : char}</span>
      ))}
    </span>
  );
}

export default function JustifyButton({
  text,
  className,
  ...props
}: { text: string } & ComponentProps<typeof Button>) {
  return (
    <motion.div
      initial={{ width: "min-content" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Button variant="link" className={`w-full ${className ?? ""}`} {...props}>
        <JustifyText text={text} />
      </Button>
    </motion.div>
  );
}
