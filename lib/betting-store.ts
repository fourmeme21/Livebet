import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Market {
  id: string;
  name: string;
  homeTeam: string;
  awayTeam: string;
  isLive: boolean;
  volatility: 'low' | 'medium' | 'high';
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
}

export interface BetSlipItem {
  marketId: string;
  market: Market;
  type: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  // Supabase RPC için — place_bet'e gönderilir
  odds_id?: string;
  match_id?: string;
  market_type?: string;
  selection?: string;
}

export interface PlacedBet {
  id: string;
  marketId: string;
  type: 'home' | 'draw' | 'away';
  odds: number;
  stake: number;
  potential: number;
  status: 'pending' | 'won' | 'lost' | 'cashed_out';
  placedAt: string;
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface BettingStore {
  // State
  markets: Market[];
  betSlip: BetSlipItem[];
  placedBets: PlacedBet[];
  balance: number;
  totalStaked: number;
  totalReturned: number;
  favorites: string[];
  undoMode: boolean;
  lastBetId: string | undefined;

  // Market actions
  addMarket: (market: Market) => void;
  updateMarket: (id: string, updates: Partial<Market>) => void;

  // Bet slip actions
  addToBetSlip: (item: BetSlipItem) => void;
  removeFromBetSlip: (marketId: string) => void;
  clearBetSlip: () => void;

  // Betting actions
  placeBet: (stake: number) => void;
  undoLastBet: () => void;
  settleBet: (betId: string, outcome: 'won' | 'lost') => void;

  // Computed
  getActiveBets: () => PlacedBet[];
  getSettledBets: () => PlacedBet[];

  // Balance actions (Supabase Realtime ile senkronize edilir)
  setBalance: (balance: number) => void;
  optimisticDeduct: (amount: number) => void;
  rollbackBalance: (amount: number) => void;

  // Favorites
  toggleFavorite: (marketId: string) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useBettingStore = create<BettingStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ──
      markets: [],
      betSlip: [],
      placedBets: [],
      balance: 1000, // Mock başlangıç — Supabase'den çekilince setBalance ile override edilir
      totalStaked: 0,
      totalReturned: 0,
      favorites: [],
      undoMode: false,
      lastBetId: undefined,

      // ── Market Actions ──
      addMarket: (market) =>
        set((state) => ({
          markets: state.markets.some((m) => m.id === market.id)
            ? state.markets
            : [...state.markets, market],
        })),

      updateMarket: (id, updates) =>
        set((state) => ({
          markets: state.markets.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
          // Bet slip'teki odds'ı da güncelle
          betSlip: state.betSlip.map((item) => {
            if (item.marketId !== id || !updates.odds) return item;
            const newOdds =
              item.type === 'home'
                ? updates.odds.home
                : item.type === 'away'
                ? updates.odds.away
                : (updates.odds.draw ?? item.odds);
            return { ...item, odds: newOdds };
          }),
        })),

      // ── Bet Slip Actions ──
      addToBetSlip: (item) =>
        set((state) => {
          // Aynı market zaten ekliyse kaldır (toggle)
          const exists = state.betSlip.find((b) => b.marketId === item.marketId);
          if (exists) {
            return {
              betSlip: state.betSlip.filter((b) => b.marketId !== item.marketId),
            };
          }
          return { betSlip: [...state.betSlip, item] };
        }),

      removeFromBetSlip: (marketId) =>
        set((state) => ({
          betSlip: state.betSlip.filter((b) => b.marketId !== marketId),
        })),

      clearBetSlip: () => set({ betSlip: [] }),

      // ── Betting Actions ──
      placeBet: (stake) => {
        const state = get();
        const totalOdds = state.betSlip.reduce((acc, item) => acc * item.odds, 1);
        const potential = stake * totalOdds;
        const betId = crypto.randomUUID();

        const newBet: PlacedBet = {
          id: betId,
          marketId: state.betSlip[0]?.marketId ?? '',
          type: state.betSlip[0]?.type ?? 'home',
          odds: totalOdds,
          stake,
          potential,
          status: 'pending',
          placedAt: new Date().toISOString(),
        };

        set((s) => ({
          placedBets: [...s.placedBets, newBet],
          betSlip: [],
          totalStaked: s.totalStaked + stake,
          undoMode: true,
          lastBetId: betId,
        }));

        // 2 saniye sonra undoMode kapanır
        setTimeout(() => {
          set({ undoMode: false, lastBetId: undefined });
        }, 2000);
      },

      undoLastBet: () => {
        const { lastBetId, placedBets } = get();
        if (!lastBetId) return;
        const bet = placedBets.find((b) => b.id === lastBetId);
        if (!bet) return;
        set((s) => ({
          placedBets: s.placedBets.filter((b) => b.id !== lastBetId),
          totalStaked: s.totalStaked - bet.stake,
          balance: s.balance + bet.stake,
          undoMode: false,
          lastBetId: undefined,
        }));
      },

      settleBet: (betId, outcome) =>
        set((state) => {
          const bet = state.placedBets.find((b) => b.id === betId);
          if (!bet) return {};
          const payout = outcome === 'won' ? bet.potential : 0;
          return {
            placedBets: state.placedBets.map((b) =>
              b.id === betId ? { ...b, status: outcome } : b
            ),
            balance: state.balance + payout,
            totalReturned: state.totalReturned + payout,
          };
        }),

      // ── Computed ──
      getActiveBets: () => get().placedBets.filter((b) => b.status === 'pending'),
      getSettledBets: () =>
        get().placedBets.filter((b) => b.status !== 'pending'),

      // ── Balance (Supabase Realtime senkronizasyonu) ──
      setBalance: (balance) => set({ balance }),

      optimisticDeduct: (amount) =>
        set((s) => ({ balance: s.balance - amount })),

      rollbackBalance: (amount) =>
        set((s) => ({ balance: s.balance + amount })),

      // ── Favorites ──
      toggleFavorite: (marketId) =>
        set((state) => ({
          favorites: state.favorites.includes(marketId)
            ? state.favorites.filter((id) => id !== marketId)
            : [...state.favorites, marketId],
        })),
    }),
    {
      name: 'livebet-store',
      // odds_value persist edilmez — mount'ta Supabase'den taze çekilir
      partialize: (state) => ({
        favorites: state.favorites,
        betSlip: state.betSlip.map((item) => ({
          ...item,
          odds: 0, // persist sırasında sıfırlanır
        })),
      }),
    }
  )
);
