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
export function opportunities(rows) {
  const groups = new Map();
  for (const row of rows) {
    if (
      !/pdf|signature|scan|document|paperwork/i.test(row.query) ||
      /signdocs|scansignature|damas technologies/i.test(row.query)
    )
      continue;
    if (!/iphone|ipad|ios|signature|sign.*pdf/i.test(row.query)) continue;
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
