export const TRUST_REASON_OPTIONS = [
  { key: 'quality', label: 'کیفیت کار' },
  { key: 'punctuality', label: 'خوش قولی' },
  { key: 'professional', label: 'رفتار حرفه‌ای' },
  { key: 'price', label: 'قیمت مناسب' },
  { key: 'responsive', label: 'پاسخگویی سریع' },
];

export function normalizeTrustReasonKeys(raw) {
  const allowed = new Set(TRUST_REASON_OPTIONS.map((o) => o.key));
  if (!Array.isArray(raw)) return [];
  return [...new Set(raw.map((k) => String(k).trim()).filter((k) => allowed.has(k)))];
}
