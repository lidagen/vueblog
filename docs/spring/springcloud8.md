## 服务总线——Bus

### 概述
+ Bus 是对springCloud Config 的扩充，实现config配置的动态刷新

+ Bus支持两种消息代理：RabbitMQ 和Kafka

+  Bus能管理和传播分布式系统间的消息，就像一个分布式执行器，可用于广播状态的更改，事件推送等。也可以当作微服务间的通信通道。

#### 什么是总线
+ 在微服务架构中，通常会使用**轻量级的消息代理**来构建一个共用的消息主题，并让系统中所有的微服务实例都连接上来，由于**该主题中产生的消息有实例监听和消费，所以称为消息总线。**在总线的各个实例，都可以方便的广播一些需要让其他连接在该主题的实例都知道的消息。

#### 基本原理
+ configClient实例都监听MQ中同一个topic,当服务刷新数据时，它会把内容放进topic中，这样其它监听这个topic的服务就能得到通知，更新自身的配置。

### 配置

#### 安装MQ
+ 本例配置RabbitMQ, 下载配置安装Erlang和RabbitMQ

+ 输入`localhost:15672`访问RabbitMQ,并登陆

#### Bus刷新全局广播的设计思想 （先增加一个3366的客户端）
我们的目的是github上值改变了，3344服务端能接受到值的改变，而客户端有多个（本例子中3355 和3366 项目）需要运维执行刷新请求才能获得动态改变的值，有两种思路解决：

+ 利用消息总线触发一个客户端configClient的/bus/refresh,而刷新所有客户端配置
  - 此架构不适合，违反了微服务职责单一性，次模块可能有自己的业务职责，把消息总线职责赋予它，会承担两份工作。
  - 客户端如果是集群，需要从一个客户端传染到多个客户端。

+ 利用消息总线触发一个服务端configServer 的/bus/refresh,而刷新所有客户端的配置

#### Bus的配置
+ 服务端server（3344）增加消息总线的支持
  - pom改动
````xml
  <!--增加bus 支持-->
  <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bus-amqp</artifactId>
  </dependency>
````
  
  - 配置bus暴露端点
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
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: admin


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
        include: "bus-refresh"


```` 

+ 客户端client（3355、3366）增加消息总线的支持
  - pom.xml
````xml
<!--增加bus 支持-->
  <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bus-amqp</artifactId>
  </dependency>
````  
  - yml
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
  rabbitmq: #RabbitMQ配置
    host: localhost
    port: 5672
    username: admin
    password: admin

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
+ 刷新 `curl -X POST "localhost:3344/actuator/bus-refresh"` ,刷新一个服务端，所有客户端都得到最新的值。

#### 动态刷新的定点通知
+ 比如我们只想通知3355而不通知3366，这时候需要定点通知

+ 公式： http://ip:服务端号/actuator/bus-refresh/{destination}

+ destination 指的是需要更新配置的服务或者实例

+ 命令 `curl -X POST "localhost:3344/actuator/bus-refresh/config-client:3355"`,config-client为application-name

