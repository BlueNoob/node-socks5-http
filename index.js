// https://r1---sn-q4flrney.googlevideo.com/videoplayback?itag=22&ip=2600%3A3c00%3A%3Af03c%3A91ff%3Afe52%3Af0d3&ms=au%2Crdu&mv=m&mt=1552548299&ratebypass=yes&requiressl=yes&id=o-AMYdu6QQpFj74qtiqTv2-HmL3-9r45xyg-H3dCLx_aUQ&mn=sn-q4flrney%2Csn-q4fl6ner&mm=31%2C29&signature=B9359865AF899037A7D6EF52B9D2164EA271D547.9674F3AA5342C6DF484E7228785A351D6F376A5F&fvip=1&c=WEB&initcwndbps=883750&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&key=yt6&mime=video%2Fmp4&source=youtube&expire=1552570022&ipbits=0&dur=242.857&pl=49&lmt=1471699166530755&ei=RgKKXKa4FpKQiwT52pXIBg

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const net = require('net');
const tls = require('tls');
const fs = require('fs');

let packet0 = Buffer.from([5, 1, 0]);

let packet1_a = Buffer.from([5, 1, 0, 3]);
let packet1_b = Buffer.from("r1---sn-npoeenee.googlevideo.com");
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

            
            const mp4 = fs.createWriteStream("./hello.mp4");
            let n = 0;
            tlsclient.on('data', (res) => {
                n++;
                if(n === 1) return;
                mp4.write(res);
            })

            tlsclient.on('end', () => {
                mp4.end();
            })

            tlsclient.write("GET /videoplayback?itag=22&ip=2600%3A3c00%3A%3Af03c%3A91ff%3Afe52%3Af0d3&ratebypass=yes&requiressl=yes&id=o-AMYdu6QQpFj74qtiqTv2-HmL3-9r45xyg-H3dCLx_aUQ&signature=3F3A72A6627B39B174670560997FB4119F2252BD.6A3EE31C02511E76A977D6E4B2C978EE0FC70299&fvip=1&c=WEB&sparams=dur,ei,expire,id,ip,ipbits,ipbypass,itag,lmt,mime,mip,mm,mn,ms,mv,pl,ratebypass,requiressl,source&key=cms1&mime=video%2Fmp4&source=youtube&expire=1552570022&ipbits=0&dur=242.857&pl=20&lmt=1471699166530755&ei=RgKKXKa4FpKQiwT52pXIBg&rm=sn-q4fele7e&req_id=2af09335e739a3ee&ipbypass=yes&mip=23.101.4.188&redirect_counter=2&cm2rm=sn-i3bse76&cms_redirect=yes&mm=34&mn=sn-npoeenee&ms=ltu&mt=1552553140&mv=m HTTP/1.1\nHost: r1---sn-npoeenee.googlevideo.com\nUser-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36\n\n");
        })
    }
})

client.on('end', () => {
    console.log('disconnected from server');
})
