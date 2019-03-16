# node-socks5-http

## installation
```shell
npm install --save socks5-http
```

## it can only send GET request now
```js
const socks5http = require('socks5-http');

// set socks5 proxy port and host
// 1080 and "localhost" is default
socks5http.setSocks5(1080, "localhost")

// https GET
socks5http.get("https://www.google.com", (res) => {
    let s = "";
    res.on('data', (buffer) => {
        s += buffer.toString();
    });
    res.on('end', () => {
        console.log(s);
    })
})

// http GET
socks5http.get("http://www.google.com", (res) => {
    let s = "";
    res.on('data', (buffer) => {
        s += buffer.toString();
    });
    res.on('end', () => {
        console.log(s);
    })
})
```
