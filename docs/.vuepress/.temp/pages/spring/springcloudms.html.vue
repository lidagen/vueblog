<template><div><h2 id="springcloud-面试题" tabindex="-1"><a class="header-anchor" href="#springcloud-面试题"><span>SpringCloud 面试题</span></a></h2>
<h3 id="什么是微服务" tabindex="-1"><a class="header-anchor" href="#什么是微服务"><span>什么是微服务</span></a></h3>
<ul>
<li>
<p>微服务架构是一种架构模式或者架构风格，它提倡将<strong>单一的应用程序划分为一组小的服务</strong>，每个服务运行在其独立的<strong>进程</strong>中，服务之间互相协调，互相配合，为用户提供最终价值。</p>
</li>
<li>
<p>服务之间采用轻量级通信机制进行沟通，通常基于HTTP的RESTful API (dubbo采用 RPC机制)</p>
</li>
<li>
<p>每个服务围绕业务进行构建，并能够被独立部署到生产、测试环境。</p>
</li>
<li>
<p>微服务还可避免统一的，集中式服务管理机制，对具体一个服务而言，可以根据业务上下文，选择合适的语言，工具进行构建。</p>
</li>
</ul>
<h3 id="微服务之间如何通信的" tabindex="-1"><a class="header-anchor" href="#微服务之间如何通信的"><span>微服务之间如何通信的</span></a></h3>
<h3 id="springcloud和dubbo有哪些区别" tabindex="-1"><a class="header-anchor" href="#springcloud和dubbo有哪些区别"><span>SpringCloud和Dubbo有哪些区别</span></a></h3>
<p>/     | Dubbo | Spring Cloud</p>
<ul>
<li>| :-: | :-: | :-: | -:
<strong>服务注册中心</strong>     | Zookeeper  |  Spring Cloud Netflix Eurake<br>
<strong>服务调用方式</strong> | RPC  |  REST API
<strong>服务监控</strong> | Dubbo-monitor  |  Spring Boot Admin
<strong>断路器</strong> | 不完善  |  Spring Cloud Netflix Hystrix<br>
<strong>服务网关</strong> | 无  |  Spring Cloud Netflix Zuul
<strong>分布式配置</strong> | 无  |  Spring Cloud  config
<strong>服务跟踪</strong> | 无  |  Spring Cloud  Sleuth
<strong>消息总线</strong> | 无  |  Spring Cloud  Bus
<strong>数据流</strong> | 无  |  Spring Cloud  Stream
<strong>批量任务</strong> | 无  |  Spring Cloud Task</li>
</ul>
<ul>
<li>
<p>Dubbo采用RPC通信方式，SpringCloud采用基于HTTP的REST,后者牺牲了一部分性能换取更高灵活性，不存在代码层面强依赖。</p>
</li>
<li>
<p>半自动和全自动，Spring Cloud可以和Spring家族完美融合，保证更高的稳定性，Dubbo需要对组件之外的东西有足够的了解。</p>
</li>
<li>
<p>社区支持和更新力度，SpringCloud更胜一筹。</p>
</li>
<li>
<p>总结：Dubbo更像是一款RPC框架，而SpringCloud目标是微服务架构下的一站式解决方案。</p>
</li>
</ul>
<h3 id="springboot和springcloud-谈谈对它们的理解" tabindex="-1"><a class="header-anchor" href="#springboot和springcloud-谈谈对它们的理解"><span>SpringBoot和SpringCloud，谈谈对它们的理解</span></a></h3>
<ul>
<li>
<p>Springboot专注与开发单个个体微服务。</p>
</li>
<li>
<p>SpringCloud是关注全局的微服务协调整理治理框架，它将SpringBoot开发的一个个单体微服务整合管理起来。</p>
</li>
<li>
<p>SpringBoot可以独立使用，SpringCloud是依赖SpringBoot的。</p>
</li>
<li>
<p>总结：SpringBoot专注快速，方便的开发单个微服务个体，SpringCloud是专著全局的服务治理框架。</p>
</li>
</ul>
<h3 id="什么是服务熔断-什么是服务降级" tabindex="-1"><a class="header-anchor" href="#什么是服务熔断-什么是服务降级"><span>什么是服务熔断，什么是服务降级</span></a></h3>
<h3 id="微服务的优缺点-说说项目中遇到的坑" tabindex="-1"><a class="header-anchor" href="#微服务的优缺点-说说项目中遇到的坑"><span>微服务的优缺点，说说项目中遇到的坑</span></a></h3>
<ul>
<li>
<p>优点：</p>
<ul>
<li>
<p>每个服务足够内聚，足够小。代码能够聚集在一个单一的业务功能上。</p>
</li>
<li>
<p>开发简单，开发效率高，一个服务可能只需要干一件事。</p>
</li>
<li>
<p>微服务能够被小团队单独开发。</p>
</li>
<li>
<p>微服务是松耦合的,无论开发还是部署都是独立的。</p>
</li>
<li>
<p>微服务便于开发人员理解,修改和维护。</p>
</li>
</ul>
</li>
<li>
<p>缺点：</p>
<ul>
<li>
<p>分布式增加了系统的复杂性。</p>
</li>
<li>
<p>多服务的运维压力比单服务大。</p>
</li>
<li>
<p>系统部署依赖。</p>
</li>
<li>
<p>系统之间调用成本。</p>
</li>
<li>
<p>数据的一致性。</p>
</li>
<li>
<p>加大系统的集成测试难度。</p>
</li>
<li>
<p>加大性能监控难度。</p>
</li>
</ul>
</li>
</ul>
<h3 id="你知道哪些微服务的技术栈" tabindex="-1"><a class="header-anchor" href="#你知道哪些微服务的技术栈"><span>你知道哪些微服务的技术栈？</span></a></h3>
<p>微服务条目 | 落地技术 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
服务开发 | springboot、spring、springMVC  |
服务配置与管理 | Netflix的Archainus、阿里的Diamond 等 |<br>
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
事件消息总线 | SpringCloud bus |</li>
</ul>
<ul>
<li>2020最新技术栈
<img :src="$withBase('/springcloud/1.png')" alt="dock"></li>
</ul>
<h3 id="eureka和zookeeper都可以提供注册与发现-说说它们的区别" tabindex="-1"><a class="header-anchor" href="#eureka和zookeeper都可以提供注册与发现-说说它们的区别"><span>eureka和zookeeper都可以提供注册与发现，说说它们的区别</span></a></h3>
</div></template>


