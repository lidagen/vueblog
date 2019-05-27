## vue 修改数据刷新页面
::: tip
vue 项目中，如果更新一条数据，需要页面刷新下，如果用 this.$router.go(0)，页面会短暂空白，体验十分不好。此时运用provide/inject 来局部刷新页面。
:::

+ 父组件中，定义reload 方法，其中有一个 isRouterAlive变量，定义在data中。
+ 定义 provide，代码如下
``` js{4}
export default {
    provide(){
      return{
        reload:this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true,
      };
    },
    methods: {
      reload(){
          this.isRouterAlive = false,
          this.$nextTick(function(){
            this.isRouterAlive = true;
          })
      }
    },

```
+ 在router-view中加v-if
``` html{4}
<router-view v-if="isRouterAlive"></router-view>
```

+ 在需要运用局部刷新的子组件中，定义inject
``` js{4}
export default {
    inject:['reload'],
}
```

+ 在需要刷新的地方 使用 this.reload(),例：
``` js{4}
deleteUser(id,status) {
          this.$Axios.post('user/updateStatus',{'userId':id,'status':status},res=>{
            this.reload();
            this.$message({
            message:res.data.msg,
            type: 'success'
          });
        })
      },
```