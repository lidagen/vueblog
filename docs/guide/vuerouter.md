## 概念
### vue router介绍
+ Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。

### 使用方法
+ npm
````sh{4}
npm install vue-router
````
+ 安装
````js{4}
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
````
### 路由具体指向
  - HTML
````html{4}
<!-- 通过传入 `to` 属性指定user链接. -->
<vue-router :to='/user'> go to</vue-router>
````
  - js
````js{4}
this.$router.push('/user')
```` 

### 动态路由匹配
+ 同一个组件，根据条件不同，都要使用这个组件渲染
````js{4}
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```` 

### 响应路由参数的变化

+ 对于多个url使用同一个组件路由匹配，组件实例被复用，
意味着组件的生命周期钩子不会再被调用。

+ 如果想要对参数变化响应的化，推荐2.2以后的导航守卫，
beforeRouteUpdate 


## 进阶

### 导航守卫
 导航守卫主要用来通过跳转或取消的方式守卫导航，参数或查询的改变并不会触发进入/离开的导航守卫

#### 全局前置守卫 beforeEach
```` js{4}
const router = new VueRouter({...})
router.beforeEach((to,from,nexe)=>{
    //...
})
````
+ 当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。
+ 每个守卫方法接收三个参数:
  - to(router):即将要进入的路由对象
  - from(router): 当前要离开的路由对象
  - next(function):一定要调用该方法来 resolve 这个钩子,执行效果依赖 next 方法的调用参数.
    + next():当前管道中的下一个钩子
    + next(false):中断当前的导航
    + next('/'):跳进'/'这个url
    + next(error):导航会被终止且该错误会被传递给 router.onError() 注册过的回调.

#### 全局解析守卫 beforeResolve 
+ 这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用

#### 全局后置钩子 afterEach
````js{4}
router.afterEach((to, from) => {
  // ...
})
````
+ 解析守卫不会接收next函数也不会改变导航

#### 路由独享的守卫
```` js{4}
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // ...
      }
    }
  ]
})
````

::: tip
#### 完整的导航解析流程
+ 导航被触发。
+ 在失活的组件里调用离开守卫。
+ 调用全局的 beforeEach 守卫。
+ 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
+ 在路由配置里调用 beforeEnter。
+ 解析异步路由组件。
+ 在被激活的组件里调用 beforeRouteEnter。
+ 调用全局的 beforeResolve 守卫 (2.5+)。
+ 导航被确认。
+ 调用全局的 afterEach 钩子。
+ 触发 DOM 更新。
+ 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。
:::








