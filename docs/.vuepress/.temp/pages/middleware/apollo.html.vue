<template><div><h2 id="apollo-分布式配置中心" tabindex="-1"><a class="header-anchor" href="#apollo-分布式配置中心"><span>Apollo-分布式配置中心</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>Apollo（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，
配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，适用于微服务配置管理场景。</p>
</li>
<li>
<p>服务端基于Spring Boot和Spring Cloud开发，不依赖外部容器，便于部署。</p>
</li>
<li>
<p>Java客户端不依赖任何框架，能够运行于所有Java运行时环境，同时对Spring/Spring Boot环境也有额外支持。</p>
</li>
</ul>
<h3 id="环境准备" tabindex="-1"><a class="header-anchor" href="#环境准备"><span>环境准备</span></a></h3>
<ul>
<li>
<p>JDK 1.8+</p>
</li>
<li>
<p>MySql 5.6.5+</p>
</li>
</ul>
<h3 id="单机版部署" tabindex="-1"><a class="header-anchor" href="#单机版部署"><span>单机版部署</span></a></h3>
<h4 id="启动apollo配置中心" tabindex="-1"><a class="header-anchor" href="#启动apollo配置中心"><span>启动Apollo配置中心</span></a></h4>
<ul>
<li>
<p>github下载项目 <code v-pre>https://github.com/nobodyiam/apollo-build-scripts</code></p>
</li>
<li>
<p>执行sql包下sql文件，分别通过语句查询，有数据则表示导入成功</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token keyword">select</span> <span class="token variable"><span class="token variable">`</span>Id<span class="token variable">`</span></span>, <span class="token variable"><span class="token variable">`</span>AppId<span class="token variable">`</span></span>, <span class="token variable"><span class="token variable">`</span>Name<span class="token variable">`</span></span> from ApolloPortalDB.App<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token keyword">select</span> <span class="token variable"><span class="token variable">`</span>NamespaceId<span class="token variable">`</span></span>, <span class="token variable"><span class="token variable">`</span>Key<span class="token variable">`</span></span>, <span class="token variable"><span class="token variable">`</span>Value<span class="token variable">`</span></span>, <span class="token variable"><span class="token variable">`</span>Comment<span class="token variable">`</span></span> from ApolloConfigDB.Item<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>
<p>修改demo.sh的<code v-pre>#apollo config db info</code>和<code v-pre># apollo portal db info</code>中数据库连接配置</p>
</li>
<li>
<p>脚本会在本地启动3个服务，分别使用8070, 8080, 8090端口，启动前请确保这3个端口当前没有被使用。</p>
</li>
<li>
<p>bash命令启动，用git 在目录下命令运行demo.sh启动</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">./demo.sh start</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>当看到如下输出后，就说明启动成功了！</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">  Started <span class="token punctuation">[</span><span class="token number">9156</span><span class="token punctuation">]</span></span>
<span class="line">  Waiting <span class="token keyword">for</span> config <span class="token function">service</span> startup<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.</span>
<span class="line">  Config <span class="token function">service</span> started. You may visit http://localhost:8080 <span class="token keyword">for</span> <span class="token function">service</span> status now<span class="token operator">!</span></span>
<span class="line">  Waiting <span class="token keyword">for</span> admin <span class="token function">service</span> startup<span class="token punctuation">..</span></span>
<span class="line">  Admin <span class="token function">service</span> started</span>
<span class="line">  <span class="token operator">==</span><span class="token operator">==</span> starting portal <span class="token operator">==</span><span class="token operator">==</span></span>
<span class="line">  Portal logging <span class="token function">file</span> is ./portal/apollo-portal.log</span>
<span class="line">  Started <span class="token punctuation">[</span><span class="token number">15100</span><span class="token punctuation">]</span></span>
<span class="line">  Waiting <span class="token keyword">for</span> portal startup<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span></span>
<span class="line">  Portal started. You can visit http://localhost:8070 now<span class="token operator">!</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>输入 localhost:8070进入管理页面，账号apollo 密码admin登陆</p>
</li>
<li>
<p>点击已有的SimpleApp项目（或者新增），新增配置增加一个key为productCode，值为7001601的配置，点击发布</p>
</li>
</ul>
<h4 id="客户端搭建" tabindex="-1"><a class="header-anchor" href="#客户端搭建"><span>客户端搭建</span></a></h4>
<ul>
<li>springboot项目 2.2.2RELEASE ，引入apollo依赖</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>com.ctrip.framework.apollo<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>apollo-client<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>1.5.1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>application.properties配置</li>
</ul>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">9999</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#appId和配置中心中AppId相同</span></span>
<span class="line"><span class="token key attr-name">app.id</span><span class="token punctuation">=</span><span class="token value attr-value">SampleApp</span></span>
<span class="line"><span class="token comment"># 配置中心地址</span></span>
<span class="line"><span class="token key attr-name">apollo.meta</span><span class="token punctuation">=</span><span class="token value attr-value">http://localhost:8080</span></span>
<span class="line"><span class="token key attr-name">apollo.bootstrap.enable</span><span class="token punctuation">=</span><span class="token value attr-value">true</span></span>
<span class="line"><span class="token key attr-name">apollo.bootstrap.namespaces</span><span class="token punctuation">=</span><span class="token value attr-value">application</span></span>
<span class="line"><span class="token comment">#日志缓存位置</span></span>
<span class="line"><span class="token key attr-name">apollo.cacheDir</span><span class="token punctuation">=</span> <span class="token value attr-value">D:\\apollo\\apollo_parent\\LOG</span></span>
<span class="line"></span>
<span class="line"><span class="token key attr-name">env</span> <span class="token punctuation">=</span> <span class="token value attr-value">DEV</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动入口增加 <code v-pre>@EnableApolloConfig</code> 注解</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableApolloConfig</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ApolloParentApplication</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">ApolloParentApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>增加获取配置的config</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ApolloConfig</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**productCode缺省值为00**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${productCode:00}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> productCode<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getProductCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> productCode<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>增加controller验证</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">HelloAction</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">ApolloConfig</span> apolloConfig<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/index"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">hello</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> productCode <span class="token operator">=</span> apolloConfig<span class="token punctuation">.</span><span class="token function">getProductCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"hello man:"</span><span class="token operator">+</span>productCode<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>浏览器输入 http://localhost:9999/index ，可以看到页面输出:</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">hello man:7001601</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="分布式部署" tabindex="-1"><a class="header-anchor" href="#分布式部署"><span>分布式部署</span></a></h3>
<ul>
<li>
<p>apollo可以按照分布式部署的方式编译、打包、部署Apollo配置中心，从而可以在开发、测试、生产等环境分别部署运行。</p>
</li>
<li>
<p>wiki <code v-pre>https://github.com/ctripcorp/apollo/wiki/%E5%88%86%E5%B8%83%E5%BC%8F%E9%83%A8%E7%BD%B2%E6%8C%87%E5%8D%97</code></p>
</li>
<li>
<p>分布式部署，不同环境拥有不同的配置，数据方面，两条sql分别是<code v-pre>ApolloPortalDB</code> 和<code v-pre>ApolloConfigDB</code>，portal是环境配置管理中心，这个sql只需要在生产上部署一份，config是配置服务，每个环境都需要刷，用来保存不同环境的不同值，下图为样例部署图:
<img :src="$withBase('/apollo/1.png')" alt="dock"></p>
</li>
</ul>
<h4 id="下载集群版" tabindex="-1"><a class="header-anchor" href="#下载集群版"><span>下载集群版</span></a></h4>
<ul>
<li>github <code v-pre>https://github.com/ctripcorp/apollo</code></li>
</ul>
</div></template>


