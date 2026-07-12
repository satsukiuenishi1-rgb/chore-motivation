export default function Gauge({
  count,
  stage,
  nextEvolutionAt,
}: {
  count: number;
  stage: number;
  nextEvolutionAt: number;
}) {
  // 具体的な数字(◯/◯)は出さず、割合だけをメーターとして見せる。
  const ratio = Math.min(count / nextEvolutionAt, 1);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-900">
      <div className="text-[11px] text-amber-700 mb-0.5 text-center">ステージ {stage}</div>
      <div className="text-center mb-2">
        これまでの頑張り、<span className="font-bold">{count}</span>個たまってるよ
      </div>
      <div className="w-full h-2 rounded-full bg-amber-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-amber-400 transition-all"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
