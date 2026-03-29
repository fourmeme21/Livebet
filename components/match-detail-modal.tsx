'use client';

import { Market, BetSlipItem } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

// ── Mock piyasa gruplari (gercek API gelince degistirilir) ─────────
function generateDetailMarkets(market: Market) {
  const h = market.odds.home;
  const a = market.odds.away;
  return [
    {
      title: 'Mac Sonucu',
      options: [
        { label: 'Ev Sahibi', odds: h },
        { label: 'Beraberlik', odds: market.odds.draw ?? 3.20 },
        { label: 'Deplasman', odds: a },
      ],
    },
    {
      title: 'Handikápli (0:1)',
      options: [
        { label: `Ev Sahibi (-${(h * 2.1).toFixed(2)})`, odds: +(h * 2.1).toFixed(2) },
        { label: `Beraberlik (${(3.5).toFixed(2)})`, odds: 3.65 },
        { label: `Deplasman ${(a * 0.56).toFixed(2)}`, odds: +(a * 0.56).toFixed(2) },
      ],
    },
    {
      title: 'Beraberlikte Iade',
      options: [
        { label: 'Ev Sahibi', odds: +(h * 0.72).toFixed(2) },
        { label: 'Deplasman', odds: +(a * 0.72).toFixed(2) },
      ],
    },
    {
      title: 'Ilk Yari Sonucu',
      options: [
        { label: 'Ev Sahibi', odds: +(h * 1.27).toFixed(2) },
        { label: 'Beraberlik', odds: 2.05 },
        { label: 'Deplasman', odds: +(a * 1.30).toFixed(2) },
      ],
    },
    {
      title: 'Cifte Sans',
      options: [
        { label: '1-X', odds: +(h * 0.57).toFixed(2) },
        { label: '1-2', odds: +(h * 0.51).toFixed(2) },
        { label: 'X-2', odds: +(a * 0.57).toFixed(2) },
      ],
    },
    {
      title: 'Alt / Ust 2.5',
      options: [
        { label: 'Alt 2.5', odds: +(h * 0.63).toFixed(2) },
        { label: 'Ust 2.5', odds: +(a * 0.92).toFixed(2) },
      ],
    },
    {
      title: 'Karsilikli Gol',
      options: [
        { label: 'Var', odds: +(h * 0.80).toFixed(2) },
        { label: 'Yok', odds: +(a * 0.72).toFixed(2) },
      ],
    },
    {
      title: 'Hangi Yari Daha Cok Gol Olur?',
      options: [
        { label: 'Ilk Yari',   odds: +(h * 1.21).toFixed(2) },
        { label: 'Esit',       odds: 3.10 },
        { label: 'Ikinci Yari', odds: +(a * 1.12).toFixed(2) },
      ],
    },
    {
      title: 'Ilk Yari Karsilikli Gol',
      options: [
        { label: 'Var', odds: +(h * 2.05).toFixed(2) },
        { label: 'Yok', odds: +(a * 0.46).toFixed(2) },
      ],
    },
    {
      title: 'Ev Sahibi Alt/Ust',
      options: [
        { label: 'Alt 0.5', odds: 3.00 },
        { label: 'Ust 0.5', odds: 1.35 },
        { label: 'Alt 1.5', odds: 1.45 },
        { label: 'Ust 1.5', odds: 2.55 },
        { label: 'Alt 2.5', odds: 1.08 },
        { label: 'Ust 2.5', odds: 6.20 },
      ],
    },
    {
      title: 'Deplasman Alt/Ust',
      options: [
        { label: 'Alt 0.5', odds: +(a * 1.02).toFixed(2) },
        { label: 'Ust 0.5', odds: +(h * 0.59).toFixed(2) },
        { label: 'Alt 1.5', odds: +(a * 0.52).toFixed(2) },
        { label: 'Ust 1.5', odds: 3.00 },
      ],
    },
  ];
}

interface MatchDetailModalProps {
  market: Market | null;
  isOpen: boolean;
  onClose: () => void;
  onBetSelected: (item: BetSlipItem) => void;
}

export function MatchDetailModal({ market, isOpen, onClose, onBetSelected }: MatchDetailModalProps) {
  if (!market) return null;

  const detailMarkets = generateDetailMarkets(market);

  const handleBet = (label: string, odds: number) => {
    onBetSelected({
      marketId: `${market.id}-${label}`,
      market,
      type: 'home',
      odds,
      stake: 0,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ backgroundColor: 'var(--background)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          {/* ── Header ── */}
          <div
            className="shrink-0 flex items-start justify-between px-4 pt-4 pb-3 border-b border-border"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <div className="flex-1 min-w-0 pr-3">
              {market.isLive ? (
                <span className="flex items-center gap-1 text-xs font-bold mb-1"
                  style={{ color: 'var(--live-pulse)' }}>
                  <span className="live-pulse inline-block w-1.5 h-1.5 rounded-full bg-current" />
                  CANLI
                </span>
              ) : (
                <p className="text-xs text-muted-foreground mb-1">Bugun, 22:00 — {market.name}</p>
              )}
              <p className="text-2xl font-extrabold text-foreground leading-tight">
                {market.homeTeam}
              </p>
              <p className="text-2xl font-extrabold text-foreground leading-tight">
                {market.awayTeam}
              </p>
            </div>

            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
              className="shrink-0 w-10 h-10 rounded flex items-center justify-center text-white"
              style={{ backgroundColor: '#cc0000' }}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* ── Piyasa listesi ── */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {detailMarkets.map((group) => (
              <div key={group.title} className="border-b border-border">

                {/* Grup basligi */}
                <div className="px-4 py-2.5"
                  style={{ backgroundColor: 'var(--card)' }}>
                  <p className="text-sm font-bold text-foreground">{group.title}</p>
                </div>

                {/* Oran butonlari — ikili grid */}
                <div
                  className="grid gap-px p-3 pt-2"
                  style={{
                    gridTemplateColumns: group.options.length === 3
                      ? 'repeat(3, 1fr)'
                      : 'repeat(2, 1fr)',
                    backgroundColor: 'var(--border)',
                  }}
                >
                  {group.options.map(({ label, odds }) => (
                    <motion.button
                      key={label}
                      onClick={() => handleBet(label, odds)}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-between px-3 py-3 text-sm"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <span className="text-foreground font-medium text-left leading-tight">
                        {label}
                      </span>
                      <span className="font-bold ml-2 shrink-0"
                        style={{ color: '#cc0000' }}>
                        {typeof odds === 'number' ? odds.toFixed(2) : odds}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            <div className="h-8" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
