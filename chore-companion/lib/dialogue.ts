import { Tone } from "./store";

// docs/chore-motivation-app/pattern1-dialogue.md のセリフ台本。
// キャラの見た目・名前は未確定のため、話者名は表示せず吹き出しのみで表現する。

export const CHECKIN_LINES: Record<Tone, string[]> = {
  night: ["おかえり", "今日はもうごはん食べた?", "今日家事どんな感じ?"],
  holiday: ["あ、今日休みだ", "時間あるね、のんびりいこ", "今日家事どんな感じ?"],
  default: ["お、来たね", "調子どう?", "今日家事どんな感じ?"],
};

export const HOME_NOT_YET_LINE = "ぼちぼちがんばろ。";

// パターン2(もうやった後)の台本はまだ未執筆。ここは仮のセリフ。
export const HOME_DONE_LINE_PLACEHOLDER =
  "今日はもうやったんだね、えらい。(このセリフは仮。パターン2はまだ台本ができてません)";

export const OMIKUJI_RESULT_LINE = "完了したら教えてね。";

// サボりを選んだ日の雑談。家事の話は一切しない。
export const CHAT_LINES = [
  "今日、日当たりがよくて気持ちよかった",
  "そういえば最近、棚の上のホコリが気になってるんだよね",
  "まあそれは置いといて",
];
