## es6 转换 es5

### 创建项目 webpack环境
```sh
mkdir babel-compile
cd babel-compile
npm init -y
````

### 安装babel 环境依赖

````sh
npm install --save-dev babel-core babel-preset-es2015 babel-preset-latest
````

### 新建`.babelrc`文件

+ 根目录下新建 `.babelrc`文件,写入如下代码
````js
{
    "presets":["es2015","latest"],
    "plugins":[]
}
````

### 全局安装 `babel-cli` 命令行
````sh
npm install -g babel-cli
babel --version
````

### 运行`babel`命令，编译文件
+ 新建src文件夹,建util.js,新建dist文件夹放编译过的文件
````js
const firstFun = () => {
    console.log('i am first es6 module');
}

const mapArr = [1,2,3];
const mapFun = () => {
    const result = mapArr.map(item => item + 1);
    console.log(result);
}

firstFun();
mapFun();
````
+ 运行命令
````sh
babel ./src/util.js --out-file ./dist/compiled-util.js
````

### html引入
````html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="../dist/compiled-util.js" type="text/javascript"></script>
</head>
<body>
    
</body>
</html>
````

### 查看效果
+ 打开浏览器F12
