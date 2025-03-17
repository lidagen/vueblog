<template><div><h2 id="服务注册中心——eureka" tabindex="-1"><a class="header-anchor" href="#服务注册中心——eureka"><span>服务注册中心——Eureka</span></a></h2>
<h4 id="服务治理" tabindex="-1"><a class="header-anchor" href="#服务治理"><span>服务治理</span></a></h4>
<ul>
<li>在传统rpc远程调用框架中，管理每个服务与服务之间的关系比较复杂，所以需要服务治理，管理服务于服务之间依赖关系，可以实现服务调用，负载均衡，容错，实现服务的注册与发现。</li>
</ul>
<h4 id="eureka的架构" tabindex="-1"><a class="header-anchor" href="#eureka的架构"><span>eureka的架构</span></a></h4>
<ul>
<li>eureka采用CS架构，Eureka Server作为服务注册功能的服务器，它是注册中心，而系统中其它的微服务，使用Eureka 客户端连接到Eureka Server并维持心跳，这样系统维护人员就能通过Eureka Server来检测各个微服务是否健康。</li>
<li>在服务注册发现中，有一个注册中心（Eureka Server），当服务器启动时(Consumer|Provider),会把自己的信息以<strong>别名</strong>注册到注册中心上，另一方（消费者|服务提供者），以该别名去注册中心获取实际通讯地址，再实现本地RPC调用RPC远程的设计思想。</li>
<li>架构图如下：
<img :src="$withBase('/springcloud/2.png')" alt="dock"></li>
</ul>
<h4 id="基本规则" tabindex="-1"><a class="header-anchor" href="#基本规则"><span>基本规则</span></a></h4>
<ul>
<li>服务启动时会获取服务的基本信息对象，然后注册到服务治理中心eureka中.</li>
<li>注册完成后会把注册信息缓存到本地内存中。</li>
<li>客户端30s(可配置)发送一次心跳到服务端。</li>
<li>服务中心90s(可配置)未收到心跳会认为客户端挂了，会删掉服务信息。</li>
<li>服务停止前，服务会主动发送一个停止请求，服务治理中心会删除这个服务的信息。</li>
<li>如果Eureka Server收到的心跳包不足正常值的85%（可配置）就会进入自我保护模式，在这种模式下，Eureka Server不会删除任何服务信息。</li>
</ul>
<h4 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现"><span>代码实现</span></a></h4>
<ul>
<li>本例子中，参照架构图，实现两个服务中心+两个服务提供者Provider+一个消费方的架构实现</li>
</ul>
<h4 id="创建eureka服务中心-端口号7001、7002-只列出一个-另一个类似" tabindex="-1"><a class="header-anchor" href="#创建eureka服务中心-端口号7001、7002-只列出一个-另一个类似"><span>创建Eureka服务中心（端口号7001、7002）,只列出一个，另一个类似</span></a></h4>
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
<span class="line">    &lt;artifactId&gt;eureka-server7002&lt;/artifactId&gt;</span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;api&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;${project.version}&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-netflix-eureka-server&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;runtime&lt;/scope&gt;</span>
<span class="line">            &lt;optional&gt;true&lt;/optional&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;test&lt;/scope&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">    &lt;/dependencies&gt;</span>
<span class="line"></span>
<span class="line">&lt;/project&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml配置</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">7002</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token comment"># eureka自我保护关闭，保证服务不可用时剔除</span></span>
<span class="line">  <span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">enable-self-preservation</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">    <span class="token key atrule">eviction-interval-timer-in-ms</span><span class="token punctuation">:</span> <span class="token number">2000</span></span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> eureka7002</span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token comment"># 由于在一台机子上，IP一样，所以修改host ,eureka7001 eureka7002都指向本机</span></span>
<span class="line">      <span class="token comment"># 7002的实例指向7001，实现服务中心互相注册</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/</span>
<span class="line">    <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line">    <span class="token key atrule">fetch-registry</span><span class="token punctuation">:</span> <span class="token boolean important">false</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Mian配置</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaServer</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EurekaMain7002</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">EurekaMain7002</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建消费提供方provider-module-端口号8001、8002-只列出一个-另一个类似" tabindex="-1"><a class="header-anchor" href="#创建消费提供方provider-module-端口号8001、8002-只列出一个-另一个类似"><span>创建消费提供方Provider Module（端口号8001、8002）,只列出一个，另一个类似</span></a></h4>
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
<span class="line">    &lt;artifactId&gt;cloud-provider-payment8002&lt;/artifactId&gt;</span>
<span class="line"></span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;api&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;${project.version}&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">         &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.mybatis.spring.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;mybatis-spring-boot-starter&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;druid-spring-boot-starter&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;1.1.10&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;mysql&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-jdbc&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.alibaba&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;druid&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;runtime&lt;/scope&gt;</span>
<span class="line">            &lt;optional&gt;true&lt;/optional&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-netflix-eureka-client&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;test&lt;/scope&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">    &lt;/dependencies&gt;</span>
<span class="line"></span>
<span class="line">&lt;/project&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8002</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>payment<span class="token punctuation">-</span>service</span>
<span class="line">  <span class="token key atrule">datasource</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">type</span><span class="token punctuation">:</span> com.alibaba.druid.pool.DruidDataSource</span>
<span class="line">    <span class="token key atrule">driver-class-name</span><span class="token punctuation">:</span> org.gjt.mm.mysql.Driver</span>
<span class="line">    <span class="token key atrule">url</span><span class="token punctuation">:</span> jdbc<span class="token punctuation">:</span>mysql<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span>3306/cloud<span class="token punctuation">?</span>useUnicode=true<span class="token important">&amp;characterEncoding=utf-8&amp;useSSL=false</span></span>
<span class="line">    <span class="token key atrule">username</span><span class="token punctuation">:</span> root</span>
<span class="line">    <span class="token key atrule">password</span><span class="token punctuation">:</span> root</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment">#eureka中显示隐藏application-name</span></span>
<span class="line">    <span class="token key atrule">instance-id</span><span class="token punctuation">:</span> payment8002</span>
<span class="line">    <span class="token comment">#访问路径显示IP</span></span>
<span class="line">    <span class="token key atrule">prefer-ip-address</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token comment">#客户端向服务端发送心跳频率，默认30秒改为1</span></span>
<span class="line">    <span class="token key atrule">lease-renewal-interval-in-seconds</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">    <span class="token comment">#eureka服务端最后一次收到心跳的等待时间上限，默认90秒</span></span>
<span class="line">    <span class="token key atrule">lease-expiration-duration-in-seconds</span><span class="token punctuation">:</span> <span class="token number">2</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">fetch-registry</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">mybatis</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">mapper-locations</span><span class="token punctuation">:</span> classpath<span class="token punctuation">:</span>mapper/<span class="token important">*.xml</span></span>
<span class="line">  <span class="token key atrule">type-aliases-package</span><span class="token punctuation">:</span> com.ws.springcloud.entites.payment</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Mian 配置</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>client<span class="token punctuation">.</span>discovery<span class="token punctuation">.</span></span><span class="token class-name">EnableDiscoveryClient</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>eureka<span class="token punctuation">.</span></span><span class="token class-name">EnableEurekaClient</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/10</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token annotation punctuation">@EnableDiscoveryClient</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PaymentMain8002</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">PaymentMain8002</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Controller</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/payment"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PaymentController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">PaymentService</span> paymentService<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">DiscoveryClient</span> discoveryClient<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/create"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestBody</span> <span class="token class-name">Payment</span> payment<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>paymentService<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>payment<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value<span class="token operator">=</span><span class="token string">"/get/{id}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Payment</span><span class="token punctuation">></span></span> <span class="token function">getById</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">)</span> <span class="token class-name">Long</span> id<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>paymentService<span class="token punctuation">.</span><span class="token function">getById</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/discovery"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">></span></span> <span class="token function">discoveryClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> services <span class="token operator">=</span> discoveryClient<span class="token punctuation">.</span><span class="token function">getServices</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">></span></span> instances <span class="token operator">=</span> discoveryClient<span class="token punctuation">.</span><span class="token function">getInstances</span><span class="token punctuation">(</span><span class="token string">"CLOUD-PAYMENT-SERVICE"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ServiceInstance</span> instance <span class="token operator">:</span> instances<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"======>"</span><span class="token operator">+</span>instance<span class="token punctuation">.</span><span class="token function">getInstanceId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"\t"</span><span class="token operator">+</span>instance<span class="token punctuation">.</span><span class="token function">getServiceId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"\t"</span><span class="token operator">+</span>instance<span class="token punctuation">.</span><span class="token function">getPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"\t"</span><span class="token operator">+</span>instance<span class="token punctuation">.</span><span class="token function">getUri</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>services<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="创建消费客户端consumer-8000" tabindex="-1"><a class="header-anchor" href="#创建消费客户端consumer-8000"><span>创建消费客户端Consumer 8000</span></a></h4>
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
<span class="line">    &lt;artifactId&gt;cloud-consumer-oder80&lt;/artifactId&gt;</span>
<span class="line"></span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;api&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;${project.version}&lt;/version&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-netflix-eureka-client&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;runtime&lt;/scope&gt;</span>
<span class="line">            &lt;optional&gt;true&lt;/optional&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;</span>
<span class="line">            &lt;scope&gt;test&lt;/scope&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">    &lt;/dependencies&gt;</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">&lt;/project&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml 配置</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8000</span></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>order<span class="token punctuation">-</span>service</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">fetch-registry</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Main配置</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>eureka<span class="token punctuation">.</span></span><span class="token class-name">EnableEurekaClient</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/9</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderMain80</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">OrderMain80</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>全局config</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>config</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>client<span class="token punctuation">.</span>loadbalancer<span class="token punctuation">.</span></span><span class="token class-name">LoadBalanced</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Bean</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>client<span class="token punctuation">.</span></span><span class="token class-name">RestTemplate</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/9</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ApplicationConfig</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token annotation punctuation">@LoadBalanced</span><span class="token comment">//负载均衡</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">RestTemplate</span> <span class="token function">restTemplate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">RestTemplate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>调用Provider的Controller</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>controller</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>common<span class="token punctuation">.</span>result<span class="token punctuation">.</span></span><span class="token class-name">CommonResult</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>entites<span class="token punctuation">.</span>payment<span class="token punctuation">.</span></span><span class="token class-name">Payment</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Autowired</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>client<span class="token punctuation">.</span></span><span class="token class-name">RestTemplate</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/9</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/consumer"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**CLOUD-PAYMENT-SERVICE是eureka中注册的名称**/</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">PAYMENT_URL</span><span class="token operator">=</span><span class="token string">"http://CLOUD-PAYMENT-SERVICE/payment"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@PostMapping</span><span class="token punctuation">(</span><span class="token string">"/payment/create"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token class-name">Payment</span> payment<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> restTemplate<span class="token punctuation">.</span><span class="token function">postForObject</span><span class="token punctuation">(</span><span class="token constant">PAYMENT_URL</span><span class="token operator">+</span><span class="token string">"/create"</span><span class="token punctuation">,</span>payment<span class="token punctuation">,</span><span class="token class-name">CommonResult</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/payment/get/{id}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">)</span> <span class="token class-name">Long</span> id<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> restTemplate<span class="token punctuation">.</span><span class="token function">getForObject</span><span class="token punctuation">(</span><span class="token constant">PAYMENT_URL</span><span class="token operator">+</span><span class="token string">"/get/"</span><span class="token operator">+</span>id<span class="token punctuation">,</span><span class="token class-name">CommonResult</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="启动顺序为-注册中心-服务端-客户端" tabindex="-1"><a class="header-anchor" href="#启动顺序为-注册中心-服务端-客户端"><span>启动顺序为 注册中心-&gt;服务端-&gt;客户端</span></a></h4>
<ul>
<li>http://eureka7002:7002/ 和http://eureka7001:7001/ 可查看注册情况</li>
<li>postman测试是否成功</li>
</ul>
</div></template>


