### vue-cli搭建项目

#### 安装node.js
[node官网](https://nodejs.org/en/)安装,
安装完成后，cmd输入node -v，如果出现版本号，则安装成功。

#### 切换源
````
npm config set registry https://registry.npm.taobao.org
````

#### vue 安装
````
npm i -g vue
````

### 全局安装 vue-cli
````
npm i -g vue-cli
````

#### 基于webpack模板创建项目
````
vue init webpack xxx
````
初始化让用户选择几个选项，项目名、描述、vue-router等。

#### 安装依赖
模板创建好以后，需要cd 进入xxx项目，然后安装依赖
````
npm i 
````

#### 运行项目
````
npm run dev
````

这时 可以浏览器输入 http://localhost:8080/ 启动项目