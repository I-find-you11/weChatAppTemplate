import router from './router/index'
import images from './utils/images'
import tools from './utils/tools'
import api from './utils/api'
import './expand/index.js'
// 获取设备信息 储存在本地，不需要重复获取，防止有时候获取失败
let systemInfo = wx.getStorageSync('systemInfo')
if(!systemInfo) {
  const { windowWidth, windowHeight, statusBarHeight } = wx.getSystemInfoSync()
  const { top, height } = wx.getMenuButtonBoundingClientRect()
  const navTop = top
  const navHeight = statusBarHeight + height + (top - statusBarHeight) * 2
  systemInfo = { windowWidth, windowHeight, navTop, navHeight }
  wx.setStorage({
    key: "systemInfo",
    data: systemInfo
  })
}
// 设备信息
App.$systemInfo = systemInfo
App.$router = router
App.$api = api
App.$images = images
App.$tools = tools

App({
  globalData: {}
})