'use client';

import { motion } from 'framer-motion';

export type TabId = 'futbol' | 'basketbol' | 'kuponlar' | 'hesabim';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  couponCount: number;
}

// ─── SVG İkonlar — NORMA stiline yakın ───────────────────────────

function FutbolIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--accent)' : 'oklch(0.55 0.010 264)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* 4'lü grid — NORMA Bahisler ikonu gibi */}
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BasketbolIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--accent)' : 'oklch(0.55 0.010 264)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Play/canlı ikonu — NORMA Canlı sekmesi gibi */}
      <circle cx="12" cy="12" r="9" />
      <polygon fill={c} stroke="none" points="10,8 17,12 10,16" />
    </svg>
  );
}

function KuponlarIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--accent)' : 'oklch(0.55 0.010 264)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HesabimIcon({ active }: { active: boolean }) {
  const c = active ? 'var(--accent)' : 'oklch(0.55 0.010 264)';
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Tab tanımları ────────────────────────────────────────────────

const TABS: {
  id: TabId;
  label: string;
  Icon: React.ComponentType<{ active: boolean }>;
}[] = [
  { id: 'futbol',     label: 'Futbol',    Icon: FutbolIcon    },
  { id: 'basketbol',  label: 'Basketbol', Icon: BasketbolIcon },
  { id: 'kuponlar',   label: 'Kuponlar',  Icon: KuponlarIcon  },
  { id: 'hesabim',    label: 'Hesabım',   Icon: HesabimIcon   },
];

// ─── Bileşen ─────────────────────────────────────────────────────

export function BottomNav({ activeTab, onTabChange, couponCount }: BottomNavProps) {
  return (
    <nav
      className="flex items-stretch"
      style={{
        backgroundColor: 'oklch(0.08 0.006 264)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = activeTab === id;
        const isKupon = id === 'kuponlar';

        return (
          <motion.button
            key={id}
            onClick={() => onTabChange(id)}
            whileTap={{ scale: 0.92 }}
            className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            style={{ minHeight: 56 }}
          >
            {/* Aktif üst çizgi — NORMA tarzı */}
            {active && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute top-0 left-2 right-2 h-[2px] rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            {/* İkon + kupon badge */}
            <div className="relative">
              <Icon active={active} />

              {isKupon && couponCount > 0 && (
                <motion.span
                  key={couponCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 flex min-w-[16px] h-4 items-center justify-center rounded px-0.5 text-[9px] font-bold"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--accent-foreground)',
                  }}
                >
                  {couponCount}
                </motion.span>
              )}
            </div>

            {/* Etiket */}
            <span
              className="text-[10px] font-semibold leading-none"
              style={{ color: active ? 'var(--accent)' : 'oklch(0.55 0.010 264)' }}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
