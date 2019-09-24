async function main(){
    const pu = require('puppeteer');
    var brs = await pu.launch();
    const pg = await brs.newPage();

    await pg.goto('https://www.instagram.com/hot.sexy.asian.girls/');

    const f = require('fs');
    if (!f.existsSync('./result')){
        f.mkdirSync('./result');
    }
    const srcs = await pg.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('article img'));
        const srcs = imgs.map(i => i.getAttribute('srcset'));
        return srcs;
    })
    await brs.close();
    for (let i = 0; i < srcs.length; i++){
        const dl = require('image-downloader');
        const sr = srcs[i];
        const s = sr.split(',');
        const rs = s[s.length - 1].split(' ')[0];
        dl({url: rs, dest:'./result'});
    }
}

main();