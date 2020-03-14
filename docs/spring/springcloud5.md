## Hystrix -断路器

### 服务雪崩
+ 多个微服务调用的时候，假设微服务A调用微服务B和微服务C，微服务B和微服务C又调用其它微服务。这就是所谓的**扇出**，如果扇出的链路上某个微服务调用时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃，这就是所谓的**雪崩效应**。

+ 对于高流量的应用来说，单一的后端依赖可能会导致所有服务器上的所有资源都在几秒中内饱和。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其它资源紧张。导致整个系统发生级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。

+ 通常当你发现一个模块下的某个实例失败后，这时候这个模块仍会接收流量，然后这个有问题的模块还调用了其它模块，这样就发生了级联故障，或者叫雪崩。

### Hystrix 是什么
+ Hystrix 是一个用在分布式系统的**延迟**和**容错**的开源库，许多依赖不可避免的会调用失败，比如超时或者异常等，Hystrix能够保证在一个依赖出问题的时候，**不会导致整体服务失败，避免级联故障，提高分布式系统弹性**。

+ “断路器”本身是一种开关装置，当某个服务发生故障时，通过断路器的故障监控，**向调用方返回一个符合预期的，可处理的备选响应（Fallback）,而不是长时间的等待或者抛出调用方无法处理的异常**。这样就保证了调用方不会长时间等待，不必要的占用，从而避免故障在分布式系统中蔓延，雪崩。


### Hystrix 能干什么

#### 服务降级(fallback)
+ 服务器没反应，返回一个友好的备用反应fallback

+ 哪些情况会服务降级
  - 程序运行异常
  - 超时
  - 服务熔断触发降级
  - 线程池/信号量打满也会导致服务降级

#### 服务熔断(break)
+ 熔断机制是应对雪崩效应的一种微服务链路保护机制，当扇出链路的某个微服务出错不可用或者响应时间过长，会进行服务降级，**进而熔断该节点微服务调用**，快速返回错误的响应信息。**当检测到该节点微服务响应正常时，恢复链路调用。**
+ 类似保险丝，达到最大访问量了，直接拒绝访问，然后调用服务降级返回友好提示。
+ 熔断过程：服务降级->进而熔断->恢复调用链路

#### 服务限流(flowlimit)
+ 秒杀高并发等操作，严禁一窝蜂的过来拥挤，大家排队，一秒N个，有序进行。


### Hystrix 案例
+ 假设一个8001端口的项目，用80端口的feign调用，方法耗时1s(OpenFeign 默认的调用超时为1秒钟),这时用jmeter压测工具增加一个线程组，200个线程访问100次，这时候feign就会频繁报RetryableException，调用时间超出了等待时间或系统程序出错，这时候就需要hystrix进行限流。  
  - 超时：超时不再等待
  - 出错：出错要有兜底 

+ 如何解决：
  -  对方服务（8001）超时了，  调用者（80）不能一直卡死等待，需要服务降级。
  -  对方服务（8001）宕机了，  调用者（80）不能一直卡死等待，需要服务降级。
  - 对方服务（8001）正常，自身服务（80）出故障或者自我要求(自己设定的等待时间小于服务提供者)，自己降级处理。

 #### 服务降级
+ 降级配置
  - @HystrixCommand

+ 8001从自身找问题 
  - 设置自身服务超时时间的峰值，峰值内正常运行
  - 超过了峰值时间有兜底处理，作服务降级fallback

+ 8001 fallback
  - 业务类增加配置 @HystrixCommand
  ````java
  @Service
public class PaymentHystrixServiceImpl implements PaymentHystrixService {
    @Override
    public String payment_OK(Integer id) {
        return "线程池："+Thread.currentThread().getName()+"payment_OK,id:" + id+"===>"+"OKOK";
    }

    @HystrixCommand(fallbackMethod = "payInfo_TimeoutHandle",commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds",value = "3000")
    })
    @Override
    public String payment_FAIL(Integer id) {
        int time = id * 1000;
        //int i = 10 / 0;
        try {
            Thread.sleep(time);
        }catch (InterruptedException e){
            e.printStackTrace();
        }
        return "线程池："+Thread.currentThread().getName()+"payment_Timeout,id:" + id+"===>"+"OUT +333+ OUT";
    }


    private String payInfo_TimeoutHandle(Integer id){
        return "线程池："+Thread.currentThread().getName()+"8001系統繁忙或运行错误，請稍候再試,id:" + id+"===>"+"超时啦！！！";

    }
}
````
  - 主程序入口增加注解 @EnableCircuitBreaker


+ 80 fallback
  - 服务端也可配置降级

+ 目前问题
  - 每个方法配置一个服务降级，导致代码膨胀也不解耦

+ 解决问题
  - 与feign配合全局性的服务降级
  - 在80客户端配置演示
+ yml 
 ````yml
 server:
  port: 8000

eureka:
  client:
    register-with-eureka: true
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
ribbon:
  #建立连接所用时间，两端连接需要时间
  ReadTimeout: 5000
  # 建立连接从服务器获取可用资源的时间
  ConnectTimeout: 5000
spring:
  application:
    name: cloud-consumer-feign-hystrix-order
feign:
  hystrix:
    enabled: true #feign中开启hystrix

hystrix:
  command:
    default:
      execution:
        timeout:
          enabled: true
        isolation:
          thread:
            timeoutInMilliseconds: 3000
 ```` 
+ 入口类
```` java
package com.ws.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * USER: wang_s
 * DATE：2020/3/12
 * DESC：
 **/
@SpringBootApplication
@EnableFeignClients
@EnableEurekaClient
@EnableHystrix
public class OrderFeignHystrix80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderFeignHystrix80.class,args);
    }
}

````

````service改动
@Component
@FeignClient(value =  "CLOUD-PAYMENT-HYSTRIX-SERVICE",fallback = FeignHystrixFallbackService.class) //增加fallback
public interface OrderFeignHystrixService {

     @GetMapping(value = "/payment/hystrix/ok/{id}")
     CommonResult getOK(@PathVariable("id") Integer id);


    @GetMapping(value = "/payment/hystrix/timeout/{id}")
    CommonResult timeout(@PathVariable("id") Integer id);
    
}

//FeignHystrixFallbackService 类
@Component
public class FeignHystrixFallbackService implements OrderFeignHystrixService {
    @Override
    public CommonResult getOK(Integer id) {
        //接口有问题走这个
        return new CommonResult("getOK,error");
    }

    @Override
    public CommonResult timeout(Integer id) {
        //接口有问题走这个
        return new CommonResult("timeout,error");
    }
}
````

#### 服务熔断
+ SpringCloud框架中，熔断机制是Hystrix实现，Hystrix会监控微服务调用情况，当失败到达一定阈值，缺省是5秒20次调用失败，就会启用熔断机制，熔断机制的注解是@HystrixCommand

+ 断路器涉及三个参数：快照时间窗、请求总数阈值、错误百分比阈值
  - 快照时间窗：断路器确定是否打开需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认最近10秒

  - 请求总数阈值：在快照时间窗内，必须满足请求总数阈值才会熔断。默认20，意味着10秒内，如果该hystrix命令的调用次数不超过20次，即使全部失败，断路器也不会打开。

  - 错误百分比阈值： 当在快照时间窗内，满足了请求总数阈值（30次），如果有15次调用失败，那失败的百分比就是50%，如果错误百分比阈值设置50%的情况下，断路器会打开。

+ 熔断三种状态
  - 熔断打开：请求不再调用当前服务，内部设置时钟一般为MTTR（平均故障处理时间），当熔断打开时常超过所设时钟则到达熔断半开状态。

  - 熔断半开 ：部分请求会根据规则调用当前服务，如果请求成功且符合 规则则认为当前服务恢复政策，关闭熔断。

  - 熔断关闭 ： 熔断关闭不会对服务镜像熔断。

+ 熔断以后的流程：
  - 熔断以后，服务调用将不再调用主逻辑，而是直接调用降级的fallback。
  
  - 主逻辑恢复：当熔断器打开进行熔断以后，hystrix启动一个休眠时间窗，超过这个时间窗，熔断半开，释放一次请求到主逻辑，如果调用正常，熔断关闭。主逻辑恢复。如果这次调用失败，断路器打开，休眠时间窗重新计时。 
  
  
#### 服务限流       
+ Alibaba Sentinel 说明


### 服务监控 hystrixDashboard

+ 监控界面的图形化展示

####  增加9001 Module
+ pom.xml
````java
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

    <artifactId>cloud-comsumer-hystrix-dashboard9001</artifactId>
    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--仪表盘监控-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-hystrix-dashboard</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
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

+ application.yml 增加端口号9001

+ 入口类加注解 @EnableHystrixDashboard

+ 需要被监控的provider 都需要依赖 `spring-boot-starter-actuator`

+ 启动9001，输入 `http://localhost:9001/hystrix` 


#### 被监控的主入口类增加
````java
 /**
     * 此配置是为了服务监控bashdoard配置，与服务容错本身无关，是springcloud升级的坑
     * ServletRegistrationBean因为springboot中默认路径不是/hystrix.stream
     * 本项目在hystrix80增加
     * @return
     */
    @Bean
    public ServletRegistrationBean getServlet(){
        HystrixMetricsStreamServlet streamServlet = new HystrixMetricsStreamServlet();
        ServletRegistrationBean registrationBean = new ServletRegistrationBean(streamServlet);
        registrationBean.setLoadOnStartup(0);
        registrationBean.addUrlMappings("/hystrix.stream");
        registrationBean.setName("HystrixMetricsStreamServlet");
        return registrationBean;
    }
````

+  `http://localhost:9001/hystrix`中输入路径 `localhost:8000` Delay `2000` Title `consumer80` 启动，之后 访问 正确和错误的请求测试断路器监控