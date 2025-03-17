<template><div><h2 id="服务总线——bus" tabindex="-1"><a class="header-anchor" href="#服务总线——bus"><span>服务总线——Bus</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>Bus 是对springCloud Config 的扩充，实现config配置的动态刷新</p>
</li>
<li>
<p>Bus支持两种消息代理：RabbitMQ 和Kafka</p>
</li>
<li>
<p>Bus能管理和传播分布式系统间的消息，就像一个分布式执行器，可用于广播状态的更改，事件推送等。也可以当作微服务间的通信通道。</p>
</li>
</ul>
<h4 id="什么是总线" tabindex="-1"><a class="header-anchor" href="#什么是总线"><span>什么是总线</span></a></h4>
<ul>
<li>在微服务架构中，通常会使用<strong>轻量级的消息代理</strong>来构建一个共用的消息主题，并让系统中所有的微服务实例都连接上来，由于**该主题中产生的消息有实例监听和消费，所以称为消息总线。**在总线的各个实例，都可以方便的广播一些需要让其他连接在该主题的实例都知道的消息。</li>
</ul>
<h4 id="基本原理" tabindex="-1"><a class="header-anchor" href="#基本原理"><span>基本原理</span></a></h4>
<ul>
<li>configClient实例都监听MQ中同一个topic,当服务刷新数据时，它会把内容放进topic中，这样其它监听这个topic的服务就能得到通知，更新自身的配置。</li>
</ul>
<h3 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h3>
<h4 id="安装mq" tabindex="-1"><a class="header-anchor" href="#安装mq"><span>安装MQ</span></a></h4>
<ul>
<li>
<p>本例配置RabbitMQ, 下载配置安装Erlang和RabbitMQ</p>
</li>
<li>
<p>输入<code v-pre>localhost:15672</code>访问RabbitMQ,并登陆</p>
</li>
</ul>
<h4 id="bus刷新全局广播的设计思想-先增加一个3366的客户端" tabindex="-1"><a class="header-anchor" href="#bus刷新全局广播的设计思想-先增加一个3366的客户端"><span>Bus刷新全局广播的设计思想 （先增加一个3366的客户端）</span></a></h4>
<p>我们的目的是github上值改变了，3344服务端能接受到值的改变，而客户端有多个（本例子中3355 和3366 项目）需要运维执行刷新请求才能获得动态改变的值，有两种思路解决：</p>
<ul>
<li>
<p>利用消息总线触发一个客户端configClient的/bus/refresh,而刷新所有客户端配置</p>
<ul>
<li>此架构不适合，违反了微服务职责单一性，次模块可能有自己的业务职责，把消息总线职责赋予它，会承担两份工作。</li>
<li>客户端如果是集群，需要从一个客户端传染到多个客户端。</li>
</ul>
</li>
<li>
<p>利用消息总线触发一个服务端configServer 的/bus/refresh,而刷新所有客户端的配置</p>
</li>
</ul>
<h4 id="bus的配置" tabindex="-1"><a class="header-anchor" href="#bus的配置"><span>Bus的配置</span></a></h4>
<ul>
<li>服务端server（3344）增加消息总线的支持
<ul>
<li>pom改动</li>
</ul>
</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line">  <span class="token comment">&lt;!--增加bus 支持--></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-bus-amqp<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>配置bus暴露端点</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3344</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>server<span class="token punctuation">-</span>center</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">config</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">git</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//github.com/lidagen/cloud<span class="token punctuation">-</span>config.git</span>
<span class="line">          <span class="token key atrule">ignoreLocalSshSettings</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment">#为了激活基于属性的SSH配置</span></span>
<span class="line">          <span class="token key atrule">search-paths</span><span class="token punctuation">:</span> <span class="token comment">## 搜索目录</span></span>
<span class="line">            <span class="token punctuation">-</span> cloud<span class="token punctuation">-</span>config</span>
<span class="line">          <span class="token key atrule">default-label</span><span class="token punctuation">:</span> master <span class="token comment">#读取分支</span></span>
<span class="line">  <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> localhost</span>
<span class="line">    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span></span>
<span class="line">    <span class="token key atrule">username</span><span class="token punctuation">:</span> admin</span>
<span class="line">    <span class="token key atrule">password</span><span class="token punctuation">:</span> admin</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token comment">#暴露监控端点</span></span>
<span class="line"><span class="token key atrule">management</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">exposure</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">"bus-refresh"</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>客户端client（3355、3366）增加消息总线的支持
<ul>
<li>pom.xml</li>
</ul>
</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token comment">&lt;!--增加bus 支持--></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-bus-amqp<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">3355</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>client</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">config</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">label</span><span class="token punctuation">:</span> master <span class="token comment">#分支名</span></span>
<span class="line">      <span class="token key atrule">name</span><span class="token punctuation">:</span> application <span class="token comment">#配置文件名</span></span>
<span class="line">      <span class="token key atrule">profile</span><span class="token punctuation">:</span> dev <span class="token comment">#配置文件后缀 两个合起来就是github上的 application-dev</span></span>
<span class="line">      <span class="token key atrule">uri</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">3344</span> <span class="token comment">#配置中心server IP地址</span></span>
<span class="line">  <span class="token key atrule">rabbitmq</span><span class="token punctuation">:</span> <span class="token comment">#RabbitMQ配置</span></span>
<span class="line">    <span class="token key atrule">host</span><span class="token punctuation">:</span> localhost</span>
<span class="line">    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5672</span></span>
<span class="line">    <span class="token key atrule">username</span><span class="token punctuation">:</span> admin</span>
<span class="line">    <span class="token key atrule">password</span><span class="token punctuation">:</span> admin</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"><span class="token comment">#暴露监控端点</span></span>
<span class="line"><span class="token key atrule">management</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">exposure</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">"*"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>刷新 <code v-pre>curl -X POST &quot;localhost:3344/actuator/bus-refresh&quot;</code> ,刷新一个服务端，所有客户端都得到最新的值。</li>
</ul>
<h4 id="动态刷新的定点通知" tabindex="-1"><a class="header-anchor" href="#动态刷新的定点通知"><span>动态刷新的定点通知</span></a></h4>
<ul>
<li>
<p>比如我们只想通知3355而不通知3366，这时候需要定点通知</p>
</li>
<li>
<p>公式： http://ip:服务端号/actuator/bus-refresh/{destination}</p>
</li>
<li>
<p>destination 指的是需要更新配置的服务或者实例</p>
</li>
<li>
<p>命令 <code v-pre>curl -X POST &quot;localhost:3344/actuator/bus-refresh/config-client:3355&quot;</code>,config-client为application-name</p>
</li>
</ul>
</div></template>


