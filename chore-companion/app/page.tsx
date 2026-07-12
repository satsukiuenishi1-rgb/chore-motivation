"use client";

import { useRouter } from "next/navigation";

export default function TitlePage() {
  const router = useRouter();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-3xl mb-2">🐣</p>
        <h1 className="text-xl font-bold text-stone-800">家事コンパニオン</h1>
        <p className="text-xs text-stone-500 mt-1">(プロトタイプ・キャラ名未定)</p>
      </div>
      <button
        onClick={() => router.push("/checkin")}
        className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold shadow"
      >
        始める
      </button>
    </div>
  );
}
