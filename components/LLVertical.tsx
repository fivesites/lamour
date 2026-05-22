export default function LLVertical({ text }: { text: string }) {
  const letter = text
    .split("")
    .map((char) => ({ char, isSpace: char === " " }));

  return (
    <div className="flex flex-col w-4 items-center justify-start">
      {letter.map((item, i) => (
        <span
          key={i}
          className="inline-block origin-center leading-none font-baskerVilleOld text-2xl [text-box-trim:both] [text-box-edge:cap_alphabetic]"
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}
