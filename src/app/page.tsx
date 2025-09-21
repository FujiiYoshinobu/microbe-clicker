"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PetriDish } from "@/components/PetriDish";
import { ShopPanel } from "@/components/ShopPanel";
import { StatsPanel } from "@/components/StatsPanel";
import {
  DEFAULT_STATE,
  GameState,
  ITEM_DEFINITIONS,
  ItemKey,
  STORAGE_KEY,
  calculateAutoRate,
  calculateClickPower,
  createDefaultItems,
  createDefaultState,
  getEvolutionStage
} from "@/lib/game";
import { playLabSound } from "@/lib/sound";

export default function Home() {
  const [state, setState] = useState<GameState>(createDefaultState());
  const [loaded, setLoaded] = useState(false);
  const [offlineGains, setOfflineGains] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as GameState;
      const mergedItems = createDefaultItems();
      (Object.keys(mergedItems) as ItemKey[]).forEach((key) => {
        if (parsed.items?.[key]) {
          mergedItems[key] = {
            count: parsed.items[key].count,
            cost: parsed.items[key].cost
          };
        }
      });

      const now = Date.now();
      const elapsedSeconds = Math.max(0, Math.floor((now - parsed.lastPlayed) / 1000));
      const autoRate = calculateAutoRate(mergedItems);
      const offlineHarvest = autoRate * elapsedSeconds;

      const hydrated: GameState = {
        ...DEFAULT_STATE,
        ...parsed,
        items: mergedItems,
        microbes: parsed.microbes + offlineHarvest,
        totalCollected: parsed.totalCollected + offlineHarvest,
        autoRate,
        clickPower: calculateClickPower(DEFAULT_STATE.clickPower, mergedItems),
        lastPlayed: now
      };

      setOfflineGains(Math.floor(offlineHarvest));
      setState(hydrated);
    } catch (error) {
      console.error("Failed to load save data", error);
      setState(createDefaultState());
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const interval = window.setInterval(() => {
      setState((previous) => {
        const now = Date.now();
        if (previous.autoRate <= 0) {
          if (now - previous.lastPlayed < 1000) {
            return previous;
          }

          return {
            ...previous,
            lastPlayed: now
          };
        }

        const gained = previous.autoRate;
        return {
          ...previous,
          microbes: previous.microbes + gained,
          totalCollected: previous.totalCollected + gained,
          lastPlayed: now
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loaded]);

  const stage = useMemo(() => getEvolutionStage(state.totalCollected), [state.totalCollected]);

  const handleHarvest = useCallback(() => {
    setState((previous) => ({
      ...previous,
      microbes: previous.microbes + previous.clickPower,
      totalCollected: previous.totalCollected + previous.clickPower,
      lastPlayed: Date.now()
    }));
    playLabSound("click");
  }, []);

  const handlePurchase = useCallback((key: ItemKey) => {
    let purchased = false;
    setState((previous) => {
      const item = previous.items[key];
      const definition = ITEM_DEFINITIONS[key];

      if (!item || !definition) {
        return previous;
      }

      if (previous.microbes < item.cost) {
        return previous;
      }

      purchased = true;
      const updatedItems = {
        ...previous.items,
        [key]: {
          count: item.count + 1,
          cost: Math.ceil(item.cost * definition.costScale)
        }
      } as GameState["items"];

      const nextAutoRate = calculateAutoRate(updatedItems);
      const nextClickPower = calculateClickPower(DEFAULT_STATE.clickPower, updatedItems);

      return {
        ...previous,
        microbes: previous.microbes - item.cost,
        items: updatedItems,
        autoRate: nextAutoRate,
        clickPower: nextClickPower,
        lastPlayed: Date.now()
      };
    });

    if (purchased) {
      playLabSound("purchase");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="flex w-full max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-between">
        <StatsPanel
          microbes={state.microbes}
          autoRate={state.autoRate}
          clickPower={state.clickPower}
          totalCollected={state.totalCollected}
          stage={stage}
          offlineGains={offlineGains}
        />

        <section className="flex flex-1 flex-col items-center gap-6 text-center">
          <header>
            <h1 className="text-4xl font-semibold tracking-[0.4em] text-lab-accent">PIXEL PETRI</h1>
            <p className="mt-3 max-w-md text-sm text-white/60">
              シャーレをタップして微生物を採取し、ラボ設備を強化しよう。進化するピクセル菌の変化を観察しながら、理想の菌株を育て上げてください。
            </p>
          </header>

          <PetriDish onHarvest={handleHarvest} stage={stage} clickPower={state.clickPower} />

          <div className="rounded-full border border-white/10 bg-black/40 px-6 py-2 text-xs uppercase tracking-[0.4em] text-white/50">
            Auto: +{state.autoRate.toFixed(2)} / sec
          </div>
        </section>

        <ShopPanel items={state.items} microbes={state.microbes} onPurchase={handlePurchase} />
      </div>
    </main>
  );
}
