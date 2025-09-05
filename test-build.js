#!/usr/bin/env node

/**
 * اسکریپت تست Build Next.js
 * این اسکریپت برای تست build کردن Next.js استفاده می‌شود
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 تست Build Next.js...\n');

async function testBuild() {
  return new Promise((resolve, reject) => {
    console.log('🔧 شروع Build...');
    
    const child = spawn('npm', ['run', 'build'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Build موفق بود!');
        resolve();
      } else {
        console.log('\n❌ Build ناموفق بود (کد:', code, ')');
        reject(new Error(`Build failed with code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      console.log('\n❌ خطا در Build:', error.message);
      reject(error);
    });
  });
}

// اجرای تست
testBuild().catch(console.error);
