export const DEFAULT_NIGHT_SKY_PROFILE = {
  enabled: true,
  count: 200,
  heightVh: 38,
  minHeightPx: 220,
  maxHeightPx: 420,
  sizeMin: 0.45,
  sizeMax: 1.35,
  opacityMin: 0.45,
  opacityMax: 0.95,
  twinklePercent: 48,
  twinkleDurationMin: 1.8,
  twinkleDurationMax: 5,
  seed: 92821,
};

export const DEFAULT_NIGHT_SKY_STARS = {
  mobile: { ...DEFAULT_NIGHT_SKY_PROFILE },
  desktop: {
    enabled: true,
    count: 140,
    heightVh: 34,
    minHeightPx: 180,
    maxHeightPx: 360,
    sizeMin: 0.11,
    sizeMax: 0.33,
    opacityMin: 0.4,
    opacityMax: 0.9,
    twinklePercent: 50,
    twinkleDurationMin: 2,
    twinkleDurationMax: 5.5,
    seed: 45173,
  },
};

/** @param {typeof DEFAULT_NIGHT_SKY_PROFILE} profile */
export function buildStars(profile) {
  const stars = [];
  let seed = profile.seed;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const sizeSpan = Math.max(0, profile.sizeMax - profile.sizeMin);
  const opacitySpan = Math.max(0, profile.opacityMax - profile.opacityMin);
  const durationSpan = Math.max(0, profile.twinkleDurationMax - profile.twinkleDurationMin);

  for (let i = 0; i < profile.count; i += 1) {
    const roll = rand();
    const r =
      roll > 0.97
        ? profile.sizeMax
        : roll > 0.88
          ? profile.sizeMin + sizeSpan * 0.75
          : roll > 0.55
            ? profile.sizeMin + sizeSpan * 0.45
            : profile.sizeMin + sizeSpan * 0.15;

    stars.push({
      id: i,
      x: Math.round(rand() * 1000),
      y: Math.round(rand() * 360),
      r,
      o: profile.opacityMin + rand() * opacitySpan,
      twinkle: rand() * 100 < profile.twinklePercent,
      delay: rand() * 5,
      duration: profile.twinkleDurationMin + rand() * durationSpan,
    });
  }

  return stars;
}

export function mergeNightSkyConfig(fromApi) {
  return {
    mobile: { ...DEFAULT_NIGHT_SKY_STARS.mobile, ...fromApi?.mobile },
    desktop: { ...DEFAULT_NIGHT_SKY_STARS.desktop, ...fromApi?.desktop },
  };
}
