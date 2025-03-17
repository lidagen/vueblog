<template><div><h2 id="服务注册中心——zookeeper" tabindex="-1"><a class="header-anchor" href="#服务注册中心——zookeeper"><span>服务注册中心——Zookeeper</span></a></h2>
<h3 id="zookeeper-用作注册中心" tabindex="-1"><a class="header-anchor" href="#zookeeper-用作注册中心"><span>Zookeeper 用作注册中心</span></a></h3>
<ul>
<li>zookeeper可以充当一个服务注册表（Service Registry），让多个服务提供者形成一个集群，让服务消费者通过服务注册表获取具体的服务访问地址（ip+端口）去访问具体的服务提供者。</li>
<li>在zookeeper中，进行服务注册，实际上就是在zookeeper中创建了一个znode节点，该节点存储了该服务的IP、端口、调用方式(协议、序列化方式)等。</li>
<li>zookeeper提供了“心跳检测”功能，它会定时向各个服务提供者发送一个请求（实际上建立的是一个 socket 长连接），如果长期没有响应，服务中心就认为该服务提供者已经“挂了”，并将其剔除。</li>
</ul>
<h3 id="单机版zookeeper服务注册中心" tabindex="-1"><a class="header-anchor" href="#单机版zookeeper服务注册中心"><span>单机版zookeeper服务注册中心</span></a></h3>
<h4 id="启动zk" tabindex="-1"><a class="header-anchor" href="#启动zk"><span>启动ZK</span></a></h4>
<ul>
<li>下载解压zookeeper安装包</li>
<li>启动zkServer.sh和zkCli.sh</li>
</ul>
<h4 id="聚合项目新建一个module" tabindex="-1"><a class="header-anchor" href="#聚合项目新建一个module"><span>聚合项目新建一个Module</span></a></h4>
<ul>
<li>pom.xml</li>
</ul>
<div class="language-pom line-numbers-mode" data-highlighter="prismjs" data-ext="pom"><pre v-pre><code><span class="line">&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot;?&gt;</span>
<span class="line">&lt;project xmlns=&quot;http://maven.apache.org/POM/4.0.0&quot;</span>
<span class="line">         xmlns:xsi=&quot;http://www.w3.org/2001/XMLSchema-instance&quot;</span>
<span class="line">         xsi:schemaLocation=&quot;http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd&quot;&gt;</span>
<span class="line">    &lt;parent&gt;</span>
<span class="line">        &lt;artifactId&gt;cloud2020&lt;/artifactId&gt;</span>
<span class="line">        &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">        &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;</span>
<span class="line">    &lt;/parent&gt;</span>
<span class="line">    &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;</span>
<span class="line"></span>
<span class="line">    &lt;artifactId&gt;cloud-provider-payment8003&lt;/artifactId&gt;</span>
<span class="line"></span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;!--api模块包括了spring-boot-starter-web--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;api&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;${project.version}&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--zookeeper--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-zookeeper-discovery&lt;/artifactId&gt;</span>
<span class="line">            &lt;exclusions&gt;</span>
<span class="line">                &lt;exclusion&gt;</span>
<span class="line">                    &lt;groupId&gt;org.apache.zookeeper&lt;/groupId&gt;</span>
<span class="line">                    &lt;artifactId&gt;zookeeper&lt;/artifactId&gt;</span>
<span class="line">                &lt;/exclusion&gt;</span>
<span class="line">            &lt;/exclusions&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--排除自带的3.5.5beta版,添加和zookeeper安装包相同的版本--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.apache.zookeeper&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;zookeeper&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;3.5.6&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;runtime&lt;/scope&gt;</span>
<span class="line">            &lt;optional&gt;true&lt;/optional&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;test&lt;/scope&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">    &lt;/dependencies&gt;</span>
<span class="line">    &lt;build&gt;</span>
<span class="line">        &lt;plugins&gt;</span>
<span class="line">            &lt;plugin&gt;</span>
<span class="line">                &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;</span>
<span class="line">                &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;</span>
<span class="line">                &lt;configuration&gt;</span>
<span class="line">                    &lt;source&gt;1.8&lt;/source&gt;</span>
<span class="line">                    &lt;target&gt;1.8&lt;/target&gt;</span>
<span class="line">                &lt;/configuration&gt;</span>
<span class="line">            &lt;/plugin&gt;</span>
<span class="line">            &lt;plugin&gt;</span>
<span class="line">                &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">                &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;</span>
<span class="line">                &lt;executions&gt;</span>
<span class="line">                    &lt;execution&gt;</span>
<span class="line">                        &lt;goals&gt;</span>
<span class="line">                            &lt;goal&gt;repackage&lt;/goal&gt;</span>
<span class="line">                        &lt;/goals&gt;</span>
<span class="line">                    &lt;/execution&gt;</span>
<span class="line">                &lt;/executions&gt;</span>
<span class="line">            &lt;/plugin&gt;</span>
<span class="line">        &lt;/plugins&gt;</span>
<span class="line">    &lt;/build&gt;</span>
<span class="line">&lt;/project&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml配置</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8003</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>payment<span class="token punctuation">-</span>service</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">zookeeper</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment">#此处zk的IP配你自己的zk</span></span>
<span class="line">      <span class="token key atrule">connect-string</span><span class="token punctuation">:</span> localhost<span class="token punctuation">:</span><span class="token number">2181</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableDiscoveryClient</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PaymentZK</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">PaymentZK</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="之后可以进入zkcli-sh查看服务是否注册上-consumer同理也可注册上" tabindex="-1"><a class="header-anchor" href="#之后可以进入zkcli-sh查看服务是否注册上-consumer同理也可注册上"><span>之后可以进入zkCli.sh查看服务是否注册上，consumer同理也可注册上</span></a></h4>
<h3 id="zk-、consul-和-eureka-作为注册中心异同点" tabindex="-1"><a class="header-anchor" href="#zk-、consul-和-eureka-作为注册中心异同点"><span>ZK 、Consul 和 Eureka 作为注册中心异同点</span></a></h3>
<ul>
<li><strong>CAP</strong> ：  指的是在一个分布式系统中，一致性（Consistency）、可用性（Availability）、分区容错性（Partition tolerance）。</li>
<li>这三个要素最多只能同时实现两点，不可能三者兼顾。</li>
<li>分布式永远需要满足P，所以只能选择AP或CP</li>
</ul>
<p>组件名 | 语言 | CAP | 服务健康检查 | 对外暴露接口 | SpringCloud集成</p>
<ul>
<li>| :-: | :-: | :-: | -: | :-: | :-: | -:<br>
Eureka  | java  |  AP | 可配支持 | HTTP | 是
Consul  | GO  |  CP | 支持 | HTTP/DNS | 是
Zookeeper  | java  |  CP | 支持 | 客户端 | 是</li>
</ul>
</div></template>


