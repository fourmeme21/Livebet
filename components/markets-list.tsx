'use client';

import { Market, useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { useMemo, useState } from 'react';
import { MarketCard } from './market-card';
import { motion } from 'framer-motion';

const TIME_FILTERS = [
  { id: 'all', label: 'Tumu' }, { id: '30m', label: '30dk' },
  { id: '1h',  label: '1s'  }, { id: '3h',  label: '3s'   },
  { id: '6h',  label: '6s'  }, { id: '12h', label: '12s'  },
  { id: '24h', label: '24s' },
];

const DAY_FILTERS = [
  { id: 'bugun', label: 'Bugun' },
  { id: 'pzts',  label: 'Pzts'  },
  { id: 'tumu',  label: 'Tumu'  },
];

const FOOTBALL_LEAGUES = new Set([
  'UEFA Champions League', 'Premier League', 'La Liga',
  'Bundesliga', 'Serie A', 'Ligue 1', 'Turkish Super Lig',
]);
const BASKETBALL_LEAGUES = new Set(['NBA']);

const LEAGUE_FLAGS: Record<string, string> = {
  'UEFA Champions League': '\uD83C\uDDEA\uD83C\uDDFA',
  'Premier League':        '\uD83C\uDDEC\uD83C\uDDE7',
  'La Liga':               '\uD83C\uDDEA\uD83C\uDDF8',
  'Bundesliga':            '\uD83C\uDDE9\uD83C\uDDEA',
  'Serie A':               '\uD83C\uDDEE\uD83C\uDDF9',
  'Ligue 1':               '\uD83C\uDDEB\uD83C\uDDF7',
  'Turkish Super Lig':     '\uD83C\uDDF9\uD83C\uDDF7',
  'NBA':                   '\uD83C\uDDFA\uD83C\uDDF8',
};

function groupByLeague(markets: Market[]) {
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

interface MarketsListProps {
  markets: Market[];
  onBetSelected: (item: BetSlipItem) => void;
  sport?: 'futbol' | 'basketbol';
}

export function MarketsList({ markets, onBetSelected, sport = 'futbol' }: MarketsListProps) {
  const { favorites, toggleFavorite } = useBettingStore();
  const [search, setSearch]         = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [dayFilter, setDayFilter]   = useState('bugun');

  const filtered = useMemo(() => markets.filter(m => {
    if (sport === 'futbol'    && !FOOTBALL_LEAGUES.has(m.name))   return false;
    if (sport === 'basketbol' && !BASKETBALL_LEAGUES.has(m.name)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) &&
          !m.homeTeam.toLowerCase().includes(q) &&
          !m.awayTeam.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [markets, search, timeFilter, sport]);

  const groups = useMemo(() => groupByLeague(filtered), [filtered]);

  return (
    <div className="flex h-full w-full flex-col">

      {/* Gun filtresi */}
      <div className="flex gap-2 px-3 py-2 shrink-0 border-b border-border">
        {DAY_FILTERS.map(df => {
          const active = dayFilter === df.id;
          return (
            <motion.button key={df.id} onClick={() => setDayFilter(df.id)} whileTap={{ scale: 0.94 }}
              className="shrink-0 rounded-lg px-4 py-1.5 text-sm font-bold transition-colors"
              style={{
                backgroundColor: active ? 'var(--background)' : 'transparent',
                color: active ? 'var(--brand-red)' : 'var(--muted-foreground)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}>
              {df.label}
            </motion.button>
          );
        })}
      </div>

      {/* Zaman filtresi */}
      <div className="flex gap-4 overflow-x-auto px-3 py-2 shrink-0 border-b border-border"
        style={{ scrollbarWidth: 'none' }}>
        {TIME_FILTERS.map(tf => {
          const active = timeFilter === tf.id;
          return (
            <motion.button key={tf.id} onClick={() => setTimeFilter(tf.id)} whileTap={{ scale: 0.94 }}
              className="shrink-0 text-sm font-semibold transition-colors"
              style={{ color: active ? 'var(--accent)' : 'var(--muted-foreground)' }}>
              {tf.label}
              {active && (
                <motion.div layoutId="time-underline" className="mt-0.5 h-[2px] rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Arama */}
      <div className="px-3 py-2 shrink-0">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Takim veya lig ara..."
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: '1px solid var(--border)' }} />
      </div>

      {/* ─── TikTok snap scroll ─── */}
      <div
        className="flex-1 w-full overflow-y-auto"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-4xl">{sport === 'futbol' ? '\u26BD' : '\uD83C\uDFC0'}</span>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {sport === 'futbol' ? 'Futbol maci bulunamadi' : 'Basketbol maci bulunamadi'}
            </p>
          </div>
        ) : groups.map(group => (
          <div key={group.league}>

            {/* ── Lig baslik — bayrak buyuk, sticky ── */}
            <div
              className="flex items-center gap-3 px-3 py-3 sticky top-0 z-10"
              style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}
            >
              {/* Bayrak %50 buyuk: text-base(1rem) → 1.5rem */}
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{group.flag}</span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block"
                  style={{ color: 'oklch(0.45 0.010 264)' }}>
                  {sport === 'futbol' ? 'Futbol' : 'Basketbol'}
                </span>
                <span className="text-sm font-bold truncate block" style={{ color: 'var(--foreground)' }}>
                  {group.league}
                </span>
              </div>
              <span className="text-xs font-semibold rounded-full px-2 py-0.5"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {group.markets.length}
              </span>
            </div>

            {/* ── Mac kartlari — her biri tam yukseklik + snap ── */}
            {group.markets.map(market => (
              <div
                key={market.id}
                style={{
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  minHeight: '55vh',
                  display: 'flex',
                  alignItems: 'stretch',
                  width: '100%',
                  padding: '8px',
                  boxSizing: 'border-box',
                }}
              >
                <MarketCard
                  market={market}
                  onBet={(type, odds) => onBetSelected({ marketId: market.id, market, type, odds, stake: 0 })}
                  onFavorite={() => toggleFavorite(market.id)}
                  isFavorite={favorites.includes(market.id)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
