/*
 * @Description: 
 * @Author: zxd
 * @Date: 2022-10-30 22:03:20
 * @LastEditTime: 2022-11-01 14:38:23
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
    this._modules = new ModuleCollection(options)
    this.commit = (type,param)=>{
      this.mutations[type].forEach(fn=>fn(param))
    }
    this.dispatch = (type,param)=>{
      this.actions[type].forEach(fn=>fn(param))
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
  Object.defineProperty(store.getters,getterName,{
    get:()=>{
      return getterFn.call(store,currentModule.state)
    }
  })
}
// 注册mutations
function registerMutation(store,mutationName,mutationFn,currentModule,){
    let mutationArr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
    mutationArr.push((payload)=>{
      mutationFn.call(store,currentModule.state,payload)
    })
}

// 注册actions
function registerAction(store,actionName,actionFn){
    let actionArr = store.actions[actionName] || (store.actions[actionName] = []);

    actionArr.push((payload)=>{
      let res = actionFn.call(store,store,payload)
      if (!(res && typeof res.then === 'function')) {
        res = Promise.resolve(res);
      }
      return res

    })
}



// 模块收集
class ModuleCollection{
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

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce((namespace,key)=>{
    module = module._children[key]
    return namespace + (module._rootModule.namespaced ? key + '/' : '');
  },'')
};

// 递归状态树，挂载getters，actions，mutations
function instalModule(store,rootState,path,rootModule){
  const namespace = store._modules.getNamespace(path);
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
      getterName = namespace + getterName;
      registerGetter(store, getterName, getterFn,rootModule);
    });
  }
  let mutations = rootModule._rootModule.mutations
  if (mutations) {
    forEachValue(mutations, (mutationFn, mutationName) => {
      mutationName = namespace + mutationName;
      registerMutation(store, mutationName, mutationFn,rootModule)
    });
  }
  let actions = rootModule._rootModule.actions
  if (actions) {
    forEachValue(actions, (actionFn, actionName) => {
      actionName = namespace + actionName;
      registerAction(store, actionName, actionFn,rootModule);
    });
  }
  forEachValue(rootModule._children, (child, key) => {
      instalModule(store, rootState, path.concat(key), child)
  })

}

const mapState = stateList => {
  return stateList.reduce((prev,stateName)=>{
    prev[stateName] =function(){
      return this.$store.state[stateName]
    }
    return prev
  },{})
}
const mapGetters = gettersList => {
  return gettersList.reduce((prev,gettersName)=>{
    prev[gettersName] =function(){
      return this.$store.getters[gettersName]
    }
    return prev
  },{})
}
const mapMutations = mutationsList => {
  return mutationsList.reduce((prev,mutationsName)=>{
    prev[mutationsName] =function(payload){
      return this.$store.commit(mutationsName,payload)
    }
    return prev
  },{})
}
const mapActions = actionsList => {
  return actionsList.reduce((prev,actionsName)=>{
    prev[actionsName] =function(payload){
      return this.$store.dispatch(actionsName,payload)
    }
    return prev
  },{})
}


export default{
  install,
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
  Store
}