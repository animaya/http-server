'use strict';

const http = require('http');

const user = {
    name: 'Tomas',
    age: 32,
}

const routing = {
    '/': 'Welcome to homepage',
    '/user': user,
    '/user/name': () => user.name.toUpperCase(),
    '/user/age': () => user.age,
    '/hello': {hello: 'world', andArray: [1,2,3,4,5,6]},
    '/api/method1': (req, res, callback) => {
        console.log(req.url + " " + res.statusCode);
        callback({status: res.statusCode})
    }
    
}

const types = {
    object: ([data], callback) => callback(JSON.stringify(data)),
   
    undefined: (args, callback) => callback('not found'),
    function: ([fn, req, res], callback) => {
        if (fn.length === 3) fn(req, res,callback)
        else callback(JSON.stringify(fn(req, res)))
    }
}

const matching = [];
for (const key in routing) {
    if (key.includes("*")) {
        const rx = new RegExp(key.replace('*', '(.*)'));
        const route = routing[key];
        matching.push([rx,route]);
        delete routing[key];

    }
}

const router = client => {
    let par;
    let route  = routing[client.req.url];
    if (!route) {
        for (let i = 0; i < matching.length; i++) {
            const rx = matching[i];
            par = client.req.url.match[rx[0]];
            if (par) {
                par.shift();
                route = rx[1];
                break;
            }
        }
    }
    const type = typeof route;
    const renderer = types[type];
    return renderer(route, par, client);
}

const serve = (data, req, res) => {
    const type = typeof data;
    if (typeof data === 'string') {
        return res.end(data);
    }
    const serializer = types[type];
    serializer([data,req, res], data => serve(data, req, res))
}

http.createServer((req, res) => {
    const data = routing[req.url];
    serve(data, req, res);
}).listen(3000)

setInterval(() => user.age++ ,2000)