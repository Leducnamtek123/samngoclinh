const net = require('net');

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const str = data.toString();
    // Handle PING
    if (/ping/i.test(str)) {
      socket.write('+PONG\r\n');
      return;
    }
    // Handle HELLO
    if (/hello/i.test(str)) {
      socket.write('%7\r\n+server\r\n+redis\r\n+version\r\n+7.0.0\r\n+proto\r\n:3\r\n+mode\r\n+standalone\r\n+role\r\n+master\r\n+modules\r\n*0\r\n');
      return;
    }
    // Handle INFO
    if (/info/i.test(str)) {
      const info = 'redis_version:7.0.0\r\nrole:master\r\n';
      socket.write(`$${info.length}\r\n${info}\r\n`);
      return;
    }
    // Handle CONFIG GET
    if (/config/i.test(str)) {
      socket.write('*0\r\n');
      return;
    }
    // Handle CLIENT
    if (/client/i.test(str)) {
      socket.write('+OK\r\n');
      return;
    }
    // Handle SUBSCRIBE
    if (/subscribe/i.test(str)) {
      socket.write('*3\r\n+subscribe\r\n+channel\r\n:1\r\n');
      return;
    }
    // Default OK
    socket.write('+OK\r\n');
  });

  socket.on('error', () => {});
});

server.listen(6379, '0.0.0.0', () => {
  console.log('Mock Redis server listening on port 6379');
});
