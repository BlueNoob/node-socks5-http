const socks5http = require('./socks5http');
const fs = require('fs');

socks5http.download("https://r3---sn-ab5szn7r.googlevideo.com/videoplayback?mime=video%2Fmp4&initcwndbps=266250&key=yt6&txp=5535432&requiressl=yes&dur=356.426&c=WEB&sparams=dur%2Cei%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&itag=22&lmt=1551718300467960&expire=1552691437&ip=2600%3A3c03%3A%3Af03c%3A91ff%3Afe13%3A8670&ipbits=0&ratebypass=yes&source=youtube&mm=31%2C29&mn=sn-ab5szn7r%2Csn-ab5l6nsk&mt=1552669699&mv=m&pl=32&id=o-AFjUSw18FE-tLlSpRfNCr6LutG0oKkGqe7IT9iaenEU6&ei=jdyLXJPGF-S48gSr_5roCg&ms=au%2Crdu&signature=92BE863DB84B5AD063AE32F713C17A6458699820.398D3EF0C0EC5996CA42EF171BAF0DD378180C21&fvip=4", (res) => {
    let n = 0;
    const mp4 = fs.createWriteStream("./cc.mp4")
    res.on('data', (bin) => {
        n++;
        if(n === 1) return;
        mp4.write(bin);
        console.log('...');
    })
    res.on('end', () => {
        mp4.close();
    })
});