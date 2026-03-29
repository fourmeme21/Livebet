'use client';

import { Market } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onBet: (type: 'home' | 'draw' | 'away', odds: number) => void;
  onFavorite: () => void;
  isFavorite: boolean;
  onDetail?: () => void;
}

export function MarketCard({ market, onBet, onFavorite, isFavorite, onDetail }: MarketCardProps) {
  return (
    <div className="w-full rounded-lg border border-border bg-card overflow-hidden">

      {/* ── Ust: takim isimleri + + butonu ── */}
      <div className="flex items-center justify-between px-3 py-2.5 gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">
            {market.homeTeam} - {market.awayTeam}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {market.isLive ? (
              <span className="flex items-center gap-1 text-[11px] font-bold"
                style={{ color: 'var(--live-pulse)' }}>
                <span className="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-current" />
                CANLI
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">Bugun, 22:00</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button onClick={onFavorite} whileTap={{ scale: 0.88 }}>
            <Heart className="w-4 h-4"
              style={{
                fill: isFavorite ? 'var(--accent)' : 'transparent',
                color: isFavorite ? 'var(--accent)' : 'var(--muted-foreground)',
              }} />
          </motion.button>

          {/* + butonu */}
          <motion.button
            onClick={onDetail}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-base"
            style={{ backgroundColor: '#cc0000' }}
          >
            +
          </motion.button>
        </div>
      </div>

      {/* ── Oran tablosu ── */}
      <div className="border-t border-border">

        {/* Baslik satiri */}
        <div className="grid border-b border-border"
          style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', backgroundColor: 'var(--muted)' }}>
          <div className="col-span-3 px-2 py-1 text-[10px] font-semibold text-muted-foreground border-r border-border">
            Mac Sonucu
          </div>
          <div className="col-span-2 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            Alt / Ust 2.5
          </div>
        </div>

        {/* Sutun basliklari */}
        <div className="grid border-b border-border"
          style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', backgroundColor: 'var(--muted)' }}>
          {['1', 'X', '2', 'Alt', 'Ust'].map((label, i) => (
            <div key={label}
              className={`text-center py-0.5 text-[10px] font-bold text-muted-foreground ${i === 2 ? 'border-r border-border' : ''}`}>
              {label}
            </div>
          ))}
        </div>

        {/* Oran degerleri */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
          {/* 1 */}
          <motion.button
            onClick={() => onBet('home', market.odds.home)}
            whileTap={{ scale: 0.95 }}
            className="py-3 text-center font-bold text-base border-r border-border hover:bg-primary/10 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {market.odds.home.toFixed(2)}
          </motion.button>

          {/* X */}
          <motion.button
            onClick={() => market.odds.draw && onBet('draw', market.odds.draw)}
            whileTap={{ scale: 0.95 }}
            className="py-3 text-center font-bold text-base border-r border-border hover:bg-primary/10 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {market.odds.draw ? market.odds.draw.toFixed(2) : '-'}
          </motion.button>

          {/* 2 */}
          <motion.button
            onClick={() => onBet('away', market.odds.away)}
            whileTap={{ scale: 0.95 }}
            className="py-3 text-center font-bold text-base border-r border-border hover:bg-primary/10 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {market.odds.away.toFixed(2)}
          </motion.button>

          {/* Alt 2.5 — simdilik statik, gercek veri gelince baglanir */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="py-3 text-center font-bold text-base border-r border-border hover:bg-primary/10 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {(market.odds.home * 0.72).toFixed(2)}
          </motion.button>

          {/* Ust 2.5 */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="py-3 text-center font-bold text-base hover:bg-primary/10 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            {(market.odds.away * 0.85).toFixed(2)}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
