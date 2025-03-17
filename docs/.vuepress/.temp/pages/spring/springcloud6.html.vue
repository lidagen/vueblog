<template><div><h2 id="服务网关——gateway" tabindex="-1"><a class="header-anchor" href="#服务网关——gateway"><span>服务网关——GateWay</span></a></h2>
<h3 id="概述简介" tabindex="-1"><a class="header-anchor" href="#概述简介"><span>概述简介</span></a></h3>
<h3 id="三大核心概念" tabindex="-1"><a class="header-anchor" href="#三大核心概念"><span>三大核心概念</span></a></h3>
<h4 id="路由route" tabindex="-1"><a class="header-anchor" href="#路由route"><span>路由Route</span></a></h4>
<ul>
<li>路由是构建网关的基本模块，它由ID，目标URI，一系列的断言和过滤器组成， 如果断言为TRUE，则匹配该路由</li>
</ul>
<h4 id="断言predicate" tabindex="-1"><a class="header-anchor" href="#断言predicate"><span>断言Predicate</span></a></h4>
<ul>
<li>开发人员可以匹配HTTP请求中的所有内容，<strong>如果请求与断言相匹配则进行路由。</strong></li>
</ul>
<h4 id="过滤filter" tabindex="-1"><a class="header-anchor" href="#过滤filter"><span>过滤Filter</span></a></h4>
<ul>
<li>指的是Spring框架中GatewayFilter的实例，使用过滤器，可以在请求被路由前或者之后对请求进行修改。</li>
</ul>
<h4 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结：</span></a></h4>
<ul>
<li>
<p>web请求，通过一些匹配条件，定位到真正的服务节点，并在这些转发过程的前后，进行一些精细化操作。</p>
</li>
<li>
<p>predicate就是我们的匹配条件，而filter,可以理解成一个无所不能的拦截器。有了这两个元素，再加上目标URI，就可以实现一个具体的路由。</p>
</li>
</ul>
<h3 id="gateway工作流程" tabindex="-1"><a class="header-anchor" href="#gateway工作流程"><span>GateWay工作流程</span></a></h3>
<ul>
<li>流程图：</li>
</ul>
<img :src="$withBase('/springcloud/3.png')" alt="dock">
<ul>
<li>
<p>客户端向Gateway发出请求，然后在Gateway Handle Mapping中找到与请求匹配的路由，将其发送到Gateway Web Handle 。</p>
</li>
<li>
<p>Handle 再通过指定的过滤器来将请求发送到我们实际的服务执行业务逻辑，然后返回。</p>
</li>
<li>
<p>过滤器在发送代理请求之前 (pre) 或者之后 (post) 执行业务逻辑。</p>
<ul>
<li>
<p>在pre类型的过滤器可以执行参数校验、权限校验、流量监控、日志输出、协议转换等。</p>
</li>
<li>
<p>在post类型过滤器中可以做响应内容、响应头的修改，日志输出、流量监控也有着重要作用。</p>
</li>
</ul>
</li>
</ul>
<h3 id="入门配置" tabindex="-1"><a class="header-anchor" href="#入门配置"><span>入门配置</span></a></h3>
<h4 id="搭建项目" tabindex="-1"><a class="header-anchor" href="#搭建项目"><span>搭建项目</span></a></h4>
<ul>
<li>
<p>新建端口号9527 Module  <code v-pre>cloud-gateway-gateway9527</code></p>
</li>
<li>
<p>pom.xml</p>
</li>
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
<span class="line">    &lt;artifactId&gt;cloud-gateway-gateway9527&lt;/artifactId&gt;</span>
<span class="line">    &lt;dependencies&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;com.ws.springcloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;api&lt;/artifactId&gt;</span>
<span class="line">            &lt;version&gt;${project.version}&lt;/version&gt;</span>
<span class="line">            &lt;!--网关不需要web包，此包API中包含--&gt;</span>
<span class="line">            &lt;exclusions&gt;</span>
<span class="line">                &lt;exclusion&gt;</span>
<span class="line">                    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">                    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;</span>
<span class="line">                &lt;/exclusion&gt;</span>
<span class="line">            &lt;/exclusions&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line"></span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--注册进eureka用--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-netflix-eureka-client&lt;/artifactId&gt;</span>
<span class="line">        &lt;/dependency&gt;</span>
<span class="line">        &lt;!--gateway--&gt;</span>
<span class="line">        &lt;dependency&gt;</span>
<span class="line">            &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">            &lt;artifactId&gt;spring-cloud-starter-gateway&lt;/artifactId&gt;</span>
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
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9527</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>gateway</span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>gateway<span class="token punctuation">-</span>service</span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment">#注册进EUREKA</span></span>
<span class="line">    <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">fetch-registry</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>eureka<span class="token punctuation">.</span></span><span class="token class-name">EnableEurekaClient</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/14</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Gateway9527</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">Gateway9527</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="通过微服务名进行动态路由" tabindex="-1"><a class="header-anchor" href="#通过微服务名进行动态路由"><span>通过微服务名进行动态路由</span></a></h4>
<ul>
<li>我们不想暴露8001 8002端口给随意访问，希望在端口外套一层9527</li>
<li>两个服务需要做负载均衡，之前我们用ribbon一个80的Module做的，这次不需要，只要在9527的yml做配置改动</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">9527</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>gateway</span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">gateway</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">discovery</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">locator</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment">#开启从注册中心动态创建路由的功能，利用微服务名进行路由</span></span>
<span class="line">      <span class="token key atrule">routes</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> payment_path <span class="token comment">#不重复的ID</span></span>
<span class="line">        <span class="token comment">#uri: http://localhost:8001</span></span>
<span class="line">          <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>//CLOUD<span class="token punctuation">-</span>PAYMENT<span class="token punctuation">-</span>SERVICE <span class="token comment">#lb负载 CLOUD-PAYMENT-SERVICE 注册在eureka上的微服务名</span></span>
<span class="line">          <span class="token key atrule">predicates</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> Path=/payment/<span class="token important">**</span> <span class="token comment">#路由的断言</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">instance</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">hostname</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>gateway<span class="token punctuation">-</span>service</span>
<span class="line">  <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token comment">#注册进EUREKA</span></span>
<span class="line">    <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">fetch-registry</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">    <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">      <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="predicate的使用" tabindex="-1"><a class="header-anchor" href="#predicate的使用"><span>Predicate的使用</span></a></h3>
<ul>
<li>常用的Predicate配置</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">cloud</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">gateway</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">discovery</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">locator</span><span class="token punctuation">:</span></span>
<span class="line">          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment">#开启从注册中心动态创建路由的功能，利用微服务名进行路由</span></span>
<span class="line">      <span class="token key atrule">routes</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> payment_path <span class="token comment">#不重复的ID</span></span>
<span class="line">          <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>//CLOUD<span class="token punctuation">-</span>PAYMENT<span class="token punctuation">-</span>SERVICE</span>
<span class="line">          <span class="token key atrule">predicates</span><span class="token punctuation">:</span></span>
<span class="line">            <span class="token punctuation">-</span> Path=/payment/<span class="token important">**</span> <span class="token comment">#路由的断言/payment/** 通过</span></span>
<span class="line">            <span class="token punctuation">-</span> After=2020<span class="token punctuation">-</span>03<span class="token punctuation">-</span>14T20<span class="token punctuation">:</span>02<span class="token punctuation">:</span>40.743+08<span class="token punctuation">:</span>00<span class="token punctuation">[</span>Asia/Shanghai<span class="token punctuation">]</span> <span class="token comment">#在这个时间之后生效，ZonedTime.now()可获取当前时间</span></span>
<span class="line">            <span class="token comment">#- Before=2020-03-14T20:02:40.743+08:00[Asia/Shanghai] #之前</span></span>
<span class="line">            <span class="token comment">#- Between=2020-01-14T20:02:40.743+08:00[Asia/Shanghai],2020-03-14T20:02:40.743+08:00[Asia/Shanghai] #之间</span></span>
<span class="line">            <span class="token comment">#- Cookie=username,ws # 带cookie访问,可用正则（用curl localhost:9527/payment/get/5 --cookie "username=ws"）测试</span></span>
<span class="line">            <span class="token comment">#- Header=X-Request-Id,\d+ #请求头要有X-Request-Id属性，并且满足正则\d+（整数）(curl localhost:9527/payment/get/5 -H "X-Request-Id:1")</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="filter的使用" tabindex="-1"><a class="header-anchor" href="#filter的使用"><span>Filter的使用</span></a></h3>
<ul>
<li>生命周期</li>
</ul>
<ul>
<li>pre</li>
<li>post</li>
</ul>
<ul>
<li>种类
<ul>
<li>GatewayFilter</li>
<li>GlobalFilter</li>
</ul>
</li>
</ul>
<h4 id="自定义filter" tabindex="-1"><a class="header-anchor" href="#自定义filter"><span>自定义filter</span></a></h4>
<ul>
<li>实现接口 GlobalFilter,Ordered</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token punctuation">.</span>filter</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>hutool<span class="token punctuation">.</span>core<span class="token punctuation">.</span>date<span class="token punctuation">.</span></span><span class="token class-name">DateUtil</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>filter<span class="token punctuation">.</span></span><span class="token class-name">GatewayFilterChain</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>filter<span class="token punctuation">.</span></span><span class="token class-name">GlobalFilter</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>core<span class="token punctuation">.</span></span><span class="token class-name">Ordered</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>http<span class="token punctuation">.</span></span><span class="token class-name">HttpStatus</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Component</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>server<span class="token punctuation">.</span></span><span class="token class-name">ServerWebExchange</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">reactor<span class="token punctuation">.</span>core<span class="token punctuation">.</span>publisher<span class="token punctuation">.</span></span><span class="token class-name">Mono</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/14</span>
<span class="line"> * DESC： gateway全局日志配置Filter</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token comment">//@Order(0)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GlobalLogFilter</span> <span class="token keyword">implements</span> <span class="token class-name">GlobalFilter</span><span class="token punctuation">,</span> <span class="token class-name">Ordered</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">></span></span> <span class="token function">filter</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">,</span> <span class="token class-name">GatewayFilterChain</span> chain<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"********GlobalLogFilter:********"</span><span class="token operator">+</span> <span class="token class-name">DateUtil</span><span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> username <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getQueryParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getFirst</span><span class="token punctuation">(</span><span class="token string">"username"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> username<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"********非法用户！********"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            exchange<span class="token punctuation">.</span><span class="token function">getResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setStatusCode</span><span class="token punctuation">(</span><span class="token class-name">HttpStatus</span><span class="token punctuation">.</span><span class="token constant">NOT_ACCEPTABLE</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">           <span class="token comment">// return exchange.getResponse().setComplete();</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 加载过滤器的顺序 数字越小越先加载</span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getOrder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


