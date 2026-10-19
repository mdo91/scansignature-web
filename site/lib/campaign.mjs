/** @param {string} provider @param {string} campaign */
export function createAppStoreUrl(provider, campaign = 'website') {
  const url = new URL('https://apps.apple.com/app/id6805875185');
  if (!provider) return url.toString();
  if (!/^\d+$/.test(provider))
    throw new Error('Invalid App Store provider token');
  let token = campaign.replace(/[^a-zA-Z0-9_-]/g, '-');
  if (token.length > 30) {
    let hash = 2166136261;
    for (const char of token)
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
    token = `${token.slice(0, 21)}-${hash.toString(16).padStart(8, '0')}`;
  }
  url.searchParams.set('pt', provider);
  url.searchParams.set('ct', token || 'website');
  url.searchParams.set('mt', '8');
  return url.toString();
}
