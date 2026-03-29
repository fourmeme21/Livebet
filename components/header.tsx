'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* Bakiye değişince animasyonlu sayı geçişi */
function AnimatedBalance({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prev = useRef(value);

  useEffect(() => {
    if (value === prev.current) return;
    setFlash(value > prev.current ? 'up' : 'down');
    const t = setTimeout(() => setFlash(null), 700);
    prev.current = value;
    setDisplay(value);
    return () => clearTimeout(t);
  }, [value]);

  const flashColor =
    flash === 'up'
      ? 'var(--odds-positive)'
      : flash === 'down'
      ? 'var(--odds-negative)'
      : 'var(--foreground)';

  return (
    <motion.span
      className="font-mono font-bold text-sm tabular-nums transition-colors"
      animate={{ color: flashColor }}
      transition={{ duration: 0.3 }}
    >
      {display.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      <span className="text-[10px] font-normal ml-0.5" style={{ color: 'var(--muted-foreground)' }}>
        ₺
      </span>
    </motion.span>
  );
}

export function Header() {
  const { balance, totalStaked } = useBettingStore();

  return (
    <header
      className="glass-card-thin sticky top-0 z-40 px-5 py-3"
      style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">

        {/* ─── Logo ─── */}
        <div className="flex items-center gap-2.5">
          {/* Altın nokta aksanı */}
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
          />
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
          >
            Live
            <span style={{ color: 'var(--accent)' }}>bet</span>
          </h1>
        </div>

        {/* ─── Sağ: Bakiye + stake ─── */}
        <div className="flex items-center gap-2">

          {/* Bakiye */}
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'var(--accent-muted)' }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Wallet
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: 'var(--accent)' }}
            />
            <AnimatedBalance value={balance} />
          </motion.div>

          {/* Aktif bahis toplamı — sadece sıfır değilse göster */}
          <AnimatePresence>
            {totalStaked > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ backgroundColor: 'var(--muted)' }}
              >
                <TrendingUp
                  className="w-3.5 h-3.5"
                  style={{ color: 'var(--odds-positive)' }}
                />
                <span
                  className="font-mono text-xs tabular-nums"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {totalStaked.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="ml-0.5 text-[9px]">₺</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
