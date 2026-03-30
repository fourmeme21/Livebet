'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Daha once reddettiyse gosterme
    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) return;

    // Zaten PWA olarak aciksa gosterme
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleAccept = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    /* Tam ekran karanlik overlay */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      {/* Merkez blok */}
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Ust: kirmizi banner */}
        <div
          className="flex flex-col items-center justify-center py-8 gap-2"
          style={{ backgroundColor: '#E30A17' }}
        >
          <span style={{ fontSize: '3rem', lineHeight: 1 }}>📲</span>
          <span className="font-black text-white tracking-tight" style={{ fontSize: '32px' }}>
            <span className="text-black">LIVE</span>BET
          </span>
        </div>

        {/* Icerik */}
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground mb-1">
              Ana Ekrana Ekle
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              LiveBet uygulamasini ana ekranina ekleyerek daha hizli acabilir,
              tam ekran deneyim yasayabilirsin.
            </p>
          </div>

          {/* Ozellikler */}
          <div className="flex flex-col gap-2">
            {[
              { icon: '⚡', text: 'Aninda acilir, tarayici yok' },
              { icon: '📶', text: 'Tam ekran uygulama gorunumu' },
              { icon: '🔔', text: 'Canli mac bildirimleri' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </div>
            ))}
          </div>

          {/* Butonlar */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleAccept}
              className="w-full rounded-xl py-4 text-base font-bold text-white transition-opacity active:opacity-80"
              style={{ backgroundColor: '#E30A17' }}
            >
              Evet, Ana Ekrana Ekle
            </button>
            <button
              onClick={handleDismiss}
              className="w-full rounded-xl py-3 text-sm font-medium text-muted-foreground transition-opacity active:opacity-80"
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
