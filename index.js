const net = require('net');

let packet0 = Buffer.from([5, 1, 0]);


let packet1_a = Buffer.from([5, 1, 0, 3]);
let packet1_b = Buffer.from("www.baidu.com");
packet1_b = Buffer.concat([Buffer.from([packet1_b.length]), packet1_b]); // 要加上域名长度

let packet1_c = Buffer.from([0, 80]);

console.log(packet1_c);
let packet1 = Buffer.concat([packet1_a, packet1_b, packet1_c]);

console.log(packet1_a, packet1_b, packet1_c);



const client = net.createConnection({ port: 1080, host: "localhost" }, () => {
    console.log('connected to server!');
    client.write(packet0);
})

client.on('data', (res) => {
    console.log(res.toString());
    if(res.length === 2 && res[1] === 0) {
        client.write(packet1);
    }
    if(res.length === 10 && res[1] === 0) {
        console.log('send http request...')
        client.write("GET https://www.baidu.com/ HTTP/1.1\n\n");
    }
})



// client.on('end', () => {
//     console.log('disconnected from server');
// })

// else if(res.length === 10 && res[1] === 0) {
//     client.write(Buffer.from(`GET / HTTP/1.1
//                               Host: wwww.baidu.com
//                               Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
//                               Accept-Encoding: gzip, deflate
//                               Accept-Language: zh-CN,zh;q=0.9
//                               Cache-Control: no-cache
//                               Pragma: no-cache
//                               Proxy-Connection: keep-alive
//                               User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36`));
// }