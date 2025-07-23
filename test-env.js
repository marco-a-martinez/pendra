// Test environment variables
require('dotenv').config({ path: '.env.local' });

console.log('Environment Variables Test');
console.log('=========================\n');

console.log('Checking .env.local file...');
const fs = require('fs');
if (fs.existsSync('.env.local')) {
  console.log('✓ .env.local file exists');
  const content = fs.readFileSync('.env.local', 'utf8');
  console.log('\nFile contents:');
  console.log('--------------');
  console.log(content);
} else {
  console.log('✗ .env.local file NOT found');
}

console.log('\nEnvironment variables loaded:');
console.log('-----------------------------');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT SET');

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n✅ All environment variables are properly set!');
  console.log('\nNext steps:');
  console.log('1. Add these same variables to Vercel:');
  console.log('   https://vercel.com/marco-a-martinez/pendra/settings/environment-variables');
  console.log('\n2. The variables to add are:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL = ' + process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY = ' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('\n3. After adding, click "Redeploy" on your latest deployment');
} else {
  console.log('\n❌ Some environment variables are missing!');
}
