## SpringCloud Config -分布式配置中心

### SpringCloud Config 概述

#### SpringCloud Config是什么
+ config是SpringCloud提供的集中化外部配置支持，配置服务器为各个不同微服务应用的所有环境提供了一个中心化的外部配置。

+ 类似携程Apollo，SpringCloud Config分为服务端和客户端两部分

####  能干什么
+ 集中管理配置文件

+ 不同环境的不同配置，动态化的配置更新

+ 运行期间动态调整的数据，可以放在配置中心，且不需要重启即可感知新的配置

+ 将配置信息REST接口形式暴露

### SpringCloud Config的服务端server构建

#### github上新建一个项目，用来放置这些配置的数据
+ 地址为 https://github.com/lidagen/cloud-config.git
+ 新建两个yml ,分别为`application-dev.yml` `application-prd.yml`
#### 新建一个端口3344的项目
+ pom.xml
````
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.ws.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-config-server3344</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <!--springCloud config-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-config-server</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
````
+ yml 
````yml
server:
  port: 3344

spring:
  application:
    name: config-server-center
  cloud:
    config:
      server:
        git:
          uri: https://github.com/lidagen/cloud-config.git
          ignoreLocalSshSettings: true #为了激活基于属性的SSH配置
          search-paths: ## 搜索目录
            - cloud-config
          default-label: master #读取分支
       

eureka:
  client:
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/


````

+ 入口类
````java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;

/**
 * USER: wang_s
 * DATE：2020/3/14
 * DESC：
 **/
@SpringBootApplication
@EnableConfigServer
public class ConfigServerCenter3344 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerCenter3344.class,args);
    }
}

````

+ 启动eureka和cofigserver ,如果报 `reject HostKey: github.com` ，请在github配置公钥
+ 浏览器输入 `http://localhost:3344/master/application-prd.yml` `http://localhost:3344/master/application-dev.yml`查看是否获取值

#### 服务端获取config配置
+ 新建一个3355端口Module
+ pom.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>cloud2020</artifactId>
        <groupId>com.ws.springcloud</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>cloud-config-client3355</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <!--springCloud config-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-config</artifactId>
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
````

+ 将模块下yml文件命名为bootstrap.yml 
  - application.yml 是用户级别资源配置项目

  - bootstrap.yml 是系统级别配置，优先级别更高
````yml
  server:
  port: 3355

spring:
  application:
    name: config-client
  cloud:
    config:
      label: master #分支名
      name: application #配置文件名
      profile: dev #配置文件后缀 两个合起来就是github上的 application-dev
      uri: http://localhost:3344 #配置中心server IP地址


eureka:
  client:
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
#暴露监控端点
management:
  endpoints:
    web:
      exposure:
        include: "*"      
````
+ 入口类
````java
@SpringBootApplication
@EnableEurekaClient
public class ConfigClientCenter3355 {
    public static void main(String[] args) {
        SpringApplication.run(ConfigClientCenter3355.class,args);
    }
}
````

+ 调用Controller
````java
@RestController
@RefreshScope
public class ConfigClientController {
    /**config.info 是github中yml 文件配置的名称**/
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/configInfo")
    public String getConfig(){
        return configInfo;
    }
}
````

+ 修改github上yml内容后，3344立刻响应，3355获取不到动态修改的值
  - yml增加配置
  
  - 调用controller增加@RefreshScope

  - 需要运维运行 `curl -X POST "localhost:3355/actuator/refresh"` 刷新配置
