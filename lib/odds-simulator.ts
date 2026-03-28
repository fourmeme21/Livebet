import { Market } from './betting-store';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LEAGUES = [
  'UEFA Champions League',
  'Premier League',
  'La Liga',
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Turkish Süper Lig',
  'NBA',
  'ATP Tour',
];

const HOME_TEAMS = [
  'Manchester City', 'Real Madrid', 'Bayern Munich', 'PSG', 'Inter Milan',
  'Arsenal', 'Barcelona', 'Borussia Dortmund', 'Napoli', 'Atletico Madrid',
  'Liverpool', 'Chelsea', 'Juventus', 'AC Milan', 'Galatasaray',
  'Fenerbahçe', 'Beşiktaş', 'Porto', 'Ajax', 'Benfica',
];

const AWAY_TEAMS = [
  'RB Leipzig', 'Tottenham', 'Sevilla', 'Marseille', 'Lazio',
  'Newcastle', 'Valencia', 'Bayer Leverkusen', 'Roma', 'Villarreal',
  'West Ham', 'Aston Villa', 'Fiorentina', 'Atalanta', 'Trabzonspor',
  'Başakşehir', 'Sivasspor', 'Sporting CP', 'PSV', 'Braga',
];

// ─── Market Generator ─────────────────────────────────────────────────────────

export function generateMarkets(count: number): Market[] {
  return Array.from({ length: count }, (_, i) => {
    const homeTeam = HOME_TEAMS[i % HOME_TEAMS.length];
    const awayTeam = AWAY_TEAMS[i % AWAY_TEAMS.length];
    const league = LEAGUES[i % LEAGUES.length];
    const isLive = i % 3 === 0; // Her 3 marketten 1'i canlı

    // Gerçekçi oran aralıkları
    const homeOdds = parseFloat((Math.random() * 2.5 + 1.3).toFixed(2));
    const awayOdds = parseFloat((Math.random() * 4.0 + 1.5).toFixed(2));
    const drawOdds = parseFloat((Math.random() * 1.5 + 2.8).toFixed(2));

    const volatilityRoll = Math.random();
    const volatility: 'low' | 'medium' | 'high' =
      volatilityRoll < 0.4 ? 'low' : volatilityRoll < 0.75 ? 'medium' : 'high';

    return {
      id: `market-${i}-${Date.now()}`,
      name: league,
      homeTeam,
      awayTeam,
      isLive,
      volatility,
      odds: {
        home: homeOdds,
        draw: drawOdds,
        away: awayOdds,
      },
    };
  });
}

// ─── Odds Simulator ───────────────────────────────────────────────────────────

const VOLATILITY_RANGE = {
  low:    0.01,
  medium: 0.03,
  high:   0.07,
};

export function simulateOddsUpdate(market: Market): Market {
  const range = VOLATILITY_RANGE[market.volatility];

  // Her güncelleme turunda %30 ihtimalle değişim
  if (Math.random() > 0.3) return market;

  const nudge = (base: number) => {
    const delta = (Math.random() - 0.5) * 2 * range;
    return parseFloat(Math.max(1.05, base + delta).toFixed(2));
  };

  return {
    ...market,
    odds: {
      home: nudge(market.odds.home),
      draw: market.odds.draw ? nudge(market.odds.draw) : undefined,
      away: nudge(market.odds.away),
    },
  };
}

// ─── Smart Favorites ──────────────────────────────────────────────────────────

/**
 * Kullanıcının favorilediği ligleri üste çıkaran algoritma.
 * Favori yoksa en yüksek volatiliteli canlı maçları öne çıkarır.
 */
export function getSmartFavorites(
  markets: Market[],
  favorites: string[]
): Market[] {
  if (favorites.length > 0) {
    const favorited = markets.filter((m) => favorites.includes(m.id));
    const rest = markets
      .filter((m) => !favorites.includes(m.id))
      .sort((a, b) => {
        // Canlı maçları öne çıkar
        if (a.isLive && !b.isLive) return -1;
        if (!a.isLive && b.isLive) return 1;
        // Yüksek volatiliteyi öne çıkar
        const vOrder = { high: 0, medium: 1, low: 2 };
        return vOrder[a.volatility] - vOrder[b.volatility];
      });
    return [...favorited, ...rest].slice(0, 10);
  }

  // Favori yoksa: canlı + yüksek volatilite önce
  return [...markets]
    .sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      const vOrder = { high: 0, medium: 1, low: 2 };
      return vOrder[a.volatility] - vOrder[b.volatility];
    })
    .slice(0, 10);
}
