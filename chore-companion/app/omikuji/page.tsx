"use client";

import { useRouter } from "next/navigation";
import { drawOmikuji, loadStore } from "@/lib/store";

export default function OmikujiPage() {
  const router = useRouter();

  function draw() {
    const store = loadStore();
    const result = drawOmikuji(store);
    const q = result ? `?mission=${encodeURIComponent(result)}` : "";
    router.push(`/omikuji/result${q}`);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <p className="text-5xl">🎋</p>
      <p className="text-sm text-stone-600">今日やる家事を決めよう</p>
      <button
        onClick={draw}
        className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold shadow"
      >
        引く
      </button>
    </div>
  );
}
