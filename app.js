const http = require('http');

const route = require('./route');

const server = http.createServer(route.handler);

server.listen(3000);