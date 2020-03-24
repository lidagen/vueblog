## SpringCloud 分布式链路追踪 Sleuth

### Sleuth 是什么
+ Spring Cloud Sleuth 提供了一套完整的服务跟踪解决方案，在分布式系统中提供追踪解决方案并兼容zipkin

### Sleuth 解决什么问题
 + 在微服务架构中，一个由客户端发起的请求在后端系统中会经过多个不同的服务端的调用来协同产生最后的请求结果，每一个前段的请求都会形成一条复杂的分布式调用链路，链路中任何一个环节出现了高延时或者请求都会导致整个请求失败。

  + 我们在微服务架构里面，我们有必要知道，一个流程走了多少步，走过了多少节点，每一步的耗时情况。Sleuth出现就是解决这个问题。

### Sleuth的zipkin搭建安装
+ zipkin下载安装
  - spring cloud F版之后不需要  构建zipkin Server了，只需要下载jar 运行
  - 下载地址： `https://dl.bintray.com/openzipkin/maven/io/zipkin/java/zipkin-server/`  下载 `zipkin-server-2.12.9-exec.jar`

+ java -jar   zipkin-server-2.12.9-exec.jar 运行

+ 运行控制台 `http://localhost:9411/zipkin/`

### zipkin调用图    

<img :src="$withBase('/springcloud/6.png')" alt="dock">

+ 名词解释：
  - Trace: 类似树结构的span集合，表示同一调用链路，存在唯一标识。
  - span: 表示调用链路来源，通俗理解span就是一次请求信息。

  ### 项目演示（一个euraka,一个服务端8001，一个客户端80）
  #### 8001 
  + 增加zipkin依赖
  ````xml
  <!--包含seluth和zipkin -->
  <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zipkin</artifactId>
        </dependency>
  ````

  + yml 增加
  ````yml
  spring:
  application:
    name: cloud-payment-service
  zipkin:
    base-url: http://localhost:9411
  sleuth:
    sampler:
      probability: 1 #采样样本，0-１之间，1表示全部采样
  ````

  + controller
  
  ````java
   @GetMapping("/zipkin")
    public CommonResult getZipkin(){
        return new CommonResult("zipkin调用成功！！！");
    }
  ````

   #### 80 增加配置如同8001 
   + 增加controller
   ````java
   @GetMapping("/payment/getZipkin")
    public CommonResult getZipkin(){
            return restTemplate.getForObject(PAYMENT_URL+"/zipkin",CommonResult.class);
    }
   ````

   + 顺序启动eureka、8001、80，调用 `localhost:8000/consumer/payment/getZipkin`


   + 访问 `http://localhost:9411/zipkin/`,可以选择服务，来查看调用情况，查看依赖看链路调用关系等


    

  
