'use client';

import { Market, useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { useMemo, useState } from 'react';
import { MarketCard } from './market-card';
import { MatchDetailModal } from './match-detail-modal';
import { motion } from 'framer-motion';

const RED = '#E30A17';

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

const LEAGUE_COUNTRY: Record<string, string> = {
  'UEFA Champions League': 'Avrupa',
  'Premier League':        'Ingiltere',
  'La Liga':               'Ispanya',
  'Bundesliga':            'Almanya',
  'Serie A':               'Italya',
  'Ligue 1':               'Fransa',
  'Turkish Super Lig':     'Turkiye',
  'NBA':                   'Amerika',
};

const TIME_FILTERS = [
  { id: '30m', label: '30dk' },
  { id: '1h',  label: '1s'   },
  { id: '3h',  label: '3s'   },
  { id: '6h',  label: '6s'   },
  { id: '12h', label: '12s'  },
  { id: '24h', label: '24s'  },
];

function groupByLeague(markets: Market[]) {
  const map = new Map<string, Market[]>();
  for (const m of markets) {
    if (!map.has(m.name)) map.set(m.name, []);
    map.get(m.name)!.push(m);
  }
  return Array.from(map.entries()).map(([league, mkts]) => ({
    league,
    flag: LEAGUE_FLAGS[league] ?? '\uD83C\uDF0D',
    country: LEAGUE_COUNTRY[league] ?? '',
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
  const [search, setSearch]           = useState('');
  const [activeDay, setActiveDay]     = useState<'bugun' | 'tumu'>('bugun');
  const [activeTime, setActiveTime]   = useState('30m');
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);

  const filtered = useMemo(() => markets.filter(m => {
    if (sport === 'futbol'    && !FOOTBALL_LEAGUES.has(m.name))   return false;
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
  }), [markets, search, sport]);

  const groups = useMemo(() => groupByLeague(filtered), [filtered]);

  return (
    <>
      <div className="flex h-full w-full flex-col bg-background">

        {/* 1 — Ince arama — sag tarafta ara ikonu */}
        <div className="px-3 pt-2 pb-1 shrink-0">
          <div className="relative flex items-center">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Takim veya lig ara..."
              className="w-full rounded-full pl-4 pr-10 py-1.5 text-[13px] outline-none"
              style={{
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
              }}
            />
            <span className="absolute right-3 text-muted-foreground pointer-events-none"
              style={{ fontSize: '15px' }}>
              🔍
            </span>
          </div>
        </div>

        {/* 2 — Gun filtresi */}
        <div className="flex px-3 py-1.5 gap-2 shrink-0">
          {[
            { id: 'bugun', label: 'Bugun' },
            { id: 'tumu',  label: 'Tumu'  },
          ].map(df => {
            const active = activeDay === df.id;
            return (
              <motion.button
                key={df.id}
                onClick={() => setActiveDay(df.id as 'bugun' | 'tumu')}
                whileTap={{ scale: 0.94 }}
                className="rounded-xl px-5 py-1.5 text-[14px] font-bold transition-colors"
                style={{
                  backgroundColor: active ? 'var(--background)' : 'transparent',
                  color: active ? RED : 'var(--muted-foreground)',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  boxShadow: active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {df.label}
              </motion.button>
            );
          })}
        </div>

        {/* 3 — Zaman filtresi — ekran enine boydan boya yayil */}
        <div
          className="flex px-3 py-1 shrink-0 border-b border-border justify-between"
        >
          {TIME_FILTERS.map(tf => {
            const active = activeTime === tf.id;
            return (
              <motion.button
                key={tf.id}
                onClick={() => setActiveTime(tf.id)}
                whileTap={{ scale: 0.94 }}
                className="flex-1 text-center text-[14px] font-bold pb-1 transition-colors"
                style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              >
                {tf.label}
                {active && (
                  <motion.div
                    layoutId="time-underline"
                    className="h-[2px] rounded-full mt-0.5 mx-auto"
                    style={{ backgroundColor: RED, width: '80%' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* 4 — Mac listesi */}
        <div
          className="flex-1 w-full overflow-y-auto"
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-16">
              <span className="text-4xl">{sport === 'futbol' ? '\u26BD' : '\uD83C\uDFC0'}</span>
              <p className="text-sm text-muted-foreground">Mac bulunamadi</p>
            </div>
          ) : groups.map(group => (
            <div key={group.league}>

              {/* Lig baslik */}
              <div
                className="flex items-center gap-2 px-3 py-2 border-b border-border"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <div
                  className="flex items-center justify-center rounded w-9 h-7 shrink-0"
                  style={{ backgroundColor: 'var(--muted)', border: '1px solid var(--border)' }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{group.flag}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {/* 11px → 13px */}
                  <p className="text-[13px] font-bold text-foreground truncate">{group.country}</p>
                  {/* 10px → 12px */}
                  <p className="text-[12px] text-muted-foreground truncate">{group.league}</p>
                </div>
              </div>

              {/* Mac kartlari */}
              {group.markets.map((market, idx) => (
                <div
                  key={market.id}
                  className="px-2 py-2"
                  style={{
                    borderBottom: idx < group.markets.length - 1
                      ? '1px solid var(--border)'
                      : undefined,
                  }}
                >
                  <MarketCard
                    market={market}
                    onBet={(type, odds) =>
                      onBetSelected({ marketId: market.id, market, type, odds, stake: 0 })
                    }
                    onFavorite={() => toggleFavorite(market.id)}
                    isFavorite={favorites.includes(market.id)}
                    onDetail={() => setSelectedMarket(market)}
                  />
                </div>
              ))}
            </div>
          ))}
          <div className="h-4" />
        </div>
      </div>

      <MatchDetailModal
        market={selectedMarket}
        isOpen={!!selectedMarket}
        onClose={() => setSelectedMarket(null)}
        onBetSelected={(item) => {
          onBetSelected(item);
          setSelectedMarket(null);
        }}
      />
    </>
  );
}
