'use client';

import { useBettingStore, BetSlipItem } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { UndoRing } from './undo-ring';
import { useState, useEffect } from 'react';

interface BetSlipProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  // Auto-clear undo mode after 2 seconds
  useEffect(() => {
    if (undoMode) {
      const timer = setTimeout(() => {
        setUndoTimeExpired(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [undoMode]);

  const totalOdds = betSlip.reduce((acc, item) => acc * item.odds, 1);
  const stakeAmount = parseFloat(stake) || 0;
  const potential = stakeAmount * totalOdds;
  const isValid = stakeAmount > 0 && stakeAmount <= balance && betSlip.length > 0;

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: isOpen ? 0 : '100%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:static md:translate-y-0 md:h-auto"
        >
          <div className="glass-card rounded-t-2xl md:rounded-lg p-4 max-h-[90vh] overflow-y-auto md:max-h-none">
            <div className="flex items-center justify-between mb-4 md:hidden">
              <h2 className="font-bold text-foreground">Betting Slip</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Bets List */}
            <div className="space-y-2 mb-4">
              {betSlip.map((item) => (
                <motion.div
                  key={item.marketId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card-thin p-3 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {item.market.name}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.type === 'home'
                        ? item.market.homeTeam
                        : item.type === 'away'
                        ? item.market.awayTeam
                        : 'Draw'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Odds</div>
                      <div className="font-mono font-bold text-accent">
                        {item.odds.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromBetSlip(item.marketId)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {betSlip.length > 0 && (
              <>
                {/* Odds Summary */}
                <div className="glass-card-thin p-3 mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Odds</span>
                    <span className="font-mono font-bold text-accent">
                      {totalOdds.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Stake Input */}
                <div className="mb-4">
                  <label className="text-xs text-muted-foreground block mb-2">
                    Stake
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={stake}
                      onChange={(e) => setStake(e.target.value)}
                      placeholder="Enter stake"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStake((balance / 2).toFixed(2))}
                      className="text-xs"
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStake(balance.toFixed(2))}
                      className="text-xs"
                    >
                      Max
                    </Button>
                  </div>
                </div>

                {/* Potential Return */}
                <motion.div
                  className="glass-card-thin p-3 mb-4"
                  animate={{
                    boxShadow: isValid
                      ? '0 0 20px rgba(86, 180, 211, 0.3)'
                      : 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Potential</span>
                    <span className="font-mono font-bold text-2xl text-accent">
                      {potential.toFixed(2)}
                    </span>
                  </div>
                </motion.div>

                {/* Place Bet Button */}
                <motion.button
                  onClick={handlePlaceBet}
                  disabled={!isValid || isPlacing}
                  whileHover={isValid ? { scale: 1.02 } : {}}
                  whileTap={isValid ? { scale: 0.98 } : {}}
                  className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 mb-2 ${
                    isValid
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {isPlacing ? 'Placing...' : 'Place Bet'}
                </motion.button>

                {/* Clear Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearBetSlip}
                  disabled={isPlacing}
                >
                  Clear Slip
                </Button>
              </>
            )}

            {/* Undo Available */}
            {undoMode && !undoTimeExpired && lastBetId && (
              <motion.button
                onClick={undoLastBet}
                className="w-full py-3 rounded-lg bg-muted text-foreground font-semibold mt-4 hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Undo Last Bet
              </motion.button>
            )}

            {betSlip.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No bets selected</p>
                <p className="text-xs mt-1">Tap odds to add to slip</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

