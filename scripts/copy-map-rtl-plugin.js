const fs = require('fs');
const path = require('path');

const src = path.join(
  __dirname,
  '../node_modules/@mapbox/mapbox-gl-rtl-text/dist/mapbox-gl-rtl-text.js'
);
const dest = path.join(__dirname, '../public/map/mapbox-gl-rtl-text.js');

if (!fs.existsSync(src)) {
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
