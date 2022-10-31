/*
 * @Description: 
 * @Author: zxd
 * @Date: 2022-10-31 13:19:55
 * @LastEditTime: 2022-10-31 13:46:24
 * @LastEditors: zxd
 * @Reference: 头部注释 window`：`ctrl+alt+i`,`mac`：`ctrl+cmd+i 函数注释**：`window`：`ctrl+alt+t`,`mac`：`ctrl+cmd+t`
 * @FilePath: /潜心学习系列/vueX/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import store from "./store"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  test:1
}).$mount('#app')
