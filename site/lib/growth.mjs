/** Search Console dates use Pacific time; retain a three-day completeness buffer. */
export function reportingWindows(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const part = (type) => parts.find((p) => p.type === type).value;
  const today = new Date(
    `${part('year')}-${part('month')}-${part('day')}T12:00:00Z`,
  );
  const day = (offset) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().slice(0, 10);
  };
  return {
    current: { startDate: day(-30), endDate: day(-3) },
    previous: { startDate: day(-58), endDate: day(-31) },
  };
}
export function normalizeRows(rows = []) {
  return rows.map((row) => ({
    query: row.keys?.[0] || '',
    page: row.keys?.[1] || '',
    device: row.keys?.[2] || '',
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    averagePosition: row.position,
  }));
}
const queryTerms = {
  en: { topic: /pdf|signature|scan|document|paperwork/i, intent: /iphone|ipad|ios|signature|sign.*pdf/i },
  tr: { topic: /pdf|imza|tarama|belge|evrak/i, intent: /iphone|ipad|ios|imza|pdf|belge|tara/i },
  de: { topic: /pdf|unterschrift|scan|dokument|papier/i, intent: /iphone|ipad|ios|unterschrift|pdf|dokument|scan/i },
  es: { topic: /pdf|firma|escane|documento|papel/i, intent: /iphone|ipad|ios|firma|pdf|documento|escane/i },
};
function matchesLocalePage(page, locale) {
  try {
    const path = new URL(page).pathname;
    return locale === 'en'
      ? !/^\/(?:tr|de|es)(?:\/|$)/.test(path)
      : path.startsWith(`/${locale}/`);
  } catch {
    return locale === 'en' || String(page).startsWith(`/${locale}/`);
  }
}
export function opportunities(rows, locale = 'en') {
  const terms = queryTerms[locale] || queryTerms.en;
  const groups = new Map();
  for (const row of rows) {
    if (
      !terms.topic.test(row.query) ||
      /signdocs|scansignature|damas technologies/i.test(row.query) ||
      !matchesLocalePage(row.page, locale)
    )
      continue;
    if (!terms.intent.test(row.query)) continue;
    const key = JSON.stringify([row.query, row.page]);
    const group = groups.get(key) || {
      query: row.query,
      page: row.page,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
    };
    group.clicks += row.clicks;
    group.impressions += row.impressions;
    group.weightedPosition += row.averagePosition * row.impressions;
    groups.set(key, group);
  }
  return [...groups.values()]
    .map((g) => ({
      ...g,
      ctr: g.impressions ? g.clicks / g.impressions : null,
      averagePosition: g.impressions
        ? g.weightedPosition / g.impressions
        : null,
    }))
    .filter(
      (g) =>
        g.impressions >= 20 &&
        g.averagePosition >= 4 &&
        g.averagePosition <= 50 &&
        g.ctr < 0.05,
    )
    .map(({ weightedPosition, ...g }) => ({
      ...g,
      priority: (g.impressions * (1 - g.ctr)) / Math.sqrt(g.averagePosition),
    }))
    .sort((a, b) => b.priority - a.priority);
}
