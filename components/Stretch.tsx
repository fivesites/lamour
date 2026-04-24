export default function Stretch({
  text,
  size,
  stretch = "scale-x-200",
  stretchY,
  className,
}: {
  text: string;
  size: string;
  stretch?: string;
  stretchY?: string;
  className?: string;
}) {
  return (
    <span className={`font-baskerVilleOld ${size} flex items-center ${className ?? ""}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`inline-block ${stretch} ${stretchY ?? ""} origin-center mx-[0.2em]`}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
