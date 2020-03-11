## 服务注册中心——Zookeeper

### Zookeeper 用作注册中心
+ zookeeper可以充当一个服务注册表（Service Registry），让多个服务提供者形成一个集群，让服务消费者通过服务注册表获取具体的服务访问地址（ip+端口）去访问具体的服务提供者。
+ 在zookeeper中，进行服务注册，实际上就是在zookeeper中创建了一个znode节点，该节点存储了该服务的IP、端口、调用方式(协议、序列化方式)等。
+ zookeeper提供了“心跳检测”功能，它会定时向各个服务提供者发送一个请求（实际上建立的是一个 socket 长连接），如果长期没有响应，服务中心就认为该服务提供者已经“挂了”，并将其剔除。

### 单机版zookeeper服务注册中心
#### 启动ZK
+ 下载解压zookeeper安装包
+ 启动zkServer.sh和zkCli.sh

#### 聚合项目新建一个Module
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

    <artifactId>cloud-provider-payment8003</artifactId>

    <dependencies>
        <!--api模块包括了spring-boot-starter-web-->
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--zookeeper-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zookeeper-discovery</artifactId>
            <exclusions>
                <exclusion>
                    <groupId>org.apache.zookeeper</groupId>
                    <artifactId>zookeeper</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <!--排除自带的3.5.5beta版,添加和zookeeper安装包相同的版本-->
        <dependency>
            <groupId>org.apache.zookeeper</groupId>
            <artifactId>zookeeper</artifactId>
            <version>3.5.6</version>
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
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <executions>
                    <execution>
                        <goals>
                            <goal>repackage</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
````

+ yml配置
````yml
server:
  port: 8003

spring:
  application:
    name: cloud-payment-service
  cloud:
    zookeeper:
    #此处zk的IP配你自己的zk
      connect-string: localhost:2181
````

+ 入口类
````java
@SpringBootApplication
@EnableDiscoveryClient
public class PaymentZK {

    public static void main(String[] args) {
        SpringApplication.run(PaymentZK.class,args);
    }
}
````

#### 之后可以进入zkCli.sh查看服务是否注册上，consumer同理也可注册上


### ZK 、Consul 和 Eureka 作为注册中心异同点

+ **CAP** ：  指的是在一个分布式系统中，一致性（Consistency）、可用性（Availability）、分区容错性（Partition tolerance）。
+ 这三个要素最多只能同时实现两点，不可能三者兼顾。
+ 分布式永远需要满足P，所以只能选择AP或CP

组件名 | 语言 | CAP | 服务健康检查 | 对外暴露接口 | SpringCloud集成  
- | :-: | :-: | :-: | -: | :-: | :-: | -:   
Eureka  | java  |  AP | 可配支持 | HTTP | 是
Consul  | GO  |  CP | 支持 | HTTP/DNS | 是
Zookeeper  | java  |  CP | 支持 | 客户端 | 是
