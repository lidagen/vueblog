<template><div><h2 id="服务治理——dubbo运用" tabindex="-1"><a class="header-anchor" href="#服务治理——dubbo运用"><span>服务治理——Dubbo运用</span></a></h2>
<ul>
<li>官方文档：<code v-pre>http://dubbo.apache.org/zh-cn/docs/user/quick-start.html</code></li>
</ul>
<h3 id="背景介绍" tabindex="-1"><a class="header-anchor" href="#背景介绍"><span>背景介绍</span></a></h3>
<p>随着互联网的发展，网站应用的规模不断扩大，常规的垂直应用架构已无法应对，分布式服务架构以及流动计算架构势在必行，亟需一个治理系统确保架构有条不紊的演进。</p>
<ul>
<li>
<p>单一应用架构</p>
<ul>
<li>当网站流量很小时，只需一个应用，将所有功能都部署在一起，以减少部署节点和成本。此时，用于简化增删改查工作量的数据访问框架(ORM)是关键。</li>
</ul>
</li>
<li>
<p>垂直应用架构</p>
<ul>
<li>当访问量逐渐增大， 单一应用增加机器带来的加速度越来越小， 将应用拆成互不相干的几个应用，以提升效率。此时，用于加速前端页面开发的 Web 框架(MVC)是关键。</li>
</ul>
</li>
<li>
<p>分布式服务架构</p>
<ul>
<li>当垂直应用越来越多，应用之间交互不可避免，将核心业务抽取出来，作为独立的服务，逐渐形成稳定的服务中心，使前端应用能更快速的响应多变的市场需求。此时，用于提高业务复用及整合的分布式服务框架(RPC)是关键。</li>
</ul>
</li>
<li>
<p>流动计算架构</p>
<ul>
<li>当服务越来越多，容量的评估，小服务资源的浪费等问题逐渐显现，此时需增加一个调度中心基于访问压力实时管理集群容量，提高集群利用率。此时，用于提高机器利用率的资源调度和治理中心
(SOA)是关键</li>
</ul>
</li>
</ul>
<h3 id="什么是dubbo" tabindex="-1"><a class="header-anchor" href="#什么是dubbo"><span>什么是Dubbo</span></a></h3>
<p>了解 dubbo 之前，了解一下什么是 RPC？</p>
<ul>
<li>RPC(Remote Procedure Call Protocol)：远程过程调用。 两台服务器 A、B，分别部署不同的应用a,b。当应用 a 需要调用应用 b 提供的函数或方法的时候，由于不在一个内存空间，不能直接调用，需要通过网络来表达调用的语义传达调用的数据。</li>
</ul>
<h4 id="rpc需要解决的问题" tabindex="-1"><a class="header-anchor" href="#rpc需要解决的问题"><span>RPC需要解决的问题</span></a></h4>
<ul>
<li>
<p><strong>通讯问题</strong>：主要是通过在客户端和服务器之间建立 TCP 连接，远程过程调用的所有交换的数据都在这个连接里传输。连接可以是按需连接，调用结束后就断掉，也可以是长连接，多个远程过程调用共享同一个连接。</p>
</li>
<li>
<p><strong>寻址问题</strong> ：A 服务器上的应用怎么告诉底层的 RPC 框架，如何连接到 B 服务器（如主机或 IP 地址）以及特定的端口，方法的名称名称是什么，这样才能完成调用。比如基于 Web 服务协议栈的 RPC，就要提供一个 endpoint URI，或者是从 UDDI 服务上查找。如果是 RMI 调用的话，还需要一个 RMI Registry 来注册服务的地址。</p>
</li>
<li>
<p><strong>序列化与反序列化</strong>：当 A 服务器上的应用发起远程过程调用时， 方法的参数需要通过底层的网络协议如 TCP 传递到 B
服务器，由于网络协议是基于二进制的，内存中的参数的值要序列化成二进制的形式，也就是序列化（Serialize）或编组（marshal），通过寻址和传输将序列化的二进制发送给 B 服务器。 同理，B 服务器接收参数要将参数反序列化。B 服务器应用调用自己的方法处理后返回的结果也要序列化给 A 服务器，A 服务器接收也要经过反序列化的过程。</p>
</li>
</ul>
<h3 id="dubbo简介" tabindex="-1"><a class="header-anchor" href="#dubbo简介"><span>Dubbo简介</span></a></h3>
<p><strong>dubbo是：</strong></p>
<ul>
<li>一款分布式服务框架</li>
<li>高性能和透明的RPC远程调用方案</li>
<li>SOA服务治理方案</li>
</ul>
<p><strong>dubbo架构图：</strong>
<img :src="$withBase('/dubbo/1.png')" alt="dock"></p>
<p><strong>dubbo包含几部分：</strong></p>
<ul>
<li>Provider：暴露服务的提供方</li>
<li>Consumer: 调用远程服务的服务消费方</li>
<li>Registry: 服务注册和发现中心</li>
<li>Monitor: 统计服务的调用次数和调用时间的监控中心</li>
<li>Container: 服务运行容器</li>
</ul>
<p>调用关系说明：</p>
<ul>
<li>
<ol start="0">
<li>服务容器负责启动，加载，运行服务提供者。</li>
</ol>
</li>
<li>
<ol>
<li>服务提供者在启动时，向注册中心注册自己提供的服务。</li>
</ol>
</li>
<li>
<ol start="2">
<li>服务消费者在启动时，向注册中心订阅自己所需的服务。</li>
</ol>
</li>
<li>
<ol start="3">
<li>注册中心返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。</li>
</ol>
</li>
<li>
<ol start="4">
<li>服务消费者，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。</li>
</ol>
</li>
<li>
<ol start="5">
<li>服务消费者和提供者，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心。</li>
</ol>
</li>
</ul>
<h3 id="环境准备-window-环境" tabindex="-1"><a class="header-anchor" href="#环境准备-window-环境"><span>环境准备（window 环境）</span></a></h3>
<ul>
<li>git _下载项目</li>
<li>maven _后端打包</li>
<li>jdk _运行jar</li>
<li>node _npm下载包</li>
<li>webpack _前端打包</li>
</ul>
<h4 id="下载zookeeper并配置启动" tabindex="-1"><a class="header-anchor" href="#下载zookeeper并配置启动"><span>下载zookeeper并配置启动</span></a></h4>
<ul>
<li>
<p><a href="https://www.apache.org/dyn/closer.cgi/zookeeper/" target="_blank" rel="noopener noreferrer">官网</a>进入，选择HTTP点击下载ZIP包（本文下载的3.4.14版本）。</p>
</li>
<li>
<p>解压到本地后，找到conf文件夹，修改zoo_sample.cfg中<code v-pre>dataDir</code>指向本地安装路径。（本例子dataDir=D:\dubboSoft\zookeeper-3.4.14）</p>
</li>
<li>
<p>修改bin目录下zkEnv.cmd中ZOOCFG指向刚修改的zoo_sample.cfg文件(set ZOOCFG=%ZOOCFGDIR%\zoo_sample.cfg)</p>
</li>
<li>
<p>点击zkServive.cmd和zkCli.cmd启动。</p>
</li>
</ul>
<h4 id="下载dubbo——前后端构建打包启动" tabindex="-1"><a class="header-anchor" href="#下载dubbo——前后端构建打包启动"><span>下载Dubbo——前后端构建打包启动</span></a></h4>
<ul>
<li>
<p>git 克隆 dubbo代码 <code v-pre>git clone https://github.com/apache/dubbo-admin</code></p>
</li>
<li>
<p>dubbo-admin-server 目录下 cmd 运行 <code v-pre>mvn package</code>打包 dubbo-admin-server模块，会在此文件夹下target生成jar包。</p>
</li>
<li>
<p>进入jar包所在target目录,cmd 运行命令 <code v-pre>java -jar dubbo-admin-server-0.1.jar</code> 启动jar，之后访问 http://localhost:8080/swagger-ui.html 成功代表后端启动成功。</p>
</li>
<li>
<p>dubbo-admin-ui 目录下 cmd 运行命令 <code v-pre>npm i</code>对前端进行打包。</p>
</li>
<li>
<p>完成后 <code v-pre>npm run dev</code>启动前端项目，访问  http://localhost:8081 进入Dubbo后台管理页面。</p>
</li>
</ul>
<p>到此阶段，Dubbo需要的环境以及依赖安装就已经完成了，可以后续进行项目开发。</p>
<h3 id="springboot聚合项目" tabindex="-1"><a class="header-anchor" href="#springboot聚合项目"><span>springboot聚合项目</span></a></h3>
<p>考虑到生产和消费要依赖同一个service接口，创建一个springboot聚合项目，三个模块，一个provider模块，一个consumer模块，一个api模块。provider 和 consumer 都可以单独启动，且都依赖api接口，这样，两个项目都需要的接口可以放在api中。</p>
<h4 id="创建项目" tabindex="-1"><a class="header-anchor" href="#创建项目"><span>创建项目</span></a></h4>
<ul>
<li>IDEA下新建一个springboot项目,删掉除了<code v-pre>pom.xml</code>外所有文件，打包模式为pom,modules内添加三个模块</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token prolog">&lt;?xml version="1.0" encoding="UTF-8"?></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>project</span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>modelVersion</span><span class="token punctuation">></span></span>4.0.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>modelVersion</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-parent<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>2.1.5.RELEASE<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>relativePath</span><span class="token punctuation">/></span></span> <span class="token comment">&lt;!-- lookup parent from repository --></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>modules</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>module</span><span class="token punctuation">></span></span>dubbo_provider<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>module</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>module</span><span class="token punctuation">></span></span>dubbo_consumer<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>module</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>module</span><span class="token punctuation">></span></span>dubbo_api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>module</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>modules</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.dubbo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>dubbo_mode<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>0.0.1-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>name</span><span class="token punctuation">></span></span>dubbo_mode<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>name</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>packaging</span><span class="token punctuation">></span></span>pom<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>packaging</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>description</span><span class="token punctuation">></span></span>Spring Boot 聚合<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>description</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>java.version</span><span class="token punctuation">></span></span>1.8<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>java.version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>project</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>项目右键新增module,新建一个provider模块，改造改<code v-pre>pom.xml</code>,主要改造 parent依赖dubbo_mode模块，application.properties中改端口号8888.</li>
<li>同理建造consumer,改端口号9999。</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token prolog">&lt;?xml version="1.0" encoding="UTF-8"?></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>project</span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>modelVersion</span><span class="token punctuation">></span></span>4.0.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>modelVersion</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.dubbo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>dubbo_mode<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>0.0.1-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>relativePath</span><span class="token punctuation">/></span></span> <span class="token comment">&lt;!-- lookup parent from repository --></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>parent</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.dubbo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>dubbo_provider<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>0.0.1-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>name</span><span class="token punctuation">></span></span>dubbo_provider<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>name</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>packaging</span><span class="token punctuation">></span></span>jar<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>packaging</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>description</span><span class="token punctuation">></span></span>Demo project for Spring Boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>description</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>java.version</span><span class="token punctuation">></span></span>1.8<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>java.version</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-web<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.dubbo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>dubbo_api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>0.0.1-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>project</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>新建api模块，由于api模块只负责提供公共的接口和类，所以建一个普通maven模块，parent选项选择null,</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token prolog">&lt;?xml version="1.0" encoding="UTF-8"?></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>project</span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">"</span></span></span>
<span class="line">         <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>modelVersion</span><span class="token punctuation">></span></span>4.0.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>modelVersion</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.dubbo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>dubbo_api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>0.0.1-SNAPSHOT<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">    </span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>project</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这里多模块的聚合项目建造完成，consumer和provider模块引入api模块，测试能引入api中的类说明依赖成功。</p>
<h3 id="引入dubbo依赖以及配置" tabindex="-1"><a class="header-anchor" href="#引入dubbo依赖以及配置"><span>引入dubbo依赖以及配置</span></a></h3>
<ul>
<li>主pom引入Apache dubbo,指定版本 2.7.1</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> <span class="token class-name">Dubbo</span> <span class="token class-name">Spring</span> <span class="token class-name">Boot</span> <span class="token class-name">Starter</span><span class="token operator">--</span><span class="token operator">></span></span>
<span class="line"><span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>dubbo<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>dubbo<span class="token operator">-</span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>starter<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">></span></span>$<span class="token punctuation">{</span>dubbo<span class="token punctuation">.</span>version<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"><span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>dubbo<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>dubbo<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">></span></span>$<span class="token punctuation">{</span>dubbo<span class="token punctuation">.</span>version<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>exclusions<span class="token punctuation">></span></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>exclusion<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>springframework<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>spring<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>exclusion<span class="token operator">></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>exclusion<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>javax<span class="token punctuation">.</span>servlet<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>servlet<span class="token operator">-</span>api<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>exclusion<span class="token operator">></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>exclusion<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>log4j<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>log4j<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>exclusion<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">/</span>exclusions<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> <span class="token class-name">Zookeeper</span> dependencies <span class="token operator">--</span><span class="token operator">></span></span>
<span class="line"><span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>dubbo<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>dubbo<span class="token operator">-</span>dependencies<span class="token operator">-</span>zookeeper<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">></span></span>$<span class="token punctuation">{</span>dubbo<span class="token punctuation">.</span>version<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>type<span class="token punctuation">></span></span>pom<span class="token operator">&lt;</span><span class="token operator">/</span>type<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span> <span class="token class-name">Dubbo</span> <span class="token class-name">Spring</span> <span class="token class-name">Boot</span> end<span class="token operator">--</span><span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>api 增加一个接口（公共接口提供给provider 和 consumer 使用）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">CostService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 成本增加接口</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">cost</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token class-name">Integer</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> cost<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="provider-生产者" tabindex="-1"><a class="header-anchor" href="#provider-生产者"><span>Provider 生产者</span></a></h4>
<ul>
<li>生产者Provider <code v-pre>application.properties</code>配置</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line">server.port=9999</span>
<span class="line"></span>
<span class="line">#生产者名称</span>
<span class="line">server.port=8888</span>
<span class="line"></span>
<span class="line">dubbo.application.name=dubbo-provider</span>
<span class="line"></span>
<span class="line">dubbo.registry.address=10.19.41.188:2181</span>
<span class="line">dubbo.registry.protocol=zookeeper</span>
<span class="line">dubbo.registry.check=false</span>
<span class="line"></span>
<span class="line">dubbo.protocol.name=dubbo</span>
<span class="line">dubbo.protocol.port=30003</span>
<span class="line"></span>
<span class="line">dubbo.monitor.protocol=register</span>
<span class="line"></span>
<span class="line">dubbo.consumer.check=false</span>
<span class="line">dubbo.consumer.timeout=3000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>生产者启动类加<code v-pre>@EnableDubbo</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableDubbo</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DubboProviderApplication</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">DubboProviderApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>生产者provider实现这个api中定义的接口</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**@Service注解import为dubbo的**/</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>dubbo<span class="token punctuation">.</span>config<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Service</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>dubbo<span class="token punctuation">.</span>service<span class="token punctuation">.</span>api<span class="token punctuation">.</span></span><span class="token class-name">CostService</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token annotation punctuation">@Service</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CostServiceImpl</span> <span class="token keyword">implements</span> <span class="token class-name">CostService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 假设之前总花费了100</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Integer</span> totalCost <span class="token operator">=</span> <span class="token number">1000</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 之前总和 加上 最近一笔</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">cost</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Integer</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> cost<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> totalCost <span class="token operator">+</span> cost<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="consumer-消费者" tabindex="-1"><a class="header-anchor" href="#consumer-消费者"><span>Consumer 消费者</span></a></h4>
<ul>
<li>消费者Consumer <code v-pre>application.properties</code>配置</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line">server.port=9999</span>
<span class="line"></span>
<span class="line">dubbo.application.name=dubbo-consumer</span>
<span class="line">#zookeper ip和端口</span>
<span class="line">dubbo.registry.address=10.19.41.188:2181</span>
<span class="line">dubbo.registry.protocol=zookeeper</span>
<span class="line">dubbo.registry.check=false</span>
<span class="line"></span>
<span class="line">dubbo.monitor.protocol=registry</span>
<span class="line"></span>
<span class="line">dubbo.consumer.check=false</span>
<span class="line">dubbo.consumer.timeout=3000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>消费者service类中注入api中的接口</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>apache<span class="token punctuation">.</span>dubbo<span class="token punctuation">.</span>config<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Reference</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>dubbo<span class="token punctuation">.</span>consumer<span class="token punctuation">.</span>service<span class="token punctuation">.</span></span><span class="token class-name">ProductService</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>dubbo<span class="token punctuation">.</span>service<span class="token punctuation">.</span>api<span class="token punctuation">.</span></span><span class="token class-name">CostService</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Service</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token annotation punctuation">@Service</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductServiceImpl</span> <span class="token keyword">implements</span> <span class="token class-name">ProductService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 使用dubbo的注解 org.apache.dubbo.config.annotation.Reference。进行远程调用service</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Reference</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">CostService</span> costService<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Integer</span> <span class="token function">getCost</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> costService<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动入口加<code v-pre>@EnableDubbo</code>注解</li>
</ul>
<h4 id="测试调用" tabindex="-1"><a class="header-anchor" href="#测试调用"><span>测试调用</span></a></h4>
<ul>
<li>消费者Consumer中加一个Controller调用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">ProductService</span> productService<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 添加完 返回总共消费</span>
<span class="line">     * <span class="token keyword">@param</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/add"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getCost</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"该产品总共消费 ："</span><span class="token operator">+</span>productService<span class="token punctuation">.</span><span class="token function">getCost</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>先启动Provider 再启动 Consumer (必须按顺序启动<code v-pre>dubbo.consumer.check=false</code>这个设置不起作用？)</p>
</li>
<li>
<p><code v-pre>http://localhost:8081/#/</code> 中服务查询可看服务注册成功</p>
</li>
<li>
<p>浏览器输入 <code v-pre>http://localhost:9999/add?a=22</code> 返回成功</p>
</li>
</ul>
<h3 id="案例分享" tabindex="-1"><a class="header-anchor" href="#案例分享"><span>案例分享</span></a></h3>
<ul>
<li>
<p>github : <code v-pre>https://github.com/lidagen/dubboSoft.git</code></p>
</li>
<li>
<p>下载下来放D 盘dubboSoft包下（或者在zoo_sample.cfg指定路径）</p>
</li>
<li>
<p>按顺序启动服务</p>
</li>
</ul>
</div></template>


