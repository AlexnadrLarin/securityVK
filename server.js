const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
	console.log(`Проксирование запроса ${req.method} ${req.url}`);

	const { method, url, headers } = req;

	if (!headers.host) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end('Отсутствует заголовок "host"');
		return;
	}

	const { hostname, port: targetPort, pathname } = new URL(url);

	const options = {
		hostname,
		port: targetPort || 80,
		path: pathname,
		method,
		headers: {
			...headers,
			host: hostname
		}
	};

	const proxyReq = http.request(options, (proxyRes) => {
		res.writeHead(proxyRes.statusCode, proxyRes.headers);
		proxyRes.pipe(res, { end: true });
	});

	proxyReq.on('error', (err) => {
		console.error('Ошибка при обработке запроса к целевому серверу:', err);
		res.writeHead(500, { 'Content-Type': 'text/plain' });
		res.end('Внутренняя ошибка сервера');
	});

	req.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
	console.log('Сервер запущен на порту: ' + server.address().port);
});