'use strict';

const http = require('http');
const { Socket } = require('net');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World\n');
// })

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}`);
// })

// server.on('error', err => {
//     if (err.code === 'EACCES') {
//         console.log(`No access to port ${port}`);
//     }
// })

const user = {
    name: 'Marcus Reeze',
    city: 'Rome',
    profession: 'emperor',
}

const server = http.createServer((req, res) => {
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'text/plain');
    res.end(`User ${user.name} said (Java is a crap) and chiao from ${user.city}`);
})

server.on('clientError', (err, socket) => {
    if (err.code === 'EACCES') {
       socket.end('HTTP/1.1 400 Bad Request \r\n\r\n');
    }
})

server.listen(3000)