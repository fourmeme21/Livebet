'use client';

import { useBettingStore } from '@/lib/betting-store';
import { motion } from 'framer-motion';
import { LogOut, Monitor, Headphones } from 'lucide-react';
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
      {display.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
    </motion.span>
  );
}

interface UserStatusBarProps {
  username?: string;
}

export function UserStatusBar({ username = 'Kullanıcı' }: UserStatusBarProps) {
  const { balance } = useBettingStore();

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 shrink-0"
      style={{
        backgroundColor: 'oklch(0.08 0.006 264)',
        borderTop: '1px solid var(--border)',
      }}
    >
      {/* Kullanıcı adı */}
      <span className="text-sm font-bold text-white shrink-0">
        {username}
      </span>

      {/* Çıkış */}
      <button
        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-white shrink-0"
        style={{ backgroundColor: 'var(--brand-red)' }}
      >
        <LogOut className="w-3 h-3" />
        <span>Çıkış</span>
      </button>

      {/* Monitor */}
      <button
        className="flex items-center justify-center rounded p-1.5 shrink-0"
        style={{ backgroundColor: 'var(--muted)' }}
      >
        <Monitor className="w-4 h-4" style={{ color: 'oklch(0.75 0 0)' }} />
      </button>

      {/* Sohbet */}
      <button
        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold shrink-0"
        style={{ backgroundColor: 'var(--muted)', color: 'oklch(0.75 0 0)' }}
      >
        <Headphones className="w-3 h-3" />
        <span>Sohbet</span>
      </button>

      {/* Bakiye — sağa yaslanır, altın renk */}
      <div className="flex-1 flex justify-end">
        <AnimatedBalance value={balance} />
      </div>
    </div>
  );
}
