"use client";

// プロトタイプ用の簡易ストア。バックエンドは持たず、すべてブラウザの localStorage に保存する。
// 設計の詳細は docs/chore-motivation-app/ を参照。

export type Frequency = "daily" | "weekly" | "biweekly" | "monthly";

export type ChoreItem = {
  id: string;
  text: string;
  type: "once" | "recurring";
  frequency?: Frequency;
  nextDueAt: string | null; // null = 現在期限が来ている(表示対象)
};

export type TodayStatus = "not_yet" | "done" | "skipped";

export type Store = {
  gauge: number;
  stage: number; // キャラの進化段階。1から始まる
  nextEvolutionAt: number; // 次に進化する頑張り数(7〜12でランダム)
  chores: ChoreItem[];
  todayDate: string | null;
  todayStatus: TodayStatus | null;
  pendingMission: string | null;
};

const STORAGE_KEY = "chore-companion-store";

const FREQUENCY_DAYS: Record<Frequency, number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// 一人暮らしを想定したデフォルトの家事表(繰り返し項目のみ。一時的な項目はメモ機能でユーザーが追加する)
const SEED_CHORES: ChoreItem[] = [
  { id: "seed-1", text: "使った食器を洗う", type: "recurring", frequency: "daily", nextDueAt: null },
  { id: "seed-2", text: "シンクの水気を拭く", type: "recurring", frequency: "daily", nextDueAt: null },
  { id: "seed-3", text: "洗濯機を回す", type: "recurring", frequency: "weekly", nextDueAt: null },
  { id: "seed-4", text: "掃除機をかける", type: "recurring", frequency: "weekly", nextDueAt: null },
  { id: "seed-5", text: "お風呂を洗う", type: "recurring", frequency: "weekly", nextDueAt: null },
  { id: "seed-6", text: "トイレを掃除する", type: "recurring", frequency: "weekly", nextDueAt: null },
  { id: "seed-7", text: "シーツ・枕カバーを替える", type: "recurring", frequency: "biweekly", nextDueAt: null },
  { id: "seed-8", text: "冷蔵庫の中を整理する", type: "recurring", frequency: "monthly", nextDueAt: null },
  { id: "seed-9", text: "換気扇のフィルターを掃除する", type: "recurring", frequency: "monthly", nextDueAt: null },
];

// マンネリ化対策のチャレンジ枠(おみくじに低確率で混ざる、アプリ側の固定候補)
export const CHALLENGE_POOL: string[] = [
  "作ったことない料理を1品作ってみる",
  "引き出しを1つだけ整理してみる",
  "捨てるか迷ってるものを1個だけ決める",
  "普段拭かない場所を1箇所だけ拭いてみる",
  "クローゼットの中身を1段だけ見直す",
  "使ってない調味料を使い切るレシピを探してみる",
  "玄関の靴を整理してみる",
  "1年以上使ってないものを1つだけ見つけてみる",
];

// 進化までの頑張り数を7〜12でランダムに決める(逆算のプレッシャーを減らすため幅を持たせる)
function randomEvolutionThreshold(): number {
  return 7 + Math.floor(Math.random() * 6);
}

function defaultStore(): Store {
  return {
    gauge: 0,
    stage: 1,
    nextEvolutionAt: randomEvolutionThreshold(),
    chores: SEED_CHORES,
    todayDate: null,
    todayStatus: null,
    pendingMission: null,
  };
}

export function loadStore(): Store {
  if (typeof window === "undefined") return defaultStore();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore();
  try {
    const parsed = JSON.parse(raw) as Store;
    // 日付が変わっていたら、その日の状態(軸A)をリセットする
    const today = todayString();
    if (parsed.todayDate !== today) {
      parsed.todayDate = today;
      parsed.todayStatus = null;
    }
    if (typeof parsed.stage !== "number") parsed.stage = 1;
    if (typeof parsed.nextEvolutionAt !== "number") {
      parsed.nextEvolutionAt = randomEvolutionThreshold();
    }
    return parsed;
  } catch {
    return defaultStore();
  }
}

export function saveStore(store: Store): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function isDue(item: ChoreItem, today: string): boolean {
  return item.nextDueAt === null || item.nextDueAt <= today;
}

export function dueChores(store: Store): ChoreItem[] {
  const today = todayString();
  return store.chores.filter((c) => isDue(c, today));
}

// ゲージに1点加算する共通処理。次の進化ラインに達したらステージを進めてゲージを0に戻し、
// 次の進化ラインを引き直す(チャレンジ枠など、家事表に項目がないミッションの完了報告でも使う)。
function addGaugePoint(store: Store): Store {
  const gauge = store.gauge + 1;
  if (gauge >= store.nextEvolutionAt) {
    return {
      ...store,
      gauge: 0,
      stage: store.stage + 1,
      nextEvolutionAt: randomEvolutionThreshold(),
    };
  }
  return { ...store, gauge };
}

// チェックした項目を「完了」にする。一時的な項目はリストから消え、繰り返す項目は
// チェックした日から起算して次回期限を再計算する(罰なし原則:曜日固定にしない)。
export function completeChore(store: Store, id: string): Store {
  const chores = store.chores
    .map((c) => {
      if (c.id !== id) return c;
      if (c.type === "once") return null;
      const days = FREQUENCY_DAYS[c.frequency ?? "weekly"];
      const next = new Date();
      next.setDate(next.getDate() + days);
      return { ...c, nextDueAt: next.toISOString().slice(0, 10) };
    })
    .filter((c): c is ChoreItem => c !== null);

  return { ...addGaugePoint(store), chores };
}

// 家事表に項目のないミッション(チャレンジ枠など)の完了報告用。ゲージだけ加算する。
export function completeMissionWithoutChore(store: Store): Store {
  return addGaugePoint(store);
}

// completeChore の前後を比べて、進化したかどうかを判定するヘルパー
export function didEvolve(before: Store, after: Store): boolean {
  return after.stage > before.stage;
}

export function deleteChore(store: Store, id: string): Store {
  return { ...store, chores: store.chores.filter((c) => c.id !== id) };
}

export function addChore(
  store: Store,
  text: string,
  type: "once" | "recurring",
  frequency?: Frequency
): Store {
  const item: ChoreItem = {
    id: `chore-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    text,
    type,
    frequency: type === "recurring" ? frequency ?? "weekly" : undefined,
    nextDueAt: null,
  };
  return { ...store, chores: [...store.chores, item] };
}

export function setTodayStatus(store: Store, status: TodayStatus): Store {
  return { ...store, todayDate: todayString(), todayStatus: status };
}

// 通常のおみくじ抽選プールに、低確率(約1〜2/10)でチャレンジ枠を混ぜる
export function drawOmikuji(store: Store): string | null {
  const pool = dueChores(store).map((c) => c.text);
  if (Math.random() < 0.15) {
    return CHALLENGE_POOL[Math.floor(Math.random() * CHALLENGE_POOL.length)];
  }
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export type Tone = "night" | "holiday" | "default";

export function currentTone(): Tone {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  if (day === 0 || day === 6) return "holiday";
  if (hour >= 18 || hour < 2) return "night";
  return "default";
}
