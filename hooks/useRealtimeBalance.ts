'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useBettingStore } from '@/lib/betting-store'
import { BalanceRealtimePayload } from '@/lib/types'
import { REALTIME_BALANCE_CHANNEL } from '@/lib/constants'

/**
 * Subscribes to real-time balance updates for the current user.
 * Syncs the Zustand store balance with the Supabase profiles table.
 */
export function useRealtimeBalance(userId: string | null) {
  const { setBalance } = useBettingStore()

  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(REALTIME_BALANCE_CHANNEL)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const data = payload as unknown as BalanceRealtimePayload
          if (data.new?.balance !== undefined) {
            setBalance(data.new.balance)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn('[useRealtimeBalance] Channel error — balance updates paused')
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [userId, setBalance])
}
