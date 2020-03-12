## 服务调用——OpenFeign

### OpenFeign 是什么
+ Feign是一个声名式WebService***客户端**，使用Feign能让编写WebService更加简单。
+ 它的使用方法是**定义一个服务接口然后在上面添加注解**，Feign也支持可拔插式的编码器和解码器，SpringCloud对Feign进行了封装，使其支持SpringMVC标准注解和HttpMessageConverters,Feign可以与Eureka和Ribbon组合使用支持负载均衡。
+ Feign内部是Ribbon，是对Ribbon的增强。OpenFeign  是 Feign的升级。

### OpenFeign 能干什么
+ 前面在使用Ribbon + RestTemplate时，利用RestTemplate对http请求封装，形成了一套模板化调用方法，但实际开发中，对于服务依赖的调用不止一处，**往往一个接口被多处调用，所以通常会针对每个微服务自行封装一些客户端来包装这些依赖服务的调用。**Feign在此基础上做了进一步封装，由他来帮我们定义和实现依赖服务的接口，我们只需要增加一个注解（@FeignClient）,即可完成服务提供方的接口绑定，简化了使用springcloud Ribbon时，自动封装服务调用客户端的开发量。

### OpenFeign使用步骤
+ 还是使用之前7001 7002两个Eureka注册中心以及8001 8002两个payment服务端。
+ feign 使用在客户端，用来对服务端的访问，新增一个Module，用来进行改造。
+ feign是自定义一个servcie 接口，通过service接口的@FeignClient指向在Eureka上注册的微服务名称，接口的方法和被调用服务提供的controller方法一致即可
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

    <artifactId>cloud-comsumer-feign-order80</artifactId>

    <dependencies>
        <dependency>
            <groupId>com.ws.springcloud</groupId>
            <artifactId>api</artifactId>
            <version>${project.version}</version>
        </dependency>
        <!--openFeign-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
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

+ yml
````yml
server:
  port: 8000


eureka:
  client:
    # 不注册进EUREKA  false
    register-with-eureka: false
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/

# 这里演示，就不注册进eureka中。
````

+ 入口类添加注解
````java
@SpringBootApplication
@EnableFeignClients//feign注解
public class OrderFeign80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderFeign80.class,args);
    }
}
````

+ 新增接口
````java
import com.ws.springcloud.common.result.CommonResult;
import com.ws.springcloud.entites.payment.Payment;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(value =  "CLOUD-PAYMENT-SERVICE")//CLOUD-PAYMENT-SERVICE为Eureka上注册的，payment服务端名词
@Component
public interface PaymentFeignService {
    //此处接口和payment服务端controller保持一致，路径也为payment服务端对外暴露的路径
    @GetMapping(value="/payment/get/{id}")
    CommonResult<Payment> getById(@PathVariable("id") Long id);

    @PostMapping(value = "/create")
    CommonResult create(@RequestBody Payment payment);

}
````

+ 客户端controller中使用
````java
@RestController
@RequestMapping("/feign")
public class OrderFeignController {

    @Autowired
    private PaymentFeignService paymentFeignService;

    @GetMapping(value="/get/{id}")
    CommonResult<Payment> getById(@PathVariable("id") Long id){
        return paymentFeignService.getById(id);
    }
}
````

### OpenFeign 的负载均衡
+ OpenFeign 默认自带负载均衡。

### OpenFeign 超时控制
+ OpenFeign 默认的调用超时为1秒钟，如果调用过程超过了1秒，Feign客户端会直接返回报错，为了避免这种情况，我们有时需要对Feign客户端进行超时控制。
+ yml中配置改造
````yml
server:
  port: 8000


eureka:
  client:
    # 不注册🥇进EUREKA
    register-with-eureka: false
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
ribbon:
  #建立连接所用时间，两端连接需要时间
  ReadTimeout: 5000
  # 建立连接从服务器获取可用资源的时间
  ConnectTimeout: 5000

````

### OpenFeign 的日志增强
+ Feign提供了日志打印功能，我们可以通过配置调整日志级别，从而了解feign请求过程中http细节。
+ 说白了就是**对feign接口调用的情况进行监控和输出**

+ 客户端增加日志配置类
````java
@Configuration
public class FeignConfig {
    @Bean
    Logger.Level feignLoggerLevel(){
        return Logger.Level.FULL;
    }
}
````

+ yml配置
````yml
server:
  port: 8000


eureka:
  client:
    # 不注册进EUREKA
    register-with-eureka: false
    service-url:
      #设置与eureka交互的地址查询服务和注册服务需要依赖这个地址
      defaultZone: http://eureka7001:7001/eureka/,http://eureka7002:7002/eureka/
ribbon:
  #建立连接所用时间，两端连接需要时间
  ReadTimeout: 5000
  # 建立连接从服务器获取可用资源的时间
  ConnectTimeout: 5000
logging:
  level:
    # 可以详细设置哪一个接口，也可以到包
    com.ws.springcloud.service.PaymentFeignService: debug
```