const rp = require('request-promise'), //进入request-promise模块
  fs = require('fs'), //进入fs模块
  cheerio = require('cheerio') //进入cheerio模块
let downloadPath, depositPath

module.exports = {
  // 获取页面
  async getPage(url) {
    const data = {
      url,
      res: await rp({ url })
    }
    return data
  },
  init(path) {
    depositPath = path
  },
  // 获取url(首页图片链接List,并且返回图片的atl用作文件夹名字)
  getUrl(data) {
    let list = []
    const $ = cheerio.load(data.res)
    $('#pins li').each(async (i, e) => {
      const obj = {
        url: e.children[0].attribs.href,
        name: e.children[0].children[0].attribs.alt
      }
      list.push(obj)
      /* obj的内容为
        * obj: {
        *  url: 'http://www.mzitu.com/123629',
        *  name: '丰满美人Jona春色大好 惊天巨乳让性感加分'
        * }
        */
    })
    return list
  },
  /**
   * 新建文件夹
   * 已有文件夹的话,return false；没有文件夹的话，会创建文件夹，并返回true
   * @param {any} obj
   * @returns
   */
  mkdir(obj) {
    downloadPath = depositPath + obj.name
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath)
      console.log(`${obj.name}文件夹创建成功`)
      return true
    } else {
      console.log(`${obj.name}文件夹已经存在`)
      return false
    }
  },
  /**
   * 获取当前页有多少页，每一页有一张图片
   * 返回总页数
   * @param {any} res
   * @param {any} name
   * @returns
   */
  getImagesNum(res, name) {
    if (res) {
      let $ = cheerio.load(res)
      let len = $('.pagenavi')
        .find('a')
        .find('span').length
      if (len === 0) {
        fs.rmdirSync(`${depositPath}${name}`)
        return 0
      }
      let pageIndex = $('.pagenavi')
        .find('a')
        .find('span')[len - 2].children[0].data
      return pageIndex
    }
  },
  /**
   * 下载图片
   *
   * @param {any} data
   * @param {any} index
   */
  async downloadImage(data, index) {
    if (data.res) {
      var $ = cheerio.load(data.res)
      if ($('.main-image').find('img')[0]) {
        let imgSrc = $('.main-image').find('img')[0].attribs.src
        let headers = {
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Cache-Control': 'no-cache',
          Host: 'i.meizitu.net',
          Pragma: 'no-cache',
          'Proxy-Connection': 'keep-alive',
          Referer: data.url,
          'Upgrade-Insecure-Requests': 1,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36'
        } //反防盗链，主要是 Referer的设置
        await rp({
          url: imgSrc,
          resolveWithFullResponse: true,
          headers
        }).pipe(fs.createWriteStream(`${downloadPath}/${index}.jpg`))
        console.log(`${downloadPath}/${index}.jpg下载成功`)
      } else {
        console.log(`${downloadPath}/${index}.jpg加载失败`)
      }
    }
  }
}
