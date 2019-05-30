## VUEX
Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式,它采用集中式存储管理应用的所有组件的状态.

### 安装
```` 
npm install vuex --save
````
```` js{4}
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

new Vue({
  el: '#app',
  store
})
````

### 状态管理模式
 + 通俗的讲，应用遇到多个组件共享状态时，需要状态管理。
   + 多个视图依赖于同一状态。
   + 来自不同视图的行为需要变更同一状态。
+ 其思想是建立一个全局单例模式管理共享数据

###核心概念

#### store 容器
 + 容器，包含着应用中需要共享的状态
 + store和单纯的全局对象的区别：
   - Vuex状态存储是响应式的，store中的状态发生变化，相应的组件中也得到高效更新
   - 不能直接改变store中的状态，需要显示的提交(commit)mutation,方便跟踪状态变化。

 + 调用
   ````js{4}
   const store = new Vuex.Store({
       state:{
           count:0
       },
       mutation:{
           add(state){
               state.count++
           }
       }
   })
   ````
   + 通过commit触发状态的变更
   ````js{4}
   store.commit('add')
   console.info(store.state.count) // ->1
   ````

   #### state 单一状态树
   + 它是作为一个唯一数据源存在，意味着一个应用包含一个state实例。

    ::: tip
    全局注册后使用
    ````js
    this.$store.state.count
    ````
    :::

#### Getter store的计算属性
+ getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。
````js
const store = new Vuex.Store({
    state:{
        pers:[
            {id:1,date:new Date()}
        ]
    },
    getters:{
        donePers:state=>{
            retrun state.pers.filter(date=>{...})
        }
    }
})
````

:::tip
通过属性访问
````js
this.$store.getters.donePers
````
:::

+ 也可以让getter返回一个函数，实现给getter传参
````js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
````
````js
store.getters.getTodoById(2) 
````
:::warning
getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果.
:::

#### Mutation store中更改状态的方法
````js
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state,n) {
      // 变更状态
      state.count+n
    }
  }
})
````
````js
store.commit('increment',10)
````

#### Action 
+ action 类似mutation,不同点是：
  - Action 提交的是 mutation，而不是直接变更状态
  - Action 可以包含任意异步操作。
````js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
````
触发
````js
store.dispatch('increment')
````  

:::tip
以上例子action和mutation没有不同，实际上，action还可执行异步，而mutation不行
:::
````js
actions: {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
````
````js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})
````

#### Module 
+ Module允许我们把store分割成模块，每个模块有自己的state、mutation、action、getter
````js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
````




