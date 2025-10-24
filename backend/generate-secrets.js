#!/usr/bin/env node

/**
 * Generate JWT Secrets for .env file
 * Run: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating JWT Secrets...\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Generate JWT_SECRET
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=');
console.log(jwtSecret);
console.log();

// Generate JWT_REFRESH_SECRET
const jwtRefreshSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_REFRESH_SECRET=');
console.log(jwtRefreshSecret);
console.log();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('✅ Copy các giá trị trên vào file .env của bạn\n');
console.log('⚠️  LƯU Ý:');
console.log('   - Không chia sẻ các secrets này với ai');
console.log('   - Không commit vào git');
console.log('   - Sử dụng secrets khác nhau cho môi trường production\n');
