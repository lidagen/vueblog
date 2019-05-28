## vuepress 搭建自己的博客

+ VuePress 是什么：
  VuePress是以Vue驱动的静态网站生成器，是一个由Vue、Vue Router和webpack驱动的单页应用。在VuePress中，你可以使用Markdown编写文档，然后生成网页，每一个由VuePress生成的页面都带有预渲染好的HTML，也因此具有非常好的加载性能和搜索引擎优化。同时，一旦页面被加载，Vue将接管这些静态内容，并将其转换成一个完整的单页应用，其他的页面则会只在用户浏览到的时候才按需加载。


#### 环境搭建
+ VuePress支持使用Yarn和npm来安装，Node.js版本需要>=8才可以。  
#### 全局安装VuePress
````
yarn global add vuepress # 或者：npm install -g vuepress
````

#### 创建项目 myblog
````
mkdir myblog
cd myblog
````

#### 初始化项目
````
yarn init -y # 或者 npm init -y
````


#### 构建基本项目目录
````
project
├─── docs
│   ├── README.md
│   └── .vuepress
│       ├── public
│       └── config.js
└── package.json
````

#### README.md 加入如下内容
````
---
home: true
actionText: 前往 →
actionLink: /guide/
features:
- title: 布局类组件
  details: 基本组件，为常用组件提供快速，可用的组件
- title: 可视化组件
  details: 积累将数据可视化的业务组件
- title: 知识库
  details: 积累前端相关的知识，涵盖 vue、react、koa2、nodejs 相关的知识点
---
````

::: tip

    config.js主要是配置包括网站的标题、描述等基本信息，以及主题的配置

    title博客主题

    description 描述

    base 对应github项目名
    
    官方解释：- 如果你打算发布到 https://<USERNAME>.github.io/，则可以省略这一步，
             因为 base 默认即是 "/"。
             - 如果你打算发布到 https://<USERNAME>.github.io/<REPO>/（也就是说你的
             仓库在 https://github.com/<USERNAME>/<REPO>），则将 base 设置为 "/<REPO>/"。    

    themeConfig 主题配置

        nav：导航条
        sidebar：侧边栏

        侧边栏children对应的是自己编辑文章的目录。此项目docs同级别的有个guide文件夹，
        里面vue文件夹下包含三个.md文件（vue1、vue2、vue3）
:::

```` JS{4}
module.exports = {
    title: 'GENDALI',
    description: '编程 学习博客',
    base: '/lidagen.github.io/',
    themeConfig: {
        nav:[
            { text: '主页', link: '/' }, // 导航条
            { text: 'vuepress', link: '/nav/vuepress' },
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
        ]
    }
}
````



#### package.json 修改
```` js{4}
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs",
  },
````

#### 启动
`````
npm run docs:dev
`````
#### 打包
````
npm run docs:build
````


## 部署博客

#### 在github上创建一个名为 myblog 的仓库,并将你的代码提交到github上.
#### 在项目根目录中，创建一个如下的 deploy.sh 脚本文件
````
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
````
#### 运行deploy.sh

双击运行 deploy.sh，脚本会自动打包提交github

#### 设置
在 GitHub 项目点击 Setting 按钮，找到 GitHub Pages - Source，选择 gh-pages 分支，点击 Save 按钮后，静静地等待它部署完成即可。

