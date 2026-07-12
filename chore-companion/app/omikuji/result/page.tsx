"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SpeechBubble from "@/components/SpeechBubble";
import { OMIKUJI_RESULT_LINE } from "@/lib/dialogue";
import { loadStore, saveStore } from "@/lib/store";

function ResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const mission = params.get("mission");

  function backHome() {
    const store = loadStore();
    saveStore({ ...store, pendingMission: mission });
    router.push("/home");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-stone-800">今日のミッション</h1>
      <div className="bg-white border border-stone-200 rounded-lg px-4 py-6 text-center text-stone-800 font-bold">
        {mission ?? "今、期限が来ている家事がなかったよ"}
      </div>
      <SpeechBubble lines={[OMIKUJI_RESULT_LINE]} />
      <button
        onClick={backHome}
        className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
      >
        ホームにもどる
      </button>
    </div>
  );
}

export default function OmikujiResultPage() {
  return (
    <Suspense fallback={null}>
      <ResultContent />
    </Suspense>
  );
}
