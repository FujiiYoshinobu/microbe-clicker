"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

import { evolveColor } from "@/lib/game";

interface PetriDishProps {
  onHarvest: () => void;
  stage: number;
  clickPower: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

const PARTICLE_COUNT = 24;

export function PetriDish({ onHarvest, stage, clickPower }: PetriDishProps) {
  const [sparkles, setSparkles] = useState<Particle[]>([]);

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, index) => ({
        id: index,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        delay: Math.random() * 4
      })),
    [stage]
  );

  const gradientClass = evolveColor(stage);

  const handleClick = () => {
    onHarvest();
    setSparkles((prev) => [
      ...prev,
      {
        id: Date.now(),
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        delay: 0
      }
    ]);
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      <motion.button
        type="button"
        onClick={handleClick}
        whileTap={{ scale: 0.96 }}
        className={`relative h-64 w-64 overflow-hidden rounded-full border-4 border-slate-900 bg-gradient-to-br ${gradientClass} shadow-glow transition-shadow duration-500 hover:shadow-[0_0_25px_rgba(127,255,212,0.6)]`}
      >
        <div className="absolute inset-0 rounded-full bg-black/15 mix-blend-multiply" />
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute h-3 w-3 rounded-full bg-white/90 shadow-[0_0_6px_rgba(255,255,255,0.7)]"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `float ${6 + particle.delay}s ease-in-out ${particle.delay}s infinite`
            }}
          />
        ))}

        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.7)] animate-sparkle"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            onAnimationEnd={() =>
              setSparkles((prev) => prev.filter((particle) => particle.id !== sparkle.id))
            }
          />
        ))}

        <div className="absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-full bg-black/35 px-3 py-1 text-xs uppercase tracking-widest text-white/70">
            Click +{clickPower.toLocaleString()}
          </span>
        </div>
      </motion.button>
    </div>
  );
}
