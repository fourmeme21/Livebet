'use client';

import { Market } from '@/lib/betting-store';
import { motion } from 'framer-motion';

interface MarketCardProps {
  market: Market;
  onBet: (type: 'home' | 'draw' | 'away', odds: number) => void;
  onFavorite: () => void;
  isFavorite: boolean;
  onDetail?: () => void;
}

export function MarketCard({ market, onBet, isFavorite, onDetail }: MarketCardProps) {
  const draw = market.odds.draw ?? 3.20;
  const alt  = +(market.odds.home * 0.63).toFixed(2);
  const ust  = +(market.odds.away * 0.90).toFixed(2);

  return (
    <div className="w-full rounded-lg overflow-hidden border border-border bg-background">

      {/* ── Takım + saat + + butonu ── */}
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-foreground truncate">
            {market.homeTeam} - {market.awayTeam}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {market.isLive ? (
              <span className="flex items-center gap-1 font-bold" style={{ color: '#e53935' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                CANLI
              </span>
            ) : 'Bugun, 22:00'}
          </p>
        </div>

        <motion.button
          onClick={onDetail}
          whileTap={{ scale: 0.88 }}
          className="shrink-0 w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: '#cc0000' }}
        >
          +
        </motion.button>
      </div>

      {/* ── Oran tablosu — birebir NORMA ── */}
      <div className="border-t border-border">

        {/* Ust baslik: Mac Sonucu | (bos) */}
        <div className="grid border-b border-border"
          style={{ gridTemplateColumns: '3fr 1fr 1fr', backgroundColor: 'var(--muted)' }}>
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground border-r border-border text-center">
            Mac Sonucu
          </div>
          <div className="px-1 py-1 text-[10px] font-semibold text-muted-foreground text-center border-r border-border">
            Alt 2.5
          </div>
          <div className="px-1 py-1 text-[10px] font-semibold text-muted-foreground text-center">
            Ust 2.5
          </div>
        </div>

        {/* Kolon basliklari: 1 | X | 2 | Alt 2.5 | Ust 2.5 */}
        <div className="grid border-b border-border"
          style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', backgroundColor: 'var(--muted)' }}>
          {['1', 'X', '2', 'Alt 2.5', 'Ust 2.5'].map((label, i) => (
            <div key={label}
              className={`text-center py-1 text-[10px] font-bold text-muted-foreground ${i < 4 ? 'border-r border-border' : ''}`}>
              {label}
            </div>
          ))}
        </div>

        {/* Oran degerleri */}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
          {[
            { val: market.odds.home, fn: () => onBet('home', market.odds.home) },
            { val: draw,             fn: () => onBet('draw', draw) },
            { val: market.odds.away, fn: () => onBet('away', market.odds.away) },
            { val: alt,              fn: () => {} },
            { val: ust,              fn: () => {} },
          ].map(({ val, fn }, i) => (
            <motion.button
              key={i}
              onClick={fn}
              whileTap={{ scale: 0.93 }}
              className={`py-3 text-center font-bold text-[15px] hover:bg-primary/10 transition-colors ${i < 4 ? 'border-r border-border' : ''}`}
              style={{ color: '#1a1a1a', fontWeight: 700 }}
            >
              {val.toFixed(2)}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
