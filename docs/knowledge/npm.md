### npm 使用

+  升级
````
 npm install -g npm
````
+ 降级 
````
npm install npm@4 -g
````
:::tip
数字4为具体版本
:::

+ npm 切换registry：如淘宝
````
npm：https://registry.npm.taobao.org/
````

### nrm 
::: tip
nrm是专门用来管理和快速切换私人配置的registry
:::

+ 全局安装
````
npm install nrm -g --save
````
+ 查看registry
````
nrm list
````

+ 测速
````
nrm test
````
+ 切换registry
````
nrm use xxx(cnpm)
````
