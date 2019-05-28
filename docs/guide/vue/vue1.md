### vue element-ui dialog 弹出框使用
::: tip
构建页面时，需要按钮弹出一个新的页面进行编辑，此时需要用到dialog弹出框，考虑复用，把弹出框单独提出来使用。
::: 

+ 父组件页面一个按钮，dialogTableVisible默认false，隐藏。addUser触发

``` html{4}
<el-button type="primary" icon="el-icon-plus" size="small" @click="addUser()" 
    :disabled="disp()">添加</el-button>
    <el-dialog title="登陆" :visible.sync="dialogTableVisible"  :append-to-body='true' 
    center :lock-scroll="false" width="30%">
    <Add></Add>
</el-dialog>

```

``` js{4}
export default {
  data() {
      return {
        dialogTableVisible: false,
        }
    }
}

addUser(){
    this.dialogTableVisible=true;//默认页面不显示为false,点击按钮将这个属性变成true
    }
```
+ 子组件编写

``` html{4}
<template>
    <div>子组件</div>
</template>
```
``` js{4}
export default {
    name: 'Add',//这个LoginName最好和引入的vue的LoginName相同
}

```
+ 父组件中引用子组件
``` js{4}
import Add  from './Add.vue';
 components: {
      Add
    }
```


