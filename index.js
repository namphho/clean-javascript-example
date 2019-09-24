// var/const/let mot cach tuy tien
// convention của một ngôn ngữ
// code lặp nhiều lần thì bỏ vào function
// text lập nhiều lần thì bỏ vào biến
//comment để giải thích cho những điều mà code nó không giải thích được
const puppeteer = require("puppeteer");
const fs = require("fs");
const downloader = require("image-downloader");

function getLargesImageFromSrcSet(srcSet) {
  const splitedSrc = srcSet.split(",");
  const imageSrc = splitedSrc[splitedSrc.length - 1].split(" ")[0];
  return imageSrc;
}

async function getImagesFromPage(url) {
  //use pupeeter, can not use normal html parser
  var browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const imageSrcSets = await page.evaluate(() => {
    //this might change if instagram change their layout
    const imgs = Array.from(document.querySelectorAll("article img"));
    const srcSetAttribute = imgs.map(i => i.getAttribute("srcset"));
    return srcSetAttribute;
  });
  await browser.close();

  const imageUrls = imageSrcSets.map(srcSet =>
    getLargesImageFromSrcSet(srcSet)
  );
  return imageUrls;
}

async function main() {
  //create forlder
  const resultFolder = "./result";
  if (!fs.existsSync(resultFolder)) {
    fs.mkdirSync(resultFolder);
  }

  const instagUrl = "https://www.instagram.com/hot.sexy.asian.girls/";
  const images = await getImagesFromPage(instagUrl);
  images.forEach(image => {
    downloader({ url: image, dest: "./result" });
  });
}

main();
