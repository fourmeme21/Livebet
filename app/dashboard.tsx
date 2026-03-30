'use client';

import { useEffect, useRef, useState } from 'react';
import { useBettingStore, BetSlipItem, Market } from '@/lib/betting-store';
import { generateMarkets, simulateOddsUpdate, getSmartFavorites } from '@/lib/odds-simulator';
import { Header } from '@/components/header';
import { BottomNav, TabId } from '@/components/bottom-nav';
import { MarketsList } from '@/components/markets-list';
import { BetSlip } from '@/components/bet-slip';
import { Hesabim } from '@/components/hesabim';
import { StatsPanel } from '@/components/stats-panel';
import { Sidebar } from '@/components/sidebar';
import { FootballPitchTracker } from '@/components/pitch-tracker';
import { UserStatusBar } from '@/components/user-status-bar';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const { addMarket, addToBetSlip, betSlip } = useBettingStore();

  const [activeTab, setActiveTab] = useState<TabId>('futbol');
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [displayedMarkets, setDisplayedMarkets] = useState<Market[]>([]);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const newMarkets = generateMarkets(50);
    newMarkets.forEach(m => addMarket(m));
    setDisplayedMarkets(newMarkets);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (displayedMarkets.length === 0) return;
    const interval = setInterval(() => {
      setDisplayedMarkets(prev =>
        prev.map(market => {
          const updated = simulateOddsUpdate(market);
          if (
            updated.odds.home !== market.odds.home ||
            updated.odds.away !== market.odds.away ||
            updated.odds.draw !== market.odds.draw
          ) return { ...market, ...updated };
          return market;
        })
      );
    }, 500);
    return () => clearInterval(interval);
  }, [displayedMarkets.length]);

  const handleBetSelected = (item: BetSlipItem) => {
    addToBetSlip(item);
    setBetSlipOpen(true);
  };

  const handleTabChange = (tab: TabId) => {
    if (tab === 'kuponlar') {
      setBetSlipOpen(true);
      return;
    }
    setActiveTab(tab);
    setBetSlipOpen(false);
  };

  const favorites = useBettingStore(s => s.favorites);
  const smartFavorites = getSmartFavorites(displayedMarkets, favorites);

  const activeSport: 'futbol' | 'basketbol' =
    activeTab === 'basketbol' ? 'basketbol' : 'futbol';

  return (
    <div className="flex h-dvh flex-col bg-background">

      {/* Header */}
      <Header couponCount={betSlip.length} onCouponOpen={() => setBetSlipOpen(true)} />

      {/* Icerik — flex-1 kalan tum alani kaplar */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Mobil: tam genislik tek sutun ── */}
        <div className="flex w-full flex-col md:hidden overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="flex flex-1 w-full min-h-0"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.15 }}
            >
              {(activeTab === 'futbol' || activeTab === 'basketbol') && (
                <div className="flex flex-1 w-full min-h-0">
                  <MarketsList
                    markets={displayedMarkets}
                    onBetSelected={handleBetSelected}
                    sport={activeSport}
                  />
                </div>
              )}
              {activeTab === 'hesabim' && (
                <div className="flex-1 w-full overflow-y-auto">
                  <Hesabim />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Desktop: 4 sutun ── */}
        <div className="hidden md:grid md:grid-cols-4 flex-1 gap-4 p-4 overflow-hidden">
          <div className="glass-card rounded-lg p-4 overflow-y-auto flex flex-col gap-4">
            <Sidebar
              favorites={smartFavorites}
              onSelectMarket={(market) => handleBetSelected({
                marketId: market.id, market, type: 'home', odds: market.odds.home, stake: 0,
              })}
            />
            <StatsPanel />
            <FootballPitchTracker />
          </div>

          <div className="glass-card rounded-lg overflow-hidden flex flex-col col-span-2">
            <MarketsList
              markets={displayedMarkets}
              onBetSelected={handleBetSelected}
              sport={activeSport}
            />
          </div>

          <div className="glass-card rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-bold">Bahis Kuponu</h2>
            </div>
            <BetSlip isOpen={true} onClose={() => {}} />
          </div>
        </div>
      </div>

      {/* Kullanici status + Alt nav — mobilde ust uste degil, birlestir */}
      <div className="md:hidden flex flex-col shrink-0">
        <UserStatusBar username="Kullanici" />
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          couponCount={betSlip.length}
        />
      </div>

      {/* Mobil Bet Slip — overlay */}
      <div className="md:hidden">
        <BetSlip isOpen={betSlipOpen} onClose={() => setBetSlipOpen(false)} />
      </div>

    </div>
  );
}
