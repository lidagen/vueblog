## SpringCloud 面试题

### 什么是微服务

+ 微服务架构是一种架构模式或者架构风格，它提倡将**单一的应用程序划分为一组小的服务**，每个服务运行在其独立的**进程**中，服务之间互相协调，互相配合，为用户提供最终价值。

+ 服务之间采用轻量级通信机制进行沟通，通常基于HTTP的RESTful API (dubbo采用 RPC机制)

+ 每个服务围绕业务进行构建，并能够被独立部署到生产、测试环境。

+   微服务还可避免统一的，集中式服务管理机制，对具体一个服务而言，可以根据业务上下文，选择合适的语言，工具进行构建。

### 微服务之间如何通信的

### SpringCloud和Dubbo有哪些区别
   /     | Dubbo | Spring Cloud
- | :-: | :-: | :-: | -:
**服务注册中心**     | Zookeeper  |  Spring Cloud Netflix Eurake    
**服务调用方式** | RPC  |  REST API
**服务监控** | Dubbo-monitor  |  Spring Boot Admin
**断路器** | 不完善  |  Spring Cloud Netflix Hystrix     
**服务网关** | 无  |  Spring Cloud Netflix Zuul
**分布式配置** | 无  |  Spring Cloud  config 
**服务跟踪** | 无  |  Spring Cloud  Sleuth 
**消息总线** | 无  |  Spring Cloud  Bus 
**数据流** | 无  |  Spring Cloud  Stream 
**批量任务** | 无  |  Spring Cloud Task  

+   Dubbo采用RPC通信方式，SpringCloud采用基于HTTP的REST,后者牺牲了一部分性能换取更高灵活性，不存在代码层面强依赖。

+ 半自动和全自动，Spring Cloud可以和Spring家族完美融合，保证更高的稳定性，Dubbo需要对组件之外的东西有足够的了解。

+ 社区支持和更新力度，SpringCloud更胜一筹。

+ 总结：Dubbo更像是一款RPC框架，而SpringCloud目标是微服务架构下的一站式解决方案。

### SpringBoot和SpringCloud，谈谈对它们的理解

+ Springboot专注与开发单个个体微服务。

+ SpringCloud是关注全局的微服务协调整理治理框架，它将SpringBoot开发的一个个单体微服务整合管理起来。

+ SpringBoot可以独立使用，SpringCloud是依赖SpringBoot的。

+ 总结：SpringBoot专注快速，方便的开发单个微服务个体，SpringCloud是专著全局的服务治理框架。

### 什么是服务熔断，什么是服务降级

### 微服务的优缺点，说说项目中遇到的坑

+ 优点：
  - 每个服务足够内聚，足够小。代码能够聚集在一个单一的业务功能上。

  - 开发简单，开发效率高，一个服务可能只需要干一件事。

  - 微服务能够被小团队单独开发。

  - 微服务是松耦合的,无论开发还是部署都是独立的。

  - 微服务便于开发人员理解,修改和维护。

+ 缺点：
  - 分布式增加了系统的复杂性。

  - 多服务的运维压力比单服务大。

  - 系统部署依赖。

  - 系统之间调用成本。

  - 数据的一致性。

  - 加大系统的集成测试难度。

  - 加大性能监控难度。

### 你知道哪些微服务的技术栈？

微服务条目 | 落地技术 | 备注  
- | :-: | :-: | :-: | -:
服务开发 | springboot、spring、springMVC  | 
服务配置与管理 | Netflix的Archainus、阿里的Diamond 等 |   
服务注册与发现 | Eureka、zookeeper、Consul 等 | 
服务调用 | Rest、RPC、gRPC  | 
服务熔断 | Hystrix  、Envoy等| 
服务负载均衡 | Ribbon、Ngnix  | 
服务接口调用 | Feign等  | 
消息队列 | Kafka、RabbitMQ、ActiveMQ  | 
服务配置中心管理 | SpringCloudConfig、Chef等  | 
服务路由（API网关） | Zuul等  | 
服务监控 | Zabbix  、Nagios、Spectator等    | 
全链路追踪 | Zipkin、Dapper、Brave等 | 
服务部署 | Docker、K8S | 
数据流操作开发包 | SpringCloud Stream | 
事件消息总线 | SpringCloud bus | 

### eureka和zookeeper都可以提供注册与发现，说说它们的区别