<template><div><h2 id="springcloud-stream-消息驱动" tabindex="-1"><a class="header-anchor" href="#springcloud-stream-消息驱动"><span>SpringCloud Stream -消息驱动</span></a></h2>
<p>面对多种消息中间件，消息驱动Stream让我们不再关注MQ内部具体细节，我们只需要用一种适配绑定的方式，实现各种MQ内切换。</p>
<h3 id="什么是消息驱动" tabindex="-1"><a class="header-anchor" href="#什么是消息驱动"><span>什么是消息驱动</span></a></h3>
<ul>
<li>消息驱动概述：
<ul>
<li>屏蔽底层<strong>消息中间件</strong>的差异，统一消息的编程模型。</li>
</ul>
</li>
</ul>
<h3 id="什么是springcloud-stream" tabindex="-1"><a class="header-anchor" href="#什么是springcloud-stream"><span>什么是SpringCloud Stream</span></a></h3>
<ul>
<li>
<p>官方定义SpringCloud Stream 是一个构建消息驱动微服务框架</p>
</li>
<li>
<p>应用程序通过inputs和outputs来与Stream中binder对象交互。通过我们配置来binding(绑定)，而Stream的binder对象负责和消息中间件交互。</p>
</li>
<li>
<p>通过使用Spring Integration 来连接消息代理中间件以实现消息事件驱动。Stream为消息中间件供应商提供了个性化自动配置实现，引用了发布-订阅、消费组、分区三个核心概念。</p>
</li>
<li>
<p>目前仅支持RabbitMQ、Kafka</p>
</li>
</ul>
<h3 id="stream-设计思想" tabindex="-1"><a class="header-anchor" href="#stream-设计思想"><span>Stream 设计思想</span></a></h3>
<h4 id="标准的mq" tabindex="-1"><a class="header-anchor" href="#标准的mq"><span>标准的MQ</span></a></h4>
<ul>
<li>
<p>生产者/消费者之间靠<strong>消息</strong>传递信息内容-&gt;Message</p>
</li>
<li>
<p>消息必须走特定的通道-&gt;消息通道MessageChannel</p>
</li>
<li>
<p>消息通道消息如何被消费，谁<strong>处理</strong>-&gt;消息通道MessageChannel的子接口SubscribableChannel,由MessageHandle 消息处理器所订阅。</p>
</li>
</ul>
<h4 id="为什么用stream" tabindex="-1"><a class="header-anchor" href="#为什么用stream"><span>为什么用Stream</span></a></h4>
<ul>
<li>
<p>比如我们项目用了rabbitMQ和Kafka,由于两个中间件架构不同，这些中间件的差异导致我们实际开发增加一定困扰，如果我们用了这两种其中的一种，后续架构切换，需要迁移到另一种，这时候无疑是一种灾难。</p>
</li>
<li>
<p>Stream给我们提供了一种解耦合的方式。</p>
</li>
<li>
<p>Stream中消息通信方式遵循了发布-订阅模式 -&gt;topic主题进行广播</p>
<ul>
<li>RabbitMQ中就算Exchange</li>
<li>Kafka中就是Topic</li>
</ul>
</li>
</ul>
<h4 id="stream-如何统一底层差异" tabindex="-1"><a class="header-anchor" href="#stream-如何统一底层差异"><span>Stream 如何统一底层差异</span></a></h4>
<ul>
<li>
<p>在没有绑定器概念前，不同的消息中间件和应用整合时，其实现细节有较大差异性。</p>
</li>
<li>
<p>通过绑定器作为中间层，完美的实现了<strong>应用程序和消息中间件细节之间的隔离</strong>。通过向应用程序暴露统一的channel通道，使得应用不需要考虑不同中间件的不同实现。</p>
</li>
</ul>
<h4 id="绑定器binder" tabindex="-1"><a class="header-anchor" href="#绑定器binder"><span>绑定器binder</span></a></h4>
<ul>
<li>
<p>通过定义绑定器binder作为中间层，实现了应用程序与消息中间件细节之间的隔离。</p>
</li>
<li>
<p>Binder</p>
<ul>
<li>
<p>input对应消费者</p>
</li>
<li>
<p>output对应生产者</p>
</li>
<li>
<p>架构图：
<img :src="$withBase('/springcloud/4.png')" alt="dock"></p>
</li>
</ul>
</li>
</ul>
<h4 id="stream-的标准流程" tabindex="-1"><a class="header-anchor" href="#stream-的标准流程"><span>Stream 的标准流程</span></a></h4>
<ul>
<li>
<p>Binder: 方便的连接中间件，屏蔽差异</p>
</li>
<li>
<p>Channel: 是队列Queue的一种抽象，在消息通讯系统中就是实现存储和转发的媒介，通过Channel对队列配置。</p>
</li>
<li>
<p>Source和Sink: 简单理解可以参照的就是Stream自身，从Stream发布消息就是输出，接受消息就是输入。</p>
</li>
</ul>
<h4 id="常用api和注解" tabindex="-1"><a class="header-anchor" href="#常用api和注解"><span>常用API和注解</span></a></h4>
<p>组成 | 说明 |</p>
<ul>
<li>| :-: | :-: | :-: | -:
Middleware | 中间件，目前支持RabbitMQ\Kafka
Binder | Binder是应用和消息中间件之间的封装
@Input | 注解标识输入通道，通过输入通道接收消息到应用程序
@Output | 注解标识输出通道，通过输出通道发送消息到队列
@StreamListener |  监听队列，用于消费者队列接收消息
@Enablebinding | 指信道channel和exchange绑定在一起</li>
</ul>
<h3 id="项目构建-一个生产者provider8801-两个消费者consumer8802-8803" tabindex="-1"><a class="header-anchor" href="#项目构建-一个生产者provider8801-两个消费者consumer8802-8803"><span>项目构建，一个生产者provider8801,两个消费者consumer8802 8803</span></a></h3>
<h4 id="provieder8801" tabindex="-1"><a class="header-anchor" href="#provieder8801"><span>provieder8801</span></a></h4>
<ul>
<li>pom.xml</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token prolog">&lt;?xml version="1.0" encoding="UTF-8"?></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>project</span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>cloud2020<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.ws.springcloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>1.0-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>modelVersion</span><span class="token punctuation">></span></span>4.0.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>modelVersion</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>cloud-stream-rabbitmq-provider8801<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.ws.springcloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>${project.version}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-actuator<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-stream-rabbit<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-devtools<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">></span></span>runtime<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>optional</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>optional</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-netflix-eureka-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">></span></span>test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>project</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8801</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> stream<span class="token punctuation">-</span>rabbitmq<span class="token punctuation">-</span>provider</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">stream</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">binders</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">defaultRabbit</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> rabbit</span>
<span class="line">          <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">host</span><span class="token punctuation">:</span> localhost</span>
<span class="line">                <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span></span>
<span class="line">                <span class="token key atrule">username</span><span class="token punctuation">:</span> admin</span>
<span class="line">                <span class="token key atrule">password</span><span class="token punctuation">:</span> admin</span>
<span class="line">      <span class="token key atrule">bindings</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">output</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">destination</span><span class="token punctuation">:</span> studyExchange</span>
<span class="line">          <span class="token key atrule">content-type</span><span class="token punctuation">:</span> application/json</span>
<span class="line">         <span class="token comment"># binder: defaultRabbit</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">lease-renewal-interval-in-seconds</span><span class="token punctuation">:</span> <span class="token number">2</span> <span class="token comment">#</span></span>
<span class="line">    <span class="token key atrule">lease-expiration-duration-in-seconds</span><span class="token punctuation">:</span> <span class="token number">5</span></span>
<span class="line">    <span class="token key atrule">instance-id</span><span class="token punctuation">:</span> send<span class="token punctuation">-</span>8801.com</span>
<span class="line">    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">StreamRabbitProvider8801</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">StreamRabbitProvider8801</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>发送service</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>service</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>hutool<span class="token punctuation">.</span>core<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">IdUtil</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">EnableBinding</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>messaging<span class="token punctuation">.</span></span><span class="token class-name">Source</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>messaging<span class="token punctuation">.</span></span><span class="token class-name">MessageChannel</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>messaging<span class="token punctuation">.</span>support<span class="token punctuation">.</span></span><span class="token class-name">MessageBuilder</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Resource</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/17</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token annotation punctuation">@EnableBinding</span><span class="token punctuation">(</span><span class="token class-name">Source</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token comment">//定义消息的推送管道</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SendMessageImpl</span> <span class="token keyword">implements</span> <span class="token class-name">SendMessage</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Resource</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">MessageChannel</span> output<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> uuid <span class="token operator">=</span> <span class="token class-name">IdUtil</span><span class="token punctuation">.</span><span class="token function">simpleUUID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        output<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token class-name">MessageBuilder</span><span class="token punctuation">.</span><span class="token function">withPayload</span><span class="token punctuation">(</span>uuid<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"=====>uuid:"</span><span class="token operator">+</span>uuid<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="consumer8802-8803" tabindex="-1"><a class="header-anchor" href="#consumer8802-8803"><span>consumer8802 8803</span></a></h4>
<ul>
<li>
<p>pom.xml与8801相同</p>
</li>
<li>
<p>yml</p>
</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8802</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> stream<span class="token punctuation">-</span>rabbitmq<span class="token punctuation">-</span>consumer</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">stream</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">binders</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">defaultRabbit</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">type</span><span class="token punctuation">:</span> rabbit</span>
<span class="line">          <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">              <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span></span>
<span class="line">                <span class="token key atrule">host</span><span class="token punctuation">:</span> localhost</span>
<span class="line">                <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span></span>
<span class="line">                <span class="token key atrule">username</span><span class="token punctuation">:</span> admin</span>
<span class="line">                <span class="token key atrule">password</span><span class="token punctuation">:</span> admin</span>
<span class="line">      <span class="token key atrule">bindings</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">input</span><span class="token punctuation">:</span> <span class="token comment"># 消费者这里是input</span></span>
<span class="line">          <span class="token key atrule">destination</span><span class="token punctuation">:</span> studyExchange</span>
<span class="line">          <span class="token key atrule">content-type</span><span class="token punctuation">:</span> application/json</span>
<span class="line">          <span class="token key atrule">group</span><span class="token punctuation">:</span> consumerA <span class="token comment"># 分组，同一服务多个实例只接收消息一次</span></span>
<span class="line">         <span class="token comment"># binder: defaultRabbit</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">lease-renewal-interval-in-seconds</span><span class="token punctuation">:</span> <span class="token number">2</span> <span class="token comment">#</span></span>
<span class="line">    <span class="token key atrule">lease-expiration-duration-in-seconds</span><span class="token punctuation">:</span> <span class="token number">5</span></span>
<span class="line">    <span class="token key atrule">instance-id</span><span class="token punctuation">:</span> send<span class="token punctuation">-</span>8801.com</span>
<span class="line">    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">StreamRabbitConsumer8802</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">StreamRabbitConsumer8802</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span>   </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>接收Listener</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>controller</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Value</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">EnableBinding</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">StreamListener</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>stream<span class="token punctuation">.</span>messaging<span class="token punctuation">.</span></span><span class="token class-name">Sink</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>messaging<span class="token punctuation">.</span></span><span class="token class-name">Message</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Component</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/17</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token annotation punctuation">@EnableBinding</span><span class="token punctuation">(</span><span class="token class-name">Sink</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReceiveMessageListener</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${server.port}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> serverPort<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@StreamListener</span><span class="token punctuation">(</span><span class="token class-name">Sink</span><span class="token punctuation">.</span><span class="token constant">INPUT</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">input</span><span class="token punctuation">(</span><span class="token class-name">Message</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> message<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"消费1号，端口："</span><span class="token operator">+</span>serverPort<span class="token operator">+</span><span class="token string">",--->接收的消息"</span><span class="token operator">+</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="分组问题" tabindex="-1"><a class="header-anchor" href="#分组问题"><span>分组问题</span></a></h4>
<ul>
<li>同一个消息，会被多个consumer重复消费</li>
<li>导致的原因是，默认分组group是不同的，组流水号不一样。不同组流水号可以重复消费，如果不想被多实例项目重复消费需要解决这个问题。</li>
</ul>
<h4 id="stream-消息持久化" tabindex="-1"><a class="header-anchor" href="#stream-消息持久化"><span>Stream 消息持久化</span></a></h4>
<ul>
<li>
<p>假设有两个不同微服务需要接收provider消息，一个设置分组group,一个没有。两个服务都未启动。</p>
</li>
<li>
<p>假设MQ上有一条消息未消费，两个服务重新启动，会发现设置group的能接收到MQ的消息，未设置group的会丢失消息。</p>
</li>
<li>
<p>为了避免消费者服务宕机后的消息丢失，设置分组group非常重要。</p>
</li>
</ul>
</div></template>


