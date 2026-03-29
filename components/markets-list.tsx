'use client';

import { Market, useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { useMemo, useState } from 'react';
import { MarketCard } from './market-card';
import { MatchDetailModal } from './match-detail-modal';

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
  const [search, setSearch] = useState('');
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
      <div className="flex h-full w-full flex-col">

        {/* Arama */}
        <div className="px-3 py-2 shrink-0 border-b border-border">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Takim veya lig ara..."
            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
            style={{
              backgroundColor: 'var(--muted)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)',
            }}
          />
        </div>

        {/* Snap scroll listesi */}
        <div
          className="flex-1 w-full overflow-y-auto"
          style={{
            scrollSnapType: 'y mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="text-4xl">{sport === 'futbol' ? '\u26BD' : '\uD83C\uDFC0'}</span>
              <p className="text-sm text-muted-foreground">Mac bulunamadi</p>
            </div>
          ) : groups.map(group => (
            <div key={group.league}>

              {/* Lig baslik */}
              <div
                className="flex items-center gap-3 px-3 py-2 sticky top-0 z-10 border-b border-border"
                style={{ backgroundColor: 'var(--background)' }}
              >
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{group.flag}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider block text-muted-foreground">
                    {sport === 'futbol' ? 'Futbol' : 'Basketbol'}
                  </span>
                  <span className="text-sm font-bold truncate block text-foreground">
                    {group.league}
                  </span>
                </div>
                <span className="text-xs font-semibold rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
                  {group.markets.length}
                </span>
              </div>

              {/* Mac kartlari */}
              {group.markets.map(market => (
                <div
                  key={market.id}
                  style={{
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    minHeight: '52vh',
                    display: 'flex',
                    alignItems: 'flex-start',
                    width: '100%',
                    padding: '6px',
                    boxSizing: 'border-box',
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
        </div>
      </div>

      {/* Detay modal */}
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
