'use client';

import { Market } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { Heart, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface MarketCardProps {
  market: Market;
  onBet: (type: 'home' | 'draw' | 'away', odds: number) => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

export function MarketCard({
  market,
  onBet,
  onFavorite,
  isFavorite,
}: MarketCardProps) {
  const [glowingOdds, setGlowingOdds] = useState<'home' | 'draw' | 'away' | null>(
    null
  );

  const handleOddsClick = (type: 'home' | 'draw' | 'away', odds: number) => {
    setGlowingOdds(type);
    setTimeout(() => setGlowingOdds(null), 600);
    onBet(type, odds);
  };

  return (
    <motion.div
      className="glass-card p-4 space-y-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-sm line-clamp-2">
            {market.homeTeam} vs {market.awayTeam}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{market.name}</p>
        </div>

        <motion.button
          onClick={onFavorite}
          className="ml-2"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? 'fill-odds-positive text-odds-positive'
                : 'text-muted-foreground hover:text-accent'
            }`}
          />
        </motion.button>
      </div>

      {/* Live Badge */}
      {market.isLive && (
        <div className="flex items-center gap-2">
          <div className="live-pulse w-2 h-2 bg-live-pulse rounded-full" />
          <span className="text-xs font-semibold text-live-pulse uppercase">
            Live
          </span>
        </div>
      )}

      {/* Odds Grid */}
      <div className="grid gap-2">
        <motion.button
          onClick={() => handleOddsClick('home', market.odds.home)}
          className={`glass-card-thin p-3 text-center transition-all ${
            glowingOdds === 'home' ? 'odds-glow' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-xs text-muted-foreground mb-1">
            {market.homeTeam.split(' ').pop()}
          </div>
          <div className="font-mono font-bold text-lg text-accent">
            {market.odds.home.toFixed(2)}
          </div>
        </motion.button>

        {market.odds.draw && (
          <motion.button
            onClick={() => handleOddsClick('draw', market.odds.draw!)}
            className={`glass-card-thin p-3 text-center transition-all ${
              glowingOdds === 'draw' ? 'odds-glow' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-xs text-muted-foreground mb-1">Draw</div>
            <div className="font-mono font-bold text-lg text-accent">
              {market.odds.draw.toFixed(2)}
            </div>
          </motion.button>
        )}

        <motion.button
          onClick={() => handleOddsClick('away', market.odds.away)}
          className={`glass-card-thin p-3 text-center transition-all ${
            glowingOdds === 'away' ? 'odds-glow' : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-xs text-muted-foreground mb-1">
            {market.awayTeam.split(' ').pop()}
          </div>
          <div className="font-mono font-bold text-lg text-accent">
            {market.odds.away.toFixed(2)}
          </div>
        </motion.button>
      </div>

      {/* Volatility Indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Zap className="w-3 h-3" />
        <span className="capitalize">{market.volatility} volatility</span>
      </div>
    </motion.div>
  );
}
