'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'win' | 'loss';
  amount: number;
  description: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  { id: '1', type: 'deposit',  amount: 500,  description: 'Para Yatırma',   date: '2025-06-25' },
  { id: '2', type: 'loss',     amount: -50,  description: 'Galatasaray - Fenerbahçe', date: '2025-06-24' },
  { id: '3', type: 'win',      amount: 230,  description: 'Beşiktaş - Trabzonspor',  date: '2025-06-23' },
  { id: '4', type: 'withdraw', amount: -200, description: 'Para Çekme',     date: '2025-06-22' },
  { id: '5', type: 'loss',     amount: -75,  description: 'Barcelona - Real Madrid',  date: '2025-06-21' },
];

export function Hesabim() {
  const [activeSection, setActiveSection] = useState<'ozet' | 'islemler' | 'profil'>('ozet');

  const balance = 1405;
  const totalWins = 3;
  const totalBets = 8;
  const winRate = Math.round((totalWins / totalBets) * 100);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">

      {/* ─── Kullanıcı Kartı ─── */}
      <div className="rounded-xl bg-card border border-border p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          K
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground text-lg">Kullanıcı</p>
          <p className="text-muted-foreground text-sm">kullanici@email.com</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Bakiye</p>
          <p className="text-xl font-bold text-green-400">₺{balance.toLocaleString('tr-TR')}</p>
        </div>
      </div>

      {/* ─── Sekme Seçici ─── */}
      <div className="flex rounded-lg bg-card border border-border overflow-hidden">
        {(['ozet', 'islemler', 'profil'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeSection === tab
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'ozet' ? 'Özet' : tab === 'islemler' ? 'İşlemler' : 'Profil'}
          </button>
        ))}
      </div>

      {/* ─── Özet ─── */}
      {activeSection === 'ozet' && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Toplam Bahis" value={totalBets.toString()} />
            <StatCard label="Kazanma Oranı" value={`%${winRate}`} highlight />
            <StatCard label="Kazanılan" value={`₺${230}`} positive />
            <StatCard label="Kaybedilen" value={`₺${125}`} negative />
          </div>

          {/* Hızlı Aksiyonlar */}
          <div className="grid grid-cols-2 gap-3 mt-1">
            <ActionButton label="💳 Para Yatır" />
            <ActionButton label="🏦 Para Çek" />
          </div>
        </div>
      )}

      {/* ─── İşlem Geçmişi ─── */}
      {activeSection === 'islemler' && (
        <div className="flex flex-col gap-2">
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg bg-card border border-border px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {tx.type === 'deposit' ? '⬇️' : tx.type === 'withdraw' ? '⬆️' : tx.type === 'win' ? '🏆' : '❌'}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <span
                className={`font-semibold text-sm ${
                  tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {tx.amount > 0 ? '+' : ''}₺{Math.abs(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ─── Profil ─── */}
      {activeSection === 'profil' && (
        <div className="flex flex-col gap-3">
          <ProfileField label="Ad Soyad" value="Kullanıcı Adı" />
          <ProfileField label="E-posta" value="kullanici@email.com" />
          <ProfileField label="Telefon" value="+90 5XX XXX XX XX" />
          <ProfileField label="Üyelik Tarihi" value="Ocak 2025" />

          <button className="mt-2 w-full rounded-lg border border-red-500/40 bg-red-500/10 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors">
            Çıkış Yap
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Yardımcı Bileşenler ─── */

function StatCard({
  label, value, highlight, positive, negative,
}: {
  label: string; value: string; highlight?: boolean; positive?: boolean; negative?: boolean;
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-3 flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-xl font-bold ${
          highlight ? 'text-primary' : positive ? 'text-green-400' : negative ? 'text-red-400' : 'text-foreground'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="rounded-lg bg-primary/10 border border-primary/30 py-3 text-sm font-medium text-primary hover:bg-primary/20 transition-colors">
      {label}
    </button>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-card border border-border px-4 py-3">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
