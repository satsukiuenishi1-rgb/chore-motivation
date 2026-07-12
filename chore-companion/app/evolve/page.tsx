"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// キャラの見た目はまだ未定なので、成長の雰囲気だけ出す仮の絵文字列。
// 実際のキャラが決まったら、ステージごとの見た目に差し替える。
const STAGE_ICONS = ["🥚", "🐣", "🐥", "🐤", "🐦", "🦜"];

function iconForStage(stage: number): string {
  const index = Math.min(stage - 1, STAGE_ICONS.length - 1);
  return STAGE_ICONS[Math.max(index, 0)];
}

function EvolveContent() {
  const router = useRouter();
  const params = useSearchParams();
  const stage = Number(params.get("stage") ?? "1");
  const from = params.get("from") ?? "/home";

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <p className="text-xs text-stone-400">(見た目は仮)</p>
      <p className="text-7xl">{iconForStage(stage)}</p>
      <div>
        <p className="text-2xl font-bold text-emerald-600">レベルアップ!</p>
        <p className="text-sm text-stone-600 mt-1">ステージ {stage} になった</p>
      </div>
      <button
        onClick={() => router.push(from)}
        className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold shadow"
      >
        もどる
      </button>
    </div>
  );
}

export default function EvolvePage() {
  return (
    <Suspense fallback={null}>
      <EvolveContent />
    </Suspense>
  );
}
