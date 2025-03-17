<template><div><h2 id="监听模式" tabindex="-1"><a class="header-anchor" href="#监听模式"><span>监听模式</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>监听者模式：触发某种行为，执行相应的动作。</p>
</li>
<li>
<p>监听器模式有三个要素--事件源、事件对象、监听器</p>
<ul>
<li>事件源：事件发生的源头，属于被监听的对象</li>
<li>监听对象：事件对象是用来包装事件源的</li>
<li>监听器：监听模式的核心，定义事件发生后的动作</li>
</ul>
</li>
<li>
<p>事件监听器方法参数是事件对象，事件对象包含事件源的引用，在方法中可以获取事件源的引用</p>
</li>
</ul>
<h3 id="三要素代码" tabindex="-1"><a class="header-anchor" href="#三要素代码"><span>三要素代码</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 〈事件对象〉</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Event</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 事件主题</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> topic<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 事件源</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Object</span> source<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Event</span><span class="token punctuation">(</span><span class="token class-name">String</span> topic<span class="token punctuation">,</span> <span class="token class-name">Object</span> source<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>topic <span class="token operator">=</span> topic<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>source <span class="token operator">=</span> source<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> topic<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">getSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> source<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 〈事件监听器〉<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span> </span>
<span class="line"> * 〈要关心的监听处理器需要实现该类〉</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">EventListener</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * </span>
<span class="line">     * 功能描述: <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line">     * 〈事件处理〉</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">void</span> <span class="token function">handle</span><span class="token punctuation">(</span><span class="token class-name">Event</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>代码中，<code v-pre>Event</code>对象就是<strong>事件对象</strong>，其中封装了<strong>事件源</strong> <code v-pre>source</code>.</p>
</li>
<li>
<p><code v-pre>EventListener</code> 接口是<strong>监听器</strong>，它的参数是事件对象。</p>
</li>
</ul>
<h3 id="完整代码" tabindex="-1"><a class="header-anchor" href="#完整代码"><span>完整代码</span></a></h3>
<ul>
<li>监听三要素已罗列，现在罗列其它类以及配置</li>
</ul>
<h4 id="事件引擎" tabindex="-1"><a class="header-anchor" href="#事件引擎"><span>事件引擎</span></a></h4>
<ul>
<li><strong>事件引擎</strong>是执行把事件对象push给<strong>监听器</strong>的媒介</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//接口</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">EventEngine</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * </span>
<span class="line">     * 功能描述: <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line">     * 〈事件发布〉</span>
<span class="line">     *</span>
<span class="line">     * <span class="token keyword">@param</span> <span class="token parameter">event</span></span>
<span class="line">     * <span class="token keyword">@see</span> [相关类/方法](可选)</span>
<span class="line">     * <span class="token keyword">@since</span> [产品/模块版本](可选)</span>
<span class="line">     */</span></span>
<span class="line">     <span class="token keyword">void</span> <span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token class-name">Event</span> event<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//实现</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EventEngineImp</span> <span class="token keyword">implements</span> <span class="token class-name">EventEngine</span><span class="token punctuation">,</span><span class="token class-name">InitializingBean</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">List</span><span class="token punctuation">&lt;</span><span class="token class-name">SubscribeRule</span><span class="token punctuation">></span><span class="token punctuation">></span></span> <span class="token constant">EVENT_RULE_MAP</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 规则列表</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SubscribeRule</span><span class="token punctuation">></span></span> listEventRule<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token class-name">Event</span> event<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SubscribeRule</span><span class="token punctuation">></span></span> eventRule <span class="token operator">=</span> <span class="token constant">EVENT_RULE_MAP</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> eventRule<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">RuntimeException</span><span class="token punctuation">(</span><span class="token string">"9999"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">SubscribeRule</span> subcribeRule <span class="token operator">:</span> eventRule<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            subcribeRule<span class="token punctuation">.</span><span class="token function">getEventListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">handle</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">afterPropertiesSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">SubscribeRule</span> eventRule <span class="token operator">:</span> listEventRule<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">String</span> topic <span class="token operator">=</span> eventRule<span class="token punctuation">.</span><span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SubscribeRule</span><span class="token punctuation">></span></span> listRule <span class="token operator">=</span> <span class="token constant">EVENT_RULE_MAP</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>topic<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> listRule<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                listRule <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token constant">EVENT_RULE_MAP</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> listRule<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            listRule<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>eventRule<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setListEventRule</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SubscribeRule</span><span class="token punctuation">></span></span> listEventRule<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>listEventRule <span class="token operator">=</span> listEventRule<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="事件规则" tabindex="-1"><a class="header-anchor" href="#事件规则"><span>事件规则</span></a></h4>
<ul>
<li>事件规则封装了<strong>事件对象</strong>中的<code v-pre>TOPIC</code>和<strong>监听器</strong><code v-pre>Listener</code>接口,由于找寻事件对象和监听器对应关系。</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SubscribeRule</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 主题</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> topic<span class="token punctuation">;</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 事件监听器</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">EventListener</span> eventListener<span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> topic<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setTopic</span><span class="token punctuation">(</span><span class="token class-name">String</span> topic<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>topic <span class="token operator">=</span> topic<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">EventListener</span> <span class="token function">getEventListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> eventListener<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setEventListener</span><span class="token punctuation">(</span><span class="token class-name">EventListener</span> eventListener<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>eventListener <span class="token operator">=</span> eventListener<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h4>
<ul>
<li>
<p>配置的目的是加载不同的监听实现，然后封装<code v-pre>SubscribeRule</code> 到<strong>事件引擎</strong>的规则列表中，发布事件后，根据<code v-pre>TOPIC</code>找寻对应的<strong>监听器</strong></p>
</li>
<li>
<p>这里模拟了两个监听器的实现，<code v-pre>AppleListener</code>、<code v-pre>OrangeListener</code>,实现了<code v-pre>EventListener</code>接口</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span><span class="token punctuation">(</span><span class="token string">"appleListener"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AppleListener</span> <span class="token keyword">implements</span> <span class="token class-name">EventListener</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">handle</span><span class="token punctuation">(</span><span class="token class-name">Event</span> event<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> source <span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> event<span class="token punctuation">.</span><span class="token function">getSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span><span class="token punctuation">(</span><span class="token string">"appleListener"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AppleListener</span> <span class="token keyword">implements</span> <span class="token class-name">EventListener</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">handle</span><span class="token punctuation">(</span><span class="token class-name">Event</span> event<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> source <span class="token operator">=</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> event<span class="token punctuation">.</span><span class="token function">getSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>配置中，把这两个listener对象封装进<code v-pre>SubscribeRule</code>中,并设置对应的<code v-pre>TOPIC</code></p>
</li>
<li>
<p>把<code v-pre>SubscribeRule</code>封装List放入<code v-pre>EventEngineImp</code>中规则列表</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Configuration</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ListenerConfig</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Logger</span> log <span class="token operator">=</span> <span class="token class-name">LoggerFactory</span><span class="token punctuation">.</span><span class="token function">getLogger</span><span class="token punctuation">(</span><span class="token class-name">ListenerConfig</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">EventEngineImp</span> <span class="token function">publish</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"=================publish load=================="</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">EventEngineImp</span> eventEngineImp <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventEngineImp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        eventEngineImp<span class="token punctuation">.</span><span class="token function">setListEventRule</span><span class="token punctuation">(</span><span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token function">getApple</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span><span class="token function">getOrange</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> eventEngineImp<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">SubscribeRule</span> <span class="token function">getApple</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SubscribeRule</span> subscribeRule <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SubscribeRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        subscribeRule<span class="token punctuation">.</span><span class="token function">setTopic</span><span class="token punctuation">(</span><span class="token string">"APPLE"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        subscribeRule<span class="token punctuation">.</span><span class="token function">setEventListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">AppleListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> subscribeRule<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">SubscribeRule</span> <span class="token function">getOrange</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SubscribeRule</span> subscribeRule <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SubscribeRule</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        subscribeRule<span class="token punctuation">.</span><span class="token function">setTopic</span><span class="token punctuation">(</span><span class="token string">"ORANGE"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        subscribeRule<span class="token punctuation">.</span><span class="token function">setEventListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">OrangeListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> subscribeRule<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="运用" tabindex="-1"><a class="header-anchor" href="#运用"><span>运用</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//注入事件引擎</span></span>
<span class="line"><span class="token annotation punctuation">@Autowired</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token class-name">EventEngine</span> eventEngine<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/"</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"&lt;===============start"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//发布事件,topic为APPLE source 为字符串123</span></span>
<span class="line">    eventEngine<span class="token punctuation">.</span><span class="token function">publishEvent</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Event</span><span class="token punctuation">(</span><span class="token string">"APPLE"</span><span class="token punctuation">,</span><span class="token string">"123"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token constant">LOG</span><span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"&lt;===============end"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token string">"index"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p>监听器的好处是解耦，调用方跟接收方没有直接交互，只需要事件引擎设置topic，找寻对应的listener。</p>
</li>
<li>
<p>在聚合项目中尤其实用，假设项目中有A\B\C三个模块，C依赖A和B，但是A和B直接相互没有依赖关系，这时候A和B直接是无法直接交互的，可以通过监听器的代码，实现A B之间相互调用.</p>
</li>
</ul>
</div></template>


