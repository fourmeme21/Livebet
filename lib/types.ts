import { Market } from './betting-store'

// ─── Supabase DB Types ────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  username: string
  display_name: string
  avatar_url: string | null
  balance: number
  currency: string
  is_active: boolean
  responsible_gambling: {
    deposit_limit: number | null
    loss_limit: number | null
    time_out_until: string | null
  }
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  sport: string
  league: string
  home_team: string
  away_team: string
  status: 'scheduled' | 'live' | 'finished' | 'cancelled'
  live_score: string | null
  live_time: string | null
  start_time: string
  updated_at: string
}

export interface Odds {
  id: string
  match_id: string
  market_type: MarketType
  selection: string
  odds_value: number
  status: 'active' | 'suspended'
  updated_at: string
}

export interface Bet {
  id: string
  user_id: string
  match_id: string
  odds_id: string
  market_type: MarketType
  selection: string
  odds_value: number
  stake: number
  potential_payout: number
  status: BetStatus
  cashout_value: number | null
  placed_at: string
  settled_at: string | null
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  balance_after: number
  reference_id: string | null
  created_at: string
}

export interface CashoutHistory {
  id: string
  bet_id: string
  user_id: string
  cashout_amount: number
  created_at: string
}

// ─── Enum Types ───────────────────────────────────────────────────────────────

export type MarketType = '1X2' | 'over_under' | 'both_teams_score' | 'double_chance'
export type BetStatus = 'pending' | 'won' | 'lost' | 'cashed_out'
export type TransactionType = 'deposit' | 'withdrawal' | 'bet_place' | 'bet_win' | 'cashout'

// Betting error codes returned by Supabase RPC functions
export type BettingError =
  | 'insufficient_balance'
  | 'odds_changed'
  | 'market_suspended'
  | 'bet_not_found'
  | 'already_settled'
  | 'cashout_unavailable'

// ─── RPC Return Types ─────────────────────────────────────────────────────────

// get_live_matches RPC return row
export interface LiveMatch extends Match {
  match_id: string
  odds: Odds[]
}

// get_user_bets RPC return row
export interface UserBetRow {
  bet_id: string
  match_id: string
  home_team: string
  away_team: string
  market_type: string
  selection: string
  odds_value: number
  stake: number
  potential_payout: number
  status: BetStatus
  cashout_value: number | null
  placed_at: string
  settled_at: string | null
}

// ─── Realtime Payload Types ───────────────────────────────────────────────────

export interface OddsRealtimePayload {
  eventType: 'UPDATE'
  new: {
    id: string
    match_id: string
    market_type: string
    selection: string
    odds_value: number
    status: 'active' | 'suspended'
    updated_at: string
  }
  old: {
    odds_value: number
  }
}

export interface BalanceRealtimePayload {
  eventType: 'UPDATE'
  new: {
    balance: number
  }
}

// ─── Conversion Helpers ───────────────────────────────────────────────────────

/**
 * Converts a Supabase LiveMatch row to a Zustand Market object.
 * DB field names (snake_case) → Frontend field names (camelCase).
 */
export function matchToMarket(match: LiveMatch): Market {
  const homeOdds = match.odds.find((o) => o.selection === 'home_win')
  const drawOdds = match.odds.find((o) => o.selection === 'draw')
  const awayOdds = match.odds.find((o) => o.selection === 'away_win')

  return {
    id: match.id ?? match.match_id,
    name: match.league,
    homeTeam: match.home_team,   // DB: home_team → UI: homeTeam
    awayTeam: match.away_team,   // DB: away_team → UI: awayTeam
    isLive: match.status === 'live',
    volatility: 'medium',
    odds: {
      home: homeOdds?.odds_value ?? 0,
      draw: drawOdds?.odds_value,
      away: awayOdds?.odds_value ?? 0,
    },
  }
}
