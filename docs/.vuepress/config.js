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
            { text: '主页', link: '/guide/vue/vue1' }, // 导航条
            { text: 'vuepress', link: '/nav/vuepress' },
            { text: '知识库', link: '/knowledge/' },
            { text: 'link',        // 这里是下拉列表展现形式。
              items: [
                { text: 'github', link: 'https://github.com/lidagen' },
                { text: 'gitee', link: 'https://gitee.com/GENDALI' },
              ]
            }
        ],
        sidebar: [
            {
                title: 'vue.js', // 侧边栏名称
                collapsable: true, // 可折叠
                children: [
                ['/guide/vue/vue1', 'dialog 弹出框使用'],// 你的md文件地址,后一个为标题
                ['/guide/vue/vue2', 'vue 动态刷新页面'],
                ['/guide/vue/vue3', 'vue 封装分页组件'],
                ['/guide/vue/vue4', 'vue 动态菜单'],
                ]
            },
            {
                title:'java基础',
                collapsable: true, // 可折叠
            },
            {
                title:'mysql',
                collapsable: true, // 可折叠
            },
            {
                title:'中间件',
                collapsable: true, // 可折叠
            },
        ]
    }
}
