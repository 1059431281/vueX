<!--
 * @Description: 
 * @Author: zxd
 * @Date: 2022-11-01 14:42:12
 * @LastEditTime: 2022-11-01 14:46:10
 * @LastEditors: zxd
 * @Reference: 头部注释 window`：`ctrl+alt+i`,`mac`：`ctrl+cmd+i 函数注释**：`window`：`ctrl+alt+t`,`mac`：`ctrl+cmd+t`
 * @FilePath: /潜心学习系列/vueX_custom/README.md
-->
代码是基于vuex源码和掘金文章进行编写学习，补充了文章里没有的namespaced的简单实现，并没有去完整的进行实现。
根据源码的思路，完整的namespaced实现需要在modules之外再新建一个本地modules对象（也就是开启了命名空间的），另外单独去注册事件。
关于actions的一步因为时间原因只实现了一半，后续有时间再拓展，基本思路就是在actions的时候判断结果是否是promise，不是就promise.resovle给予一下然后返回，再在dispatch定义的时候用promise返回一下就好了