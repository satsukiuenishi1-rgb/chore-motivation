"use client";

import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/SpeechBubble";
import { CHAT_LINES } from "@/lib/dialogue";
import { loadStore, saveStore } from "@/lib/store";

export default function ChatPage() {
  const router = useRouter();

  function feelMotivated() {
    const store = loadStore();
    saveStore({ ...store, todayStatus: "not_yet" });
    router.push("/omikuji");
  }

  return (
    <div className="flex flex-col gap-6">
      <SpeechBubble lines={CHAT_LINES} />
      <button
        onClick={feelMotivated}
        className="w-full py-3 rounded-full bg-emerald-500 text-white font-bold shadow"
      >
        やっぱやる気出てきた
      </button>
    </div>
  );
}
