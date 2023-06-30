// 请求头
let header = {
  // "content-type": "application/x-www-form-urlencoded"
}
import apiBash from './config'
let loading = false
const request = ({ url, method = 'get', data = {}, undelay = false}) => new Promise(async (resolve, reject) => {
  // const { userInfor: { miniOpenId } } = App.store.getState()
  const app = getApp()
  let bashUrl = apiBash.bashUrl
  const { globalData } = app
  while(!globalData.miniOpenId && !undelay) {
    await delay(1000);
  }
  if(globalData.miniOpenId) {
    data = { miniOpenId: globalData.miniOpenId, unionId: globalData.unionId, ...data }
  }
  if(method == 'post') {
    wx.showLoading({ mask: true, title: '请稍候' })
    loading = true
  }
  wx.request({
    url: `${bashUrl}api/${url}`, method, data, header, success: async (res) => {
      const { statusCode, data } = res
      if(statusCode == 200 && data.code == 200) {
        setTimeout(() => {
          resolve(data)
        }, 200)
      }
      // else if( data.code == 2 ) {
      //   // 用户流程出现问题，用code = 2表示，然后将 msg 打印出来，
      //   // failToast(isLoading, res.data.msg)
      // }else if( data.code == 3 ) {
      //   // 用户流程出现问题，用code = 3 表示，但是不需要展示报错信息。直接交给请求的地方处理逻辑。 直接执行错误的返回函数
      //   reject(data)
      // }
      else {
        console.log(data.msg)
        // 以下处理其他异常情况统一的报错
        failToast({errText: data.msg})
      }
    },
    fail: err => {
      failToast()
      // promise 反馈失败
      reject(err)
    },
    complete() {
      loading = false
      setTimeout(() => {
        if(!loading) {
          wx.hideLoading()
        }
      }, 100)
    }
  })
})

// 默认反馈文字为 请求失败
function failToast({loading, errText = '加载出现一点问题，请重试'} = {}) {
  setTimeout(() => {
    wx.showToast({
      title: errText,
      icon: 'none',
      duration: (errText ? 3 : 1.5) * 1000
    })
  }, 120)
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export default request
