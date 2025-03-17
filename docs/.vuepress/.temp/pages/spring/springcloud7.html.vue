<template><div><h2 id="springcloud-config-分布式配置中心" tabindex="-1"><a class="header-anchor" href="#springcloud-config-分布式配置中心"><span>SpringCloud Config -分布式配置中心</span></a></h2>
<h3 id="springcloud-config-概述" tabindex="-1"><a class="header-anchor" href="#springcloud-config-概述"><span>SpringCloud Config 概述</span></a></h3>
<h4 id="springcloud-config是什么" tabindex="-1"><a class="header-anchor" href="#springcloud-config是什么"><span>SpringCloud Config是什么</span></a></h4>
<ul>
<li>
<p>config是SpringCloud提供的集中化外部配置支持，配置服务器为各个不同微服务应用的所有环境提供了一个中心化的外部配置。</p>
</li>
<li>
<p>类似携程Apollo，SpringCloud Config分为服务端和客户端两部分</p>
</li>
</ul>
<h4 id="能干什么" tabindex="-1"><a class="header-anchor" href="#能干什么"><span>能干什么</span></a></h4>
<ul>
<li>
<p>集中管理配置文件</p>
</li>
<li>
<p>不同环境的不同配置，动态化的配置更新</p>
</li>
<li>
<p>运行期间动态调整的数据，可以放在配置中心，且不需要重启即可感知新的配置</p>
</li>
<li>
<p>将配置信息REST接口形式暴露</p>
</li>
</ul>
<h3 id="springcloud-config的服务端server构建" tabindex="-1"><a class="header-anchor" href="#springcloud-config的服务端server构建"><span>SpringCloud Config的服务端server构建</span></a></h3>
<h4 id="github上新建一个项目-用来放置这些配置的数据" tabindex="-1"><a class="header-anchor" href="#github上新建一个项目-用来放置这些配置的数据"><span>github上新建一个项目，用来放置这些配置的数据</span></a></h4>
<ul>
<li>地址为 https://github.com/lidagen/cloud-config.git</li>
<li>新建两个yml ,分别为<code v-pre>application-dev.yml</code> <code v-pre>application-prd.yml</code></li>
</ul>
<h4 id="新建一个端口3344的项目" tabindex="-1"><a class="header-anchor" href="#新建一个端口3344的项目"><span>新建一个端口3344的项目</span></a></h4>
<ul>
<li>pom.xml</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">&lt;?xml version="1.0" encoding="UTF-8"?></span>
<span class="line">&lt;project xmlns="http://maven.apache.org/POM/4.0.0"</span>
<span class="line">         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"</span>
<span class="line">         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></span>
<span class="line">    &lt;parent></span>
<span class="line">        &lt;artifactId>cloud2020&lt;/artifactId></span>
<span class="line">        &lt;groupId>com.ws.springcloud&lt;/groupId></span>
<span class="line">        &lt;version>1.0-SNAPSHOT&lt;/version></span>
<span class="line">    &lt;/parent></span>
<span class="line">    &lt;modelVersion>4.0.0&lt;/modelVersion></span>
<span class="line"></span>
<span class="line">    &lt;artifactId>cloud-config-server3344&lt;/artifactId></span>
<span class="line"></span>
<span class="line">    &lt;dependencies></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>com.ws.springcloud&lt;/groupId></span>
<span class="line">            &lt;artifactId>api&lt;/artifactId></span>
<span class="line">            &lt;version>${project.version}&lt;/version></span>
<span class="line">        &lt;/dependency></span>
<span class="line"></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>org.springframework.boot&lt;/groupId></span>
<span class="line">            &lt;artifactId>spring-boot-starter-actuator&lt;/artifactId></span>
<span class="line">        &lt;/dependency></span>
<span class="line"></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>org.springframework.cloud&lt;/groupId></span>
<span class="line">            &lt;artifactId>spring-cloud-starter-netflix-eureka-client&lt;/artifactId></span>
<span class="line">        &lt;/dependency></span>
<span class="line"></span>
<span class="line">        &lt;!--springCloud config--></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>org.springframework.cloud&lt;/groupId></span>
<span class="line">            &lt;artifactId>spring-cloud-config-server&lt;/artifactId></span>
<span class="line">        &lt;/dependency></span>
<span class="line"></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>org.springframework.boot&lt;/groupId></span>
<span class="line">            &lt;artifactId>spring-boot-devtools&lt;/artifactId></span>
<span class="line">            &lt;scope>runtime&lt;/scope></span>
<span class="line">            &lt;optional>true&lt;/optional></span>
<span class="line">        &lt;/dependency></span>
<span class="line"></span>
<span class="line">        &lt;dependency></span>
<span class="line">            &lt;groupId>org.springframework.boot&lt;/groupId></span>
<span class="line">            &lt;artifactId>spring-boot-starter-test&lt;/artifactId></span>
<span class="line">            &lt;scope>test&lt;/scope></span>
<span class="line">        &lt;/dependency></span>
<span class="line">    &lt;/dependencies></span>
<span class="line">&lt;/project></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml</li>
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
<span class="line">       </span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>config<span class="token punctuation">.</span>server<span class="token punctuation">.</span></span><span class="token class-name">EnableConfigServer</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/14</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableConfigServer</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConfigServerCenter3344</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">ConfigServerCenter3344</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动eureka和cofigserver ,如果报 <code v-pre>reject HostKey: github.com</code> ，请在github配置公钥</li>
<li>浏览器输入 <code v-pre>http://localhost:3344/master/application-prd.yml</code> <code v-pre>http://localhost:3344/master/application-dev.yml</code>查看是否获取值</li>
</ul>
<h4 id="服务端获取config配置" tabindex="-1"><a class="header-anchor" href="#服务端获取config配置"><span>服务端获取config配置</span></a></h4>
<ul>
<li>新建一个3355端口Module</li>
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
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>cloud-config-client3355<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependencies</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.ws.springcloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>api<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>${project.version}<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-actuator<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-netflix-eureka-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">&lt;!--springCloud config--></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-config<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-devtools<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>scope</span><span class="token punctuation">></span></span>runtime<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>scope</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>optional</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>optional</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
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
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>将模块下yml文件命名为bootstrap.yml
<ul>
<li>
<p>application.yml 是用户级别资源配置项目</p>
</li>
<li>
<p>bootstrap.yml 是系统级别配置，优先级别更高</p>
</li>
</ul>
</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line">  <span class="token key atrule">server</span><span class="token punctuation">:</span></span>
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
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"><span class="token comment">#暴露监控端点</span></span>
<span class="line"><span class="token key atrule">management</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">endpoints</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">web</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">exposure</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">include</span><span class="token punctuation">:</span> <span class="token string">"*"</span>      </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConfigClientCenter3355</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">ConfigClientCenter3355</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>调用Controller</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token annotation punctuation">@RefreshScope</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConfigClientController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**config.info 是github中yml 文件配置的名称**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${config.info}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> configInfo<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/config/configInfo"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> configInfo<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>修改github上yml内容后，3344立刻响应，3355获取不到动态修改的值
<ul>
<li>
<p>yml增加配置</p>
</li>
<li>
<p>调用controller增加@RefreshScope</p>
</li>
<li>
<p>需要运维运行 <code v-pre>curl -X POST &quot;localhost:3355/actuator/refresh&quot;</code> 刷新配置</p>
</li>
</ul>
</li>
</ul>
</div></template>


