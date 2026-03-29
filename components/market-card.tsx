'use client';

import { Market } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { Heart, Radio } from 'lucide-react';
import { useState } from 'react';

interface MarketCardProps {
  market: Market;
  onBet: (type: 'home' | 'draw' | 'away', odds: number) => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

const SELECTION_LABELS: Record<'home' | 'draw' | 'away', string> = {
  home: '1',
  draw: 'X',
  away: '2',
};

export function MarketCard({ market, onBet, onFavorite, isFavorite }: MarketCardProps) {
  const [glowingOdds, setGlowingOdds] = useState<'home' | 'draw' | 'away' | null>(null);

  const handleOddsClick = (type: 'home' | 'draw' | 'away', odds: number) => {
    setGlowingOdds(type);
    setTimeout(() => setGlowingOdds(null), 550);
    onBet(type, odds);
  };

  const oddsButtons = [
    { type: 'home' as const, label: SELECTION_LABELS.home, value: market.odds.home, team: market.homeTeam },
    ...(market.odds.draw ? [{ type: 'draw' as const, label: SELECTION_LABELS.draw, value: market.odds.draw, team: 'Beraberlik' }] : []),
    { type: 'away' as const, label: SELECTION_LABELS.away, value: market.odds.away, team: market.awayTeam },
  ];

  return (
    <motion.div
      className="glass-card p-4 space-y-3 group"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      {/* ─── Üst: maç bilgisi + favori ─── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">

          {/* Lig adı */}
          <p
            className="text-[10px] font-semibold tracking-widest uppercase mb-1.5"
            style={{ color: 'var(--muted-foreground)' }}
          >
            {market.name}
          </p>

          {/* Takımlar */}
          <div className="space-y-0.5">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
              {market.homeTeam}
            </p>
            <p
              className="text-[10px] font-medium"
              style={{ color: 'var(--muted-foreground)' }}
            >
              vs
            </p>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
              {market.awayTeam}
            </p>
          </div>
        </div>

        {/* Sağ: LIVE + favori */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {market.isLive && (
            <div
              className="luxury-badge"
              style={{
                backgroundColor: 'oklch(0.65 0.20 25 / 0.12)',
                color: 'var(--live-pulse)',
                border: '1px solid oklch(0.65 0.20 25 / 0.30)',
              }}
            >
              <span className="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-current" />
              Canlı
            </div>
          )}

          <motion.button
            onClick={onFavorite}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.88 }}
            className="p-1"
          >
            <Heart
              className="w-4 h-4 transition-colors"
              style={{
                fill: isFavorite ? 'var(--accent)' : 'transparent',
                color: isFavorite ? 'var(--accent)' : 'var(--muted-foreground)',
              }}
            />
          </motion.button>
        </div>
      </div>

      {/* ─── Ayırıcı çizgi ─── */}
      <div className="accent-divider" />

      {/* ─── Oran butonları — yatay grid ─── */}
      <div className={`grid gap-2 ${oddsButtons.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {oddsButtons.map(({ type, label, value }) => (
          <motion.button
            key={type}
            onClick={() => handleOddsClick(type, value)}
            className={`odds-btn glass-card-thin flex flex-col items-center justify-center py-2.5 px-1 ${
              glowingOdds === type ? 'odds-glow' : ''
            }`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            style={{
              borderColor: glowingOdds === type
                ? 'var(--accent)'
                : 'var(--border-subtle)',
            }}
          >
            {/* 1 / X / 2 etiketi */}
            <span
              className="text-[10px] font-bold tracking-wider mb-1"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {label}
            </span>

            {/* Oran değeri — altın renk */}
            <span
              className="font-mono font-bold text-base tabular-nums"
              style={{ color: 'var(--accent)' }}
            >
              {value.toFixed(2)}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
