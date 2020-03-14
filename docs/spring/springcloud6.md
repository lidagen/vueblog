## 服务网关——GateWay

### 概述简介

### 三大核心概念

#### 路由Route  
+ 路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成， 如果断言为TRUE，则匹配该路由
#### 断言Predicate
+ 开发人员可以匹配HTTP请求中的所有内容，**如果请求与断言相匹配则进行路由。**
#### 过滤Filter
+ 指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。
#### 总结：
+ web请求，通过一些匹配条件，定位到真正的服务节点，并在这些转发过程的前后，进行一些精细化操作。

+ predicate就是我们的匹配条件，而filter,可以理解成一个无所不能的拦截器。有了这两个元素，再加上目标URI，就可以实现一个具体的路由。

### GateWay工作流程
+ 流程图：

<img :src="$withBase('/springcloud/3.png')" alt="dock">

+ 客户端向Gateway发出请求，然后在Gateway Handle Mapping中找到与请求匹配的路由，将其发送到Gateway Web Handle 。

+ Handle 再通过指定的过滤器来将请求发送到我们实际的服务执行业务逻辑，然后返回。

+ 过滤器在发送代理请求之前 (pre) 或者之后 (post) 执行业务逻辑。
  - 在pre类型的过滤器可以执行参数校验、权限校验、流量监控、日志输出、协议转换等。

  -  在post类型过滤器中可以做响应内容、响应头的修改，日志输出、流量监控也有着重要作用。

### 入门配置
#### 搭建项目
+ 新建端口号9527 Module  `cloud-gateway-gateway9527`

+ pom.xml
````pom
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

    <artifactId>cloud-gateway-gateway9527</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
            <!--网关不需要web包，此包API中包含-->
            <exclusions>
                <exclusion>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-starter-web</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--注册进eureka用-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <!--gateway-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-gateway</artifactId>
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
  port: 9527

spring:
  application:
    name: cloud-gateway

eureka:
  instance:
    hostname: cloud-gateway-service
  client:
    #注册进EUREKA
    register-with-eureka: true
    fetch-registry: true
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/

````

+ 入口类
````java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * USER: wang_s
 * DATE：2020/3/14
 * DESC：
 **/
@SpringBootApplication
@EnableEurekaClient
public class Gateway9527 {
    public static void main(String[] args) {
        SpringApplication.run(Gateway9527.class,args);
    }
}

````

#### 通过微服务名进行动态路由
+ 我们不想暴露8001 8002端口给随意访问，希望在端口外套一层9527
+ 两个服务需要做负载均衡，之前我们用ribbon一个80的Module做的，这次不需要，只要在9527的yml做配置改动
````yml
server:
  port: 9527

spring:
  application:
    name: cloud-gateway
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true #开启从注册中心动态创建路由的功能，利用微服务名进行路由
      routes:
        - id: payment_path #不重复的ID
        #uri: http://localhost:8001
          uri: lb://CLOUD-PAYMENT-SERVICE #lb负载 CLOUD-PAYMENT-SERVICE 注册在eureka上的微服务名
          predicates:
            - Path=/payment/** #路由的断言

eureka:
  instance:
    hostname: cloud-gateway-service
  client:
    #注册进EUREKA
    register-with-eureka: true
    fetch-registry: true
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/

````


### Predicate的使用
+ 常用的Predicate配置
````yml
spring:
  cloud:
    gateway:
      discovery:
        locator:
          enabled: true #开启从注册中心动态创建路由的功能，利用微服务名进行路由
      routes:
        - id: payment_path #不重复的ID
          uri: lb://CLOUD-PAYMENT-SERVICE
          predicates:
            - Path=/payment/** #路由的断言/payment/** 通过
            - After=2020-03-14T20:02:40.743+08:00[Asia/Shanghai] #在这个时间之后生效，ZonedTime.now()可获取当前时间
            #- Before=2020-03-14T20:02:40.743+08:00[Asia/Shanghai] #之前
            #- Between=2020-01-14T20:02:40.743+08:00[Asia/Shanghai],2020-03-14T20:02:40.743+08:00[Asia/Shanghai] #之间
            #- Cookie=username,ws # 带cookie访问,可用正则（用curl localhost:9527/payment/get/5 --cookie "username=ws"）测试
            #- Header=X-Request-Id,\d+ #请求头要有X-Request-Id属性，并且满足正则\d+（整数）(curl localhost:9527/payment/get/5 -H "X-Request-Id:1")
````


### Filter的使用
+ 生命周期
 - pre
 - post

+ 种类
  - GatewayFilter
  - GlobalFilter

#### 自定义filter
+ 实现接口 GlobalFilter,Ordered
````java
package com.ws.springcloud.filter;

import cn.hutool.core.date.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * USER: wang_s
 * DATE：2020/3/14
 * DESC： gateway全局日志配置Filter
 **/
@Slf4j
@Component
//@Order(0)
public class GlobalLogFilter implements GlobalFilter, Ordered {


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("********GlobalLogFilter:********"+ DateUtil.now());
        String username = exchange.getRequest().getQueryParams().getFirst("username");
        if (null == username){
            log.error("********非法用户！********");
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
           // return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    /**
     * 加载过滤器的顺序 数字越小越先加载
     * @return
     */
    @Override
    public int getOrder() {
        return 0;
    }
}

````