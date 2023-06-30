/**
 *
 * 构造函数扩展, 添加全局属性
 *
 * @param {*} Page 原生Page
 */
import { findRoute } from '../router/index'
const computedBehavior = require('miniprogram-computed')
const extend = (extend, type) => {
  return object => {
    let { behaviors = [], options = {}, externalClasses = [], setData, _data } = object
    // 获取那些是否需要挂载的参数配置
    // 扩展data, 用于做一些全局通用的一些配置
    // 全局的 app 对象
    // object.$app = app
    // 默认自带 behaviors computedBehavior 方法
    object.behaviors = [ computedBehavior, ...behaviors ]
    // 添加全局的纯数据字段
    object.options = { pureDataPattern: /^_/ , ...object.options }

    // 改下onload 方法，在执行之前把路由封装
    const { onLoad } = object
    switch(type) {
      // 组件单独配置
      case 'Component': {
        // 设置可以使用全局样式
        object.options = { addGlobalClass: true, multipleSlots: true, ...options }
        // 设置 使用父级样式的class名字
        object.externalClasses = [ ...externalClasses, 'styleclass']

        // 改写组件show方法，在这里会绑定一次当前的路由信息
        const { lifetimes: { ready = () => {} } = {}, lifetimes, created = () => {} } = object
        object.lifetimes = {
          ...lifetimes, ready: function(options) {
            let pages = getCurrentPages();
            const { $route } = pages[pages.length - 1];
            this.$route = $route
            ready.call(this)
          }
        }
        break
      }
      // 单独页面配置
      case 'Page':
        object.onLoad = function(options) { 
          // 这里必须使用function, 不可以使用箭头函数， 否则this指向错误
          const queryStr = options.routerQuery ? decodeURIComponent(options.routerQuery) : '{}'
          const query = JSON.parse(queryStr)
          this.$route = { ...findRoute({ path: '/' + this.route }), query: { ...query, ...options }}
          if(typeof onLoad === 'function') {
            onLoad.call(this, options);
          }
        }
        break
    }
    // 路由封装
    return extend(object)
  }
}

// 重写 构造函数
Page = extend(Page, 'Page')
Component = extend(Component, 'Component')


