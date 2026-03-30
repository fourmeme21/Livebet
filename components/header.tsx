'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

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

  const color =
    flash === 'up'   ? 'var(--odds-positive)' :
    flash === 'down' ? 'var(--odds-negative)' :
    'var(--accent)';

  return (
    <motion.span
      className="font-mono font-bold text-sm tabular-nums"
      animate={{ color }}
      transition={{ duration: 0.3 }}
    >
      {display.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
    </motion.span>
  );
}

interface HeaderProps {
  couponCount: number;
  onCouponOpen: () => void;
}

export function Header({ couponCount, onCouponOpen }: HeaderProps) {
  const { balance } = useBettingStore();

  return (
    <header
      className="sticky top-0 z-40 flex items-center px-3 py-2"
      style={{
        backgroundColor: 'var(--brand-red)',
        borderBottom: '1px solid var(--brand-red-dark)',
      }}
    >
      {/* Sol: bos alan — arama asagiya tasindi */}
      <div className="w-10 shrink-0" />

      {/* Orta: Logo — %40 buyuk: text-xl(20px) → text-[28px] */}
      <div className="flex flex-1 items-center justify-center">
        <span className="font-black tracking-tight" style={{ fontSize: '28px', lineHeight: 1 }}>
          <span className="text-black">LIVE</span>
          <span className="text-white">BET</span>
        </span>
      </div>

      {/* Sag: Kupon sayaci */}
      <motion.button
        onClick={onCouponOpen}
        className="flex shrink-0 flex-col items-center gap-0.5"
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          {/* 3 cizgi ikon */}
          <div
            className="flex w-10 h-8 flex-col items-center justify-center gap-1 rounded"
            style={{ backgroundColor: 'var(--brand-red-dark)' }}
          >
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="rounded-full bg-white"
                style={{ width: i === 1 ? 18 : 14, height: 2 }}
              />
            ))}
          </div>

          {/* Badge */}
          <AnimatePresence>
            {couponCount > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -bottom-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded px-0.5 font-bold"
                style={{
                  fontSize: '13px', // 10px → 13px (+30%)
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-foreground)',
                }}
              >
                {couponCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Kuponunuz yazisi — 9px → 12px (+30%) */}
        <span className="leading-none text-white/70" style={{ fontSize: '12px' }}>
          Kuponunuz
        </span>
      </motion.button>
    </header>
  );
}
