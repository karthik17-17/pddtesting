const http = require('http');
const https = require('https');

const TARGET_URL = process.env.TEST_URL || 'https://neurostay-ai.onrender.com';
const CONCURRENT_USERS = parseInt(process.env.CONCURRENT_USERS || '100', 10);
const DURATION_SECONDS = parseInt(process.env.DURATION_SECONDS || '60', 10);

console.log(`=======================================================`);
console.log(`🚀 NEUROSTAY AI - BASELINE / LOAD TESTING SUITE`);
console.log(`=======================================================`);
console.log(`• Target Server URL: ${TARGET_URL}`);
console.log(`• Concurrent Virtual Users (VUs): ${CONCURRENT_USERS}`);
console.log(`• Duration: ${DURATION_SECONDS} seconds (1 minute)`);
console.log(`• Starting baseline test... Please wait...\n`);

const isHttps = TARGET_URL.startsWith('https');
const agent = new (isHttps ? https.Agent : http.Agent)({
  keepAlive: true,
  maxSockets: CONCURRENT_USERS * 2,
  keepAliveMsecs: 1000,
});

let totalRequests = 0;
const statusCounts = {};
const responseTimes = [];

const endpointStats = {
  health: { count: 0, totalMs: 0, minMs: Infinity, maxMs: 0 },
  search: { count: 0, totalMs: 0, minMs: Infinity, maxMs: 0 },
  login:  { count: 0, totalMs: 0, minMs: Infinity, maxMs: 0 },
};

function sendRequest(endpointName, path, method = 'GET', bodyData = null) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parsed = new URL(`${TARGET_URL}${path}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true',
      'Connection': 'keep-alive',
    };

    let postPayload = null;
    if (bodyData) {
      postPayload = JSON.stringify(bodyData);
      headers['Content-Length'] = Buffer.byteLength(postPayload);
    }

    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: method,
      headers: headers,
      agent: agent,
      timeout: 15000,
    };

    const req = (isHttps ? https : http).request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const latencyMs = Date.now() - startTime;
        totalRequests++;
        responseTimes.push(latencyMs);

        const status = res.statusCode;
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        const stat = endpointStats[endpointName];
        if (stat) {
          stat.count++;
          stat.totalMs += latencyMs;
          if (latencyMs < stat.minMs) stat.minMs = latencyMs;
          if (latencyMs > stat.maxMs) stat.maxMs = latencyMs;
        }

        resolve();
      });
    });

    req.on('error', (err) => {
      totalRequests++;
      statusCounts['ERROR'] = (statusCounts['ERROR'] || 0) + 1;
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      totalRequests++;
      statusCounts['TIMEOUT'] = (statusCounts['TIMEOUT'] || 0) + 1;
      resolve();
    });

    if (postPayload) {
      req.write(postPayload);
    }
    req.end();
  });
}

async function runVirtualUser(userId, stopTime) {
  const requestsList = [
    { name: 'health', path: '/api/health', method: 'GET' },
    { name: 'search', path: '/api/serpapi/hotels', method: 'POST', body: { query: 'Chennai' } },
    { name: 'login',  path: '/api/auth/login', method: 'POST', body: { email: 'test@example.com', password: 'password123' } },
  ];

  let requestIndex = userId % requestsList.length;

  while (Date.now() < stopTime) {
    const reqInfo = requestsList[requestIndex];
    await sendRequest(reqInfo.name, reqInfo.path, reqInfo.method, reqInfo.body);
    requestIndex = (requestIndex + 1) % requestsList.length;
    // Pace virtual users slightly to mimic 100 realistic active users
    await new Promise(r => setTimeout(r, 100));
  }
}

async function startTest() {
  const startTime = Date.now();
  const stopTime = startTime + (DURATION_SECONDS * 1000);

  const userWorkers = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    userWorkers.push(runVirtualUser(i, stopTime));
  }

  const ticker = setInterval(() => {
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);
    const currentRps = (totalRequests / Math.max(1, elapsedSec)).toFixed(1);
    process.stdout.write(`\r⏱️  Elapsed: ${elapsedSec}s / ${DURATION_SECONDS}s | Completed Requests: ${totalRequests} | Current RPS: ${currentRps} req/sec`);
  }, 1000);

  await Promise.all(userWorkers);
  clearInterval(ticker);
  console.log(`\n\n✅ Load test completed in ${(Date.now() - startTime) / 1000} seconds.`);

  responseTimes.sort((a, b) => a - b);
  const minTime = responseTimes.length ? responseTimes[0] : 0;
  const maxTime = responseTimes.length ? responseTimes[responseTimes.length - 1] : 0;
  const sumTime = responseTimes.reduce((acc, v) => acc + v, 0);
  const avgTime = responseTimes.length ? (sumTime / responseTimes.length).toFixed(1) : 0;
  
  const p50 = responseTimes.length ? responseTimes[Math.floor(responseTimes.length * 0.50)] : 0;
  const p95 = responseTimes.length ? responseTimes[Math.floor(responseTimes.length * 0.95)] : 0;
  const p99 = responseTimes.length ? responseTimes[Math.floor(responseTimes.length * 0.99)] : 0;

  const actualDurationSec = (Date.now() - startTime) / 1000;
  const rps = (totalRequests / actualDurationSec).toFixed(2);

  console.log(`\n=======================================================`);
  console.log(`📊 BASELINE / LOAD TEST RESULTS (100 CONCURRENT VUs)`);
  console.log(`=======================================================`);
  console.log(`• Target Host: ${TARGET_URL}`);
  console.log(`• Concurrent Virtual Users (VUs): ${CONCURRENT_USERS}`);
  console.log(`• Total Requests Sent: ${totalRequests.toLocaleString()}`);
  console.log(`• Requests Per Second (RPS): ${rps} req/sec`);
  console.log(`-------------------------------------------------------`);
  console.log(`📈 STATUS CODE BREAKDOWN:`);
  Object.keys(statusCounts).forEach(code => {
    const count = statusCounts[code];
    const pct = ((count / totalRequests) * 100).toFixed(1);
    console.log(`  - Status ${code}: ${count.toLocaleString()} requests (${pct}%)`);
  });
  console.log(`-------------------------------------------------------`);
  console.log(`⏱️ RESPONSE TIME (LATENCY) STATS:`);
  console.log(`  - Minimum Response Time (Fastest): ${minTime} ms`);
  console.log(`  - Average Response Time: ${avgTime} ms`);
  console.log(`  - Median (p50): ${p50} ms`);
  console.log(`  - 95th Percentile (p95): ${p95} ms`);
  console.log(`  - 99th Percentile (p99): ${p99} ms`);
  console.log(`  - Maximum Response Time (Slowest): ${maxTime} ms (${(maxTime / 1000).toFixed(2)}s)`);
  console.log(`-------------------------------------------------------`);
  console.log(`📍 ENDPOINT LATENCY BREAKDOWN:`);

  Object.keys(endpointStats).forEach((ep) => {
    const s = endpointStats[ep];
    const epAvg = s.count > 0 ? (s.totalMs / s.count).toFixed(1) : 0;
    const epMin = s.minMs === Infinity ? 0 : s.minMs;
    console.log(`  [${ep.toUpperCase()}]:`);
    console.log(`    - Requests Handled: ${s.count.toLocaleString()}`);
    console.log(`    - Avg Latency: ${epAvg} ms | Min: ${epMin} ms | Max: ${s.maxMs} ms`);
  });
  console.log(`=======================================================\n`);
}

startTest();
