import apiBash from './config'

// 上传图片
const uploadImg = async (localIds = []) => {
  const promiseArr = []
  wx.showLoading({
    title: ''
  })
  localIds.forEach(item => {
    promiseArr.push(new Promise((resolve, reject) => {
      wx.uploadFile({
        url: `${apiBash.bashUrl}api/file/upload`,
        filePath: item.tempFilePath,
        name: 'file',
        success (res){
          const data = JSON.parse(res.data)
          resolve(data.url)
        },
        fail(e) {
          // 上传失败 5 秒后重新上传一次
          // setTimeout(() => {
          //   uploadFile()
          // }, 5 * 1000)
        }
      })
    }))
  })
  const res = await Promise.all(promiseArr)
  wx.hideLoading()
  return res
}

const getDateObject = (d) => {
  let date
  switch(typeof d) {
    case 'string':
      d = d.replace(/-/g, '/')
      date = new Date(d)
      break
    default: 
      date = d ? new Date(d) : new Date()
  }
  const week = ['日', '一', '二', '三', '四', '五', '六']
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const monthDays = new Date(year, month, 0).getDate()
  return {
    year,
    month,
    day: date.getDate(),
    week: date.getDay(),
    mm: date.getMinutes(),
    hh: date.getHours(),
    ss: date.getSeconds(),
    monthDays,
    weekText: week[date.getDay()],
    date,
    timeStamp: +date,
    toDay: new Date().toDateString() === date.toDateString(),
    chinese: {
      yy_mm: `${year}年${month}月`,
      yy_mm_dd: `${year}年${month}月${date.getDate()}日`
    },
    str: `${fillInStr(year)}-${fillInStr(month)}-${fillInStr(date.getDate())}`
  }
}

// 字符串往前补0
const fillInStr = (str, num = 2) => {
  let s
  switch (typeof str) {
    case 'string':
      s = str
      break
    default:
      s = str.toString()
      break
  }
  const length = s.length
  for(let i = length; i < num; i++) {
    s = '0' + s
  }
  return s
}

export default {
  uploadImg, getDateObject, fillInStr
}