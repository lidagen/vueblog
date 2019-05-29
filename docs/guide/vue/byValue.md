### vue 常用传值

#### 父传子

+ 父组件
```` html{4}
<template>
    <div>
        <input type="text" v-model="count"/>
        <!--子组件v-bind 绑定count到子组件身上-->
        <user :count= count></user>
    </div>
</template>
<script>
import user from './user'
export default {
    data(){
        return{
            count: ''
        }
    },
    components:{
        user
    }
}
</script>
````

+ 子组件
```` html{4}
<template>
    <!--获取父组件传来的值-->
    <div>user{{count}}</div>
</template>
<script>
export default {
    name: 'user',
    //子组件接收count
    props:{
        count:String,
        required: true
    }
}
</script>
````

#### 子传父

+ 子组件
```` html{4}
<template>
    <div>
        <!--点击触发chufa方法，this.$emit传值-->
        <input type="button" value="触发" @click="chufa">
    </div>
</template>
<script>
export default {
    name: 'user',
    data(){
        return{
            count:'123'
        }
    },
    methods:{
        chufa(){
            this.$emit('childrenValue',this.count)
        }
    }
}
</script>
````

+ 父组件
```` html{4}
<template>
    <div>
        <!--v-on绑定接收childrenValue,传给childrenget方法-->
        <user v-on:childrenValue="childrenget"></user>
        {{num}}
    </div>
</template>
<script>
import user from './user'
export default {
    data(){
        return{
            num: ''
        }
    },
    methods:{
        childrenget(val){
            this.num =val
            console.info(this.num)
        }
    },
    components:{
        user
    }
}
</script>
````

::: tip
总结：

  + 父组件传值给子组件，首先父组件发送的形式是用bind(用缩写:)绑定值到子组件身上。然后子组件用属性props接收

  + 子组件传值父组件，首先是子组件发送的形式是this.$emit(事件名,需要发送的值)，事件名：父组件on监听的方法，
    父组件第一件事就是监听子组件发送过来的事件名，有参方法获取传来的值
:::

