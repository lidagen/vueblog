## 服务治理——Dubbo运用
+ 官方文档：`http://dubbo.apache.org/zh-cn/docs/user/quick-start.html`

### 背景介绍
随着互联网的发展，网站应用的规模不断扩大，常规的垂直应用架构已无法应对，分布式服务架构以及流动计算架构势在必行，亟需一个治理系统确保架构有条不紊的演进。

+ 单一应用架构
  - 当网站流量很小时，只需一个应用，将所有功能都部署在一起，以减少部署节点和成本。此时，用于简化增删改查工作量的数据访问框架(ORM)是关键。

+ 垂直应用架构
  - 当访问量逐渐增大， 单一应用增加机器带来的加速度越来越小， 将应用拆成互不相干的几个应用，以提升效率。此时，用于加速前端页面开发的 Web 框架(MVC)是关键。

+ 分布式服务架构
  - 当垂直应用越来越多，应用之间交互不可避免，将核心业务抽取出来，作为独立的服务，逐渐形成稳定的服务中心，使前端应用能更快速的响应多变的市场需求。此时，用于提高业务复用及整合的分布式服务框架(RPC)是关键。

+ 流动计算架构
  - 当服务越来越多，容量的评估，小服务资源的浪费等问题逐渐显现，此时需增加一个调度中心基于访问压力实时管理集群容量，提高集群利用率。此时，用于提高机器利用率的资源调度和治理中心
(SOA)是关键  

### 什么是Dubbo
了解 dubbo 之前，了解一下什么是 RPC？

+ RPC(Remote Procedure Call Protocol)：远程过程调用。 两台服务器 A、B，分别部署不同的应用a,b。当应用 a 需要调用应用 b 提供的函数或方法的时候，由于不在一个内存空间，不能直接调用，需要通过网络来表达调用的语义传达调用的数据。

#### RPC需要解决的问题
+ **通讯问题**：主要是通过在客户端和服务器之间建立 TCP 连接，远程过程调用的所有交换的数据都在这个连接里传输。连接可以是按需连接，调用结束后就断掉，也可以是长连接，多个远程过程调用共享同一个连接。

+ **寻址问题** ：A 服务器上的应用怎么告诉底层的 RPC 框架，如何连接到 B 服务器（如主机或 IP 地址）以及特定的端口，方法的名称名称是什么，这样才能完成调用。比如基于 Web 服务协议栈的 RPC，就要提供一个 endpoint URI，或者是从 UDDI 服务上查找。如果是 RMI 调用的话，还需要一个 RMI Registry 来注册服务的地址。

+ **序列化与反序列化**：当 A 服务器上的应用发起远程过程调用时， 方法的参数需要通过底层的网络协议如 TCP 传递到 B
服务器，由于网络协议是基于二进制的，内存中的参数的值要序列化成二进制的形式，也就是序列化（Serialize）或编组（marshal），通过寻址和传输将序列化的二进制发送给 B 服务器。 同理，B 服务器接收参数要将参数反序列化。B 服务器应用调用自己的方法处理后返回的结果也要序列化给 A 服务器，A 服务器接收也要经过反序列化的过程。

### Dubbo简介

**dubbo是：**
+ 一款分布式服务框架
+ 高性能和透明的RPC远程调用方案
+ SOA服务治理方案


**dubbo架构图：**
<img :src="$withBase('/dubbo/1.png')" alt="dock">

**dubbo包含几部分：**
+ Provider：暴露服务的提供方
+ Consumer: 调用远程服务的服务消费方
+ Registry: 服务注册和发现中心
+ Monitor: 统计服务的调用次数和调用时间的监控中心
+ Container: 服务运行容器

调用关系说明：
+ 0. 服务容器负责启动，加载，运行服务提供者。
+ 1. 服务提供者在启动时，向注册中心注册自己提供的服务。
+ 2. 服务消费者在启动时，向注册中心订阅自己所需的服务。
+ 3. 注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。
+ 4. 服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。
+ 5. 服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。

### 环境准备（window 环境）
+ git _下载项目
+ maven _后端打包
+ jdk _运行jar
+ node _npm下载包
+ webpack _前端打包

#### 下载zookeeper并配置启动
+ [官网](https://www.apache.org/dyn/closer.cgi/zookeeper/)进入，选择HTTP点击下载ZIP包（本文下载的3.4.14版本）。

+ 解压到本地后，找到conf文件夹，修改zoo_sample.cfg中`dataDir`指向本地安装路径。（本例子dataDir=D:\dubboSoft\zookeeper-3.4.14）

+ 修改bin目录下zkEnv.cmd中ZOOCFG指向刚修改的zoo_sample.cfg文件(set ZOOCFG=%ZOOCFGDIR%\zoo_sample.cfg)

+ 点击zkServive.cmd和zkCli.cmd启动。

#### 下载Dubbo——前后端构建打包启动
+ git 克隆 dubbo代码 `git clone https://github.com/apache/dubbo-admin`

+ dubbo-admin-server 目录下 cmd 运行 `mvn package`打包 dubbo-admin-server模块，会在此文件夹下target生成jar包。

+ 进入jar包所在target目录,cmd 运行命令 `java -jar dubbo-admin-server-0.1.jar` 启动jar，之后访问 http://localhost:8080/swagger-ui.html 成功代表后端启动成功。

+ dubbo-admin-ui 目录下 cmd 运行命令 `npm i`对前端进行打包。

+ 完成后 `npm run dev`启动前端项目，访问  http://localhost:8081 进入Dubbo后台管理页面。

到此阶段，Dubbo需要的环境以及依赖安装就已经完成了，可以后续进行项目开发。

### springboot聚合项目
考虑到生产和消费要依赖同一个service接口，创建一个springboot聚合项目，三个模块，一个provider模块，一个consumer模块，一个api模块。provider 和 consumer 都可以单独启动，且都依赖api接口，这样，两个项目都需要的接口可以放在api中。

#### 创建项目
+ IDEA下新建一个springboot项目,删掉除了`pom.xml`外所有文件，打包模式为pom,modules内添加三个模块


````xml
<<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.5.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <modules>
        <module>dubbo_provider</module>
        <module>dubbo_consumer</module>
        <module>dubbo_api</module>
    </modules>

    <groupId>com.dubbo</groupId>
    <artifactId>dubbo_mode</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>dubbo_mode</name>
    <packaging>pom</packaging>
    <description>Spring Boot 聚合</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>

    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

````
+ 项目右键新增module,新建一个provider模块，改造改`pom.xml`,主要改造 parent依赖dubbo_mode模块，application.properties中改端口号8888.
+ 同理建造consumer,改端口号9999。
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>com.dubbo</groupId>
        <artifactId>dubbo_mode</artifactId>
        <version>0.0.1-SNAPSHOT</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.dubbo</groupId>
    <artifactId>dubbo_provider</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>dubbo_provider</name>
    <packaging>jar</packaging>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>com.dubbo</groupId>
            <artifactId>dubbo_api</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>
</project>
````

+ 新建api模块，由于api模块只负责提供公共的接口和类，所以建一个普通maven模块，parent选项选择null,
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.dubbo</groupId>
    <artifactId>dubbo_api</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    
</project>
`````

这里多模块的聚合项目建造完成，consumer和provider模块引入api模块，测试能引入api中的类说明依赖成功。


### 引入dubbo依赖以及配置
+ 主pom引入Apache dubbo,指定版本 2.7.1
````java
<!-- Dubbo Spring Boot Starter-->
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>${dubbo.version}</version>
</dependency>
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo</artifactId>
    <version>${dubbo.version}</version>
    <exclusions>
        <exclusion>
            <groupId>org.springframework</groupId>
            <artifactId>spring</artifactId>
        </exclusion>
        <exclusion>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
        </exclusion>
        <exclusion>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<!-- Zookeeper dependencies -->
<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-dependencies-zookeeper</artifactId>
    <version>${dubbo.version}</version>
    <type>pom</type>
</dependency>
<!-- Dubbo Spring Boot end-->
````
+ api 增加一个接口（公共接口提供给provider 和 consumer 使用）
````java
public interface CostService {
    /**
     * 成本增加接口
     * @param cost
     * @return
     */
    Integer add(int cost);
}
````

#### Provider 生产者
+ 生产者Provider `application.properties`配置
````xml
server.port=9999

#生产者名称
server.port=8888

dubbo.application.name=dubbo-provider

dubbo.registry.address=10.19.41.188:2181
dubbo.registry.protocol=zookeeper
dubbo.registry.check=false

dubbo.protocol.name=dubbo
dubbo.protocol.port=30003

dubbo.monitor.protocol=register

dubbo.consumer.check=false
dubbo.consumer.timeout=3000
````

+ 生产者启动类加`@EnableDubbo`
````java
@SpringBootApplication
@EnableDubbo
public class DubboProviderApplication {

    public static void main(String[] args) {
        SpringApplication.run(DubboProviderApplication.class, args);
    }

}
````

+ 生产者provider实现这个api中定义的接口
````java
/**@Service注解import为dubbo的**/
import org.apache.dubbo.config.annotation.Service;
import com.dubbo.service.api.CostService;

@Service
public class CostServiceImpl implements CostService {
    /**
     * 假设之前总花费了100
     */
    private final Integer totalCost = 1000;

    /**
     * 之前总和 加上 最近一笔
     * @param cost
     * @return
     */
    @Override
    public Integer add(int cost) {
        return totalCost + cost;
    }
}
````

#### Consumer 消费者

+ 消费者Consumer `application.properties`配置
````xml
server.port=9999

dubbo.application.name=dubbo-consumer
#zookeper ip和端口
dubbo.registry.address=10.19.41.188:2181
dubbo.registry.protocol=zookeeper
dubbo.registry.check=false

dubbo.monitor.protocol=registry

dubbo.consumer.check=false
dubbo.consumer.timeout=3000
````

+ 消费者service类中注入api中的接口
````java
import org.apache.dubbo.config.annotation.Reference;
import com.dubbo.consumer.service.ProductService;
import com.dubbo.service.api.CostService;
import org.springframework.stereotype.Service;


@Service
public class ProductServiceImpl implements ProductService {
    /**
     * 使用dubbo的注解 org.apache.dubbo.config.annotation.Reference。进行远程调用service
     */
    @Reference
    private CostService costService;

    @Override
    public Integer getCost(int a) {
        return costService.add(a);
    }
}
````

+ 启动入口加`@EnableDubbo`注解 

#### 测试调用

+ 消费者Consumer中加一个Controller调用
````java
@RestController
public class ProductController {
    @Autowired
    private ProductService productService;

    /**
     * 添加完 返回总共消费
     * @param
     * @return
     */
    @RequestMapping("/add")
    public String getCost(int a){
        return "该产品总共消费 ："+productService.getCost(a);
    }
}
````

+ 先启动Provider 再启动 Consumer (必须按顺序启动`dubbo.consumer.check=false`这个设置不起作用？)

+ `http://localhost:8081/#/` 中服务查询可看服务注册成功 

+ 浏览器输入 `http://localhost:9999/add?a=22` 返回成功

### 案例分享
+ github : `https://github.com/lidagen/dubboSoft.git`

+ 下载下来放D 盘dubboSoft包下（或者在zoo_sample.cfg指定路径）

+ 按顺序启动服务
