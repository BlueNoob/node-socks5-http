process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const net = require('net');
const tls = require('tls');

let packet0 = Buffer.from([5, 1, 0]);

let packet1_a = Buffer.from([5, 1, 0, 3]);
let packet1_b = Buffer.from("www.google.com");
packet1_b = Buffer.concat([Buffer.from([packet1_b.length]), packet1_b]);
let packet1_c = Buffer.from([1, 187]);

let packet1 = Buffer.concat([packet1_a, packet1_b, packet1_c]);

const client = net.createConnection({ port: 1080, host: "localhost" }, () => {
    console.log('connected to server!');
    client.write(packet0);
})

client.on('data', (res) => {
    if(res.length === 2 && res[1] === 0) {
        client.write(packet1);
    }
    if(res.length === 10 && res[1] === 0) {
        console.log('send http request...')
        const tlsclient = tls.connect({ socket: client }, () => {
            console.log("client upgrade to tls!");

            tlsclient.on('data', (res) => {
                console.log(res.toString());
            })

            tlsclient.write("GET / HTTP/1.1\nHost: www.google.com\nProxy-connection: keep-alive\n\n");
        })
    }
})

client.on('end', () => {
    console.log('disconnected from server');
})
