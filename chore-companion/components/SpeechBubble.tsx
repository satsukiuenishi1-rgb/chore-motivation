export default function SpeechBubble({ lines }: { lines: string[] }) {
  return (
    <div className="relative">
      <div className="w-full aspect-square rounded-3xl bg-emerald-100 border border-emerald-300 flex items-center justify-center overflow-hidden">
        <span className="text-[7rem] leading-none select-none">🐣</span>
      </div>
      <div className="absolute top-3 right-3 max-w-[75%] bg-white border border-stone-300 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
        {lines.map((line, i) => (
          <p key={i} className="text-stone-800 text-sm leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
