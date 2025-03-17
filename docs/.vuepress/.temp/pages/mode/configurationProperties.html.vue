<template><div><h2 id="configurationproperties获取配置文件值" tabindex="-1"><a class="header-anchor" href="#configurationproperties获取配置文件值"><span>@ConfigurationProperties获取配置文件值</span></a></h2>
<ul>
<li>在编写项目代码时，我们要求更灵活的配置，更好的模块化整合。在 Spring Boot 项目中，为满足以上要求，我们将大量的参数配置在 application.properties 或 application.yml 文件中，通过 @ConfigurationProperties 注解，我们可以方便的获取这些参数值</li>
</ul>
<h3 id="编写配置类" tabindex="-1"><a class="header-anchor" href="#编写配置类"><span>编写配置类</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * <span class="token keyword">@author</span> wang.song</span>
<span class="line"> * <span class="token keyword">@date</span> 2020-12-09 14:54</span>
<span class="line"> * @Desc  获取properties中 spring.private.redis前缀的值</span>
<span class="line"> */</span></span>
<span class="line"><span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span>prefix <span class="token operator">=</span> <span class="token string">"spring.private.redis"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token annotation punctuation">@Data</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyRedisProperties</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 模式</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Integer</span> mode<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 密码</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> password<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 单机HOST:PORT</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> hostPort<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 单机port</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> port<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 哨兵名称</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> sentinelName<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 哨兵节点</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> sentinelnodes<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="enableconfigurationproperties-进行注册" tabindex="-1"><a class="header-anchor" href="#enableconfigurationproperties-进行注册"><span>@EnableConfigurationProperties 进行注册</span></a></h2>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * <span class="token keyword">@author</span> wang.song</span>
<span class="line"> * <span class="token keyword">@date</span> 2020-12-09 11:50</span>
<span class="line"> * @Desc redisson 配置</span>
<span class="line"> */</span></span>
<span class="line"><span class="token annotation punctuation">@Slf4j</span></span>
<span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token annotation punctuation">@EnableConfigurationProperties</span><span class="token punctuation">(</span><span class="token class-name">MyRedisProperties</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedissonConfiguration</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 构建前缀</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">SENTINEL_PREFIX</span> <span class="token operator">=</span> <span class="token string">"redis://"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Config</span> config <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Config</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span>  <span class="token class-name">Redisson</span> redisson<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token annotation punctuation">@ConditionalOnMissingBean</span><span class="token punctuation">(</span><span class="token class-name">RedissonClient</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">MyRedisProperties</span> <span class="token function">getProperties</span><span class="token punctuation">(</span><span class="token class-name">MyRedisProperties</span> myRedisProperties<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">createRedisson</span><span class="token punctuation">(</span>myRedisProperties<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> myRedisProperties<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">createRedisson</span><span class="token punctuation">(</span><span class="token class-name">MyRedisProperties</span> myRedisProperties<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Integer</span> mode <span class="token operator">=</span> myRedisProperties<span class="token punctuation">.</span><span class="token function">getMode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">setConfig</span><span class="token punctuation">(</span>mode<span class="token punctuation">,</span> myRedisProperties<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        redisson<span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">Redisson</span><span class="token punctuation">)</span> <span class="token class-name">Redisson</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Redisson</span> <span class="token function">getRedisson</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> redisson<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 根据配置文件获取redis模式</span>
<span class="line">     *</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">type</span></span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">myRedisProperties</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">setConfig</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> type<span class="token punctuation">,</span> <span class="token class-name">MyRedisProperties</span> myRedisProperties<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">switch</span> <span class="token punctuation">(</span>type<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token number">1</span><span class="token operator">:</span></span>
<span class="line">                <span class="token comment">//单机redis</span></span>
<span class="line">                config<span class="token punctuation">.</span><span class="token function">useSingleServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAddress</span><span class="token punctuation">(</span><span class="token constant">SENTINEL_PREFIX</span> <span class="token operator">+</span> myRedisProperties<span class="token punctuation">.</span><span class="token function">getHostPort</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setPassword</span><span class="token punctuation">(</span>myRedisProperties<span class="token punctuation">.</span><span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token number">2</span><span class="token operator">:</span></span>
<span class="line">                <span class="token comment">//哨兵</span></span>
<span class="line">                <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> split <span class="token operator">=</span> myRedisProperties<span class="token punctuation">.</span><span class="token function">getSentinelnodes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">","</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> arrayList <span class="token operator">=</span> <span class="token class-name">Lists</span><span class="token punctuation">.</span><span class="token function">newArrayList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">String</span> sp <span class="token operator">:</span> split<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    arrayList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token constant">SENTINEL_PREFIX</span> <span class="token operator">+</span> sp<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">                <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> strings <span class="token operator">=</span> arrayList<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span>arrayList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                config<span class="token punctuation">.</span><span class="token function">useSentinelServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addSentinelAddress</span><span class="token punctuation">(</span>strings<span class="token punctuation">)</span></span>
<span class="line">                        <span class="token punctuation">.</span><span class="token function">setMasterName</span><span class="token punctuation">(</span>myRedisProperties<span class="token punctuation">.</span><span class="token function">getSentinelName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setPassword</span><span class="token punctuation">(</span>myRedisProperties<span class="token punctuation">.</span><span class="token function">getPassword</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setDatabase</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">case</span> <span class="token number">3</span><span class="token operator">:</span></span>
<span class="line">                <span class="token comment">//TODO 集群</span></span>
<span class="line">                config<span class="token punctuation">.</span><span class="token function">useClusterServers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addNodeAddress</span><span class="token punctuation">(</span></span>
<span class="line">                        <span class="token string">"redis://172.29.3.245:6375"</span><span class="token punctuation">,</span> <span class="token string">"redis://172.29.3.245:6376"</span><span class="token punctuation">,</span> <span class="token string">"redis://172.29.3.245:6377"</span><span class="token punctuation">,</span></span>
<span class="line">                        <span class="token string">"redis://172.29.3.245:6378"</span><span class="token punctuation">,</span> <span class="token string">"redis://172.29.3.245:6379"</span><span class="token punctuation">,</span> <span class="token string">"redis://172.29.3.245:6380"</span><span class="token punctuation">)</span></span>
<span class="line">                        <span class="token punctuation">.</span><span class="token function">setPassword</span><span class="token punctuation">(</span><span class="token string">"a123456"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setScanInterval</span><span class="token punctuation">(</span><span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">default</span><span class="token operator">:</span></span>
<span class="line">                <span class="token comment">//默认单机</span></span>
<span class="line">                config<span class="token punctuation">.</span><span class="token function">useSingleServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAddress</span><span class="token punctuation">(</span><span class="token string">"redis://172.0.0.1:6379"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


