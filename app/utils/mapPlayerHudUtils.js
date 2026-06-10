/** نشان و نوار امتیاز HUD نقشه (کاربر / متخصص / فروشگاه) */

export const MAP_PLAYER_IDENTITY = {
  member: {
    id: 'member',
    label: 'کاربر',
    ariaLabel: 'امتیاز کاربر',
    iconClass: 'text-sky-600 drop-shadow-[0_0_1px_#fff,0_1px_3px_rgba(0,0,0,0.75)]',
    fillClass:
      'bg-gradient-to-l from-sky-200 via-sky-400 to-sky-500 shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)]',
  },
  expert: {
    id: 'expert',
    label: 'متخصص',
    ariaLabel: 'امتیاز متخصص',
    iconClass: 'text-teal-600 drop-shadow-[0_0_1px_#fff,0_1px_3px_rgba(0,0,0,0.75)]',
    fillClass:
      'bg-gradient-to-l from-yellow-200 via-yellow-400 to-amber-500 shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)]',
  },
  merchant: {
    id: 'merchant',
    label: 'فروشگاه',
    ariaLabel: 'امتیاز فروشگاه',
    iconClass: 'text-amber-600 drop-shadow-[0_0_1px_#fff,0_1px_3px_rgba(0,0,0,0.75)]',
    fillClass:
      'bg-gradient-to-l from-orange-200 via-orange-400 to-orange-500 shadow-[inset_0_-1px_0_rgba(255,255,255,0.35)]',
  },
};

function hasRole(user, roleName) {
  return Boolean(user?.userRoles?.some((role) => role.name === roleName));
}

export function resolveMapPlayerScoreBars(user, scores = {}) {
  const {
    memberScore = 88,
    expertScore = 88,
    merchantScore = 72,
  } = scores;

  if (!user) {
    return [
      { ...MAP_PLAYER_IDENTITY.expert, score: expertScore },
      { ...MAP_PLAYER_IDENTITY.merchant, score: merchantScore },
    ];
  }

  const isExpert = hasRole(user, 'expert');
  const isMerchant = hasRole(user, 'merchant');
  const bars = [];

  if (!isExpert && !isMerchant) {
    bars.push({ ...MAP_PLAYER_IDENTITY.member, score: memberScore });
  }
  if (isExpert) {
    bars.push({ ...MAP_PLAYER_IDENTITY.expert, score: expertScore });
  }
  if (isMerchant) {
    bars.push({ ...MAP_PLAYER_IDENTITY.merchant, score: merchantScore });
  }

  return bars.length > 0
    ? bars
    : [{ ...MAP_PLAYER_IDENTITY.member, score: memberScore }];
}

export function resolveMapPlayerIdentitySummary(user) {
  return resolveMapPlayerScoreBars(user).map((bar) => bar.label).join(' · ');
}
