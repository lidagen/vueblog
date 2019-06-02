module.exports = {
    title: 'GENDALI',
    description: 'stay hungry, stay foolish',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }]// 增加一个自定义的 favicon(网页标签的图标)
      ],
    base: '/lidagen.github.io/',
    themeConfig: {
        logo: '/img/1.jpg',
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        nav:[
            { text: '主页', link: '/' }, // 导航条
            { text: 'vuepress', link: '/nav/vuepress' },
            { text: '杂',
            items:[
                {text:'GIT命令',  link: '/knowledge/git'},
                {text:'python+django',  link: '/knowledge/django'},
                {text:'vue cli搭建项目',  link: '/knowledge/vuecli'},
            ]
             },
            { text: 'link',        // 这里是下拉列表展现形式。
              items: [
                { text: 'github', link: 'https://github.com/lidagen' },
                { text: 'gitee', link: 'https://gitee.com/GENDALI' },
                { text: 'csdn', link: 'https://blog.csdn.net/ws346348183' },
              ]
            }
        ],
        sidebar: [
            {
                title: 'vue.js', // 侧边栏名称
                collapsable: true, // 可折叠
                children: [
                ['/guide/', 'vue基础'],
                ['/guide/vuerouter', 'vue router'],
                ['/guide/vuex', 'Vuex'],
                ['/guide/axios', 'Axios 跨域'],
                ['/guide/vue/vue1', 'dialog 弹出框使用'],// 你的md文件地址,后一个为标题
                ['/guide/vue/vue2', 'vue 动态刷新页面'],
                ['/guide/vue/vue3', 'vue 封装分页组件'],
                ['/guide/vue/vue4', 'vue 动态菜单'],
                ['/guide/vue/byValue', 'vue 常用传值'],
               
                ]
            },
            {
                title:'java基础',
                collapsable: true, // 可折叠
            },
            {
                title:'mysql',
                collapsable: true, // 可折叠
                children: [
                    ['/knowledge/高性能MYSQL', '高性能mysql'],// 你的md文件地址,后一个为标题   
                ]
            },
            {
                title:'中间件',
                collapsable: true,
                children:[
                    ['/activiti/act1','IDEA下的Activiti HelloWord']
                ] 
            },
        ]
    }
}
