import { useBettingStore } from '@/lib/betting-store'
import { formatCurrency } from '@/lib/utils'
import { Heart } from 'lucide-react'

export function Sidebar() {
  const balance = useBettingStore((s) => s.balance)
  const activeBets = useBettingStore((s) => s.getActiveBets())
  const favorites = useBettingStore((s) => s.favorites)
  const markets = useBettingStore((s) => s.markets)
  const toggleFavorite = useBettingStore((s) => s.toggleFavorite)

  const favoriteMarkets = markets.filter((m) => favorites.includes(m.id))

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4">
      {/* Hesap özeti */}
      <div className="rounded-lg bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">Bakiye</p>
        <p className="text-2xl font-mono font-bold">{formatCurrency(balance)}</p>
      </div>

      {/* Aktif bahisler */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Aktif Bahisler
        </h3>
        {activeBets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz aktif bahis yok</p>
        ) : (
          <ul className="space-y-2">
            {activeBets.map((bet) => (
              <li key={bet.id} className="rounded-lg bg-card p-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono">{bet.odds}</span>
                  <span className="text-muted-foreground">{formatCurrency(bet.stake)}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {bet.type === 'home' ? 'Ev' : bet.type === 'away' ? 'Deplasman' : 'Beraberlik'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Favori maçlar */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Favori Maçlar
        </h3>
        {favoriteMarkets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz favori maç yok</p>
        ) : (
          <ul className="space-y-2">
            {favoriteMarkets.map((market) => (
              <li
                key={market.id}
                className="flex cursor-pointer items-center justify-between rounded-lg bg-card p-3 text-sm hover:bg-accent/10"
              >
                <div>
                  <div className="font-medium">{market.homeTeam}</div>
                  <div className="text-xs text-muted-foreground">{market.awayTeam}</div>
                </div>
                <button
                  onClick={() => toggleFavorite(market.id)}
                  className="p-1 text-red-500"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
