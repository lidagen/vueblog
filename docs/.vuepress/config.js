module.exports = {
    title: 'GENDALI',
    description: '编程 学习博客',
    base: '/lidagen.github.io/',
    themeConfig: {
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        nav:[
            { text: '主页', link: '/' }, // 导航条
            { text: '组件文档', link: '/baseComponents/' },
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
                title: 'vue', // 侧边栏名称
                collapsable: true, // 可折叠
                children: [
                ['/guide/vue/vue1', 'dialog 弹出框使用'],// 你的md文件地址,后一个为标题
                ['/guide/vue/vue2', 'vue 动态刷新页面'],
                ['/guide/vue/vue3', 'vue 封装分页组件']
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
