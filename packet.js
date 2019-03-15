const url = require('url');
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

module.exports.ssPacket = Buffer.from([5, 1, 0]);

module.exports.desPacket = (u) => {
    const info = url.parse(u);
    if(ipRegex.test(info.host)) {
        const p1_a = Buffer.from([5, 1, 0, 1]);
        let p1_b = Buffer.from(info.host.split(".").map(x => Number(x)));
        const port = info.port?Number(info.port):80;
        const arr = new Uint16Array(1);
        arr[0] = port;
        const p1_c = Buffer.from(arr.buffer).reverse();
        return [Buffer.concat([p1_a, p1_b, p1_c]), info];
    }else {
        const p1_a = Buffer.from([5, 1, 0, 3]);
        let p1_b = Buffer.from(info.host);
        p1_b = Buffer.concat([Buffer.from([p1_b.length]), p1_b]);
        const port = info.port?Number(info.port):info.protocol === "https:"?443:80;
        const arr = new Uint16Array(1);
        arr[0] = port;
        const p1_c = Buffer.from(arr.buffer).reverse();
        return [Buffer.concat([p1_a, p1_b, p1_c]), info];
    }
}