import type { ItemKey, ItemState } from "@/lib/game";
import { ITEM_DEFINITIONS, formatNumber } from "@/lib/game";

interface ShopPanelProps {
  items: Record<ItemKey, ItemState>;
  microbes: number;
  onPurchase: (key: ItemKey) => void;
}

export function ShopPanel({ items, microbes, onPurchase }: ShopPanelProps) {
  return (
    <aside className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-lab-panel/70 p-6 shadow-inner shadow-black/40">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-sm uppercase tracking-[0.35em] text-white/60">Research Shop</h2>
          <p className="mt-1 text-xs text-white/50">微生物を投資して設備を拡張</p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {(Object.keys(ITEM_DEFINITIONS) as ItemKey[]).map((key) => {
          const definition = ITEM_DEFINITIONS[key];
          const item = items[key];
          const affordable = microbes >= item.cost;

          return (
            <button
              type="button"
              key={key}
              onClick={() => onPurchase(key)}
              disabled={!affordable}
              className={`group flex flex-col gap-1 rounded-xl border border-white/10 bg-black/40 p-4 text-left transition ${
                affordable
                  ? "hover:border-lab-accent/80 hover:bg-black/55 hover:shadow-glow"
                  : "opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white/90">{definition.name}</p>
                  <p className="text-xs text-white/60">{definition.description}</p>
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-lab-accent/80">
                  {formatNumber(item.count)} owned
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/60">
                {definition.autoRate ? (
                  <span className="text-emerald-300/80">+{definition.autoRate}/s</span>
                ) : (
                  <span />
                )}
                {definition.clickBoost ? (
                  <span className="text-sky-300/80">クリック +{definition.clickBoost}</span>
                ) : null}
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-white/60">Cost</span>
                <span className={affordable ? "text-lab-accent" : "text-white/40"}>
                  {formatNumber(item.cost)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
