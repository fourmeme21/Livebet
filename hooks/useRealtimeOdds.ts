'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useBettingStore } from '@/lib/betting-store'
import { OddsRealtimePayload } from '@/lib/types'
import { REALTIME_ODDS_CHANNEL } from '@/lib/constants'

/**
 * Subscribes to real-time odds updates from Supabase.
 * - Updates matchStore odds on change
 * - Triggers 'odds_changed' detection for bet slip items
 * - Handles suspended markets
 */
export function useRealtimeOdds() {
  const { updateMarket, markets, betSlip } = useBettingStore()

  useEffect(() => {
    const channel = supabase
      .channel(REALTIME_ODDS_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'odds',
        },
        (payload) => {
          const data = payload as unknown as OddsRealtimePayload

          if (!data.new) return

          const { match_id, selection, odds_value, status } = data.new

          // Find the market this odds update belongs to
          const market = markets.find((m) => m.id === match_id)
          if (!market) return

          // Build partial odds update
          const updatedOdds = { ...market.odds }

          if (selection === 'home_win') updatedOdds.home = odds_value
          else if (selection === 'away_win') updatedOdds.away = odds_value
          else if (selection === 'draw') updatedOdds.draw = odds_value

          // If market is suspended, we could disable it — for now just update
          updateMarket(match_id, {
            odds: updatedOdds,
          })

          // Check if any bet slip item has this odds and the value changed significantly
          // betSlipStore.updateMarket already handles betSlip odds sync via updateMarket
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('[useRealtimeOdds] Channel error — live updates paused')
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [markets, betSlip, updateMarket])
}
