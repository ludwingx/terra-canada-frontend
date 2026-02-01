// Script to generate environment files from environment variables during build
// Used by Vercel and other CI/CD platforms

const fs = require('fs');
const path = require('path');

const API_BASE_URL = process.env.API_BASE_URL;
const DEBUG_API = process.env.DEBUG_API === 'true';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Generate public/assets/env.js (runtime config)
const envJsContent = `window.__env = window.__env || {};
window.__env = {
  API_BASE_URL: "${API_BASE_URL}",
  DEBUG_API: ${DEBUG_API}
};
`;

const envJsDir = path.join(__dirname, 'public', 'assets');
const envJsFile = path.join(envJsDir, 'env.js');

if (!fs.existsSync(envJsDir)) {
  fs.mkdirSync(envJsDir, { recursive: true });
}
fs.writeFileSync(envJsFile, envJsContent);
console.log('✅ Generated public/assets/env.js');

// Generate src/environments/environment.ts (Angular build config)
const envTsContent = `export const environment = {
  production: ${PRODUCTION},
  apiUrl: '${API_BASE_URL}'
};
`;

const envTsDir = path.join(__dirname, 'src', 'environments');
const envTsFile = path.join(envTsDir, 'environment.ts');

if (!fs.existsSync(envTsDir)) {
  fs.mkdirSync(envTsDir, { recursive: true });
}
fs.writeFileSync(envTsFile, envTsContent);
console.log('✅ Generated src/environments/environment.ts');

console.log('   API_BASE_URL:', API_BASE_URL);
