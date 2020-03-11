## 服务注册中心——Eureka 

#### 服务治理
+ 在传统rpc远程调用框架中，管理每个服务与服务之间的关系比较复杂，所以需要服务治理，管理服务于服务之间依赖关系，可以实现服务调用，负载均衡，容错，实现服务的注册与发现。

#### eureka的架构
+ eureka采用CS架构，Eureka Server作为服务注册功能的服务器，它是注册中心，而系统中其它的微服务，使用Eureka 客户端连接到Eureka Server并维持心跳，这样系统维护人员就能通过Eureka Server来检测各个微服务是否健康。
+ 在服务注册发现中，有一个注册中心（Eureka Server），当服务器启动时(Consumer|Provider),会把自己的信息以**别名**注册到注册中心上，另一方（消费者|服务提供者），以该别名去注册中心获取实际通讯地址，再实现本地RPC调用RPC远程的设计思想。
+ 架构图如下：
<img :src="$withBase('/springcloud/2.png')" alt="dock">

#### 基本规则
+ 服务启动时会获取服务的基本信息对象，然后注册到服务治理中心eureka中.
+ 注册完成后会把注册信息缓存到本地内存中。
+ 客户端30s(可配置)发送一次心跳到服务端。
+ 服务中心90s(可配置)未收到心跳会认为客户端挂了，会删掉服务信息。
+ 服务停止前，服务会主动发送一个停止请求，服务治理中心会删除这个服务的信息。
+ 如果Eureka Server收到的心跳包不足正常值的85%（可配置）就会进入自我保护模式，在这种模式下，Eureka Server不会删除任何服务信息。

#### 代码实现
+ 本例子中，参照架构图，实现两个服务中心+两个服务提供者Provider+一个消费方的架构实现
#### 创建Eureka服务中心（端口号7001、7002）,只列出一个，另一个类似
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

    <artifactId>eureka-server7002</artifactId>
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
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
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
+ yml配置
````yml
server:
  port: 7002

eureka:
  # eureka自我保护关闭，保证服务不可用时剔除
  server:
    enable-self-preservation: false
    eviction-interval-timer-in-ms: 2000
  instance:
    hostname: eureka7002
  client:
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      # 由于在一台机子上，IP一样，所以修改host ,eureka7001 eureka7002都指向本机
      # 7002的实例指向7001，实现服务中心互相注册
      defaultZone: http://eureka7001:7001/eureka/
    register-with-eureka: false
    fetch-registry: false
````

+ Mian配置
````java
@SpringBootApplication
@EnableEurekaServer
public class EurekaMain7002 {
    public static void main(String[] args) {
        SpringApplication.run(EurekaMain7002.class,args);
    }
}
````

#### 创建消费提供方Provider Module（端口号8001、8002）,只列出一个，另一个类似
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

    <artifactId>cloud-provider-payment8002</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>
         <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid-spring-boot-starter</artifactId>
            <version>1.1.10</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
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
  port: 8002

spring:
  application:
    name: cloud-payment-service
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: org.gjt.mm.mysql.Driver
    url: jdbc:mysql://localhost:3306/cloud?useUnicode=true&characterEncoding=utf-8&useSSL=false
    username: root
    password: root

eureka:
  instance:
    #eureka中显示隐藏application-name
    instance-id: payment8002
    #访问路径显示IP
    prefer-ip-address: true
    #客户端向服务端发送心跳频率，默认30秒改为1
    lease-renewal-interval-in-seconds: 1
    #eureka服务端最后一次收到心跳的等待时间上限，默认90秒
    lease-expiration-duration-in-seconds: 2
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/



mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.ws.springcloud.entites.payment

````

+ Mian 配置
````java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * USER: wang_s
 * DATE：2020/3/10
 * DESC：
 **/
@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient
public class PaymentMain8002 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain8002.class, args);
    }
}

````

+ Controller
````java
@RestController
@RequestMapping("/payment")
@Slf4j
public class PaymentController {
    @Autowired
    private PaymentService paymentService;

    @Autowired
    private DiscoveryClient discoveryClient;

    @PostMapping(value = "/create")
    public CommonResult create(@RequestBody Payment payment){

        return new CommonResult<>(paymentService.create(payment));
    }

    @GetMapping(value="/get/{id}")
    public CommonResult<Payment> getById(@PathVariable("id") Long id){

        return new CommonResult<>(paymentService.getById(id));
    }

    @GetMapping(value = "/discovery")
    public CommonResult<Object> discoveryClient(){
        List<String> services = discoveryClient.getServices();
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        for (ServiceInstance instance : instances) {
            log.info("======>"+instance.getInstanceId()+"\t"+instance.getServiceId()+"\t"+instance.getPort()+"\t"+instance.getUri());
        }
        return new CommonResult<>(services);
    }
}
````

#### 创建消费客户端Consumer 8000
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

    <artifactId>cloud-consumer-oder80</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
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
+ yml 配置
````yml
server:
  port: 8000
spring:
  application:
    name: cloud-order-service

eureka:
  client:
    register-with-eureka: true
    fetch-registry: true
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/

````

+ Main配置
````java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

/**
 * USER: wang_s
 * DATE：2020/3/9
 * DESC：
 **/
@SpringBootApplication
@EnableEurekaClient
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class,args);
    }
}
````

+ 全局config
````java
package com.ws.springcloud.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * USER: wang_s
 * DATE：2020/3/9
 * DESC：
 **/
@Configuration
public class ApplicationConfig {
    @Bean
    @LoadBalanced//负载均衡
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
````

+ 调用Provider的Controller
````java
package com.ws.springcloud.controller;

import com.ws.springcloud.common.result.CommonResult;
import com.ws.springcloud.entites.payment.Payment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

/**
 * USER: wang_s
 * DATE：2020/3/9
 * DESC：
 **/
@RestController
@Slf4j
@RequestMapping("/consumer")
public class OrderController {
    /**CLOUD-PAYMENT-SERVICE是eureka中注册的名称**/
    public static final String PAYMENT_URL="http://CLOUD-PAYMENT-SERVICE/payment";
    @Autowired
    private RestTemplate restTemplate;

    @PostMapping("/payment/create")
    public CommonResult create(Payment payment){
        return restTemplate.postForObject(PAYMENT_URL+"/create",payment,CommonResult.class);
    }

    @GetMapping("/payment/get/{id}")
    public CommonResult get(@PathVariable("id") Long id){
        return restTemplate.getForObject(PAYMENT_URL+"/get/"+id,CommonResult.class);
    }
}

````

#### 启动顺序为 注册中心->服务端->客户端
+ http://eureka7002:7002/ 和http://eureka7001:7001/ 可查看注册情况
+ postman测试是否成功


