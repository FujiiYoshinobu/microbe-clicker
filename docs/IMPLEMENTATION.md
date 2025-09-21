# Pixel Petri 実装メモ

本ドキュメントでは、仕様書に基づいて構築した Pixel Petri の主要ポイントを整理する。

## 技術スタック

- **Next.js 14 (App Router)** – ページは `src/app/page.tsx` に実装。
- **TypeScript** – ゲームステート、アイテム定義、UI コンポーネントの型安全性を確保。
- **Tailwind CSS 3** – ラボ風のダーク UI、ドット絵調の演出、レスポンシブレイアウトを構築。
- **framer-motion** – シャーレクリック時の軽いスケール演出。
- **Web Audio API** – クリック・購入のフィードバックサウンド。
- **localStorage** – 完全フロントエンドで状態永続化（バックエンド不要）。

## ゲームサイクル

1. **手動採取** – 中央のシャーレ (`PetriDish` コンポーネント) をクリックすると、`clickPower` に応じて微生物を獲得。
2. **自動増殖** – `autoRate`（秒間獲得数）を 1 秒毎に加算。アイテム購入で速度が向上。
3. **ショップ** – 右ペインの `ShopPanel` で研究設備を購入。購入時はコストがスケーリングし、各設備が自動増殖かクリック効率を強化。
4. **ステータス表示** – 左ペインの `StatsPanel` が現在の菌数、増殖速度、累計培養数、進化段階、オフライン獲得量を表示。

## ステート管理

`src/lib/game.ts` にデータモデルとユーティリティを集約。

```ts
interface GameState {
  microbes: number;        // 現在の菌数
  clickPower: number;      // 1 クリックあたりの獲得数
  autoRate: number;        // 秒あたりの自動増殖量
  items: Record<ItemKey, ItemState>; // 研究アイテムの保有数と次回コスト
  lastPlayed: number;      // 保存時刻 (ms)
  totalCollected: number;  // 累計獲得数 (進化判定用)
}
```

- `createDefaultState()` / `createDefaultItems()` で新規データを生成し、保存データ読み込み時も欠損なく復元。
- `calculateAutoRate()` と `calculateClickPower()` でアイテム効果を集約し、購入・読込時に再計算。
- `getEvolutionStage()` は累計培養数に応じて進化段階を返却し、UI 色味を変更。

## 永続化とオフライン処理

- 状態は `pixel-petri-state` キーで `localStorage` に保存。
- `lastPlayed` と現在時刻の差分からオフライン経過秒を算出し、`autoRate` に応じた自動増殖を起動時に付与。
- 付与結果は UI 上で「オフライン増殖」として提示。

## 演出

- シャーレは Tailwind のグラデーションとカスタムアニメーションでドット風粒子を表示。
- `framer-motion` でクリック時に軽く縮小。
- Web Audio API のシンプルなシンセサイザーで「クリック」「購入」サウンドを再生。

## 将来拡張の余地

- `ITEM_DEFINITIONS` にイベント用フィールドを追加することで、突然変異や限定アイテムを柔軟に拡張可能。
- Prestige や図鑑機能は `GameState` に追加プロパティを持たせることで対応しやすい構造。
- 温度・pH など環境パラメータは別 Reducer / Hook で状態化して UI に組み込める。
