'use client';

import { Market, useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo, useState } from 'react';
import { MarketCard } from './market-card';
import { motion } from 'framer-motion';

// ─── Zaman filtresi ───────────────────────────────────────────────
const TIME_FILTERS = [
  { id: 'all',  label: 'Tümü' },
  { id: '30m',  label: '30dk' },
  { id: '1h',   label: '1s' },
  { id: '3h',   label: '3s' },
  { id: '6h',   label: '6s' },
  { id: '12h',  label: '12s' },
  { id: '24h',  label: '24s' },
];

// ─── Gün filtresi — NORMA tarzı ──────────────────────────────────
const DAY_FILTERS = [
  { id: 'bugun', label: 'Bugün' },
  { id: 'pzts',  label: 'Pzts'  },
  { id: 'tumu',  label: 'Tümü'  },
];

// ─── Spor → Lig eşlemesi ─────────────────────────────────────────
const FOOTBALL_LEAGUES = new Set([
  'UEFA Champions League',
  'Premier League',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Turkish Süper Lig',
]);

const BASKETBALL_LEAGUES = new Set([
  'NBA',
]);

// ─── Ülke bayrağı emoji — gizli Unicode yok ──────────────────────
const LEAGUE_FLAGS: Record<string, string> = {
  'UEFA Champions League': '\uD83C\uDDEA\uD83C\uDDFA',
  'Premier League':        '\uD83C\uDDEC\uD83C\uDDE7',
  'La Liga':               '\uD83C\uDDEA\uD83C\uDDF8',
  'Bundesliga':            '\uD83C\uDDE9\uD83C\uDDEA',
  'Serie A':               '\uD83C\uDDEE\uD83C\uDDF9',
  'Ligue 1':               '\uD83C\uDDEB\uD83C\uDDF7',
  'Turkish Süper Lig':     '\uD83C\uDDF9\uD83C\uDDF7',
  'NBA':                   '\uD83C\uDDFA\uD83C\uDDF8',
};

// ─── Liglere göre gruplama ────────────────────────────────────────
function groupByLeague(markets: Market[]): { league: string; flag: string; markets: Market[] }[] {
  const map = new Map<string, Market[]>();
  for (const m of markets) {
    if (!map.has(m.name)) map.set(m.name, []);
    map.get(m.name)!.push(m);
  }
  return Array.from(map.entries()).map(([league, mkts]) => ({
    league,
    flag: LEAGUE_FLAGS[league] ?? '\uD83C\uDF0D',
    markets: mkts,
  }));
}

// ─── Sanal liste item türleri ─────────────────────────────────────
type VirtualItem =
  | { kind: 'header'; league: string; flag: string; count: number }
  | { kind: 'card'; market: Market };

interface MarketsListProps {
  markets: Market[];
  onBetSelected: (item: BetSlipItem) => void;
  sport?: 'futbol' | 'basketbol';
}

export function MarketsList({ markets, onBetSelected, sport = 'futbol' }: MarketsListProps) {
  const { favorites, toggleFavorite } = useBettingStore();
  const [search, setSearch] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState('bugun');
  const parentRef = useRef<HTMLDivElement>(null);

  // ─── Filtreleme ───────────────────────────────────────────────
  const filtered = useMemo(() => {
    return markets.filter(m => {
      if (sport === 'futbol' && !FOOTBALL_LEAGUES.has(m.name)) return false;
      if (sport === 'basketbol' && !BASKETBALL_LEAGUES.has(m.name)) return false;

      if (search) {
        const q = search.toLowerCase();
        if (
          !m.name.toLowerCase().includes(q) &&
          !m.homeTeam.toLowerCase().includes(q) &&
          !m.awayTeam.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [markets, search, timeFilter, sport]);

  // ─── Düzleştirilmiş liste ─────────────────────────────────────
  const flatItems = useMemo<VirtualItem[]>(() => {
    const groups = groupByLeague(filtered);
    const items: VirtualItem[] = [];
    for (const g of groups) {
      items.push({ kind: 'header', league: g.league, flag: g.flag, count: g.markets.length });
      for (const m of g.markets) {
        items.push({ kind: 'card', market: m });
      }
    }
    return items;
  }, [filtered]);

  const virtualizer = useVirtualizer({
    count: flatItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => flatItems[i].kind === 'header' ? 44 : 200,
    overscan: 6,
  });

  return (
    <div className="flex h-full flex-col">

      {/* ─── Gün filtresi — Bugün / Pzts / Tümü ─── */}
      <div
        className="flex gap-2 px-3 py-2 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {DAY_FILTERS.map(df => {
          const active = dayFilter === df.id;
          return (
            <motion.button
              key={df.id}
              onClick={() => setDayFilter(df.id)}
              whileTap={{ scale: 0.94 }}
              className="relative shrink-0 rounded-lg px-4 py-1.5 text-xs font-bold transition-colors"
              style={{
                backgroundColor: active ? 'var(--background)' : 'transparent',
                color: active ? 'var(--brand-red)' : 'var(--muted-foreground)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              {df.label}
            </motion.button>
          );
        })}
      </div>

      {/* ─── Zaman filtresi — 30dk / 1s / 3s … ─── */}
      <div
        className="flex gap-4 overflow-x-auto px-3 py-2 shrink-0"
        style={{ scrollbarWidth: 'none', borderBottom: '1px solid var(--border)' }}
      >
        {TIME_FILTERS.map(tf => {
          const active = timeFilter === tf.id;
          return (
            <motion.button
              key={tf.id}
              onClick={() => setTimeFilter(tf.id)}
              whileTap={{ scale: 0.94 }}
              className="shrink-0 text-xs font-semibold transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--muted-foreground)' }}
            >
              {tf.label}
              {active && (
                <motion.div
                  layoutId="time-underline"
                  className="mt-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ─── Arama ─── */}
      <div className="px-3 py-2 shrink-0">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Takım veya lig ara..."
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: 'var(--muted)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          }}
        />
      </div>

      {/* ─── Sanal liste ─── */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto"
        style={{ contain: 'strict' }}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map(vItem => {
            const item = flatItems[vItem.index];

            return (
              <div
                key={vItem.key}
                data-index={vItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${vItem.start}px)`,
                }}
              >
                {item.kind === 'header' ? (
                  /* ─── Lig header ─── */
                  <div
                    className="flex items-center gap-2 px-3 py-2"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <span className="text-base leading-none">{item.flag}</span>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider block"
                        style={{ color: 'oklch(0.45 0.010 264)' }}
                      >
                        {sport === 'futbol' ? 'Futbol' : 'Basketbol'}
                      </span>
                      <span
                        className="text-xs font-semibold truncate block"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {item.league}
                      </span>
                    </div>
                    <span
                      className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      {item.count}
                    </span>
                  </div>
                ) : (
                  /* ─── Market kartı ─── */
                  <div className="px-3 pb-2 pt-1">
                    <MarketCard
                      market={item.market}
                      onBet={(type, odds) =>
                        onBetSelected({
                          marketId: item.market.id,
                          market: item.market,
                          type,
                          odds,
                          stake: 0,
                        })
                      }
                      onFavorite={() => toggleFavorite(item.market.id)}
                      isFavorite={favorites.includes(item.market.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Boş durum ─── */}
        {flatItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-3xl">
              {sport === 'futbol' ? '\u26BD' : '\uD83C\uDFC0'}
            </span>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {sport === 'futbol' ? 'Futbol maci bulunamadi' : 'Basketbol maci bulunamadi'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
