"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/SpeechBubble";
import { CHECKIN_LINES } from "@/lib/dialogue";
import { currentTone, loadStore, saveStore, setTodayStatus, Tone } from "@/lib/store";

export default function CheckinPage() {
  const router = useRouter();
  const [tone, setTone] = useState<Tone | null>(null);

  useEffect(() => {
    const store = loadStore();
    // 今日すでに状態を答えている場合は、聞き直さずそのまま該当画面へ
    if (store.todayStatus === "skipped") {
      router.replace("/chat");
      return;
    }
    if (store.todayStatus === "done" || store.todayStatus === "not_yet") {
      router.replace("/home");
      return;
    }
    setTone(currentTone());
  }, [router]);

  function choose(status: "not_yet" | "done" | "skipped") {
    const store = saveWithStatus(status);
    saveStore(store);
    router.push(status === "skipped" ? "/chat" : "/home");
  }

  function saveWithStatus(status: "not_yet" | "done" | "skipped") {
    const store = loadStore();
    return setTodayStatus(store, status);
  }

  if (!tone) return null;

  return (
    <div className="flex flex-col gap-6">
      <SpeechBubble lines={CHECKIN_LINES[tone]} />
      <div className="flex flex-col gap-3">
        <button
          onClick={() => choose("not_yet")}
          className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
        >
          まだ
        </button>
        <button
          onClick={() => choose("done")}
          className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
        >
          もうやった
        </button>
        <button
          onClick={() => choose("skipped")}
          className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
        >
          今日はサボる
        </button>
      </div>
    </div>
  );
}
