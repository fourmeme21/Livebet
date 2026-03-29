'use client';

import { useEffect, useState, useRef } from 'react';
import { useBettingStore, BetSlipItem, Market } from '@/lib/betting-store';
import { generateMarkets, simulateOddsUpdate, getSmartFavorites } from '@/lib/odds-simulator';
import { Header } from '@/components/header';
import { MarketsList } from '@/components/markets-list';
import { BetSlip } from '@/components/bet-slip';
import { Sidebar } from '@/components/sidebar';
import { StatsPanel } from '@/components/stats-panel';
import { FootballPitchTracker } from '@/components/pitch-tracker';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function DashboardPage() {
  const { addMarket, addToBetSlip, favorites, betSlip } = useBettingStore();

  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayedMarkets, setDisplayedMarkets] = useState<Market[]>([]);

  // ─── FIX: useRef ile tek seferlik init kontrolü ───────────────────────────
  // markets veya addMarket dep'e girmiyor → döngü yok
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const newMarkets = generateMarkets(50);
    newMarkets.forEach((market) => addMarket(market));
    setDisplayedMarkets(newMarkets);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── FIX: Odds simülasyonu local state'i günceller, Zustand'a dokunmaz ───
  // displayedMarkets dep'e girmiyor (prev kullanıyoruz) → döngü yok
  useEffect(() => {
    if (displayedMarkets.length === 0) return;

    const interval = setInterval(() => {
      setDisplayedMarkets((prev) =>
        prev.map((market) => {
          const updated = simulateOddsUpdate(market);
          if (
            updated.odds.home !== market.odds.home ||
            updated.odds.away !== market.odds.away ||
            updated.odds.draw !== market.odds.draw
          ) {
            return { ...market, ...updated };
          }
          return market;
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [displayedMarkets.length]); // length değişmediği sürece interval yeniden kurulmaz

  const handleBetSelected = (item: BetSlipItem) => {
    addToBetSlip(item);
    setBetSlipOpen(true);
  };

  const smartFavorites = getSmartFavorites(displayedMarkets, favorites);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Mobile: Hamburger + Markets */}
        <div className="md:hidden flex flex-col w-full overflow-hidden">
          <div className="px-4 py-2 border-b border-border flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              {sidebarOpen ? 'Markets' : 'Menu'}
            </Button>
          </div>

          {/* Sidebar overlay mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                  className="absolute inset-0 bg-black/50 z-10"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 20 }}
                  className="absolute left-0 top-16 bottom-0 w-80 z-20 overflow-y-auto"
                >
                  <div className="p-4">
                    <Sidebar
                      favorites={smartFavorites}
                      onSelectMarket={(market) => {
                        handleBetSelected({
                          marketId: market.id,
                          market,
                          type: 'home',
                          odds: market.odds.home,
                          stake: 0,
                        });
                        setSidebarOpen(false);
                      }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Markets */}
          <div className="flex-1 overflow-hidden">
            <MarketsList
              markets={displayedMarkets}
              onBetSelected={handleBetSelected}
            />
          </div>

          {/* Floating Bet Slip Button */}
          {betSlip.length > 0 && !betSlipOpen && (
            <motion.button
              onClick={() => setBetSlipOpen(true)}
              className="fixed bottom-6 right-6 z-40 px-6 py-3 bg-accent text-accent-foreground rounded-full font-semibold shadow-lg flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="font-bold">{betSlip.length}</span>
            </motion.button>
          )}
        </div>

        {/* Desktop: 4-column layout */}
        <div className="hidden md:grid md:grid-cols-4 flex-1 gap-4 p-4 overflow-hidden">
          {/* Left: Account & Sidebar */}
          <div className="glass-card rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
            <Sidebar
              favorites={smartFavorites}
              onSelectMarket={(market) => {
                handleBetSelected({
                  marketId: market.id,
                  market,
                  type: 'home',
                  odds: market.odds.home,
                  stake: 0,
                });
              }}
            />
            <StatsPanel />
            <FootballPitchTracker />
          </div>

          {/* Center-Left: All Markets */}
          <div className="glass-card rounded-lg p-4 overflow-hidden flex flex-col">
            <h2 className="font-bold text-foreground mb-4">All Markets</h2>
            <MarketsList
              markets={displayedMarkets}
              onBetSelected={handleBetSelected}
            />
          </div>

          {/* Center-Right: Smart Favorites */}
          <div className="glass-card rounded-lg p-4 overflow-y-auto">
            <h2 className="font-bold text-foreground mb-4">Quick Access</h2>
            <div className="space-y-3">
              {smartFavorites.map((market) => (
                <motion.button
                  key={market.id}
                  onClick={() => {
                    handleBetSelected({
                      marketId: market.id,
                      market,
                      type: 'home',
                      odds: market.odds.home,
                      stake: 0,
                    });
                  }}
                  className="w-full text-left glass-card-thin p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ x: 4, scale: 1.02 }}
                >
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                    {market.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {market.homeTeam.split(' ').pop()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {market.awayTeam.split(' ').pop()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-accent font-bold text-sm">
                        {market.odds.home.toFixed(2)}
                      </p>
                      {market.isLive && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-live-pulse rounded-full live-pulse" />
                          <span className="text-xs text-live-pulse">Live</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Betting Slip */}
          <div className="glass-card rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold text-foreground">Betting Slip</h2>
            </div>
            <BetSlip isOpen={true} onClose={() => {}} />
          </div>
        </div>
      </div>

      {/* Mobile: Bottom Sheet Betting Slip */}
      <BetSlip isOpen={betSlipOpen} onClose={() => setBetSlipOpen(false)} />
    </div>
  );
}
