## SpringCloud Stream -消息驱动
面对多种消息中间件，消息驱动Stream让我们不再关注MQ内部具体细节，我们只需要用一种适配绑定的方式，实现各种MQ内切换。

### 什么是消息驱动
+ 消息驱动概述：
  - 屏蔽底层**消息中间件**的差异，统一消息的编程模型。

### 什么是SpringCloud Stream
+ 官方定义SpringCloud Stream 是一个构建消息驱动微服务框架

+ 应用程序通过inputs和outputs来与Stream中binder对象交互。通过我们配置来binding(绑定)，而Stream的binder对象负责和消息中间件交互。

+ 通过使用Spring Integration 来连接消息代理中间件以实现消息事件驱动。Stream为消息中间件供应商提供了个性化自动配置实现，引用了发布-订阅、消费组、分区三个核心概念。

+ 目前仅支持RabbitMQ、Kafka

### Stream 设计思想

#### 标准的MQ
+ 生产者/消费者之间靠**消息**传递信息内容->Message

+ 消息必须走特定的通道->消息通道MessageChannel

+ 消息通道消息如何被消费，谁**处理**->消息通道MessageChannel的子接口SubscribableChannel,由MessageHandle 消息处理器所订阅。

#### 为什么用Stream
+ 比如我们项目用了rabbitMQ和Kafka,由于两个中间件架构不同，这些中间件的差异导致我们实际开发增加一定困扰，如果我们用了这两种其中的一种，后续架构切换，需要迁移到另一种，这时候无疑是一种灾难。

+ Stream给我们提供了一种解耦合的方式。

+ Stream中消息通信方式遵循了发布-订阅模式 ->topic主题进行广播
  - RabbitMQ中就算Exchange
  - Kafka中就是Topic

#### Stream 如何统一底层差异
+ 在没有绑定器概念前，不同的消息中间件和应用整合时，其实现细节有较大差异性。

+ 通过绑定器作为中间层，完美的实现了**应用程序和消息中间件细节之间的隔离**。通过向应用程序暴露统一的channel通道，使得应用不需要考虑不同中间件的不同实现。

#### 绑定器binder
+ 通过定义绑定器binder作为中间层，实现了应用程序与消息中间件细节之间的隔离。

+ Binder
  - input对应消费者
  - output对应生产者

  - 架构图：
  <img :src="$withBase('/springcloud/4.png')" alt="dock">

#### Stream 的标准流程
+ Binder: 方便的连接中间件，屏蔽差异

+ Channel: 是队列Queue的一种抽象，在消息通讯系统中就是实现存储和转发的媒介，通过Channel对队列配置。

+ Source和Sink: 简单理解可以参照的就是Stream自身，从Stream发布消息就是输出，接受消息就是输入。

#### 常用API和注解
组成 | 说明 |  
- | :-: | :-: | :-: | -:
Middleware | 中间件，目前支持RabbitMQ\Kafka
Binder | Binder是应用和消息中间件之间的封装
@Input | 注解标识输入通道，通过输入通道接收消息到应用程序
@Output | 注解标识输出通道，通过输出通道发送消息到队列
@StreamListener |  监听队列，用于消费者队列接收消息
@Enablebinding | 指信道channel和exchange绑定在一起

###  项目构建，一个生产者provider8801,两个消费者consumer8802 8803
#### provieder8801
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

    <artifactId>cloud-stream-rabbitmq-provider8801</artifactId>

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
            <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
        </dependency>


        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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
  port: 8801


spring:
  application:
    name: stream-rabbitmq-provider
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
          environment:
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: admin
                password: admin
      bindings:
        output:
          destination: studyExchange
          content-type: application/json
         # binder: defaultRabbit



eureka:
  client:
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
  instance:
    lease-renewal-interval-in-seconds: 2 #
    lease-expiration-duration-in-seconds: 5
    instance-id: send-8801.com
    prefer-ip-address: true

````
+ 入口类
````java
@SpringBootApplication
public class StreamRabbitProvider8801 {
    public static void main(String[] args) {
        SpringApplication.run(StreamRabbitProvider8801.class, args);
    }
}

````
+ 发送service
````java
package com.ws.springcloud.service;

import cn.hutool.core.util.IdUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Source;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;

import javax.annotation.Resource;

/**
 * USER: wang_s
 * DATE：2020/3/17
 * DESC：
 **/
@Slf4j
@EnableBinding(Source.class)//定义消息的推送管道
public class SendMessageImpl implements SendMessage {
    @Resource
    private MessageChannel output;

    @Override
    public String send() {
        String uuid = IdUtil.simpleUUID();

        output.send(MessageBuilder.withPayload(uuid).build());
        log.info("=====>uuid:"+uuid);
        return null;
    }
}

````    
#### consumer8802 8803

+ pom.xml与8801相同

+ yml
````yml
server:
  port: 8802


spring:
  application:
    name: stream-rabbitmq-consumer
  cloud:
    stream:
      binders:
        defaultRabbit:
          type: rabbit
          environment:
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: admin
                password: admin
      bindings:
        input: # 消费者这里是input
          destination: studyExchange
          content-type: application/json
          group: consumerA # 分组，同一服务多个实例只接收消息一次
         # binder: defaultRabbit



eureka:
  client:
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
  instance:
    lease-renewal-interval-in-seconds: 2 #
    lease-expiration-duration-in-seconds: 5
    instance-id: send-8801.com
    prefer-ip-address: true
````
+ 入口类
````java
@SpringBootApplication
public class StreamRabbitConsumer8802 {
    public static void main(String[] args) {
        SpringApplication.run(StreamRabbitConsumer8802.class, args);
    }
}   
````
+ 接收Listener
````java
package com.ws.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

/**
 * USER: wang_s
 * DATE：2020/3/17
 * DESC：
 **/
@Component
@EnableBinding(Sink.class)
public class ReceiveMessageListener {
    @Value("${server.port}")
    private String serverPort;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message){
        System.out.println("消费1号，端口："+serverPort+",--->接收的消息"+message);
    }
}

````

#### 分组问题
+ 同一个消息，会被多个consumer重复消费
+ 导致的原因是，默认分组group是不同的，组流水号不一样。不同组流水号可以重复消费，如果不想被多实例项目重复消费需要解决这个问题。 

#### Stream 消息持久化  
+ 假设有两个不同微服务需要接收provider消息，一个设置分组group,一个没有。两个服务都未启动。

+ 假设MQ上有一条消息未消费，两个服务重新启动，会发现设置group的能接收到MQ的消息，未设置group的会丢失消息。

+ 为了避免消费者服务宕机后的消息丢失，设置分组group非常重要。