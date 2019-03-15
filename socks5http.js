const net = require('net');
const tls = require('tls');
const EventEmitter = require('events');
const { ssPacket, desPacket } = require('./packet');

const socks5http = {
    ssPort: 1080,
    ssHost: "localhost",
    setSocks5(port, host) {
        this.ssPort = port;
        this.ssHost = host;
    },
    get(url, cb) {
        const a = this;
        const resEmitter = new EventEmitter();
        cb(resEmitter);
        const tcpSocket = net.createConnection({ port: a.ssPort, host: a.ssHost}, () => {
            tcpSocket.write(ssPacket);
            tcpSocket.once('data', (res) => {
                if(res.length === 2 && res[1] === 0) {
                    const [pkt, { protocol, host, path }] = desPacket(url);
                    tcpSocket.write(pkt);
                    tcpSocket.once('data', (res) => {
                        if(res.length === 10 && res[1] === 0) {
                            if(protocol === "https:") {
                                const tlsSocket = tls.connect({ socket: tcpSocket, rejectUnauthorized: false }, () => {
                                    tlsSocket.on('data', (res) => {
                                        resEmitter.emit('data', res);
                                    })
                                    tlsSocket.on('end', () => {
                                        resEmitter.emit('end', null);
                                        tlsSocket.destroy();
                                        tcpSocket.destroy();
                                    })
                                    tlsSocket.write("GET " + path + " HTTP/1.1\n" + "Host: " + host + "\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\nConnection: close\n\n")
                                })
                            }else {
                                tcpSocket.on('data', (res) => {
                                    resEmitter.emit('data', res);
                                })
                                tcpSocket.on('end', () => {
                                    resEmitter.emit('end', null);
                                    tcpSocket.destroy();
                                })
                                tcpSocket.write("GET " + path + " HTTP/1.1\n" + "Host: " + host + "\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\nConnection: close\n\n")
                            }
                        }
                    })
                }
            })
        })
    },
    download(url, cb) {
        const a = this;
        const resEmitter = new EventEmitter();
        cb(resEmitter);
        const tcpSocket = net.createConnection({ port: a.ssPort, host: a.ssHost}, () => {
            tcpSocket.write(ssPacket);
            tcpSocket.once('data', (res) => {
                if(res.length === 2 && res[1] === 0) {
                    const [pkt, { protocol, host, path }] = desPacket(url);
                    tcpSocket.write(pkt);
                    tcpSocket.once('data', (res) => {
                        if(res.length === 10 && res[1] === 0) {
                            if(protocol === "https:") {
                                const tlsSocket = tls.connect({ socket: tcpSocket, rejectUnauthorized: false }, () => {
                                    tlsSocket.once('data', (res) => {
                                        const resText = res.toString();
                                        const s = +resText.substring(9, 12);
                                        if(s === 301 || s === 302) {
                                            const location = resText.split("\r\n").find(x => x.startsWith("Location")).substr(10);
                                            a.get(location, (res) => {
                                                res.on('data', (res) => {
                                                    resEmitter.emit('data', res);
                                                })
                                                res.on('end', () =>{
                                                    resEmitter.emit('end', null);
                                                    tlsSocket.destroy();
                                                    tcpSocket.destroy();
                                                })
                                            })
                                        }else {
                                            a.get(url, (res) => {
                                                res.on('data', (res) => {
                                                    resEmitter.emit('data', res);
                                                })
                                                res.on('end', () =>{
                                                    resEmitter.emit('end', null);
                                                    tlsSocket.destroy();
                                                    tcpSocket.destroy();
                                                })
                                            })
                                        }
                                    })
                                    tlsSocket.write("GET " + path + " HTTP/1.1\n" + "Host: " + host + "\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\nConnection: close\n\n")
                                })
                            }else {
                                tcpSocket.once('data', (res) => {
                                    const resText = res.toString();
                                    const s = +resText.substring(9, 12);
                                    if(s === 301 || s === 302) {
                                        const location = resText.split("\r\n").find(x => x.startsWith("Location")).substr(10);
                                        a.get(location, (res) => {
                                            res.on('data', (res) => {
                                                resEmitter.emit('data', res);
                                            })
                                            res.on('end', () =>{
                                                resEmitter.emit('end', null);
                                                tcpSocket.destroy();
                                            })
                                        })
                                    }else {
                                        a.get(url, (res) => {
                                            res.on('data', (res) => {
                                                resEmitter.emit('data', res);
                                            })
                                            res.on('end', () =>{
                                                resEmitter.emit('end', null);
                                                tcpSocket.destroy();
                                            })
                                        })
                                    }
                                })
                                tcpSocket.write("GET " + path + " HTTP/1.1\n" + "Host: " + host + "\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\nConnection: close\n\n")
                            }
                        }
                    })
                }
            })
        })
    }
}

module.exports = socks5http;