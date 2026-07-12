"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addChore,
  completeChore,
  deleteChore,
  didEvolve,
  dueChores,
  Frequency,
  loadStore,
  saveStore,
  Store,
} from "@/lib/store";

export default function ChoresPage() {
  const router = useRouter();
  const [store, setStore] = useState<Store | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<"once" | "recurring">("once");
  const [frequency, setFrequency] = useState<Frequency>("weekly");

  useEffect(() => {
    setStore(loadStore());
  }, []);

  if (!store) return null;

  function toggle(id: string) {
    if (!store) return;
    const next = completeChore(store, id);
    saveStore(next);
    setStore(next);
    if (didEvolve(store, next)) {
      router.push(`/evolve?stage=${next.stage}&from=/chores`);
    }
  }

  function remove(id: string) {
    if (!store) return;
    const next = deleteChore(store, id);
    saveStore(next);
    setStore(next);
  }

  function submitMemo(e: React.FormEvent) {
    e.preventDefault();
    if (!store || !text.trim()) return;
    const next = addChore(store, text.trim(), type, type === "recurring" ? frequency : undefined);
    saveStore(next);
    setStore(next);
    setText("");
    setShowForm(false);
  }

  const items = dueChores(store);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-bold text-stone-800">家事表</h1>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="text-sm text-stone-500">今、期限が来ている家事はないよ。</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-2"
          >
            <input
              type="checkbox"
              onChange={() => toggle(item.id)}
              className="w-5 h-5 accent-emerald-500"
            />
            <span className="flex-1 text-sm text-stone-800">{item.text}</span>
            {item.type === "recurring" && (
              <span className="text-[10px] text-stone-400">{item.frequency}</span>
            )}
            {item.type === "once" && (
              <button
                onClick={() => remove(item.id)}
                aria-label="削除"
                className="text-stone-400 text-sm px-1"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 rounded-full border border-dashed border-stone-400 text-stone-600 text-sm"
        >
          + メモを追加
        </button>
      )}

      {showForm && (
        <form onSubmit={submitMemo} className="bg-white border border-stone-200 rounded-lg p-3 flex flex-col gap-3">
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="例: 棚を拭く"
            className="border border-stone-300 rounded px-2 py-1 text-sm"
          />
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={type === "once"}
                onChange={() => setType("once")}
              />
              一時的
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                checked={type === "recurring"}
                onChange={() => setType("recurring")}
              />
              繰り返す
            </label>
          </div>
          {type === "recurring" && (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Frequency)}
              className="border border-stone-300 rounded px-2 py-1 text-sm"
            >
              <option value="daily">毎日</option>
              <option value="weekly">毎週</option>
              <option value="biweekly">隔週</option>
              <option value="monthly">毎月</option>
            </select>
          )}
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold">
              追加する
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-full border border-stone-300 text-sm text-stone-600"
            >
              やめる
            </button>
          </div>
        </form>
      )}

      <button
        onClick={() => router.push("/home")}
        className="w-full py-3 rounded-full bg-white border border-stone-300 font-bold text-stone-800"
      >
        ホームにもどる
      </button>
    </div>
  );
}
