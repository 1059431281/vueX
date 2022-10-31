/*
 * @Description: 
 * @Author: zxd
 * @Date: 2022-10-30 22:03:20
 * @LastEditTime: 2022-10-31 20:09:44
 * @LastEditors: zxd
 * @Reference: 头部注释 window`：`ctrl+alt+i`,`mac`：`ctrl+cmd+i 函数注释**：`window`：`ctrl+alt+t`,`mac`：`ctrl+cmd+t`
 * @FilePath: /潜心学习系列/vueX_custom/src/vuex.js
 */
import Vue from 'vue'

const install = (vue)=>{
  vue.mixin({
    beforeCreate(){
      const options = this.$options;
      if(options.store){
        this.$store = typeof options.store == 'function' ? options.store() : options.store;
      }else if(options.parent && options.parent.$store){
        this.$store = options.parent.$store;
      }
    }
  })
}

class Store{
  constructor(options={}){
    this.options = options
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    this._modules = new moduleCollection(options)
    this.commit = (type,param)=>{
      console.log(this)
      Array.isArray(this.mutations[type]) ? this.mutations[type].forEach(fn=>fn(param)) :this.mutations[type](param)
    }
    this.dispatch = (type,param)=>{
      Array.isArray(this.actions[type]) ? this.actions[type].forEach(fn=>fn(param)) :this.actions[type](param)

    }
    const state = options.state;
    const path = [];
    instalModule(this,state,path,this._modules.root)
    if(Vue.observable){
      this.vmData = {
        state: Vue.observable(options.state || {})
      }
    }else {
      this.vmData = new Vue({
        data: {
            state: options.state
        }
      });
    }
    console.log(this)
  }
  get state(){
    return this.vmData.state ? this.vmData.state :this.vmData._data.state 
  }

}

// 提取通用的foreach为公共函数
function forEachValue(obj,fn){
  Object.keys(obj).forEach(key=>fn(obj[key],key))
}
// 注册getter
function registerGetter(store,getterName,getterFn,currentModule){
  Object.defineProperty(store.getters,key,{
    get:()=>{
      return getterFn.call(store,currentModule.state)
    }
  })
}
// 注册mutations
function registerMutation(store,mutationName,mutationFn,currentModule,moduleName){
  if(currentModule._rootModule.namespaced){
    store.mutations[moduleName+'/'+mutationName] = (payload)=>{
      mutationFn.call(store,currentModule.state,payload)
    }
  }else{
    let mutationArr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
    mutationArr.push((payload)=>{
      mutationFn.call(store,currentModule.state,payload)
    })
  }
}

// 注册actions
function registerAction(store,actionName,actionFn,currentModule,moduleName){
  if(currentModule._rootModule.namespaced){
    store.actions[moduleName+'/'+actionName] = (payload)=>{
      actionFn.call(store,store,payload)
    }
  }else{
    let actionArr = store.actions[actionName] || (store.actions[actionName] = []);
    actionArr.push((payload)=>{
      actionFn.call(store,store,payload)
    })
  }
}



// 模块收集
class moduleCollection{
  constructor(rootModule){
    this.register([],rootModule)
  }
  register(path,rootModule){
    const newModule = {
      _rootModule: rootModule,
      _children:{},
      state:rootModule.state
    }
    if(path.length === 0){
      this.root = newModule;
    }else{
      const parent = path.slice(0,-1).reduce((module,key)=>{
        return module._children(key)
      },this.root)
      parent._children[path[path.length - 1]] = newModule
    }

    if(rootModule.modules){
      forEachValue(rootModule.modules,(rootChildModule,key)=>{
        this.register(path.concat(key),rootChildModule)
      })
    }
  }
}

// 递归状态树，挂载getters，actions，mutations
function instalModule(store,rootState,path,rootModule){
  if (path.length > 0) {
    const parent = path.slice(0,-1).reduce((state,key)=>{
      return state[key]
    },rootState)
    Vue.set(parent, path[path.length - 1], rootModule.state)
  }

  // 循环注册包含模块内的所有getters
  let getters = rootModule._rootModule.getters
  if (getters) {
    forEachValue(getters, (getterFn, getterName) => {
      registerGetter(store, getterName, getterFn);
    });
  }
  let mutations = rootModule._rootModule.mutations
  if (mutations) {
    forEachValue(mutations, (mutationFn, mutationName) => {
      registerMutation(store, mutationName, mutationFn)
    });
  }
  let actions = rootModule._rootModule.actions
  if (actions) {
    forEachValue(actions, (actionFn, actionName) => {
      registerAction(store, actionName, actionFn);
    });
  }
  forEachValue(rootModule._children, (child, key) => {
      instalModule(store, rootState, path.concat(key), child)
  })

}


export default{
  install,
  Store
}