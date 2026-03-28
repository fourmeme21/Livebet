'use client';

import { Market, useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo } from 'react';
import { MarketCard } from './market-card';
import { Input } from './ui/input';
import { useState } from 'react';

interface MarketsListProps {
  markets: Market[];
  onBetSelected: (item: BetSlipItem) => void;
  searchQuery?: string;
}

export function MarketsList({
  markets,
  onBetSelected,
  searchQuery = '',
}: MarketsListProps) {
  const { favorites, toggleFavorite } = useBettingStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const parentRef = useRef<HTMLDivElement>(null);

  // Filter markets
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      if (!localSearch) return true;
      const query = localSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(query) ||
        m.homeTeam.toLowerCase().includes(query) ||
        m.awayTeam.toLowerCase().includes(query)
      );
    });
  }, [markets, localSearch]);

  // Virtualize the list
  const virtualizer = useVirtualizer({
    count: filteredMarkets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 280,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Search */}
      <Input
        placeholder="Search markets..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="h-10"
      />

      {/* Markets Grid with Virtualization */}
      <div
        ref={parentRef}
        className="flex-1 overflow-y-auto"
        style={{
          contain: 'strict',
        }}
      >
        <div
          style={{
            height: `${totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const market = filteredMarkets[virtualItem.index];
            if (!market) return null;

            const isFavorite = favorites.includes(market.id);

            return (
              <div
                key={market.id}
                data-index={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="px-4 mb-3">
                  <MarketCard
                    market={market}
                    onBet={(type, odds) => {
                      onBetSelected({
                        marketId: market.id,
                        market,
                        type,
                        odds,
                        stake: 0,
                      });
                    }}
                    onFavorite={() => toggleFavorite(market.id)}
                    isFavorite={isFavorite}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredMarkets.length === 0 && (
        <div className="flex items-center justify-center flex-1 text-muted-foreground">
          <p>No markets found</p>
        </div>
      )}
    </div>
  );
}
