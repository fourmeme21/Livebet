'use client';

import { useEffect, useState } from 'react';

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Zaten PWA olarak aciksa gosterme
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    // Daha once kapatmissa gosterme
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    // Kisa gecikme — sayfa yuklendikten sonra cik
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('pwa-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  // Kullanicinin tarayicisini detect et
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Ust kirmizi banner */}
        <div
          className="flex flex-col items-center justify-center py-8 gap-3"
          style={{ backgroundColor: '#E30A17' }}
        >
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>📲</span>
          <span className="font-black tracking-tight" style={{ fontSize: '34px', lineHeight: 1 }}>
            <span className="text-black">LIVE</span>
            <span className="text-white">BET</span>
          </span>
        </div>

        {/* Icerik */}
        <div className="px-6 py-6 flex flex-col gap-5">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground mb-1">
              Ana Ekrana Ekle
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LiveBet uygulamasini ana ekranina ekle, tarayici olmadan tam ekran ac.
            </p>
          </div>

          {/* Adimlar */}
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ backgroundColor: 'var(--muted)' }}
          >
            {isIOS ? (
              <>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">iPhone / Safari</p>
                <Step n="1" text='Alttaki Paylas butonuna bas' icon="⬆️" />
                <Step n="2" text='"Ana Ekrana Ekle" sec' icon="➕" />
                <Step n="3" text='"Ekle" butonuna bas' icon="✅" />
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Android / Chrome</p>
                <Step n="1" text='Sag ustteki menu butonuna bas' icon="⋮" />
                <Step n="2" text='"Ana ekrana ekle" sec' icon="➕" />
                <Step n="3" text='"Ekle" butonuna bas' icon="✅" />
              </>
            )}
          </div>

          {/* Butonlar */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDismiss}
              className="w-full rounded-xl py-3 text-sm font-medium text-muted-foreground transition-opacity active:opacity-70"
              style={{
                backgroundColor: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              Simdilik Hayir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, text, icon }: { n: string; text: string; icon: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: '#E30A17' }}
      >
        {n}
      </span>
      <span className="text-sm text-foreground flex-1">{text}</span>
      <span className="text-lg">{icon}</span>
    </div>
  );
}
