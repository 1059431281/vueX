/*
 * @Description: 
 * @Author: zxd
 * @Date: 2022-10-31 13:22:29
 * @LastEditTime: 2022-11-01 14:35:22
 * @LastEditors: zxd
 * @Reference: 头部注释 window`：`ctrl+alt+i`,`mac`：`ctrl+cmd+i 函数注释**：`window`：`ctrl+alt+t`,`mac`：`ctrl+cmd+t`
 * @FilePath: /潜心学习系列/vueX_custom/src/store/index.js
 */
import Vue from "vue";
import vueX from "../vuex";
// import vueX from "vuex";
Vue.use(vueX)
let modulesA = {
  namespaced:true,
  state:{
    nameA:"我是模块A"
  },
  mutations:{
    updateA(state,params){
      console.log(params)
      state.nameA = params
    }
  },
  actions:{
    updateA({commit},params){
      console.log()
      commit("modulesA/updateA",params)
    }
  },
  getters:{
    getA(state){
      return state.nameA
    }
  }
}
let modulesB = {
  state:{
    nameB:"我是模块B"
  },
  mutations:{
    updateB(state,params){
      state.nameB = params
    }
  },
  actions:{
    updateB({commit},params){
      commit("updateB",params)
    }
  },
  getters:{
    getB(state){
      return state.nameB
    }
  }
}
export default new vueX.Store({
  modules:{
    modulesA,modulesB
  },
  state: {
    text: "Hello vuex"
  },
  getters: {
    getText(state){
      return state.text + "getters"
    }
  },
  mutations: {
    updateText(state,params){
      state.text = params
    }
  },
  actions: {
    updateText({commit},params){
      commit("updateText",params)
    }
  },
})

