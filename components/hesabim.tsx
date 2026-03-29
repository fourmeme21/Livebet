'use client';

import { useState } from 'react';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { id: 'sifre',    icon: '🔑', label: 'Sifre Degisikligi'  },
  { id: 'gunluk',  icon: '📅', label: 'Gunluk Raporlar'    },
  { id: 'detayli', icon: '📊', label: 'Detayli Raporlar'   },
  { id: 'nakit',   icon: '💸', label: 'Nakit Akisi'         },
];

export function Hesabim() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Baslik */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-primary font-bold text-lg">Hesabim</h1>
      </div>

      {/* Menu Listesi */}
      <div className="mx-4 rounded-lg border border-border overflow-hidden bg-card">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelected(item.id)}
            className={`
              w-full flex items-center gap-4 px-4 py-4 text-left transition-colors
              ${selected === item.id ? 'bg-primary/10' : 'hover:bg-muted/40'}
              ${index < menuItems.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            <span className="text-xl text-primary w-6 text-center">{item.icon}</span>
            <span className="text-sm font-medium text-foreground">{item.label}</span>
            <span className="ml-auto text-muted-foreground">›</span>
          </button>
        ))}
      </div>

      {/* Cikis */}
      <div className="px-4 mt-6">
        <button className="w-full rounded-lg border border-red-500/30 bg-red-500/10 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
          Cikis Yap
        </button>
      </div>

    </div>
  );
}
