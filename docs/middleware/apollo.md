## Apollo-分布式配置中心


### 概述
+ Apollo（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，
配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。

+ 服务端基于Spring Boot和Spring Cloud开发，不依赖外部容器，便于部署。

+ Java客户端不依赖任何框架，能够运行于所有Java运行时环境，同时对Spring/Spring Boot环境也有额外支持。

### 环境准备
+ JDK 1.8+

+ MySql 5.6.5+

### 单机版部署

#### 启动Apollo配置中心

+ github下载项目 `https://github.com/nobodyiam/apollo-build-scripts`


+ 执行sql包下sql文件，分别通过语句查询，有数据则表示导入成功
````sh
select `Id`, `AppId`, `Name` from ApolloPortalDB.App;
````

````sh
select `NamespaceId`, `Key`, `Value`, `Comment` from ApolloConfigDB.Item;
````

+ 修改demo.sh的`#apollo config db info`和`# apollo portal db info`中数据库连接配置

+ 脚本会在本地启动3个服务，分别使用8070, 8080, 8090端口，启动前请确保这3个端口当前没有被使用。

+ bash命令启动，用git 在目录下命令运行demo.sh启动
````sh
./demo.sh start
````
  - 当看到如下输出后，就说明启动成功了！

  ````sh
    Started [9156]
    Waiting for config service startup.......
    Config service started. You may visit http://localhost:8080 for service status now!
    Waiting for admin service startup..
    Admin service started
    ==== starting portal ====
    Portal logging file is ./portal/apollo-portal.log
    Started [15100]
    Waiting for portal startup......
    Portal started. You can visit http://localhost:8070 now!
  ````

+ 输入 localhost:8070进入管理页面，账号apollo 密码admin登陆

+ 点击已有的SimpleApp项目（或者新增），新增配置增加一个key为productCode，值为7001601的配置，点击发布

#### 客户端搭建
+ springboot项目 2.2.2RELEASE ，引入apollo依赖
````xml
<dependency>
    <groupId>com.ctrip.framework.apollo</groupId>
    <artifactId>apollo-client</artifactId>
    <version>1.5.1</version>
</dependency>
````

+ application.properties配置
````properties
server.port=9999

#appId和配置中心中AppId相同
app.id=SampleApp
# 配置中心地址
apollo.meta=http://localhost:8080
apollo.bootstrap.enable=true
apollo.bootstrap.namespaces=application
#日志缓存位置
apollo.cacheDir= D:\\apollo\\apollo_parent\\LOG

env = DEV

````

+ 启动入口增加 `@EnableApolloConfig` 注解
````java
@SpringBootApplication
@EnableApolloConfig
public class ApolloParentApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApolloParentApplication.class, args);
    }

}
````

+ 增加获取配置的config
````java
@Configuration
public class ApolloConfig {
    /**productCode缺省值为00**/
    @Value("${productCode:00}")
    private String productCode;

    public String getProductCode() {
        return productCode;
    }
}
````

+ 增加controller验证
````java
@RestController
public class HelloAction {

    @Autowired
    private ApolloConfig apolloConfig;

    @RequestMapping("/index")
    public String hello(){
        String productCode = apolloConfig.getProductCode();
        return "hello man:"+productCode;
    }
}
````

+ 浏览器输入 http://localhost:9999/index ，可以看到页面输出:
````
hello man:7001601
````

### 分布式部署

+ apollo可以按照分布式部署的方式编译、打包、部署Apollo配置中心，从而可以在开发、测试、生产等环境分别部署运行。

+ wiki `https://github.com/ctripcorp/apollo/wiki/%E5%88%86%E5%B8%83%E5%BC%8F%E9%83%A8%E7%BD%B2%E6%8C%87%E5%8D%97`

+ 分布式部署，不同环境拥有不同的配置，数据方面，两条sql分别是`ApolloPortalDB` 和`ApolloConfigDB`，portal是环境配置管理中心，这个sql只需要在生产上部署一份，config是配置服务，每个环境都需要刷，用来保存不同环境的不同值，下图为样例部署图:
<img :src="$withBase('/apollo/1.png')" alt="dock">

#### 下载集群版
+ github `https://github.com/ctripcorp/apollo`