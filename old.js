process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const net = require('net');
const tls = require('tls');
const fs = require('fs');

let packet0 = Buffer.from([5, 1, 0]);

let packet1_a = Buffer.from([5, 1, 0, 3]);
let packet1_b = Buffer.from("r5---sn-n4v7knl6.googlevideo.com");
packet1_b = Buffer.concat([Buffer.from([packet1_b.length]), packet1_b]);
let packet1_c = Buffer.from([1, 187]);

let packet1 = Buffer.concat([packet1_a, packet1_b, packet1_c]);

const client = net.createConnection({ port: 1080, host: "localhost" }, () => {
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
            let n = 0;
            tlsclient.on('data', (res) => {
                console.log(res.toString());
            })

            tlsclient.on('end', () => {
                console.log('end');
            })

            tlsclient.write("GET /videoplayback?signature=D74CE65B3C60FDFD6C241F1533BC5BC921A9D628.B53F481B2B75C66E3C676D26747EE296584C3CE2&mm=31%2C26&mn=sn-n4v7knl6%2Csn-a5msen7z&ipbits=0&ratebypass=yes&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ip=2600%3A3c01%3A%3Af03c%3A91ff%3Afe52%3Af02c&mime=video%2Fmp4&requiressl=yes&source=youtube&txp=5533432&lmt=1543053950745060&dur=190.984&expire=1552633816&mt=1552612132&mv=m&id=o-ABMF64QpONLMdzSnvq1hT2GXLBlXK_oGptclw2szS-Z0&ei=ePuKXJbHE8mPkwam5ZuoCQ&ms=au%2Conr&c=WEB&pl=32&key=yt6&itag=22&initcwndbps=435000&fvip=5 HTTP/1.1\nHost: r5---sn-n4v7knl6.googlevideo.com\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\n\n");
        })
    }
})

client.on('end', () => {
    console.log('disconnected from server');
})
