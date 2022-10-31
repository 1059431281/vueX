<!--
 * @Description: 
 * @Author: zxd
 * @Date: 2022-10-31 13:19:55
 * @LastEditTime: 2022-10-31 20:01:58
 * @LastEditors: zxd
 * @Reference: 头部注释 window`：`ctrl+alt+i`,`mac`：`ctrl+cmd+i 函数注释**：`window`：`ctrl+alt+t`,`mac`：`ctrl+cmd+t`
 * @FilePath: /潜心学习系列/vueX_custom/src/App.vue
-->
<template>
  <div>
    state:{{getState}}
    <br/>
    getter:{{$store.getters.getText}}
    <br/>
    mouduleA:{{$store.state.modulesA.nameA}}
    <br/>
    mouduleA:{{$store.state.modulesB.nameB}}
  </div>
</template>
<script>
export default{
  computed:{
    getState(){
      return this.$store.state.text
    }
  },
  mounted(){
    this.$store.state.text = 123
    console.log(this.$store.commit)
    setTimeout(()=>{
      this.$store.commit("updateText","实现muations更新")
    },2000)
    setTimeout(()=>{
      this.$store.dispatch("updateText","实现action更新")
    },3000)
    console.log("开启A命名空间后的getters:",this.$store.getters['modulesA/getA'])
    setTimeout(()=>{
    console.log("开启A命名空间后的commit:",this.$store.commit('modulesA/updateA','开启A命名空间后的commit'))
    },2000)
    setTimeout(()=>{
    console.log("开启A命名空间后的dispatch:",this.$store.dispatch('modulesA/updateA','开启A命名空间后的dispatch'))
    },3000)
  }
}
</script>