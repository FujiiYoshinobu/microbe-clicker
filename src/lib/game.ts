export type ItemKey =
  | "medium"
  | "incubator"
  | "microscope"
  | "geneSequencer"
  | "quantumGel";

export interface ItemDefinition {
  key: ItemKey;
  name: string;
  description: string;
  baseCost: number;
  costScale: number;
  autoRate?: number;
  clickBoost?: number;
}

export interface ItemState {
  count: number;
  cost: number;
}

export interface GameState {
  microbes: number;
  clickPower: number;
  autoRate: number;
  items: Record<ItemKey, ItemState>;
  lastPlayed: number;
  totalCollected: number;
}

export const ITEM_DEFINITIONS: Record<ItemKey, ItemDefinition> = {
  medium: {
    key: "medium",
    name: "栄養培地",
    description: "微生物の基礎的な餌。ゆっくり自動増殖。",
    baseCost: 10,
    costScale: 1.15,
    autoRate: 0.5
  },
  incubator: {
    key: "incubator",
    name: "インキュベーター",
    description: "温度管理で増殖速度を大幅アップ。",
    baseCost: 120,
    costScale: 1.2,
    autoRate: 6
  },
  microscope: {
    key: "microscope",
    name: "顕微鏡",
    description: "一度の採取で観察できる個体数が増える。",
    baseCost: 60,
    costScale: 1.35,
    clickBoost: 1
  },
  geneSequencer: {
    key: "geneSequencer",
    name: "遺伝子編集",
    description: "遺伝子最適化で自動と手動の両方を向上。",
    baseCost: 500,
    costScale: 1.4,
    autoRate: 25,
    clickBoost: 3
  },
  quantumGel: {
    key: "quantumGel",
    name: "量子ゲル",
    description: "時空を歪めて指数的な繁殖を引き起こす。",
    baseCost: 2400,
    costScale: 1.55,
    autoRate: 120
  }
};

export const EVOLUTION_THRESHOLDS = [0, 250, 1500, 8000, 25000, 75000, 150000];

export function createDefaultItems(): Record<ItemKey, ItemState> {
  return (Object.keys(ITEM_DEFINITIONS) as ItemKey[]).reduce(
    (acc, key) => {
      acc[key] = {
        count: 0,
        cost: ITEM_DEFINITIONS[key].baseCost
      };
      return acc;
    },
    {} as Record<ItemKey, ItemState>
  );
}

export function createDefaultState(): GameState {
  return {
    microbes: 0,
    clickPower: 1,
    autoRate: 0,
    items: createDefaultItems(),
    lastPlayed: Date.now(),
    totalCollected: 0
  };
}

export const DEFAULT_STATE: GameState = createDefaultState();

export const STORAGE_KEY = "pixel-petri-state";

export function calculateAutoRate(items: GameState["items"]): number {
  return (Object.keys(items) as ItemKey[]).reduce((total, key) => {
    const definition = ITEM_DEFINITIONS[key];
    const item = items[key];
    return total + (definition.autoRate ?? 0) * item.count;
  }, 0);
}

export function calculateClickPower(base: number, items: GameState["items"]): number {
  const additional = (Object.keys(items) as ItemKey[]).reduce((bonus, key) => {
    const definition = ITEM_DEFINITIONS[key];
    const item = items[key];
    return bonus + (definition.clickBoost ?? 0) * item.count;
  }, 0);

  return Math.max(1, base + additional);
}

export function getEvolutionStage(totalMicrobes: number): number {
  for (let i = EVOLUTION_THRESHOLDS.length - 1; i >= 0; i -= 1) {
    if (totalMicrobes >= EVOLUTION_THRESHOLDS[i]) {
      return i;
    }
  }
  return 0;
}

export function evolveColor(stage: number): string {
  const palette = [
    "from-sky-400 via-emerald-300 to-teal-300",
    "from-teal-300 via-lime-300 to-yellow-200",
    "from-indigo-300 via-purple-300 to-pink-300",
    "from-amber-300 via-orange-400 to-red-300",
    "from-emerald-300 via-cyan-300 to-blue-400",
    "from-pink-400 via-rose-400 to-purple-500",
    "from-yellow-300 via-amber-400 to-lime-300"
  ];

  return palette[Math.min(stage, palette.length - 1)];
}

export function formatNumber(value: number): string {
  if (value < 1000) {
    return value.toLocaleString();
  }

  const suffixes = ["k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
  let suffixIndex = -1;
  let shortValue = value;

  while (shortValue >= 1000 && suffixIndex < suffixes.length - 1) {
    shortValue /= 1000;
    suffixIndex += 1;
  }

  return `${shortValue.toFixed(shortValue >= 100 ? 0 : 1)}${suffixes[suffixIndex]}`;
}
