<template><div><h2 id="分布式锁二-redis分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁二-redis分布式锁"><span>分布式锁二 Redis分布式锁</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>redis实现分布式锁类似数据库分布式锁。针对某个资源，保证其访问的互斥性。使用redis实现锁，主要就是讲资源放入redis中，利用其原子性的特性。当其它线程访问资源时，先在redis中看是否存在，如果存在不允许继续操作。</p>
</li>
<li>
<p>redis有两个方法：<code v-pre>setnx()</code> <code v-pre>expire()</code>.setnx接收两个参数key，value。如果key存在，则不做任何操作，返回0，若key不存在，则设置成功，返回1。expire 设置过期时间，要注意的是 setnx 命令不能设置 key 的超时时间，只能通过 expire() 来对 key 设置。这两个方法是实现redis分布式锁的重要方法。</p>
</li>
<li>
<p>加锁：加锁中需要设置过期时间，这两个操作必须是原子性的，否则加锁后没有成功设置过期时间，导致死锁。</p>
</li>
<li>
<p>解锁：解锁必须是解除自己加上的锁，比如一个A线程执行效率特别慢，导致锁失效后还未执行完，这时B线程拿到了锁，之后A线程执行完毕去解锁，结果把B线程的锁解了。导致后面的C、D、E都可以拿到锁。</p>
</li>
</ul>
<h3 id="实现过程" tabindex="-1"><a class="header-anchor" href="#实现过程"><span>实现过程</span></a></h3>
<ul>
<li>
<p>引入redis 并配置，实现参考<strong>代码片段</strong>里的 springboot整合redis</p>
</li>
<li>
<p>和数据库分布式锁类似，当执行一个流程时，先加锁，如果成功则执行业务代码，完成后解锁.</p>
</li>
<li>
<p>当加锁失败，说明此时已经存在锁，此处抛AppException异常，可以上游捕获此异常后续处理.</p>
</li>
</ul>
<h3 id="代码片段" tabindex="-1"><a class="header-anchor" href="#代码片段"><span>代码片段</span></a></h3>
<ul>
<li>redis锁代码</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisLock</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token doc-comment comment">/**</span>
<span class="line">     * 解锁脚本，原子操作</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> unlockScript <span class="token operator">=</span></span>
<span class="line">            <span class="token string">"if redis.call(\"get\",KEYS[1]) == ARGV[1]\n"</span></span>
<span class="line">                    <span class="token operator">+</span> <span class="token string">"then\n"</span></span>
<span class="line">                    <span class="token operator">+</span> <span class="token string">"    return redis.call(\"del\",KEYS[1])\n"</span></span>
<span class="line">                    <span class="token operator">+</span> <span class="token string">"else\n"</span></span>
<span class="line">                    <span class="token operator">+</span> <span class="token string">"    return 0\n"</span></span>
<span class="line">                    <span class="token operator">+</span> <span class="token string">"end"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">StringRedisTemplate</span> redisTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">     <span class="token doc-comment comment">/**</span>
<span class="line">       * 功能描述: <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line">       *&lt; 加锁，有阻塞></span>
<span class="line">       *</span>
<span class="line">       * <span class="token keyword">@param</span></span>
<span class="line">       * <span class="token keyword">@return</span></span>
<span class="line">       */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">lock</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token keyword">long</span> expire<span class="token punctuation">,</span> <span class="token keyword">long</span> timeout<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">long</span> startTime <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> token<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">do</span><span class="token punctuation">{</span></span>
<span class="line">            token <span class="token operator">=</span> <span class="token function">tryLock</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> expire<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span><span class="token punctuation">(</span>token <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-</span>startTime<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token punctuation">(</span>timeout<span class="token operator">-</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                    <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">                <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//try 50 per sec</span></span>
<span class="line">                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">while</span><span class="token punctuation">(</span>token<span class="token operator">==</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> token<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 加锁，无阻塞</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">name</span></span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">expire</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">tryLock</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token keyword">long</span> expire<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> token <span class="token operator">=</span> <span class="token constant">UUID</span><span class="token punctuation">.</span><span class="token function">randomUUID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">RedisConnectionFactory</span> factory <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">getConnectionFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">RedisConnection</span> conn <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span><span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Boolean</span> result <span class="token operator">=</span> conn<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>name<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> token<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">                    <span class="token class-name">Expiration</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>expire<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MILLISECONDS</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">RedisStringCommands<span class="token punctuation">.</span>SetOption</span><span class="token punctuation">.</span><span class="token constant">SET_IF_ABSENT</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span><span class="token punctuation">(</span>result<span class="token operator">!=</span><span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> result<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span> token<span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">RedisConnectionUtils</span><span class="token punctuation">.</span><span class="token function">releaseConnection</span><span class="token punctuation">(</span>conn<span class="token punctuation">,</span> factory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 解锁</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">name</span></span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">token</span></span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">unlock</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token class-name">String</span> token<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span> keysAndArgs <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        keysAndArgs<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> name<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        keysAndArgs<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> token<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">RedisConnectionFactory</span> factory <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">getConnectionFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">RedisConnection</span> conn <span class="token operator">=</span> factory<span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Long</span> result <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Long</span><span class="token punctuation">)</span>conn<span class="token punctuation">.</span><span class="token function">scriptingCommands</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">eval</span><span class="token punctuation">(</span>unlockScript<span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">Charset</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"UTF-8"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token class-name">ReturnType</span><span class="token punctuation">.</span><span class="token constant">INTEGER</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span> keysAndArgs<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span><span class="token punctuation">(</span>result<span class="token operator">!=</span><span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> result<span class="token operator">></span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">RedisConnectionUtils</span><span class="token punctuation">.</span><span class="token function">releaseConnection</span><span class="token punctuation">(</span>conn<span class="token punctuation">,</span> factory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>封装</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//回调接口</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 调用</span>
<span class="line">     * <span class="token keyword">@return</span> 结果</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token class-name">T</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">  <span class="token doc-comment comment">/**</span>
<span class="line">     * Redis实体类，封装加锁参数</span>
<span class="line">     * <span class="token keyword">@return</span> 结果</span>
<span class="line">     */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisLockBean</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> expire<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">long</span> timeout<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">RedisLockBean</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token keyword">long</span> expire<span class="token punctuation">,</span> <span class="token keyword">long</span> timeout<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>expire <span class="token operator">=</span> expire<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>timeout <span class="token operator">=</span> timeout<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">getExpire</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> expire<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setExpire</span><span class="token punctuation">(</span><span class="token keyword">long</span> expire<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>expire <span class="token operator">=</span> expire<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">getTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> timeout<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">long</span> timeout<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>timeout <span class="token operator">=</span> timeout<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 模板</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">RedisLockTemplate</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 执行</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">callBack</span> 回调</span>
<span class="line">     * <span class="token keyword">@return</span> 执行结果</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">RedisLockBean</span> redisLockBean<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 〈〉<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line"> * 模板实现类</span>
<span class="line"> *</span>
<span class="line"> * <span class="token keyword">@author</span> 88395515</span>
<span class="line"> * <span class="token keyword">@date</span>: Created in 15:59 2019/9/9</span>
<span class="line"> * <span class="token keyword">@see</span> [相关类/方法]（可选）</span>
<span class="line"> * <span class="token keyword">@since</span> [产品/模块版本] （可选）</span>
<span class="line"> */</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisLockTemplateImpl</span> <span class="token keyword">implements</span> <span class="token class-name">RedisLockTemplate</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Logger</span> <span class="token constant">LOG</span> <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">RedisLockTemplateImpl</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token class-name">RedisLock</span> redisLock<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">RedisLockBean</span> redisLockBean<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> token <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            token <span class="token operator">=</span> redisLock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span>redisLockBean<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> redisLockBean<span class="token punctuation">.</span><span class="token function">getExpire</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> redisLockBean<span class="token punctuation">.</span><span class="token function">getTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>token <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"RedisLockTemplate,获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> callBack<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"RedisLockTemplate,未获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token class-name">CoreErrorCode</span><span class="token punctuation">.</span><span class="token constant">ONE_BY_ONE_EXCEPTION</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"业务正在处理中"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>token <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                redisLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span>redisLockBean<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> token<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Autowired</span></span>
<span class="line"><span class="token class-name">RedisLockTemplate</span> redisLockTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/b"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">ModelAndView</span> <span class="token function">b</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">ModelAndView</span> mv <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ModelAndView</span><span class="token punctuation">(</span><span class="token string">"b"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    redisLockTemplate<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">RedisLockBean</span><span class="token punctuation">(</span><span class="token string">"LOCK_DEMO_B"</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token keyword">new</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Object</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token annotation punctuation">@Override</span></span>
<span class="line">            <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token comment">//TODO 业务逻辑代码</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> mv<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p>上述代码，仅对 redis 单实例架构有效，当面对 redis 集群时就无效了。但是一般情况下，我们的 redis 架构多数会做成“主备”模式，然后再通过 redis 哨兵实现主从切换，这种模式下我们的应用服务器直接面向主机，也可看成是单实例，因此上述代码实现也有效。但是当在主机宕机，从机被升级为主机的一瞬间的时候，如果恰好在这一刻，由于 redis 主从复制的异步性，导致从机中数据没有即时同步，那么上述代码依然会无效，导致同一资源有可能会产生两把锁，违背了分布式锁的原则。</p>
</li>
<li>
<p>当 redis 的架构是单实例模式时，如果存在主备且可以忍受小概率的锁出错，那么就可以直接使用上述代码，当然最严谨的方式还是使用官方的 Redlock 算法实现。其中 Java 包推荐使用 redisson。</p>
</li>
</ul>
<h2 id="redisson-改写redis分布式锁" tabindex="-1"><a class="header-anchor" href="#redisson-改写redis分布式锁"><span>Redisson 改写redis分布式锁</span></a></h2>
<ul>
<li>Redisson是架设在Redis基础上的一个Java主内存数据网格（In-Memory Data Grid）。在Java实用工具包中常用接口的基础上，为使用者提供了一系列具有分布式特性的常用工具类。</li>
<li>Redisson Wiki：<code v-pre>https://github.com/redisson/redisson/wiki</code></li>
</ul>
<h3 id="jar包依赖" tabindex="-1"><a class="header-anchor" href="#jar包依赖"><span>jar包依赖</span></a></h3>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.redisson<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>redisson<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">></span></span>3.5.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="配置redisson" tabindex="-1"><a class="header-anchor" href="#配置redisson"><span>配置Redisson</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedissonManager</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Config</span> config <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Config</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//声明redisso对象</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Redisson</span> redisson <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token comment">//实例化redisson</span></span>
<span class="line">    <span class="token keyword">static</span><span class="token punctuation">{</span></span>
<span class="line">       <span class="token doc-comment comment">/**</span>
<span class="line">         * 单机模式,如果有密码后面setPassword</span>
<span class="line">         */</span></span>
<span class="line">        config<span class="token punctuation">.</span><span class="token function">useSingleServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAddress</span><span class="token punctuation">(</span><span class="token string">"redis://127.0.0.1:6379"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token doc-comment comment">/**</span>
<span class="line">         * 哨兵模式</span>
<span class="line">         */</span></span>
<span class="line">        <span class="token comment">/*config.useSentinelServers().addSentinelAddress("redis://172.29.3.245:26378","redis://172.29.3.245:26379", "redis://172.29.3.245:26380")</span>
<span class="line">                .setMasterName("mymaster")</span>
<span class="line">                .setPassword("a123456").setDatabase(0);*/</span></span>
<span class="line">        <span class="token doc-comment comment">/**</span>
<span class="line">         * 集群模式</span>
<span class="line">         */</span></span>
<span class="line">        <span class="token comment">/*config.useClusterServers().addNodeAddress(</span>
<span class="line">                "redis://172.29.3.245:6375","redis://172.29.3.245:6376", "redis://172.29.3.245:6377",</span>
<span class="line">                "redis://172.29.3.245:6378","redis://172.29.3.245:6379", "redis://172.29.3.245:6380")</span>
<span class="line">                .setPassword("a123456").setScanInterval(5000);*/</span></span>
<span class="line">       </span>
<span class="line">        <span class="token comment">//得到redisson对象</span></span>
<span class="line">        redisson <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Redisson</span><span class="token punctuation">)</span> <span class="token class-name">Redisson</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"> <span class="token comment">//获取redisson对象的方法</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Redisson</span> <span class="token function">getRedisson</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> redisson<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="锁的获取和释放" tabindex="-1"><a class="header-anchor" href="#锁的获取和释放"><span>锁的获取和释放</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DistributedRedisLock</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Logger</span> <span class="token constant">LOG</span> <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">DistributedRedisLock</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token comment">//从配置类中获取redisson对象</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Redisson</span> redisson <span class="token operator">=</span> <span class="token class-name">RedissonManager</span><span class="token punctuation">.</span><span class="token function">getRedisson</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">LOCK_TITLE</span> <span class="token operator">=</span> <span class="token string">"redisLock_"</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token comment">//加锁</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token class-name">String</span> lockName<span class="token punctuation">,</span><span class="token keyword">int</span> timeout<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//声明key对象</span></span>
<span class="line">        <span class="token class-name">String</span> key <span class="token operator">=</span> <span class="token constant">LOCK_TITLE</span> <span class="token operator">+</span> lockName<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//获取锁对象</span></span>
<span class="line">        <span class="token class-name">RLock</span> mylock <span class="token operator">=</span> redisson<span class="token punctuation">.</span><span class="token function">getLock</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//加锁，并且设置锁过期时间，防止死锁的产生</span></span>
<span class="line">       <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> mylock<span class="token punctuation">.</span><span class="token function">tryLock</span><span class="token punctuation">(</span>time<span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MINUTES</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"======lock,e:{}======"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">FALSE</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token comment">//锁的释放</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">release</span><span class="token punctuation">(</span><span class="token class-name">String</span> lockName<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//必须是和加锁时的同一个key</span></span>
<span class="line">        <span class="token class-name">String</span> key <span class="token operator">=</span> <span class="token constant">LOCK_TITLE</span> <span class="token operator">+</span> lockName<span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//获取所对象</span></span>
<span class="line">        <span class="token class-name">RLock</span> mylock <span class="token operator">=</span> redisson<span class="token punctuation">.</span><span class="token function">getLock</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//释放锁（解锁）</span></span>
<span class="line">        mylock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"======unlock======"</span><span class="token operator">+</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="改写-redislocktemplateimpl" tabindex="-1"><a class="header-anchor" href="#改写-redislocktemplateimpl"><span>改写 <code v-pre>RedisLockTemplateImpl</code></span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedisLockTemplateImpl</span> <span class="token keyword">implements</span> <span class="token class-name">RedisLockTemplate</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Logger</span> <span class="token constant">LOG</span> <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">RedisLockTemplateImpl</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token class-name">RedisLock</span> redisLock<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">T</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">RedisLockBean</span> redisLockBean<span class="token punctuation">,</span> <span class="token class-name">CallBack</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> callBack<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">         <span class="token keyword">boolean</span> acquire <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            acquire <span class="token operator">=</span> <span class="token class-name">DistributedRedisLock</span><span class="token punctuation">.</span><span class="token function">acquire</span><span class="token punctuation">(</span>redisLockBean<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> redisLockBean<span class="token punctuation">.</span><span class="token function">getTimeout</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>acquire<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"RedisLockTemplate,获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token keyword">return</span> callBack<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">"RedisLockTemplate,未获取到锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token class-name">CoreErrorCode</span><span class="token punctuation">.</span><span class="token constant">ONE_BY_ONE_EXCEPTION</span><span class="token punctuation">,</span> oneByOne<span class="token punctuation">.</span><span class="token function">getDescription</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"业务正在处理中"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span><span class="token punctuation">(</span>acquire<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">                <span class="token class-name">DistributedRedisLock</span><span class="token punctuation">.</span><span class="token function">release</span><span class="token punctuation">(</span>redisLockBean<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span>  </span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


