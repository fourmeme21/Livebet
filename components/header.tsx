'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
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
    flash === 'up' ? 'var(--odds-positive)' :
    flash === 'down' ? 'var(--odds-negative)' :
    'var(--accent)';

  return (
    <motion.span
      className="font-mono font-bold text-sm tabular-nums"
      animate={{ color }}
      transition={{ duration: 0.3 }}
    >
      {display.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
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
      className="sticky top-0 z-40 flex items-center gap-2 px-3 py-2"
      style={{
        backgroundColor: 'var(--brand-red)',
        borderBottom: '1px solid var(--brand-red-dark)',
      }}
    >
      {/* ─── Sol: Arama butonu ─── */}
      <button
        className="flex items-center gap-2 rounded px-3 py-2 text-sm shrink-0"
        style={{
          backgroundColor: 'var(--brand-red-dark)',
          color: 'oklch(0.85 0 0)',
          minWidth: '80px',
        }}
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="font-medium">Ara</span>
      </button>

      {/* ─── Orta: Logo ─── */}
      <div className="flex flex-1 items-center justify-center">
        <span className="text-xl font-black tracking-tight text-white">
          LIVE<span style={{ color: 'var(--accent)' }}>BET</span>
        </span>
      </div>

      {/* ─── Sağ: Kupon sayacı — NORMA stili ─── */}
      <motion.button
        onClick={onCouponOpen}
        className="flex shrink-0 flex-col items-center gap-0.5"
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          {/* 3 çizgi ikon */}
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
                className="absolute -bottom-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded px-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: 'var(--accent-foreground)',
                }}
              >
                {couponCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span className="text-[9px] leading-none text-white/70">
          Kuponunuz
        </span>
      </motion.button>
    </header>
  );
      }
          
