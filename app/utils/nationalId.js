/** اعتبارسنجی کد ملی ایران (۱۰ رقم + رقم کنترل) */
export function isValidNationalId(nationalId) {
  const id = String(nationalId || "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(id)) return false;
  if (/^(\d)\1{9}$/.test(id)) return false;

  const check = parseInt(id[9], 10);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += parseInt(id[i], 10) * (10 - i);
  }
  const remainder = sum % 11;
  return remainder < 2 ? check === remainder : check === 11 - remainder;
}
