export const resolveRingUrl = (id: number): string => {
  const candidates = [
    `/${id}_RING.png`,
    `/ring_${id}.png`,
    `/ring_${id}.jpg`,
  ];
  return candidates[0];
};

export const resolveBandUrl = (id: number): string => {
  const candidates = [
    `/${id}_band.png`,
    `/band_${id}.png`,
    `/band_${id}.jpg`,
  ];
  return candidates[0];
};

export const resolveGemUrl = (id: number): string => {
  const candidates = [
    `/${id}_gem.png`,
    `/gem_${id}.png`,
    `/gem_${id}.jpg`,
  ];
  return candidates[0];
};

export const preloadAndChoose = async (urls: string[]): Promise<string | null> => {
  for (const u of urls) {
    const ok = await new Promise<boolean>((resolve) => { const img = new Image(); img.onload = () => resolve(true); img.onerror = () => resolve(false); img.src = u; });
    if (ok) return u;
  }
  return null;
};