import routerConfig from './config'

export function findRoute({ name, path }) {
  return routerConfig.find(item => item.name == name || item.path == path)
}

export default {
  navigateTo({ name, path, query = {} }) {
    const dataStr = encodeURIComponent(JSON.stringify(query))
    wx.navigateTo({
      url: `${findRoute({name}).path}?routerQuery=${dataStr}`
    })
  },
  redirectTo({ name, path, query = {} }) {
    const dataStr = encodeURIComponent(JSON.stringify(query))
    wx.redirectTo({
      url: `${findRoute({name}).path}?routerQuery=${dataStr}` 
    })
  },
  reLaunch({ name, path, query = {} }) {
    const dataStr = encodeURIComponent(JSON.stringify(query))
    wx.reLaunch({
      url: `${findRoute({name}).path}?routerQuery=${dataStr}` 
    })
  },
  navigateBack(delta) {
    const pages = getCurrentPages(); 
    if(pages.length > 1) {
      wx.navigateBack({
        delta
      })
    }else {
      const { prveRouter } = pages[0].$route
      prveRouter && this.reLaunch({name: prveRouter})
    }

  }
}