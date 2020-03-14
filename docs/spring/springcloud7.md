## SpringCloud Config -分布式配置中心

### SpringCloud Config 概述

#### SpringCloud Config是什么
+ config是SpringCloud提供的集中化外部配置支持，配置服务器为各个不同微服务应用的所有环境提供了一个中心化的外部配置。

+ 类似携程Apollo

####  能干什么
+ 集中管理配置文件

+ 不同环境的不同配置，动态化的配置更新

+ 运行期间动态调整的数据，可以放在配置中心，且不需要重启即可感知新的配置

+ 将配置信息REST接口形式暴露

### SpringCloud Config的server构建

#### github上新建一个项目，用来放置这些配置的数据

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
          uri: git@github.com:lidagen/cloud-config.git
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