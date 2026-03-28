'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';

export function ActiveBets() {
  const { getActiveBets, settleBet } = useBettingStore();
  const activeBets = getActiveBets();

  if (activeBets.length === 0) {
    return (
      <div className="glass-card p-4 rounded-lg text-center text-muted-foreground">
        <p className="text-sm">No active bets</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activeBets.map((bet) => (
        <motion.div
          key={bet.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-thin p-3 rounded-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <span className="font-mono font-bold text-accent">
              {bet.potential.toFixed(2)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-7"
              onClick={() => settleBet(bet.id, 'won')}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Won
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-7"
              onClick={() => settleBet(bet.id, 'lost')}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Lost
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
