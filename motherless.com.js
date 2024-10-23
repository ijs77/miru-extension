// ==MiruExtension==
// @name         Motherless
// @version      v0.0.1
// @author       javxsub.com
// @lang         en
// @license      MIT
// @icon         https://motherless.com/favicon.ico
// @package      motherless.com
// @type         bangumi
// @webSite      https://motherless.com
// @nsfw         true
// ==/MiruExtension==

export default class extends Extension {

  async req(url) {
    const res = await this.request("", {
      "Miru-Url": url,
    });
    return url;
  }

  async latest(page) {
    // Latest updates
    const paddedPage = page.toString();
    const url = `/videos/recent?page=${paddedPage}`;
    const res = await this.request(url);
    const videoList = await this.querySelectorAll(res, "div.thumb-container");
    const videos = [];

    for (const element of videoList) {
        const html  = await element.content;
        const title = await this.getAttributeText(html,"div.captions > a","title");
        const url   = await this.getAttributeText(html,"a","href");
        const cover = await this.getAttributeText(html,"img.static","src");
        const updt  = await this.getAttributeText(html,"span.hits > span").text;
    
        if (title && url && cover) {
            videos.push({
                title: title,
                url: url,
                cover: cover.replace(/.*\//, 'https://i2.wp.com/motherless.com/thumbs/'),
                update: updt
            });
        }
    }

    return videos;
  }

  async search(kw, page) {
    // Search
    const paddedPage = page.toString();
    const url = `/term/videos/${kw}?sort=date&page=${paddedPage}`;
    const res = await this.request(url);
    const videoList = await this.querySelectorAll(res, "div.thumb-container");
    const videos = [];

    for (const element of videoList) {
        const html  = await element.content;
        const title = await this.getAttributeText(html,"div.captions > a","title");
        const url   = await this.getAttributeText(html,"a","href");
        const cover = await this.getAttributeText(html,"img.static","src");
  
      if (title && url && cover) {
          videos.push({
              title: title,
              url: url,
              cover: cover.replace(/.*\//, 'https://i2.wp.com/motherless.com/thumbs/'),
          });
      }
    }
    return videos;
  }

  async detail(url) {
    // Details
    const strippedpath = url.replace(/^(https?:\/\/)?([^\/]+)(\/.*)?/, '$3');
    const res   = await this.request(strippedpath);
    const title = await this.querySelector(res, 'div.media-meta-title > h1').text;
    const cover = await this.querySelector(res, 'video.video-js').getAttributeText("data-poster");
    const desc  = await this.querySelector(res, 'meta[name="keywords"]').getAttributeText("content");
    const user  = await this.querySelector(res, 'span.username').text;
    const mp4   = await this.querySelector(res, 'source[type="video\/mp4"]').getAttributeText("src");

    return {
      title: title.trim(),
      cover: cover.replace(/.*\//, 'https://i2.wp.com/motherless.com/thumbs/'),
      desc,
      episodes: [
        {
          title: user.trim(),
          urls: [{
            name: "Play",
            url: mp4,
          }]
        },
      ],
    };
  }


  async watch(url) {
    return {
      type: "mp4",
      url: url || "",
    };
  }
}
