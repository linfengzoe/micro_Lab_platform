const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.glb': 'model/gltf-binary',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf'
};

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*'
  });
  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', (chunk) => (buf += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(buf || '{}'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

function callDeepSeek(command) {
  return new Promise((resolve, reject) => {
    if (!API_KEY) {
      reject(new Error('Missing DEEPSEEK_API_KEY'));
      return;
    }

    const payload = JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            '你是指令解析器。只输出JSON，不要解释。格式: {"actions":[{"color":"blue|red|yellow|green|purple","targetBin":"blue|red|yellow|green|purple|null"}],"reply":"中文自然语言反馈"}。'
        },
        { role: 'user', content: command }
      ]
    });

    const endpoint = new URL('/v1/chat/completions', BASE_URL);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Authorization: `Bearer ${API_KEY}`
      }
    };

    const req = https.request(endpoint, options, (res) => {
      let raw = '';
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`DeepSeek error: ${res.statusCode}`));
          return;
        }
        try {
          const data = JSON.parse(raw);
          const content =
            data &&
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
              ? data.choices[0].message.content.trim()
              : '';
          resolve(content);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  if (parsed.pathname === '/api/interpret' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const command = (body.command || '').toString();
      if (!command) {
        sendJson(res, 400, { error: 'Missing command' });
        return;
      }

      const llmText = await callDeepSeek(command);
      let parsedJson = null;
      try {
        const cleaned = llmText
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();
        parsedJson = JSON.parse(cleaned);
      } catch (err) {
        parsedJson = null;
      }

      const actions = parsedJson && Array.isArray(parsedJson.actions) ? parsedJson.actions : [];
      const reply = parsedJson && parsedJson.reply ? parsedJson.reply : '';
      sendJson(res, 200, { actions, reply });
    } catch (err) {
      sendJson(res, 500, { error: err.message || 'LLM request failed' });
    }
    return;
  }

  if (parsed.pathname === '/api/health' && req.method === 'GET') {
    if (!API_KEY) {
      sendJson(res, 200, { status: 'offline', reason: 'missing_key' });
      return;
    }
    sendJson(res, 200, { status: 'online' });
    return;
  }

  let filePath = path.join(__dirname, parsed.pathname || '/');
  if (parsed.pathname === '/' || parsed.pathname === '') {
    filePath = path.join(__dirname, 'system.html');
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': type,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
