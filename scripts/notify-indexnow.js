#!/usr/bin/env node
/**
 * notify-indexnow.js — SpritChecker.de
 * Submits top canonical URLs to IndexNow (Bing, Yandex, Seznam, Naver)
 * 
 * Cap: 100 URLs per run, 2 runs/day (04:30 and 18:30) = exactly 200 URLs/day.
 * - Morning batch (04:30): Home + Pillar pages + top 95 cities (overview)
 * - Evening batch (18:30): Top 100 cities (diesel pages)
 */

import cities from '../src/data/german_cities.json' with { type: 'json' };

const HOST = 'spritchecker.de';
const SITE_URL = `https://${HOST}`;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'c491fade6de847b39a3bfce7e3e018d9';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const BING_API_KEY = process.env.BING_API_KEY || '4f25c5dc3491468f8459b92c21bb3ac1';

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://yandex.com/indexnow',
];

// 1. High priority overview URLs
const morningUrls = [
  `${SITE_URL}/`,
  `${SITE_URL}/spritpreise/diesel/`,
  `${SITE_URL}/spritpreise/super-e10/`,
  `${SITE_URL}/spritpreise/super-e5/`,
  `${SITE_URL}/billig-tanken/`,
  ...cities.slice(0, 95).map(c => `${SITE_URL}/tankstellen/stadt-${c.slug}/`),
];

// 2. High priority diesel URLs
const eveningUrls = cities.slice(0, 100).map(c => `${SITE_URL}/tankstellen/stadt-${c.slug}/diesel/`);

// Determine batch
const args = process.argv.slice(2);
const batchArg = args.find(a => a.startsWith('--batch='));
let selectedUrls = morningUrls;

if (batchArg) {
  const batchNum = parseInt(batchArg.split('=')[1], 10);
  selectedUrls = batchNum === 2 ? eveningUrls : morningUrls;
} else {
  const currentHour = new Date().getHours();
  selectedUrls = currentHour >= 12 ? eveningUrls : morningUrls;
}

async function main() {
  console.log(`[IndexNow] SpritChecker.de — Pinging ${selectedUrls.length} URLs (Host: ${HOST})`);
  console.log(`[IndexNow] First URL: ${selectedUrls[0]}`);
  console.log(`[IndexNow] Last URL: ${selectedUrls[selectedUrls.length - 1]}`);

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: selectedUrls,
  };

  // Submit to IndexNow
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(body),
      });
      console.log(`[IndexNow] ${endpoint} -> status ${res.status}`);
    } catch (err) {
      console.error(`[IndexNow] Error on ${endpoint}:`, err.message);
    }
  }

  // Submit to Bing Webmaster Tools API
  if (BING_API_KEY) {
    try {
      const bingEndpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${BING_API_KEY}`;
      const bingRes = await fetch(bingEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          siteUrl: `${SITE_URL}/`,
          urlList: selectedUrls,
        }),
      });
      console.log(`[BingAPI] SubmitUrlBatch status: ${bingRes.status}`);
    } catch (err) {
      console.error('[BingAPI] Error:', err.message);
    }
  }
}

main();
