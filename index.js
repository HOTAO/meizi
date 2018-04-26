const Meizi = require('./model.js'),
  basicPath = 'http://www.mzitu.com/hot/',
  depositPath = '/Users/GeekBean/Documents/box/MySelf/meizi/images2/' //存放照片的地址

let page = 1,
  maxPage = 10

const main = async url => {
  let list = [],
    index = 0 // 当前页itme坐标
  const data = await Meizi.getPage(url)
  list = Meizi.getUrl(data)
  downLoadImages(list, index)
}

const downLoadImages = async (list, index) => {
  // 如果是最后一个item，page++
  if (index === list.length) {
    page++
    // 如果page小于maxPage, 那就再来一发
    if (page < maxPage) {
      main(basicPath + page)
    }
    return false
    // 这里return，下面的不执行了
  }
  // 判断是否存在文件夹
  if (Meizi.mkdir(list[index])) {
    let item = await Meizi.getPage(list[index].url), //获取图片url所在的网页
      imageNum = Meizi.getImagesNum(item.res, list[index].name) //获取这组图片的数量
    for (var i = 1; i <= imageNum; i++) {
      let page = await Meizi.getPage(list[index].url + `/${i}`) //遍历获取这组图片每一张所在的网页
      await Meizi.downloadImage(page, i) //下载
    }
    index++
    downLoadImages(list, index) //循环完成下载下一组
  } else {
    index++
    downLoadImages(list, index) //下载下一组
  }
}
Meizi.init(depositPath)
main(basicPath + page)
