/* Servidor estático mínimo para previsualizar la landing en local.
   Uso:  node server.js   ->   http://localhost:5197/                */
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon'
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(root, p);
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(5197, () => console.log('Innovar Espacios RF en http://localhost:5197/'));
