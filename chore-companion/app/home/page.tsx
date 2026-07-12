"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/SpeechBubble";
import Gauge from "@/components/Gauge";
import { HOME_DONE_LINE_PLACEHOLDER, HOME_NOT_YET_LINE } from "@/lib/dialogue";
import {
  completeChore,
  completeMissionWithoutChore,
  didEvolve,
  loadStore,
  saveStore,
  Store,
} from "@/lib/store";

export default function HomePage() {
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const s = loadStore();
    if (s.todayStatus === "skipped" && !s.pendingMission) {
      router.replace("/chat");
      return;
    }
    setStore(s);
  }, [router]);

  if (!store) return null;

  function reportDone() {
    if (!store || !store.pendingMission) return;
    // プロトタイプでは「今日のミッション」のテキストと一致する家事表項目を完了扱いにする
    const match = store.chores.find((c) => c.text === store.pendingMission);
    let next = match ? completeChore(store, match.id) : completeMissionWithoutChore(store);
    next = { ...next, pendingMission: null, todayStatus: "done" };
    saveStore(next);
    setStore(next);
    if (didEvolve(store, next)) {
      router.push(`/evolve?stage=${next.stage}&from=/home`);
    }
  }

  if (store.pendingMission) {
    return (
      <div className="flex flex-col gap-6">
        <SpeechBubble lines={[`今日のミッション:${store.pendingMission}`]} />
        <Gauge count={store.gauge} stage={store.stage} nextEvolutionAt={store.nextEvolutionAt} />
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/chores")}
            className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
          >
            家事表
          </button>
          <button
            onClick={reportDone}
            className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold"
          >
            完了報告
          </button>
        </div>
      </div>
    );
  }

  const isDone = store.todayStatus === "done";

  return (
    <div className="flex flex-col gap-6">
      <SpeechBubble lines={[isDone ? HOME_DONE_LINE_PLACEHOLDER : HOME_NOT_YET_LINE]} />
      <Gauge count={store.gauge} stage={store.stage} nextEvolutionAt={store.nextEvolutionAt} />
      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/chores")}
          className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
        >
          家事表
        </button>
        {!isDone && (
          <button
            onClick={() => router.push("/omikuji")}
            className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
          >
            おみくじ
          </button>
        )}
      </div>
    </div>
  );
}
