export function maskMobile(mobile) {
  const m = String(mobile || "").replace(/\D/g, "");
  const normalized =
    m.startsWith("98") && m.length === 12
      ? `0${m.slice(2)}`
      : m.startsWith("9") && m.length === 10
        ? `0${m}`
        : m;
  if (normalized.length < 7) return "***";
  return `${normalized.slice(0, 4)}***${normalized.slice(-3)}`;
}

export function maskEmail(email) {
  const value = String(email || "").trim().toLowerCase();
  const at = value.indexOf("@");
  if (at < 1) return "***";
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}***@${domain}`;
}
