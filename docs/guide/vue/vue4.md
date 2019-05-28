### vue+element-ui构建动态菜单

#### 构建菜单数据结构 config.js
```` js{4}
let config =[
    {
        "createUserId":0,
        "parentMenuId":0,
        "icon":"el-icon-message",
        "name":"系统管理",
        "alias":"系统管理",
        "id":1,
        "sort":0,
        "state":"ENABLE",
        "type":"NONE",
        "childs":[
            {
                "createUserId":0,
                "parentMenuId":1,
                "icon":"el-icon-message",
                "name":"权限管理",
                "alias":"权限管理",
                "id":3,
                "sort":0,
                "state":"ENABLE",
                "type":"LINK",
                "value":"/auth",
                "childs":[
                    {
                        "createUserId":0,
                        "parentMenuId":3,
                        "icon":"el-icon-message",
                        "name":"权限管理son",
                        "alias":"权限管理son",
                        "id":11,
                        "sort":0,
                        "state":"ENABLE",
                        "type":"LINK",
                        "value":"/auth",
                        "childs":[
 
                        ]
                    }
                ]
            },
            {
                "createUserId":0,
                "parentMenuId":1,
                "icon":"el-icon-message",
                "name":"角色管理",
                "alias":"角色管理",
                "id":3,
                "sort":1,
                "state":"ENABLE",
                "type":"LINK",
                "value":"/elc",
                "childs":[
                    {
                        "createUserId":0,
                        "parentMenuId":3,
                        "icon":"el-icon-message",
                        "name":"权限管理son",
                        "alias":"权限管理son",
                        "id":11,
                        "sort":0,
                        "state":"ENABLE",
                        "type":"LINK",
                        "value":"/auth",
                        "childs":[
 
                        ]
                    }
                ]
            }
        ]
    },
    {
        "createUserId":0,
        "parentMenuId":0,
        "icon":"el-icon-news",
        "name":"用户管理",
        "alias":"用户管理",
        "id":6,
        "sort":1,
        "state":"ENABLE",
        "type":"NONE",
        "childs":[
            {
                "createUserId":0,
                "parentMenuId":6,
                "icon":"el-icon-message",
                "name":"邮箱管理",
                "alias":"邮箱管理",
                "id":7,
                "sort":0,
                "state":"ENABLE",
                "type":"LINK",
                "value":"/elc",
                "childs":[
 
                ]
            }
        ]
    }
]
 
export default config

````
#### 菜单组件
```` html{4}
<template>
  <div class="navMenu">
    
    <label v-for="navMenu in navMenus" :key="navMenu.name">
      <el-menu-item v-if="navMenu.childs==null"
                    :key="navMenu.id" :data="navMenu" :index="navMenu.name" 
                  @click="handleRoute(navMenu.value)" >
        <i :class="navMenu.icon"></i>
        <span slot="title">{{navMenu.alias}}</span>
      </el-menu-item>
 
      <el-submenu v-if="navMenu.childs" @click.native="goto(navMenu.value)"
                  :key="navMenu.id" :data="navMenu" :index="navMenu.name">
        <template slot="title">
          <i :class="navMenu.icon"></i>
          <span> {{navMenu.alias}}</span>
        </template>
        <NavMenu :navMenus="navMenu.childs"></NavMenu>
      </el-submenu>
    </label>
 
  </div>
</template>
 
<script>
  export default {
    name: 'NavMenu',
    props: ['navMenus'],
    data() {
      return {}
    },
    methods: {
      goto (menu) {
        // 通过菜单URL跳转至指定路由
      
       console.info(menu)
       if(menu){
          this.$router.push(menu)
       }
      //
      }
    }
  }
</script>
 
<style scoped>
 
</style>

````

#### main 页面调用
```` html{4}
<template lang="html">
  <div class="" >
  <el-container style="height: 720px; border: 1px solid #eee">
 
    <!--左侧菜单组件-->
  <el-aside width="200px" style="background-color:#2a3a4a">
       <el-menu
         :default-active="isId"
         @select="handleSelect"
         class="el-menu-vertical-demo"
         background-color="#2a3a4a"
         text-color="#dddddd"
         active-text-color="#aaaaaa">
         <NavMenu :navMenus="totalList"></NavMenu>
       </el-menu>
  </el-aside>
  
  <el-container>
    <el-header style="text-align: right; font-size: 12px;" >
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" 
    background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
       <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
           <template slot="title">我的工作台</template>
           <el-menu-item index="2-1">选项1</el-menu-item>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4"><a href="#" target="_blank">订单管理</a></el-menu-item>
    </el-menu>
  </el-header>
  <!--MAIN-->
  <el-main>
    <router-view></router-view>
  </el-main>
  <el-footer>------------------</el-footer>
  </el-container>
</el-container>
</div>
 
</template>
 
<script>
import config from "./config";
import NavMenu from "./menuTemp";
export default {
  data() {
    return {
      totalList: [],
      isId: "权限管理",
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  components: {
    NavMenu
  },
  beforeRouteEnter(to, from, next) {
    console.log("我从哪里来", to.params.id, from);
    var self = this;
 
    next(vm => {
      vm.isId = to.params.id;
    });
  },
  watch: {
    $route(to, from) {
      this.isId = to.params.id;
    }
  },
  created() {
    this.totalList = config;
  }
};
</script>
 
<style>
 
  
  .el-aside {
    color: #333;
  }
</style>

````

#### router
```` js{4}
import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/ele/Main.vue'
import user from '@/components/system/user.vue'
import auth from '@/components/system/auth.vue'
 
 
Vue.use(Router)
 
export default new Router({
    routes: [
        {
            path: '/',
            component: Main,
            name: 'Main',
            children: [
                {
                    path: 'elc',
                    component: user,
                    name: 'user'
                },
                {
                    path: 'auth',
                    component: auth,
                    name: 'auth'
                },
                
            ]
        }
    ]
})

````

````
前端的组件数据就这些了，后端用递归查询返回数据。
````

#### 后端Ztree ，省略get set
```` java{4}
public class Ztree {
    private int id;
 
    private int parentMenuId;
 
    private String name;
 
    private String icon;
 
    private String alias;
 
    private String state;
 
    private int sort;
 
    private String value;
 
    private String type;
 
    private int createUserId;
}
 
````

#### 模拟构建数据
```` java{4}
  List<Ztree> ztreeList =new ArrayList<>();
 
        Ztree ztree =new Ztree();
        ztree.setId(1);
        ztree.setParentMenuId(0);
        ztree.setName("系统管理");
        ztree.setIcon("el-icon-message");
        ztree.setAlias("系统管理");
        ztree.setState("ENABLE");
        ztree.setSort(0);
        ztree.setValue(null);
        ztree.setType("NONE");
 
 
        Ztree ztree1 =new Ztree();
        ztree1.setId(3);
        ztree1.setParentMenuId(1);
        ztree1.setName("权限管理");
        ztree1.setIcon("el-icon-message");
        ztree1.setAlias("权限管理");
        ztree1.setState("ENABLE");
        ztree1.setSort(0);
        ztree1.setValue("/auth");
        ztree1.setType("LINK");
 
        Ztree ztree11 =new Ztree();
        ztree11.setId(11);
        ztree11.setParentMenuId(3);
        ztree11.setName("权限管理son");
        ztree11.setIcon("el-icon-message");
        ztree11.setAlias("权限管理son");
        ztree11.setState("ENABLE");
        ztree11.setSort(0);
        ztree11.setValue("/auth");
        ztree11.setType("LINK");
 
 
        Ztree ztree2 =new Ztree();
        ztree2.setId(3);
        ztree2.setParentMenuId(1);
        ztree2.setName("角色管理");
        ztree2.setIcon("el-icon-message");
        ztree2.setAlias("角色管理");
        ztree2.setState("ENABLE");
        ztree2.setSort(1);
        ztree2.setValue("/elc");
        ztree2.setType("LINK");
 
 
        //总的2
        Ztree ztree4 =new Ztree();
        ztree4.setId(6);
        ztree4.setParentMenuId(0);
        ztree4.setName("用户管理");
        ztree4.setIcon("el-icon-news");
        ztree4.setAlias("用户管理");
        ztree4.setState("ENABLE");
        ztree4.setSort(1);
        ztree4.setValue(null);
        ztree4.setType("NONE");
 
 
        Ztree ztree6 =new Ztree();
        ztree6.setId(7);
        ztree6.setParentMenuId(6);
        ztree6.setName("邮箱管理");
        ztree6.setIcon("el-icon-message");
        ztree6.setAlias("邮箱管理");
        ztree6.setState("ENABLE");
        ztree6.setSort(0);
        ztree6.setValue("/elc");
        ztree6.setType("LINK");
 
 
        ztreeList.add(ztree);
        ztreeList.add(ztree1);
        ztreeList.add(ztree2);
        ztreeList.add(ztree4);
        ztreeList.add(ztree6);
        ztreeList.add(ztree11);
 
        JSONArray array= JSONArray.parseArray(JSON.toJSONString(ztreeList));

````

#### 递归调用
```` java{4}
public static JSONArray treeMenuList(JSONArray menuList, int parentId) {
        JSONArray childMenu = new JSONArray();
        for (Object object : menuList) {
            JSONObject jsonMenu = JSONObject.parseObject(JSONObject.toJSONString(object));
            int menuId = (int)jsonMenu.get("id");
            int pid = (int)jsonMenu.get("parentMenuId");
            if (parentId == pid) {
                JSONArray c_node = treeMenuList(menuList, menuId);
                jsonMenu.put("childs", c_node);
                childMenu.add(jsonMenu);
            }
        }
        return childMenu;
    }

````

::: tip
这样，得到的数据就是前端页面需要的数据。数据库建表就是Ztree里的字段。前端页面可以在created生命周期函数中调用后端获取数据
:::