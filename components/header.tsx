'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { Globe2, TrendingUp, Wallet } from 'lucide-react';

export function Header() {
  const { balance, totalStaked } = useBettingStore();

  return (
    <header className="glass-card-thin sticky top-0 z-40 px-4 py-3 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Globe2 className="w-5 h-5 text-accent-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Livebet</h1>
        </div>

        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <Wallet className="w-4 h-4 text-accent" />
            <span className="font-mono text-sm font-semibold">
              {balance.toFixed(2)}
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4 text-odds-positive" />
            <span className="font-mono text-xs text-muted-foreground">
              {totalStaked.toFixed(2)}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
