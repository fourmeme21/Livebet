import { useBettingStore } from '@/lib/betting-store'
import { formatCurrency } from '@/lib/utils'

export function StatsPanel() {
  const settledBets = useBettingStore((s) => s.getSettledBets())
  const totalWon = settledBets.filter((b) => b.status === 'won').reduce((sum, b) => sum + b.potential, 0)
  const totalLost = settledBets.filter((b) => b.status === 'lost').reduce((sum, b) => sum + b.stake, 0)
  const totalBets = settledBets.length
  const wins = settledBets.filter((b) => b.status === 'won').length
  const winRate = totalBets === 0 ? 0 : (wins / totalBets) * 100
  const profit = totalWon - totalLost

  return (
    <div className="space-y-4 rounded-lg bg-card p-4 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        İstatistikler
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Kazanma Oranı</p>
          <p className="text-lg font-mono font-bold">{winRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Kar / Zarar</p>
          <p className={`text-lg font-mono font-bold ${profit >= 0 ? 'text-odds-positive' : 'text-odds-negative'}`}>
            {formatCurrency(profit)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Toplam Kazanç</p>
          <p className="text-lg font-mono font-bold text-odds-positive">{formatCurrency(totalWon)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Toplam Kayıp</p>
          <p className="text-lg font-mono font-bold text-odds-negative">{formatCurrency(totalLost)}</p>
        </div>
      </div>
    </div>
  )
}
