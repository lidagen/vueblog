### VUE概述
+ Vue.js是一款轻量级的以数据驱动的渐进式JavaScript 框架。
### MVVM
+ MVVM 是Model-View-ViewModel 的缩写，它是一种基于前端开发的架构模式，其核心是提供对View 和 ViewModel 的双向数据绑定，
这使得ViewModel 的状态改变可以自动传递给 View，即所谓的数据双向绑定。
Vue.js 就是一个提供了 MVVM 风格的双向数据绑定的 Javascript 库，专注于View 层。
它的核心是 MVVM 中的 VM，也就是 ViewModel。 ViewModel负责连接 View 和 Model，保证视图和数据的一致性。
### vue常用指令
+ v-if
```` html{4}
<!--flag 为true 显示div-->
<div v-if='flag'>123</div>
````
+ v-else
````html{4}
<!--根据条件决定显示哪个div-->
<div v-if='flag'>123</div>
<div v-else>456</div>
````
+ v-show
````html{4}
<!--与v-if类似,不同点是v-show加载过程就会渲染,不管有没有显示。
v-if条件成立后才渲染显示-->
<div v-show='flag'>AAA</div>
````
::: tip
总结：
1.v-if更高的切换消耗,v-show更高的初始渲染消耗。
2.如果切换频繁，v-show一次渲染，如果条件渲染消耗大，条件不经常改变用v-if
:::

+ v-for
```` html{4}
<!--循环遍历-->
<ul>
    <li v-for='stu for students'>
    {{stu}}
    </li>
</ul>
````
::: tip
v-for可以遍历数组，对象。其中遍历的参数可以是value，index，如果是对象还有key。
:::

+ v-on
```` html{4}
<!--v-on 监听dom事件触发js,v-on:后面可以是submit、keyup、enter等-->
<button type='button' v-on:click='num +1'>点击+1</button>
````
:::tip
语法糖：v-on:click 可缩写 @click
:::

+ v-bind
````html{4}
<a v-bind:href="url"></a>
````
:::tip
v-bind 主要用于属性绑定，
语法糖：v-bind 可缩写 :
:::

+ v-model
::: tip
双向数据绑定：表单和data数据的绑定,监听用户的输入事件以更新数据
:::

+ v-once
:::tip
只渲染元素和组件一次。随后的重新渲染,元素/组件及其所有的子节点将被视为静态内容并跳过。
:::

### vue 生命周期

+ beforeCreate 
    刚刚new Vue()之后，这个时候，数据还没有挂载呢，只是一个空壳.
    这时候，页面以及数据都undefined
+ created
    这个时候已经可以使用到数据，也可以更改数据,在这里更改数据不会触发updated函数
    一般可以在这里做初始数据的获取
+ beforeMounted
    虚拟dom已经创建完成，马上就要渲染,在这里也可以更改数据，不会触发updated
+ mounted
    数据、真实dom都已经处理好了,事件都已经挂载好了
    可以在这里操作真实dom等事情
+ beforeUpdate
    重新渲染之前触发
    这里不能更改数据，否则会陷入死循环
+ updated
    数据已经更改完成，dom也重新render完成
    这里不能更改数据，否则会陷入死循环
+ beforeDestroy
    销毁前执行（$destroy方法被调用的时候就会执行）,一般在这里善后
    清除计时器、清除非指令绑定的事件等等
+ destroyed
    组件的数据绑定、监听...都去掉了,只剩下dom空壳

### 计算属性 computed
模板内的表达式非常便利,模板中放入太多的逻辑会让模板过重且难以维护,例如：
```` html{4}
<div id="example">
  {{ message.split('').reverse().join('') }}
</div>
````
对于任何复杂逻辑，你都应当使用计算属性。
````html{4}
<div id="example">
  {{ reversedMessage  }}
</div>
var vm =new Vue({
    el: '#example',
    data:{
        message:'hello'
    },
    computed:{
        //计算属性
        reversedMessage:function(){
            return this.message.split('').reverse().join('')
        }
    }
})
````

::: tip
计算属性 vs 方法：
    以上翻转字符串也可以用method实现,不同的是计算属性是基于它们的响应式依赖进行缓存的。
    多次访问 reversedMessage 计算属性会立即返回之前的计算结果，不必再次执行函数。
    相当于计算属性有缓存,method每次触发重新渲染都会执行一遍。
:::
### 侦听器 watch      
vue通过watch选项提供一个更通用方法，来响应数据变化，当需要在数据变化时执行异步或者开销
较大的时候使用。


### 组件
组件是可复用的 Vue 实例
+ 组件注册
    - 全局注册
    ````js{4}
    Vue.component('my-component-name', { /* ... */ })
    ````
    使用
    ```` html{4}
    <template>
        <my-component-name></my-component-name>
    </template>
    ````
    - 局部注册
    ```` js{4}
    var ComponentA = { /* ... */ }
    new Vue({
        el: '#app',
        components:{
            'com-a':ComponentA,
        }
    })
    ````
+ 模块化局部注册
```` js{4}
import ComponentA from './ComponentA'

export default{
    components:{
        ComponentA,
    }
}
````    

### prop
+ HTML中特性时大小写不敏感，使用dom中模板时，(camelCase)驼峰命名的prop需要等价(kebab-case)短横线分割命名
+ prop类型
    - String
  
    - Number
    
    - Boolean

    - Array
 
    - Object

    - Function

    - Promise
    ```` html{4}
    <!-- 动态赋予一个变量的值 -->
    <blog-post v-bind:title="post.title"></blog-post>
    ````
+ 单向数据流
    - 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，
    但是反过来则不行。
    
    - 每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。你不应该在一个子组件内部改变 prop。
    如果你这样做了，Vue 会在浏览器的控制台中发出警告。

    ::: tip
    有两种常见的试图改变一个 prop 的情形：
    + 这个 prop 用来传递一个初始值；这个子组件接下来希望将其作为一个本地的 prop 数据来使用。
      - 在这种情况下，最好定义一个本地的 data 属性并将这个 prop 用作其初始值
      ````
      props: ['initialCounter'],
      data: function () {
      return {
          counter: this.initialCounter
        }
      }
      ````
    + 这个 prop 以一种原始的值传入且需要进行转换
      - 在这种情况下，最好使用这个 prop 的值来定义一个计算属性：
      ````
      props: ['size'],
      computed: {
      normalizedSize: function () {
          return this.size.trim().toLowerCase()
        }
      }
      ````  
    :::   

+  prop验证
```` js{4}
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
````     

### 自定义事件

+ 事件名
  - 不同于组件和 prop，事件名不存在任何自动化的大小写转换,触发事件名需要完全匹配监听事件名
  ````js{4}
  this.$emit('my-event',functhion(){/**/})
  ````
  ::: tip
  推荐始终使用 kebab-case 的事件名。
  :::


