/* eslint-disable @typescript-eslint/no-require-imports */
const os = require('os');

const PORT = process.env.PORT || '3001';

function getLanIp() {
  const nets = os.networkInterfaces();
  const candidates = [];

  for (const [name, addrs] of Object.entries(nets)) {
    if (/vmware|virtualbox|hyper-v|vethernet|loopback|docker|wsl/i.test(name)) continue;

    for (const net of addrs) {
      const isV4 = net.family === 'IPv4' || net.family === 4;
      if (!isV4 || net.internal || net.address.startsWith('169.254.')) continue;

      const lower = name.toLowerCase();
      const score =
        (/wi-?fi|wlan|wireless/i.test(lower) ? 3 : 0) +
        (/eth|ethernet/i.test(lower) ? 2 : 0) +
        (lower.includes('local') ? 1 : 0);

      candidates.push({ address: net.address, score });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.address || null;
}

const lanIp = getLanIp();

console.log('');
console.log('  Next.js dev — دسترسی از موبایل (همان وای‌فای):');
if (lanIp) {
  console.log(`  → http://${lanIp}:${PORT}`);
} else {
  console.log('  (IP شبکه پیدا نشد — از IP وای‌فای لپ‌تاپ در تنظیمات ویندوز استفاده کنید)');
}
console.log('');
