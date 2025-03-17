<template><div><h2 id="springcloud-分布式链路追踪-sleuth" tabindex="-1"><a class="header-anchor" href="#springcloud-分布式链路追踪-sleuth"><span>SpringCloud 分布式链路追踪 Sleuth</span></a></h2>
<h3 id="sleuth-是什么" tabindex="-1"><a class="header-anchor" href="#sleuth-是什么"><span>Sleuth 是什么</span></a></h3>
<ul>
<li>Spring Cloud Sleuth 提供了一套完整的服务跟踪解决方案，在分布式系统中提供追踪解决方案并兼容zipkin</li>
</ul>
<h3 id="sleuth-解决什么问题" tabindex="-1"><a class="header-anchor" href="#sleuth-解决什么问题"><span>Sleuth 解决什么问题</span></a></h3>
<ul>
<li>
<p>在微服务架构中，一个由客户端发起的请求在后端系统中会经过多个不同的服务端的调用来协同产生最后的请求结果，每一个前段的请求都会形成一条复杂的分布式调用链路，链路中任何一个环节出现了高延时或者请求都会导致整个请求失败。</p>
</li>
<li>
<p>我们在微服务架构里面，我们有必要知道，一个流程走了多少步，走过了多少节点，每一步的耗时情况。Sleuth出现就是解决这个问题。</p>
</li>
</ul>
<h3 id="sleuth的zipkin搭建安装" tabindex="-1"><a class="header-anchor" href="#sleuth的zipkin搭建安装"><span>Sleuth的zipkin搭建安装</span></a></h3>
<ul>
<li>
<p>zipkin下载安装</p>
<ul>
<li>spring cloud F版之后不需要  构建zipkin Server了，只需要下载jar 运行</li>
<li>下载地址： <code v-pre>https://dl.bintray.com/openzipkin/maven/io/zipkin/java/zipkin-server/</code>  下载 <code v-pre>zipkin-server-2.12.9-exec.jar</code></li>
</ul>
</li>
<li>
<p>java -jar   zipkin-server-2.12.9-exec.jar 运行</p>
</li>
<li>
<p>运行控制台 <code v-pre>http://localhost:9411/zipkin/</code></p>
</li>
</ul>
<h3 id="zipkin调用图" tabindex="-1"><a class="header-anchor" href="#zipkin调用图"><span>zipkin调用图</span></a></h3>
<img :src="$withBase('/springcloud/6.png')" alt="dock">
<ul>
<li>
<p>名词解释：</p>
<ul>
<li>Trace: 类似树结构的span集合，表示同一调用链路，存在唯一标识。</li>
<li>span: 表示调用链路来源，通俗理解span就是一次请求信息。</li>
</ul>
<h3 id="项目演示-一个euraka-一个服务端8001-一个客户端80" tabindex="-1"><a class="header-anchor" href="#项目演示-一个euraka-一个服务端8001-一个客户端80"><span>项目演示（一个euraka,一个服务端8001，一个客户端80）</span></a></h3>
<h4 id="_8001" tabindex="-1"><a class="header-anchor" href="#_8001"><span>8001</span></a></h4>
<ul>
<li>增加zipkin依赖</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token comment">&lt;!--包含seluth和zipkin --></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-zipkin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>yml 增加</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line"><span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>payment<span class="token punctuation">-</span>service</span>
<span class="line"><span class="token key atrule">zipkin</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">base-url</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">9411</span></span>
<span class="line"><span class="token key atrule">sleuth</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">sampler</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">probability</span><span class="token punctuation">:</span> <span class="token number">1</span> <span class="token comment">#采样样本，0-１之间，1表示全部采样</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>controller</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/zipkin"</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">getZipkin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token punctuation">(</span><span class="token string">"zipkin调用成功！！！"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_80-增加配置如同8001" tabindex="-1"><a class="header-anchor" href="#_80-增加配置如同8001"><span>80 增加配置如同8001</span></a></h4>
<ul>
<li>增加controller</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/payment/getZipkin"</span><span class="token punctuation">)</span></span>
<span class="line"> <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">getZipkin</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">         <span class="token keyword">return</span> restTemplate<span class="token punctuation">.</span><span class="token function">getForObject</span><span class="token punctuation">(</span><span class="token constant">PAYMENT_URL</span><span class="token operator">+</span><span class="token string">"/zipkin"</span><span class="token punctuation">,</span><span class="token class-name">CommonResult</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>顺序启动eureka、8001、80，调用 <code v-pre>localhost:8000/consumer/payment/getZipkin</code></p>
</li>
<li>
<p>访问 <code v-pre>http://localhost:9411/zipkin/</code>,可以选择服务，来查看调用情况，查看依赖看链路调用关系等</p>
</li>
</ul>
</li>
</ul>
</div></template>


