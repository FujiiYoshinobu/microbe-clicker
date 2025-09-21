import { EVOLUTION_THRESHOLDS, formatNumber } from "@/lib/game";

interface StatsPanelProps {
  microbes: number;
  autoRate: number;
  clickPower: number;
  totalCollected: number;
  stage: number;
  offlineGains: number;
}

const stageLabels = [
  "芽生えた胞子",
  "初期菌糸",
  "分岐群体",
  "蛍光菌膜",
  "共生複合体",
  "量子変異体",
  "時空超越体"
];

export function StatsPanel({
  microbes,
  autoRate,
  clickPower,
  totalCollected,
  stage,
  offlineGains
}: StatsPanelProps) {
  return (
    <aside className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-white/10 bg-lab-panel/70 p-6 shadow-inner shadow-black/40">
      <header>
        <h2 className="text-sm uppercase tracking-[0.3em] text-white/60">Lab Status</h2>
        <p className="mt-2 text-2xl font-semibold text-lab-accent">
          {formatNumber(microbes)} <span className="text-base text-white/70">microbes</span>
        </p>
      </header>

      <dl className="grid grid-cols-1 gap-3 text-sm text-white/70">
        <div className="flex items-center justify-between rounded-lg bg-black/40 px-3 py-2">
          <dt>増殖速度</dt>
          <dd className="text-lab-accent">{formatNumber(autoRate)}/s</dd>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
          <dt>採取効率</dt>
          <dd className="text-lab-accent">+{formatNumber(clickPower)}</dd>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
          <dt>累計培養</dt>
          <dd>{formatNumber(totalCollected)}</dd>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2">
          <dt>次の進化</dt>
          <dd>
            {stage >= EVOLUTION_THRESHOLDS.length - 1
              ? "---"
              : `${formatNumber(EVOLUTION_THRESHOLDS[stage + 1] - totalCollected)} 体`}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-white/60">
        <p className="font-semibold text-white/80">現在の形態</p>
        <p className="mt-1 text-base text-lab-accent">{stageLabels[stage]}</p>
        {offlineGains > 0 ? (
          <p className="mt-2 text-[11px] text-emerald-300/80">
            オフライン増殖: +{formatNumber(offlineGains)} 体
          </p>
        ) : null}
      </div>
    </aside>
  );
}
