## 负载均衡服务调用——Ribbon

### Ribbon是什么
#### Ribbon简介
+ Ribbon是Netflix发布的开源项目，主要功能是提供**客户端软件的负载均衡算法和服务调用**，Ribbon提供了一系列完善的配置项如连接超时、重试等。Ribbon会帮助我们基于某种规则（简单轮询、随机连接等）去连接机器，我们也可以实现自定义的负载均衡算法。
+ Ribbon就是负载均衡+RestTemplate的调用

#### 什么是负载均衡
+ 简单来说就是将用户的请求平摊的分配给多个服务器上，从而达到系统的HA（高可用）
+ 常见的负载均衡软件有Nginx、LVS、硬件F5等。

#### Ribbon负载均衡和Nginx负载均衡的区别
+ Nginx是服务器负载均衡，客户端所有请求都交给Nginx,然后由Nginx实现转发请求，即负载均衡在服务端实现的。
+ Ribbon本地负载均衡，在调用微服务接口时，会在注册中心上获取注册信息服务列表后缓存在JVM本地，从而在本地实现RPC远程调用服务。    

### Ribbon负载均衡
+ 架构说明： Ribbon是一个软负载均衡**客户端**组件，他可以和其它所需求的客户端结合使用，和eureka结合只是其中一个实例。
+ pom.xml
````pom
# spring-cloud-starter-netflix-eureka-client 中已经包含了spring-cloud-starter-netflix-ribbon
# 如果不和eureka集成则单独引入
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
````
+ RestTemplate使用
  - getForObject/getForEntity方法 | postForObject/postForEntiry方法
  - ForObject返回是JSON串，ForEntity返回的是对象，并包含返回头信息，状态码等。

### Ribbon 核心组件IRule
+ IRule是个接口，其下有多个负载均衡策略
+ 替换负载策略：
  - RoundRobinRule：轮询
  - RandomRule： 随机
  - RetryRule： 先按照RoundRobinRule策略获取服务，如果获取失败则在指定时间重连
  - BestAvailableRule： 会过滤掉多次访问失败的服务，然后挑一个并发量最小的连接
  - AvailabilityFilteringRule：先过滤失败的服务，挑并发最小的连接
  - WeightedResponseTimeRule: 继承RoundRobinRule并增加了权重

#### 负载均衡切换（配置在之前eureka项目的oder80客户端中，eureka注册中心和服务端payment8001 payment8002不需要改动   ）
+ 客户端增加自定义配置类（这个配置类不能放在@CompaseScan能扫描到的包下，否则这个配置类会被所有Ribbon客户端共享，达不到特殊定制的目的）
````java
package com.ws.ribbon;

import com.netflix.loadbalancer.AvailabilityFilteringRule;
import com.netflix.loadbalancer.IRule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * USER: wang_s
 * DATE：2020/3/11
 * DESC：选择AvailabilityFilteringRule策略，可以在一台服务端挂掉后所有请求负载到另一台
 **/
@Configuration
public class RibbonConfig {
    @Bean
    public IRule getRule(){
        return new AvailabilityFilteringRule();
    }
}

````
+ 入口类增加注解
````java
package com.ws.springcloud;

import com.ws.ribbon.RibbonConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.ribbon.RibbonClient;

/**
 * USER: wang_s
 * DATE：2020/3/9
 * DESC：RibbonClient 的name是需要修改负载均衡服务的名称，configuration是配置负载的配置类
 **/
@SpringBootApplication
@EnableEurekaClient
@RibbonClient(name="CLOUD-PAYMENT-SERVICE",configuration = RibbonConfig.class)
public class OrderMain80 {
    public static void main(String[] args) {
        SpringApplication.run(OrderMain80.class,args);
    }
}

````

### Ribbon 负载均衡算法
#### 原理
+ 负载均衡算法：rest接口第几次请求的数字对服务器集群数取余（请求次数%服务器数量）。每次服务器重启后计数重新开始。
````java
/**获取服务器数量的方法**/
List  instance=discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
````
#### 源码
````java
/**CAS 自旋锁**/
public class RoundRobinRule extends AbstractLoadBalancerRule {
    //下个server的下标
    private AtomicInteger nextServerCyclicCounter;
    private static final boolean AVAILABLE_ONLY_SERVERS = true;
    private static final boolean ALL_SERVERS = false;
    private static Logger log = LoggerFactory.getLogger(RoundRobinRule.class);

    public RoundRobinRule() {
        this.nextServerCyclicCounter = new AtomicInteger(0);
    }

    public RoundRobinRule(ILoadBalancer lb) {
        this();
        this.setLoadBalancer(lb);
    }

    public Server choose(ILoadBalancer lb, Object key) {
        if (lb == null) {
            log.warn("no load balancer");
            return null;
        } else {
            Server server = null;
            int count = 0;

            while(true) {
                if (server == null && count++ < 10) {
                    List<Server> reachableServers = lb.getReachableServers();
                    List<Server> allServers = lb.getAllServers();
                    int upCount = reachableServers.size();
                    int serverCount = allServers.size();
                    if (upCount != 0 && serverCount != 0) {
                        //自旋锁，获取下一个机器下标，并且修改nextServerCyclicCounter数值
                        int nextServerIndex = this.incrementAndGetModulo(serverCount);
                        server = (Server)allServers.get(nextServerIndex);
                        if (server == null) {
                            Thread.yield();
                        } else {
                            if (server.isAlive() && server.isReadyToServe()) {
                                return server;
                            }

                            server = null;
                        }
                        continue;
                    }

                    log.warn("No up servers available from load balancer: " + lb);
                    return null;
                }

                if (count >= 10) {
                    log.warn("No available alive servers after 10 tries from load balancer: " + lb);
                }

                return server;
            }
        }
    }
    /**自旋锁，保证原子性获取下一个server坐标
    **/
    private int incrementAndGetModulo(int modulo) {
        int current;
        int next;
        do {
            //获取AtomicInteger计数
            current = this.nextServerCyclicCounter.get();
            //计数%机器数
            next = (current + 1) % modulo;
            //CSA,对比两个数字交换位置
        } while(!this.nextServerCyclicCounter.compareAndSet(current, next));

        return next;
    }

    public Server choose(Object key) {
        return this.choose(this.getLoadBalancer(), key);
    }

    public void initWithNiwsConfig(IClientConfig clientConfig) {
    }
}

````
#### 手写算法

+ 思路：
  - 算法应该在80客户端实现。
  - DiscoveryClient 可以获取所有的List&lt;  ServiceInstance &gt;，我们需要写一个算法根据 **访问次数%服务器个数 **得到下次访问的ServiceInstance
````java
  //接口
  public interface LoadBalance {
    /**
     * 从Eureka中所有的ServiceInstanceList 挑选符合负载均衡的ServiceInstance
     * @param serviceInstances
     * @return
     */
    ServiceInstance serviceInstance(List<ServiceInstance> serviceInstances);
   }
````

```` java
//实现类
@Component
public class MyLB implements LoadBalance {
    private AtomicInteger integer = new AtomicInteger(0);


    /**自旋锁 获取第几次的访问**/
    public final int getAndIncrement() {
        //当前
        int current;
        //下一个下标
        int next;
        do {
            //当前数字
            current = this.integer.get();
            next = current >= Integer.MAX_VALUE ? 0 : current + 1;
        } while (!this.integer.compareAndSet(current,next));
        System.out.println("***第几次访问next:***" + next);
        return next;
    }

    @Override
    public ServiceInstance serviceInstance(List<ServiceInstance> serviceInstances) {
        //次数%服务端个数
        int index = getAndIncrement() % serviceInstances.size();
        return serviceInstances.get(index);
    }
}
````

  - controller调用
 ````java
 @RestController
@Slf4j
@RequestMapping("/consumer")
public class OrderController {
   

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private DiscoveryClient client;

    @Autowired
    LoadBalance loadBalance;

    @GetMapping("/payment/getLb")
    public CommonResult getLb(){
        URI uri= null;
         /**CLOUD-PAYMENT-SERVICE是eureka中注册的名称**/
        List<ServiceInstance> instances = client.getInstances("CLOUD-PAYMENT-SERVICE");
        if (!CollectionUtils.isEmpty(instances)){
            ServiceInstance serviceInstance = loadBalance.serviceInstance(instances);
             uri = serviceInstance.getUri();

        }

        return restTemplate.getForObject(uri+"/payment/getLb",CommonResult.class);
    }
}
 ```` 
 - 取消config中的@LoadBalance注解
 ````java
 @Configuration
public class ApplicationConfig {
    @Bean
    //@LoadBalanced//负载均衡
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
 ````

