const http = require('http');

function makeReq(method, path, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 3002, path, method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const req = http.request(opts, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        resolve({ status: res.statusCode, headers: res.headers, raw });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  // Login
  const login = await makeReq('POST', '/api/auth/dev-login', null, '{}');
  const token = JSON.parse(login.raw.toString()).token;
  
  // Get messages
  const msgs = await makeReq('GET', '/api/chats/1/messages', token);
  console.log('Status:', msgs.status);
  console.log('Content-Type:', msgs.headers['content-type']);
  
  // Show raw bytes of first text field
  const text = msgs.raw.toString('utf8');
  const firstText = text.match(/"text":"([^"]+)"/);
  if (firstText) {
    const val = firstText[1];
    const buf = Buffer.from(val, 'utf8');
    console.log('First text value:', val);
    console.log('Bytes:', buf.toString('hex'));
    console.log('Expected hex for Привет: d09fd180d0b8d0b2d0b5d182');
    console.log('Match:', buf.toString('hex') === 'd09fd180d0b8d0b2d0b5d182' ? 'YES' : 'NO');
  }
  
  process.exit(0);
}
run();
