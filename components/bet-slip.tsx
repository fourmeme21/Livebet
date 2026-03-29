'use client';

import { useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UndoRing } from './undo-ring';
import { useState, useEffect } from 'react';

interface BetSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

const SELECTION_LABEL: Record<string, string> = {
  home: 'Ev Sahibi',
  draw: 'Beraberlik',
  away: 'Deplasman',
};

export function BetSlip({ isOpen, onClose }: BetSlipProps) {
  const {
    betSlip,
    balance,
    removeFromBetSlip,
    clearBetSlip,
    placeBet,
    undoLastBet,
    undoMode,
    lastBetId,
  } = useBettingStore();

  const [stake, setStake] = useState('10');
  const [isPlacing, setIsPlacing] = useState(false);
  const [undoTimeExpired, setUndoTimeExpired] = useState(false);

  useEffect(() => {
    if (undoMode) {
      const timer = setTimeout(() => setUndoTimeExpired(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [undoMode]);

  const totalOdds   = betSlip.reduce((acc, item) => acc * item.odds, 1);
  const stakeAmount = parseFloat(stake) || 0;
  const potential   = stakeAmount * totalOdds;
  const isValid     = stakeAmount >= 5 && stakeAmount <= balance && betSlip.length > 0;
  const isOverBalance = stakeAmount > balance && stakeAmount > 0;

  const handlePlaceBet = () => {
    if (!isValid) return;
    setIsPlacing(true);
    placeBet(stakeAmount);
    setTimeout(() => {
      setIsPlacing(false);
      onClose();
      setStake('10');
      setUndoTimeExpired(false);
    }, 600);
  };

  return (
    <>
      <UndoRing
        isActive={undoMode && !undoTimeExpired && lastBetId !== undefined}
        onExpire={() => setUndoTimeExpired(true)}
      />

      {/* Mobil backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: 'oklch(0 0 0 / 0.65)' }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:static md:translate-y-0"
      >
        <div
          className="glass-card md:rounded-xl rounded-t-2xl overflow-hidden"
          style={{ maxHeight: '90dvh', overflowY: 'auto' }}
        >

          {/* ─── Başlık ─── */}
          <div
            className="flex items-center justify-between px-4 py-3 sticky top-0"
            style={{
              backgroundColor: 'oklch(0.14 0.010 264 / 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2">
              <h2
                className="text-sm font-bold tracking-tight"
                style={{ color: 'var(--foreground)' }}
              >
                Bahis Kuponu
              </h2>
              {betSlip.length > 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--accent-muted)',
                    color: 'var(--accent)',
                  }}
                >
                  {betSlip.length}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg md:hidden transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3">

            {/* ─── Bahis listesi ─── */}
            <AnimatePresence initial={false}>
              {betSlip.map((item) => (
                <motion.div
                  key={item.marketId}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card-thin p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[10px] uppercase tracking-wider font-medium truncate mb-0.5"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {item.market.name}
                      </p>
                      <p
                        className="text-xs font-semibold truncate"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {item.type === 'home'
                          ? item.market.homeTeam
                          : item.type === 'away'
                          ? item.market.awayTeam
                          : 'Beraberlik'}
                      </p>
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        {SELECTION_LABEL[item.type]}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="font-mono font-bold text-sm tabular-nums"
                        style={{ color: 'var(--accent)' }}
                      >
                        {item.odds.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromBetSlip(item.marketId)}
                        className="p-1 rounded-md transition-colors"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* ─── Boş durum ─── */}
            {betSlip.length === 0 && (
              <div className="py-10 text-center space-y-1">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Kuponda bahis yok
                </p>
                <p
                  className="text-xs"
                  style={{ color: 'oklch(0.45 0.008 264)' }}
                >
                  Oran butonuna tıklayarak ekle
                </p>
              </div>
            )}

            {betSlip.length > 0 && (
              <>
                {/* ─── Toplam oran ─── */}
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <span
                    className="text-xs"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Toplam Oran
                  </span>
                  <span
                    className="font-mono font-bold text-sm tabular-nums"
                    style={{ color: 'var(--accent)' }}
                  >
                    {totalOdds.toFixed(2)}
                  </span>
                </div>

                {/* ─── Stake girişi ─── */}
                <div className="space-y-1.5">
                  <label
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Bahis Miktarı
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        placeholder="0.00"
                        min={5}
                        className="pr-6 font-mono text-sm"
                        style={{
                          borderColor: isOverBalance
                            ? 'var(--destructive)'
                            : 'var(--border)',
                        }}
                      />
                      <span
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        ₺
                      </span>
                    </div>
                    <button
                      onClick={() => setStake((balance / 2).toFixed(2))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      %50
                    </button>
                    <button
                      onClick={() => setStake(balance.toFixed(2))}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      style={{
                        backgroundColor: 'var(--muted)',
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      Max
                    </button>
                  </div>
                  {isOverBalance && (
                    <p
                      className="text-[10px]"
                      style={{ color: 'var(--destructive)' }}
                    >
                      Yetersiz bakiye
                    </p>
                  )}
                </div>

                {/* ─── Potansiyel kazanç ─── */}
                <motion.div
                  className="glass-card-thin px-4 py-3"
                  animate={{
                    borderColor: isValid
                      ? 'oklch(0.78 0.14 78 / 0.35)'
                      : 'var(--border-subtle)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: 'var(--muted-foreground)' }}
                    >
                      Tahmini Kazanç
                    </span>
                    <div className="text-right">
                      <span
                        className="font-mono font-bold text-xl tabular-nums"
                        style={{ color: isValid ? 'var(--accent)' : 'var(--muted-foreground)' }}
                      >
                        {potential.toFixed(2)}
                      </span>
                      <span
                        className="text-xs ml-0.5"
                        style={{ color: 'var(--muted-foreground)' }}
                      >
                        ₺
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* ─── Place Bet butonu ─── */}
                <motion.button
                  onClick={handlePlaceBet}
                  disabled={!isValid || isPlacing}
                  whileHover={isValid ? { scale: 1.015 } : {}}
                  whileTap={isValid ? { scale: 0.985 } : {}}
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity"
                  style={{
                    backgroundColor: isValid ? 'var(--accent)' : 'var(--muted)',
                    color: isValid ? 'var(--accent-foreground)' : 'var(--muted-foreground)',
                    cursor: isValid ? 'pointer' : 'not-allowed',
                    opacity: isPlacing ? 0.7 : 1,
                  }}
                >
                  {isPlacing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                      />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      Bahis Yap
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* ─── Kuponu temizle ─── */}
                <button
                  onClick={clearBetSlip}
                  disabled={isPlacing}
                  className="w-full py-2 text-xs font-medium transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Kuponu Temizle
                </button>
              </>
            )}

            {/* ─── Undo butonu ─── */}
            <AnimatePresence>
              {undoMode && !undoTimeExpired && lastBetId && (
                <motion.button
                  key="undo"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  onClick={undoLastBet}
                  className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: 'var(--muted)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Son Bahsi Geri Al
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}
