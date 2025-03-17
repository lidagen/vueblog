<template><div><h2 id="负载均衡服务调用——ribbon" tabindex="-1"><a class="header-anchor" href="#负载均衡服务调用——ribbon"><span>负载均衡服务调用——Ribbon</span></a></h2>
<h3 id="ribbon是什么" tabindex="-1"><a class="header-anchor" href="#ribbon是什么"><span>Ribbon是什么</span></a></h3>
<h4 id="ribbon简介" tabindex="-1"><a class="header-anchor" href="#ribbon简介"><span>Ribbon简介</span></a></h4>
<ul>
<li>Ribbon是Netflix发布的开源项目，主要功能是提供<strong>客户端软件的负载均衡算法和服务调用</strong>，Ribbon提供了一系列完善的配置项如连接超时、重试等。Ribbon会帮助我们基于某种规则（简单轮询、随机连接等）去连接机器，我们也可以实现自定义的负载均衡算法。</li>
<li>Ribbon就是负载均衡+RestTemplate的调用</li>
</ul>
<h4 id="什么是负载均衡" tabindex="-1"><a class="header-anchor" href="#什么是负载均衡"><span>什么是负载均衡</span></a></h4>
<ul>
<li>简单来说就是将用户的请求平摊的分配给多个服务器上，从而达到系统的HA（高可用）</li>
<li>常见的负载均衡软件有Nginx、LVS、硬件F5等。</li>
</ul>
<h4 id="ribbon负载均衡和nginx负载均衡的区别" tabindex="-1"><a class="header-anchor" href="#ribbon负载均衡和nginx负载均衡的区别"><span>Ribbon负载均衡和Nginx负载均衡的区别</span></a></h4>
<ul>
<li>Nginx是服务器负载均衡，客户端所有请求都交给Nginx,然后由Nginx实现转发请求，即负载均衡在服务端实现的。</li>
<li>Ribbon本地负载均衡，在调用微服务接口时，会在注册中心上获取注册信息服务列表后缓存在JVM本地，从而在本地实现RPC远程调用服务。</li>
</ul>
<h3 id="ribbon负载均衡" tabindex="-1"><a class="header-anchor" href="#ribbon负载均衡"><span>Ribbon负载均衡</span></a></h3>
<ul>
<li>架构说明： Ribbon是一个软负载均衡<strong>客户端</strong>组件，他可以和其它所需求的客户端结合使用，和eureka结合只是其中一个实例。</li>
<li>pom.xml</li>
</ul>
<div class="language-pom line-numbers-mode" data-highlighter="prismjs" data-ext="pom"><pre v-pre><code><span class="line"># spring-cloud-starter-netflix-eureka-client 中已经包含了spring-cloud-starter-netflix-ribbon</span>
<span class="line"># 如果不和eureka集成则单独引入</span>
<span class="line">&lt;dependency&gt;</span>
<span class="line">    &lt;groupId&gt;org.springframework.cloud&lt;/groupId&gt;</span>
<span class="line">    &lt;artifactId&gt;spring-cloud-starter-netflix-eureka-client&lt;/artifactId&gt;</span>
<span class="line">&lt;/dependency&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>RestTemplate使用
<ul>
<li>getForObject/getForEntity方法 | postForObject/postForEntiry方法</li>
<li>ForObject返回是JSON串，ForEntity返回的是对象，并包含返回头信息，状态码等。</li>
</ul>
</li>
</ul>
<h3 id="ribbon-核心组件irule" tabindex="-1"><a class="header-anchor" href="#ribbon-核心组件irule"><span>Ribbon 核心组件IRule</span></a></h3>
<ul>
<li>IRule是个接口，其下有多个负载均衡策略</li>
<li>替换负载策略：
<ul>
<li>RoundRobinRule：轮询</li>
<li>RandomRule： 随机</li>
<li>RetryRule： 先按照RoundRobinRule策略获取服务，如果获取失败则在指定时间重连</li>
<li>BestAvailableRule： 会过滤掉多次访问失败的服务，然后挑一个并发量最小的连接</li>
<li>AvailabilityFilteringRule：先过滤失败的服务，挑并发最小的连接</li>
<li>WeightedResponseTimeRule: 继承RoundRobinRule并增加了权重</li>
</ul>
</li>
</ul>
<h4 id="负载均衡切换-配置在之前eureka项目的oder80客户端中-eureka注册中心和服务端payment8001-payment8002不需要改动" tabindex="-1"><a class="header-anchor" href="#负载均衡切换-配置在之前eureka项目的oder80客户端中-eureka注册中心和服务端payment8001-payment8002不需要改动"><span>负载均衡切换（配置在之前eureka项目的oder80客户端中，eureka注册中心和服务端payment8001 payment8002不需要改动   ）</span></a></h4>
<ul>
<li>客户端增加自定义配置类（这个配置类不能放在@CompaseScan能扫描到的包下，否则这个配置类会被所有Ribbon客户端共享，达不到特殊定制的目的）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>ribbon</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>loadbalancer<span class="token punctuation">.</span></span><span class="token class-name">AvailabilityFilteringRule</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>loadbalancer<span class="token punctuation">.</span></span><span class="token class-name">IRule</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Bean</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/11</span>
<span class="line"> * DESC：选择AvailabilityFilteringRule策略，可以在一台服务端挂掉后所有请求负载到另一台</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RibbonConfig</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">IRule</span> <span class="token function">getRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AvailabilityFilteringRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类增加注解</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>ribbon<span class="token punctuation">.</span></span><span class="token class-name">RibbonConfig</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>eureka<span class="token punctuation">.</span></span><span class="token class-name">EnableEurekaClient</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>ribbon<span class="token punctuation">.</span></span><span class="token class-name">RibbonClient</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/9</span>
<span class="line"> * DESC：RibbonClient 的name是需要修改负载均衡服务的名称，configuration是配置负载的配置类</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token annotation punctuation">@RibbonClient</span><span class="token punctuation">(</span>name<span class="token operator">=</span><span class="token string">"CLOUD-PAYMENT-SERVICE"</span><span class="token punctuation">,</span>configuration <span class="token operator">=</span> <span class="token class-name">RibbonConfig</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderMain80</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">OrderMain80</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ribbon-负载均衡算法" tabindex="-1"><a class="header-anchor" href="#ribbon-负载均衡算法"><span>Ribbon 负载均衡算法</span></a></h3>
<h4 id="原理" tabindex="-1"><a class="header-anchor" href="#原理"><span>原理</span></a></h4>
<ul>
<li>负载均衡算法：rest接口第几次请求的数字对服务器集群数取余（请求次数%服务器数量）。每次服务器重启后计数重新开始。</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**获取服务器数量的方法**/</span></span>
<span class="line"><span class="token class-name">List</span>  instance<span class="token operator">=</span>discoveryClient<span class="token punctuation">.</span><span class="token function">getInstances</span><span class="token punctuation">(</span><span class="token string">"CLOUD-PAYMENT-SERVICE"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="源码" tabindex="-1"><a class="header-anchor" href="#源码"><span>源码</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**CAS 自旋锁**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RoundRobinRule</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractLoadBalancerRule</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//下个server的下标</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">AtomicInteger</span> nextServerCyclicCounter<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token constant">AVAILABLE_ONLY_SERVERS</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token constant">ALL_SERVERS</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Logger</span> log <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">RoundRobinRule</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">RoundRobinRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>nextServerCyclicCounter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">RoundRobinRule</span><span class="token punctuation">(</span><span class="token class-name">ILoadBalancer</span> lb<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setLoadBalancer</span><span class="token punctuation">(</span>lb<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Server</span> <span class="token function">choose</span><span class="token punctuation">(</span><span class="token class-name">ILoadBalancer</span> lb<span class="token punctuation">,</span> <span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>lb <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">"no load balancer"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Server</span> server <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>server <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> count<span class="token operator">++</span> <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Server</span><span class="token punctuation">></span></span> reachableServers <span class="token operator">=</span> lb<span class="token punctuation">.</span><span class="token function">getReachableServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Server</span><span class="token punctuation">></span></span> allServers <span class="token operator">=</span> lb<span class="token punctuation">.</span><span class="token function">getAllServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">int</span> upCount <span class="token operator">=</span> reachableServers<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">int</span> serverCount <span class="token operator">=</span> allServers<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">if</span> <span class="token punctuation">(</span>upCount <span class="token operator">!=</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> serverCount <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                        <span class="token comment">//自旋锁，获取下一个机器下标，并且修改nextServerCyclicCounter数值</span></span>
<span class="line">                        <span class="token keyword">int</span> nextServerIndex <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">incrementAndGetModulo</span><span class="token punctuation">(</span>serverCount<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                        server <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Server</span><span class="token punctuation">)</span>allServers<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>nextServerIndex<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                        <span class="token keyword">if</span> <span class="token punctuation">(</span>server <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token keyword">yield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">                            <span class="token keyword">if</span> <span class="token punctuation">(</span>server<span class="token punctuation">.</span><span class="token function">isAlive</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> server<span class="token punctuation">.</span><span class="token function">isReadyToServe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                                <span class="token keyword">return</span> server<span class="token punctuation">;</span></span>
<span class="line">                            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">                            server <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                        <span class="token punctuation">}</span></span>
<span class="line">                        <span class="token keyword">continue</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">                    log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">"No up servers available from load balancer: "</span> <span class="token operator">+</span> lb<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">>=</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">"No available alive servers after 10 tries from load balancer: "</span> <span class="token operator">+</span> lb<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">                <span class="token keyword">return</span> server<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**自旋锁，保证原子性获取下一个server坐标</span>
<span class="line">    **/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">incrementAndGetModulo</span><span class="token punctuation">(</span><span class="token keyword">int</span> modulo<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> current<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">int</span> next<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">do</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//获取AtomicInteger计数</span></span>
<span class="line">            current <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nextServerCyclicCounter<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//计数%机器数</span></span>
<span class="line">            next <span class="token operator">=</span> <span class="token punctuation">(</span>current <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">%</span> modulo<span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//CSA,对比两个数字交换位置</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>nextServerCyclicCounter<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> next<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> next<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Server</span> <span class="token function">choose</span><span class="token punctuation">(</span><span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">choose</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getLoadBalancer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initWithNiwsConfig</span><span class="token punctuation">(</span><span class="token class-name">IClientConfig</span> clientConfig<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="手写算法" tabindex="-1"><a class="header-anchor" href="#手写算法"><span>手写算法</span></a></h4>
<ul>
<li>思路：
<ul>
<li>算法应该在80客户端实现。</li>
<li>DiscoveryClient 可以获取所有的List&lt;  ServiceInstance &gt;，我们需要写一个算法根据 **访问次数%服务器个数 **得到下次访问的ServiceInstance</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">  <span class="token comment">//接口</span></span>
<span class="line">  <span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">LoadBalance</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 从Eureka中所有的ServiceInstanceList 挑选符合负载均衡的ServiceInstance</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">serviceInstances</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token class-name">ServiceInstance</span> <span class="token function">serviceInstance</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">></span></span> serviceInstances<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//实现类</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyLB</span> <span class="token keyword">implements</span> <span class="token class-name">LoadBalance</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">AtomicInteger</span> integer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**自旋锁 获取第几次的访问**/</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//当前</span></span>
<span class="line">        <span class="token keyword">int</span> current<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//下一个下标</span></span>
<span class="line">        <span class="token keyword">int</span> next<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">do</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//当前数字</span></span>
<span class="line">            current <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>integer<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            next <span class="token operator">=</span> current <span class="token operator">>=</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> current <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>integer<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span>next<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"***第几次访问next:***"</span> <span class="token operator">+</span> next<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> next<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">ServiceInstance</span> <span class="token function">serviceInstance</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">></span></span> serviceInstances<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//次数%服务端个数</span></span>
<span class="line">        <span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span> serviceInstances<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> serviceInstances<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>controller调用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/consumer"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderController</span> <span class="token punctuation">{</span></span>
<span class="line">  </span>
<span class="line"></span>
<span class="line">   <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">   <span class="token keyword">private</span> <span class="token class-name">RestTemplate</span> restTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">   <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">   <span class="token keyword">private</span> <span class="token class-name">DiscoveryClient</span> client<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">   <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">   <span class="token class-name">LoadBalance</span> loadBalance<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">   <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/payment/getLb"</span><span class="token punctuation">)</span></span>
<span class="line">   <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">getLb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">       <span class="token class-name">URI</span> uri<span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token doc-comment comment">/**CLOUD-PAYMENT-SERVICE是eureka中注册的名称**/</span></span>
<span class="line">       <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ServiceInstance</span><span class="token punctuation">></span></span> instances <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">getInstances</span><span class="token punctuation">(</span><span class="token string">"CLOUD-PAYMENT-SERVICE"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">       <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">CollectionUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>instances<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">           <span class="token class-name">ServiceInstance</span> serviceInstance <span class="token operator">=</span> loadBalance<span class="token punctuation">.</span><span class="token function">serviceInstance</span><span class="token punctuation">(</span>instances<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            uri <span class="token operator">=</span> serviceInstance<span class="token punctuation">.</span><span class="token function">getUri</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">       <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">       <span class="token keyword">return</span> restTemplate<span class="token punctuation">.</span><span class="token function">getForObject</span><span class="token punctuation">(</span>uri<span class="token operator">+</span><span class="token string">"/payment/getLb"</span><span class="token punctuation">,</span><span class="token class-name">CommonResult</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>取消config中的@LoadBalance注解</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ApplicationConfig</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token annotation punctuation">@Bean</span></span>
<span class="line">   <span class="token comment">//@LoadBalanced//负载均衡</span></span>
<span class="line">   <span class="token keyword">public</span> <span class="token class-name">RestTemplate</span> <span class="token function">restTemplate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">       <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">RestTemplate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


