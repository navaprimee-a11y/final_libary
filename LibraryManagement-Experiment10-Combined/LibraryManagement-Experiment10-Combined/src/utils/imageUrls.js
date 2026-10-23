// Open Library supports S (small), M (medium), and L (large) cover variants.
// Only rewrite known Open Library cover URLs; leave arbitrary URLs untouched.
export const getSizedCoverUrl = (url, size = 'M') => {
  if (typeof url !== 'string' || !url) return '';
  const safeSize = ['S', 'M', 'L'].includes(size) ? size : 'M';
  return url.replace(/(\/b\/id\/\d+)-[SML](\.jpg(?:\?.*)?$)/i, `$1-${safeSize}$2`);
};
