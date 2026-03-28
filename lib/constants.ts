// Stake limits (TRY)
export const MIN_STAKE = 5
export const MAX_STAKE = 10000

// Cashout
export const CASHOUT_FACTOR = 0.85

// Odds simulation interval (ms)
export const ODDS_UPDATE_INTERVAL = 500

// Undo window (ms)
export const UNDO_WINDOW_MS = 2000

// Odds change tolerance — if diff > this, backend rejects and triggers dialog
export const ODDS_CHANGE_TOLERANCE = 0.05

// Realtime channel names
export const REALTIME_ODDS_CHANNEL = 'odds-realtime'
export const REALTIME_BALANCE_CHANNEL = 'balance-realtime'
